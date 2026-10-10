/* V2 campaign chapter 01. Hand-authored, deterministic map; V1 remains separate. */
'use strict';
(() => {
  const W = 48, H = 36, SAVE_KEY = 'otherPlayerChapter1SaveV2';
  const BACKUP_KEY = SAVE_KEY + '_backup', CAMPAIGN_KEY = 'otherPlayerCampaignV2_1';
  const $ = id => document.getElementById(id), index = (x, y) => y * W + x;
  const canvas = $('world'), ctx = canvas.getContext('2d', { alpha: false });
  const mapCanvas = $('minimap'), mapCtx = mapCanvas.getContext('2d', { alpha: false });
  const grid = new Uint8Array(W * H).fill(1);
  const rooms = [
    { label: 'PREMIÈRE RENCONTRE', x: 2, y: 14, w: 12, h: 10 },
    { label: 'GALERIE DES TRACES', x: 16, y: 2, w: 13, h: 11 },
    { label: 'LES TRACES SE CROISENT', x: 33, y: 14, w: 13, h: 10 },
    { label: 'RETROUVAILLES', x: 16, y: 24, w: 13, h: 11 },
    { label: 'NICHE', x: 2, y: 2, w: 10, h: 8 }
  ];
  function floor(x, y) { if (x > 0 && y > 0 && x < W - 1 && y < H - 1) grid[index(x, y)] = 0; }
  function carveRoom(r) { for (let y=r.y+1;y<r.y+r.h-1;y++) for (let x=r.x+1;x<r.x+r.w-1;x++) floor(x,y); }
  function carveSegment(a,b,r=1) {
    let x=a[0],y=a[1];
    while(x!==b[0]||y!==b[1]) {
      for(let oy=-r;oy<=r;oy++)for(let ox=-r;ox<=r;ox++)floor(x+ox,y+oy);
      if(x!==b[0])x+=Math.sign(b[0]-x);else y+=Math.sign(b[1]-y);
    }
    for(let oy=-r;oy<=r;oy++)for(let ox=-r;ox<=r;ox++)floor(x+ox,y+oy);
  }
  function carveRoute(points) { for(let i=1;i<points.length;i++)carveSegment(points[i-1],points[i]); }
  rooms.forEach(carveRoom);
  [
    [[12,17],[14,17],[14,9],[17,9]],
    [[27,9],[30,9],[30,17],[34,17]],
    [[39,22],[39,27],[27,27]],
    [[17,30],[13,30],[13,20],[12,20]],
    [[5,15],[5,11],[5,8]]
  ].forEach(carveRoute);
  // A short wall rib makes the north gallery readable without closing its loop.
  for (let y=5;y<9;y++) grid[index(23,y)] = 1;
  const traces = [{x:14.5,y:13.5},{x:20.5,y:7.5},{x:37.5,y:17.5}];
  const decoy = {x:15.5,y:11.5}, niche = {x:5.5,y:5.5}, exit = {x:22.5,y:29.5};
  const state = {
    player:{x:7.5,y:19.5}, other:{x:8.5,y:20.5}, traceIndex:0, decoySeen:false,
    nicheFound:false, complete:false, paused:true, explored:new Uint8Array(W*H),
    events:[], lastSave:0, frame:0, elapsed:0, toastUntil:0
  };
  let input={x:0,y:0}, pointer=null, lastFrame=0, viewW=1, viewH=1, dpr=1, camera={x:0,y:0};
  let otherPath=[], pathTarget='', pathTimer=0, drawerOpen=false, drawerWasPaused=false;
  let restartWasPaused=true, restartFocusReturn=null, hudTimer=0;
  const held=new Map(), neighbors=[[1,0],[-1,0],[0,1],[0,-1]];
  function checksum(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return(h>>>0).toString(16).padStart(8,'0');}
  function passable(x,y){const cx=Math.floor(x),cy=Math.floor(y);return cx>0&&cy>0&&cx<W-1&&cy<H-1&&grid[index(cx,cy)]===0;}
  function actorValid(p){const r=.2;return [[0,0],[-r,0],[r,0],[0,-r],[0,r]].every(([dx,dy])=>passable(p.x+dx,p.y+dy));}
  function encodeSave(){const payload=JSON.stringify({v:1,player:state.player,other:state.other,traceIndex:state.traceIndex,decoySeen:state.decoySeen,nicheFound:state.nicheFound,complete:state.complete,explored:Array.from(state.explored),events:state.events.slice(-30)});return JSON.stringify({version:1,payload,checksum:checksum(payload)});}
  function decodeSave(raw){try{const box=JSON.parse(raw);if(box.version!==1||typeof box.payload!=='string'||checksum(box.payload)!==box.checksum)return null;const d=JSON.parse(box.payload);return d.v===1&&d.player&&d.other?d:null;}catch{return null;}}
  function getSave(){try{const a=localStorage.getItem(SAVE_KEY);return(a&&decodeSave(a))||decodeSave(localStorage.getItem(BACKUP_KEY)||'');}catch{return null;}}
  function loadSave(){const d=getSave();if(!d)return; if(actorValid(d.player))state.player=d.player;if(actorValid(d.other))state.other=d.other;state.traceIndex=Math.max(0,Math.min(3,Number(d.traceIndex)||0));state.decoySeen=!!d.decoySeen;state.nicheFound=!!d.nicheFound;state.complete=!!d.complete;if(Array.isArray(d.explored)&&d.explored.length===W*H)state.explored=Uint8Array.from(d.explored,n=>n?1:0);state.events=Array.isArray(d.events)?d.events.slice(-30):[];}
  function save(force=false){if(!force&&Date.now()-state.lastSave<1000)return;state.lastSave=Date.now();try{const previous=localStorage.getItem(SAVE_KEY);if(previous&&decodeSave(previous))localStorage.setItem(BACKUP_KEY,previous);localStorage.setItem(SAVE_KEY,encodeSave());}catch{toast('Sauvegarde indisponible dans ce navigateur.');}}
  function remember(type){state.events.push({type,time:Date.now()});if(state.events.length>30)state.events.shift();save(true);}
  function toast(text,ms=2400){$('toast').textContent=text;$('toast').classList.add('visible');state.toastUntil=performance.now()+ms;}
  function near(a,b,r){return Math.hypot(a.x-b.x,a.y-b.y)<=r;}
  function updateHud(){
    $('traceCount').textContent=`EMPREINTES · ${state.traceIndex} / 3`;
    $('objective').textContent=state.complete?'CHAPITRE 01 TERMINÉ · LES EMPREINTES ONT ÉTÉ SUIVIES.':state.traceIndex<3?'Suis les trois empreintes lumineuses dans l’ordre, puis retrouve l’Autre dans la salle basse.':'Les trois empreintes sont suivies. Rejoins l’Autre dans la salle basse.';
    $('gateStatus').textContent=state.traceIndex<3?'SORTIE : SCELLÉE':near(state.other,exit,1.1)?'SORTIE : OUVERTE · REJOINS L’AUTRE':'SORTIE : L’AUTRE T’ATTEND';
    $('otherStatus').textContent=state.traceIndex===3?(near(state.other,exit,1.1)?'L’AUTRE : IL T’ATTEND':'L’AUTRE : REJOINT LA SALLE BASSE'):near(state.player,state.other,1.7)?'L’AUTRE : AVEC TOI':'L’AUTRE : IL SUIT TES TRACES';
    $('drawerObjective').textContent=state.traceIndex<3?'Suis les trois empreintes lumineuses dans l’ordre, puis retrouve l’Autre.':'Retrouve l’Autre dans la salle basse.';
    $('drawerObjectiveState').textContent=state.complete?'TERMINÉ':state.traceIndex===3?'EMPREINTES SUIVIES · RETROUVAILLES':'EN COURS · '+state.traceIndex+' / 3';
    $('drawerOtherStatus').textContent=$('otherStatus').textContent;$('drawerGateStatus').textContent=$('gateStatus').textContent;
    $('drawerProgress').textContent=`EMPREINTES : ${state.traceIndex} / 3${state.nicheFound?' · NICHE TROUVÉE':''}`;
    $('drawerJourney').textContent=state.traceIndex===3?'PARCOURS : VOUS VOUS RETROUVEZ':state.traceIndex?'PARCOURS : L’AUTRE GARDE TES TRACES':'PARCOURS : VOUS ÊTES ENSEMBLE';
  }
  function markChapterComplete(){ window.v2MarkCampaignChapterComplete?.(1); }
  function nearestFree(x,y){const sx=Math.floor(x),sy=Math.floor(y);if(passable(sx+.5,sy+.5))return index(sx,sy);for(let r=1;r<=4;r++)for(let yy=-r;yy<=r;yy++)for(let xx=-r;xx<=r;xx++){if(Math.abs(xx)!==r&&Math.abs(yy)!==r)continue;const nx=sx+xx,ny=sy+yy;if(passable(nx+.5,ny+.5))return index(nx,ny);}return-1;}
  class Heap{constructor(){this.a=[];}push(v){const a=this.a;a.push(v);let i=a.length-1;while(i){const p=(i-1)>>1;if(a[p].f<=v.f)break;a[i]=a[p];i=p;}a[i]=v;}pop(){const a=this.a,r=a[0],end=a.pop();if(a.length){let i=0;while(1){let c=i*2+1;if(c>=a.length)break;if(c+1<a.length&&a[c+1].f<a[c].f)c++;if(a[c].f>=end.f)break;a[i]=a[c];i=c;}a[i]=end;}return r;}get length(){return this.a.length;}}
  function findPath(start,target){const begin=nearestFree(start.x,start.y),goal=nearestFree(target.x,target.y);if(begin<0||goal<0||begin===goal)return[];const g=new Float32Array(W*H);g.fill(Infinity);const came=new Int32Array(W*H);came.fill(-1);const closed=new Uint8Array(W*H),open=new Heap(),gx=goal%W,gy=Math.floor(goal/W),h=(x,y)=>Math.abs(x-gx)+Math.abs(y-gy);g[begin]=0;open.push({id:begin,f:h(begin%W,Math.floor(begin/W))});while(open.length){const id=open.pop().id;if(closed[id])continue;if(id===goal)break;closed[id]=1;const x=id%W,y=Math.floor(id/W);for(const[dx,dy]of neighbors){const nx=x+dx,ny=y+dy,ni=index(nx,ny);if(!passable(nx+.5,ny+.5)||closed[ni])continue;const score=g[id]+1;if(score<g[ni]){g[ni]=score;came[ni]=id;open.push({id:ni,f:score+h(nx,ny)});}}}if(came[goal]<0)return[];const path=[];for(let id=goal;id!==begin&&id>=0;id=came[id])path.push({x:id%W+.5,y:Math.floor(id/W)+.5});path.reverse();return path;}
  function moveActor(actor,dx,dy,amount){const mag=Math.hypot(dx,dy);if(mag>1){dx/=mag;dy/=mag;}const sx=dx*amount,sy=dy*amount,r=.2;const blocked=(x,y)=>[[0,0],[-r,0],[r,0],[0,-r],[0,r]].some(([ox,oy])=>!passable(x+ox,y+oy));if(!blocked(actor.x+sx,actor.y))actor.x+=sx;if(!blocked(actor.x,actor.y+sy))actor.y+=sy;}
  function updateOther(dt){pathTimer-=dt;const target=state.traceIndex===3?exit:state.player;const key=`${state.traceIndex}:${Math.floor(target.x)}:${Math.floor(target.y)}`;const distance=Math.hypot(target.x-state.other.x,target.y-state.other.y);if((state.traceIndex===3&&distance<.72)||(state.traceIndex<3&&distance<1.35)){otherPath=[];return;}if(key!==pathTarget||pathTimer<=0||!otherPath.length){otherPath=findPath(state.other,target);pathTarget=key;pathTimer=.55;}while(otherPath.length&&near(state.other,otherPath[0],.25))otherPath.shift();if(otherPath.length)moveActor(state.other,otherPath[0].x-state.other.x,otherPath[0].y-state.other.y,3.2*dt);}
  function interact(){if(state.paused||state.complete)return;if(near(state.player,niche,1.35)){if(!state.nicheFound){state.nicheFound=true;remember('found_northwest_niche');toast('Une alcôve cachée. L’Autre y avait laissé une empreinte plus ancienne.');}else toast('La niche garde une trace de votre première rencontre.');}else if(near(state.player,exit,1.6)){toast(state.traceIndex<3?'La sortie reste fermée. Il manque des empreintes.':near(state.other,exit,1.4)?'Vous êtes réunis. La sortie s’ouvre.':'L’Autre te rejoint dans cette salle.');}else toast('Suis les empreintes lumineuses qui continuent dans le labyrinthe.');}
  function reveal(){for(const[a,r]of[[state.player,7],[state.other,5]]){const ax=Math.floor(a.x),ay=Math.floor(a.y);for(let y=ay-r;y<=ay+r;y++)for(let x=ax-r;x<=ax+r;x++)if(x>0&&y>0&&x<W-1&&y<H-1&&Math.hypot(x+.5-a.x,y+.5-a.y)<=r)state.explored[index(x,y)]=1;}}
  function update(dt){const step=Math.min(dt,.05),steps=Math.max(1,Math.ceil(step/.025));state.elapsed+=step;for(let i=0;i<steps;i++)moveActor(state.player,input.x,input.y,4.25*step/steps);updateOther(step);reveal();while(state.traceIndex<traces.length&&near(state.player,traces[state.traceIndex],.9)){state.traceIndex++;remember('followed_trace_'+state.traceIndex);toast(state.traceIndex<3?`Empreinte ${state.traceIndex} suivie. La trace continue.`:'Troisième empreinte suivie. L’Autre t’attend dans la salle basse.');pathTarget='';}
    if(!state.decoySeen&&near(state.player,decoy,.9)){state.decoySeen=true;remember('noticed_false_trace');toast('La fausse empreinte s’arrête avant la dalle. Le vrai chemin continue.');}
    if(state.traceIndex===3&&near(state.player,exit,1.05)&&near(state.other,exit,1.05)){state.complete=true;state.paused=true;remember('chapter1_reunited_at_exit');markChapterComplete();$('completeSummary').textContent=`Vous avez suivi les trois empreintes.${state.nicheFound?' Tu as aussi découvert la niche cachée.':' La niche facultative reste à découvrir.'} L’Autre a gardé la trace de votre parcours.`;$('completeOverlay').classList.add('active');$('completeOverlay').setAttribute('aria-hidden','false');input={x:0,y:0};held.clear();}
    updateHud();hudTimer+=step;if(hudTimer>.2){hudTimer=0;if(drawerOpen)updateDrawer();}if(state.frame%75===0)save();if(performance.now()>state.toastUntil)$('toast').classList.remove('visible');}
  function updateDrawer(){updateHud();const n=state.explored.reduce((a,b)=>a+b,0);$('drawerProgress').textContent=`EMPREINTES : ${state.traceIndex} / 3 · CARTE ${Math.round(n/state.explored.length*100)} %`+(state.nicheFound?' · NICHE TROUVÉE':'');}
  function resize(){const r=canvas.getBoundingClientRect();dpr=Math.min(window.devicePixelRatio||1,1.5);viewW=Math.max(1,r.width);viewH=Math.max(1,r.height);const w=Math.round(viewW*dpr),h=Math.round(viewH*dpr);if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}ctx.setTransform(dpr,0,0,dpr,0,0);mapCanvas.width=Math.round(mapCanvas.clientWidth*dpr);mapCanvas.height=Math.round(mapCanvas.clientHeight*dpr);mapCtx.setTransform(dpr,0,0,dpr,0,0);}
  function worldToScreen(x,y){return{x:x*22-camera.x,y:y*22-camera.y};}
  function drawActor(p,color,label,phase){const q=worldToScreen(p.x,p.y),bob=Math.sin(state.elapsed*3+phase)*1.3;ctx.beginPath();ctx.arc(q.x,q.y+bob,9,0,Math.PI*2);ctx.fillStyle=color+'30';ctx.fill();ctx.beginPath();ctx.arc(q.x,q.y+bob,5.5,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();ctx.font='600 10px system-ui';ctx.textAlign='center';ctx.fillStyle=color;ctx.fillText(label,q.x,q.y-11+bob);}
  function drawMap(){const cw=mapCanvas.clientWidth,ch=mapCanvas.clientHeight;if(!cw||mapCanvas.hidden)return;mapCtx.setTransform(dpr,0,0,dpr,0,0);mapCtx.fillStyle='#071014';mapCtx.fillRect(0,0,cw,ch);const cell=Math.min(cw/W,ch/H),ox=(cw-W*cell)/2,oy=(ch-H*cell)/2;for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(!state.explored[index(x,y)])continue;mapCtx.fillStyle=grid[index(x,y)]?'#5a6a6f':'#15252a';mapCtx.fillRect(ox+x*cell,oy+y*cell,Math.ceil(cell),Math.ceil(cell));}for(const[a,c]of[[state.player,'#82edaa'],[state.other,'#ff8996']])if(state.explored[index(Math.floor(a.x),Math.floor(a.y))]){mapCtx.fillStyle=c;mapCtx.beginPath();mapCtx.arc(ox+a.x*cell,oy+a.y*cell,Math.max(2,cell*.8),0,Math.PI*2);mapCtx.fill();}}
  function draw(){const width=viewW,height=viewH,tile=22,worldW=W*tile,worldH=H*tile;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.fillStyle='#05090c';ctx.fillRect(0,0,width,height);camera.x=Math.max(0,Math.min(worldW-width,state.player.x*tile-width/2));camera.y=Math.max(0,Math.min(worldH-height,state.player.y*tile-height/2));const x0=Math.max(0,Math.floor(camera.x/tile)-1),x1=Math.min(W-1,Math.ceil((camera.x+width)/tile)+1),y0=Math.max(0,Math.floor(camera.y/tile)-1),y1=Math.min(H-1,Math.ceil((camera.y+height)/tile)+1);for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const seen=state.explored[index(x,y)],p=worldToScreen(x,y);ctx.fillStyle=seen?(grid[index(x,y)]?'#35454a':'#11191d'):'#05090c';ctx.fillRect(p.x,p.y,tile+.4,tile+.4);}
    const marker=(p,color,label,r=8)=>{const q=worldToScreen(p.x,p.y);ctx.beginPath();ctx.arc(q.x,q.y,r,0,Math.PI*2);ctx.fillStyle=color+'40';ctx.fill();ctx.beginPath();ctx.arc(q.x,q.y,r*.55,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();if(label){ctx.font='700 9px system-ui';ctx.textAlign='center';ctx.fillStyle=color;ctx.fillText(label,q.x,q.y-12);}};
    traces.forEach((p,i)=>{if(state.explored[index(Math.floor(p.x),Math.floor(p.y))])marker(p,i<state.traceIndex?'#82edaa':i===state.traceIndex?'#f3ce83':'#73868b',i<state.traceIndex?'TRACE · SUIVIE':`TRACE ${i+1}`,i===state.traceIndex?9:7);});
    if(state.explored[index(Math.floor(decoy.x),Math.floor(decoy.y))])marker(decoy,'#b6a4d8',state.decoySeen?'FAUSSE TRACE':'?',7);
    if(state.explored[index(Math.floor(niche.x),Math.floor(niche.y))])marker(niche,state.nicheFound?'#93d7df':'#6f8b91',state.nicheFound?'NICHE':'·',7);
    if(state.explored[index(Math.floor(exit.x),Math.floor(exit.y))]){const q=worldToScreen(exit.x,exit.y);ctx.strokeStyle=state.traceIndex===3?'#82edaa':'#76858a';ctx.lineWidth=3;ctx.strokeRect(q.x-10,q.y-13,20,26);ctx.font='700 9px system-ui';ctx.textAlign='center';ctx.fillStyle='#d5e0e0';ctx.fillText('SORTIE',q.x,q.y+24);}
    for(let i=0;i<rooms.length;i++){const r=rooms[i],cx=r.x+r.w/2,cy=r.y+r.h/2;if(!state.explored[index(Math.floor(cx),Math.floor(cy))])continue;const q=worldToScreen(cx,cy);ctx.font='600 8px system-ui';ctx.textAlign='center';ctx.fillStyle='#aebdc044';ctx.fillText(r.label,q.x,q.y);}
    drawActor(state.other,'#ff8996','L’AUTRE',1);drawActor(state.player,'#82edaa','TOI',0);drawMap();}
  function setPaused(value){state.paused=!!value;$('pauseButton').textContent=state.paused?'REPRENDRE':'PAUSE';$('pauseButton').setAttribute('aria-pressed',String(state.paused));$('pauseOverlay').classList.toggle('active',state.paused);$('pauseOverlay').setAttribute('aria-hidden',String(!state.paused));if(state.paused){held.clear();releaseJoystick();}lastFrame=performance.now();}
  function togglePause(){if(!drawerOpen&&!state.complete)setPaused(!state.paused);}
  function setDrawer(open){
    if(open===drawerOpen)return;
    drawerOpen=open;
    $('sideDrawer').classList.toggle('open',open);$('drawerScrim').classList.toggle('open',open);
    $('sideDrawer').setAttribute('aria-hidden',String(!open));$('drawerScrim').setAttribute('aria-hidden',String(!open));$('menuButton').setAttribute('aria-expanded',String(open));
    if(open){
      drawerWasPaused=state.paused;state.paused=true;
      $('pauseOverlay').classList.remove('active');$('pauseOverlay').setAttribute('aria-hidden','true');
      held.clear();releaseJoystick();updateDrawer();$('drawerClose').focus();
    }else{
      if(!drawerWasPaused&&!state.complete){state.paused=false;$('pauseButton').textContent='PAUSE';$('pauseButton').setAttribute('aria-pressed','false');}
      else if(drawerWasPaused){$('pauseOverlay').classList.add('active');$('pauseOverlay').setAttribute('aria-hidden','false');}
      drawerWasPaused=false;
    }
    lastFrame=performance.now();
  }
  function toggleMap(){mapCanvas.hidden=!mapCanvas.hidden;$('mapToggle').setAttribute('aria-expanded',String(!mapCanvas.hidden));resize();draw();}
  function showIntro(){const progress=state.traceIndex||state.nicheFound;$('introMemory').textContent=progress?'Une progression du chapitre 1 est enregistrée sur cet appareil.':'Ta progression V2 est séparée de la sauvegarde V1.';$('startButton').textContent=state.complete?'REJOUER LE CHAPITRE 1':progress?'REPRENDRE LE PARCOURS':'COMMENCER';state.paused=true;$('pauseOverlay').classList.remove('active');$('pauseOverlay').setAttribute('aria-hidden','true');$('introOverlay').classList.add('active');$('introOverlay').setAttribute('aria-hidden','false');lastFrame=performance.now();$('startButton').focus();}
  function enterLevel(){if(state.complete){requestRestart();return;}$('introOverlay').classList.remove('active');$('introOverlay').setAttribute('aria-hidden','true');state.paused=false;$('pauseButton').textContent='PAUSE';$('pauseButton').setAttribute('aria-pressed','false');lastFrame=performance.now();}
  function requestRestart(){restartWasPaused=state.paused;restartFocusReturn=document.activeElement;if(!state.paused&&!state.complete)setPaused(true);$('restartOverlay').classList.add('active');$('restartOverlay').setAttribute('aria-hidden','false');$('confirmRestart').focus();}
  function cancelRestart(){ $('restartOverlay').classList.remove('active');$('restartOverlay').setAttribute('aria-hidden','true');if(!state.complete&&!restartWasPaused)setPaused(false);else lastFrame=performance.now();if(restartFocusReturn?.focus)restartFocusReturn.focus();}
  function confirmRestart(){try{localStorage.removeItem(SAVE_KEY);localStorage.removeItem(BACKUP_KEY);}catch{}state.player={x:7.5,y:19.5};state.other={x:8.5,y:20.5};state.traceIndex=0;state.decoySeen=false;state.nicheFound=false;state.complete=false;state.paused=true;state.explored.fill(0);state.events=[];state.lastSave=0;state.elapsed=0;state.frame=0;state.toastUntil=0;input={x:0,y:0};held.clear();releaseJoystick();otherPath=[];pathTarget='';pathTimer=0;drawerOpen=false;drawerWasPaused=false;$('sideDrawer').classList.remove('open');$('sideDrawer').setAttribute('aria-hidden','true');$('drawerScrim').classList.remove('open');$('drawerScrim').setAttribute('aria-hidden','true');$('menuButton').setAttribute('aria-expanded','false');$('completeOverlay').classList.remove('active');$('completeOverlay').setAttribute('aria-hidden','true');$('pauseOverlay').classList.remove('active');$('pauseOverlay').setAttribute('aria-hidden','true');$('mapToggle').setAttribute('aria-expanded','false');mapCanvas.hidden=true;$('toast').classList.remove('visible');reveal();updateHud();showIntro();draw();}
  function keyDown(e){const k=e.key.toLowerCase();if(k==='escape'){e.preventDefault();if($('restartOverlay').classList.contains('active')){cancelRestart();return;}if($('introOverlay').classList.contains('active'))return;if(drawerOpen)setDrawer(false);else if($('pauseOverlay').classList.contains('active'))setPaused(false);else if(!state.complete)togglePause();return;}if(state.paused||drawerOpen||state.complete)return;const keys={arrowleft:[-1,0],a:[-1,0],q:[-1,0],arrowright:[1,0],d:[1,0],arrowup:[0,-1],w:[0,-1],z:[0,-1],arrowdown:[0,1],s:[0,1]};if(keys[k]){e.preventDefault();held.set(k,keys[k]);let x=0,y=0;for(const[vx,vy]of held.values()){x+=vx;y+=vy;}const m=Math.hypot(x,y)||1;input={x:x/m,y:y/m};}else if(k==='e'||k==='enter'){e.preventDefault();interact();}else if(k==='p')togglePause();}
  function keyUp(e){if(held.delete(e.key.toLowerCase())){let x=0,y=0;for(const[vx,vy]of held.values()){x+=vx;y+=vy;}const m=Math.hypot(x,y)||1;input=held.size?{x:x/m,y:y/m}:{x:0,y:0};}}
  function joystickMove(e){const joy=$('joystick'),r=joy.getBoundingClientRect(),max=r.width*.31;let dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2),d=Math.hypot(dx,dy);if(d>max){dx*=max/d;dy*=max/d;}const nx=dx/max,ny=dy/max,dead=.12;input={x:Math.abs(nx)<dead?0:nx,y:Math.abs(ny)<dead?0:ny};$('stick').style.transform=`translate(${dx}px,${dy}px)`;}
  function releaseJoystick(){pointer=null;input={x:0,y:0};$('stick').style.transform='translate(0,0)';if(held.size){let x=0,y=0;for(const[vx,vy]of held.values()){x+=vx;y+=vy;}const m=Math.hypot(x,y)||1;input={x:x/m,y:y/m};}}
  function openRestartFocusTrap(e){if(e.key!=='Tab')return;const items=[...$('restartOverlay').querySelectorAll('button:not([disabled]),a[href]')];if(!items.length)return;const first=items[0],last=items[items.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}
  loadSave();reveal();resize();updateHud();window.addEventListener('resize',resize,{passive:true});window.visualViewport?.addEventListener('resize',resize,{passive:true});window.addEventListener('keydown',keyDown);window.addEventListener('keyup',keyUp);window.addEventListener('blur',()=>{held.clear();releaseJoystick();});document.addEventListener('visibilitychange',()=>{if(document.hidden){held.clear();releaseJoystick();save(true);}});
  $('interact').addEventListener('click',interact);$('pauseButton').addEventListener('click',togglePause);$('mapToggle').addEventListener('click',toggleMap);$('menuButton').addEventListener('click',()=>setDrawer(true));$('drawerClose').addEventListener('click',()=>setDrawer(false));$('drawerScrim').addEventListener('click',()=>setDrawer(false));$('drawerResume').addEventListener('click',()=>{setDrawer(false);setPaused(false);});$('drawerMap').addEventListener('click',()=>{setDrawer(false);toggleMap();});$('drawerPause').addEventListener('click',()=>{setDrawer(false);setPaused(true);});$('drawerRestart').addEventListener('click',requestRestart);$('resumeButton').addEventListener('click',()=>setPaused(false));$('pauseMenuButton').addEventListener('click',()=>setDrawer(true));$('startButton').addEventListener('click',enterLevel);$('reset').addEventListener('click',requestRestart);$('completeClose').addEventListener('click',requestRestart);$('confirmRestart').addEventListener('click',confirmRestart);$('cancelRestart').addEventListener('click',cancelRestart);$('restartOverlay').addEventListener('click',e=>{if(e.target===$('restartOverlay'))cancelRestart();});$('restartOverlay').addEventListener('keydown',openRestartFocusTrap);
  $('sideDrawer').addEventListener('keydown',e=>{if(e.key!=='Tab')return;const items=[...$('sideDrawer').querySelectorAll('button:not([disabled]),a[href]')];if(!items.length)return;const first=items[0],last=items[items.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}});
  const joy=$('joystick');joy.addEventListener('pointerdown',e=>{if(state.paused||drawerOpen||state.complete)return;pointer=e.pointerId;joy.setPointerCapture(e.pointerId);joystickMove(e);});joy.addEventListener('pointermove',e=>{if(e.pointerId===pointer)joystickMove(e);});joy.addEventListener('pointerup',releaseJoystick);joy.addEventListener('pointercancel',releaseJoystick);
  if(state.complete){markChapterComplete();$('completeOverlay').classList.add('active');$('completeOverlay').setAttribute('aria-hidden','false');}
  showIntro();if(state.events.length)toast('Progression du chapitre 1 restaurée.');
  function frame(now){requestAnimationFrame(frame);if(!lastFrame)lastFrame=now;const dt=Math.min(.1,Math.max(0,(now-lastFrame)/1000));lastFrame=now;if(!state.paused&&!state.complete){state.frame++;update(dt);}draw();}requestAnimationFrame(frame);
  window.v2Chapter1Snapshot=()=>({width:W,height:H,player:{...state.player},other:{...state.other},traceIndex:state.traceIndex,decoySeen:state.decoySeen,nicheFound:state.nicheFound,complete:state.complete,paused:state.paused,explored:state.explored.reduce((a,b)=>a+b,0),eventTypes:state.events.map(e=>e.type)});
})();
