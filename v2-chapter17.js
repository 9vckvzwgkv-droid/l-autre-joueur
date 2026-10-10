/* Chapitre 17 — ÉCHO. Répétition observée, puis geste différent pour rompre la boucle. */
'use strict';
(()=>{
 const W=92,H=58,T=18,KEY='otherPlayerChapter17SaveV2',CAMPAIGN='otherPlayerCampaignV2_1';
 const $=id=>document.getElementById(id),canvas=$('world'),ctx=canvas.getContext('2d'),mini=$('minimap'),mctx=mini.getContext('2d');
 const grid=new Uint8Array(W*H).fill(1),idx=(x,y)=>y*W+x;
 const rooms=[
  {name:'ENTRÉE',x:2,y:21,w:13,h:15},
  {name:'GALERIE DES SIGNES',x:17,y:5,w:15,h:13},
  {name:'SALLE DU REFUS',x:34,y:20,w:15,h:17},
  {name:'OBSERVATOIRE NORD',x:36,y:3,w:13,h:12},
  {name:'ARCHIVES SUD',x:35,y:43,w:15,h:12},
  {name:'ROUTE ALTERNATIVE',x:53,y:5,w:15,h:13},
  {name:'SALLE DE REMISE À ZÉRO',x:53,y:38,w:15,h:15},
  {name:'SORTIE',x:75,y:21,w:15,h:16}
 ];
 const floor=(x,y)=>{if(x>0&&y>0&&x<W-1&&y<H-1)grid[idx(x,y)]=0};
 function room(r){for(let y=r.y+1;y<r.y+r.h-1;y++)for(let x=r.x+1;x<r.x+r.w-1;x++)floor(x,y)}
 function path(a,b,r=1){let x=a[0],y=a[1];while(true){for(let oy=-r;oy<=r;oy++)for(let ox=-r;ox<=r;ox++)floor(x+ox,y+oy);if(x===b[0]&&y===b[1])break;if(x!==b[0])x+=Math.sign(b[0]-x);else y+=Math.sign(b[1]-y)}}
 rooms.forEach(room);
 [
  [[14,28],[19,28]],[[19,28],[20,15]],[[20,15],[24,15]],[[19,30],[20,43]],[[20,43],[25,43]],
  [[24,17],[25,22]],[[25,36],[25,41]],[[30,11],[37,11]],[[31,47],[37,47]],
  [[42,14],[42,22]],[[42,36],[42,44]],[[48,10],[54,10]],[[49,48],[54,48]],
  [[48,27],[56,27]],[[56,27],[63,27]],[[63,18],[63,23]],[[63,23],[63,27]],
  [[63,36],[63,31]],[[63,27],[69,27]],[[69,27],[76,27]],[[42,27],[46,27]],[[42,33],[42,38]],
  [[48,27],[48,20]],[[48,20],[56,10]],[[48,27],[48,35]],[[48,35],[56,47]]
 ].forEach(p=>path(p[0],p[1],1));
 // Small pillars shape routes but preserve connected north/south alternatives.
 [[21,8,2,2],[28,12,1,3],[21,40,3,1],[38,24,2,1],[45,31,1,3],[58,8,2,2],[64,12,1,2],[58,42,2,2],[81,24,1,3]].forEach(([x,y,w,h])=>{for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)grid[idx(xx,yy)]=1});
 const start={x:7.5,y:28.5},otherStart={x:10.5,y:30.5},door={x:42.5,y:28.5},respect={x:61.5,y:10.5},reset={x:61.5,y:47.5},secret={x:42.5,y:49.5},exit={x:82.5,y:28.5};
 let s={player:{...start},other:{...otherStart},complete:false,paused:true,started:false,showMap:false,explored:new Array(W*H).fill(false),steps:0,doorUnlocked:false,refusalHeard:false,forced:false,trapUntil:0,resetDone:false,respected:false,secret:false,otherMood:'wary',echoes:0,firstGesture:null,lastGesture:null,brokenEcho:false};
 function save(){try{localStorage.setItem(KEY,JSON.stringify(s));localStorage.setItem(KEY+'_backup',JSON.stringify(s))}catch(e){}}
 function load(){try{const q=JSON.parse(localStorage.getItem(KEY)||'null');if(q&&q.player&&q.other)s={...s,...q}}catch(e){}}
 function toast(t){const el=$('toast');el.textContent=t;el.classList.add('visible');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('visible'),3000)}
 const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y),walk=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&grid[idx(Math.floor(x),Math.floor(y))]===0;
 function move(who,dx,dy,speed){const nx=who.x+dx*speed,ny=who.y+dy*speed;if(walk(nx,who.y))who.x=nx;if(walk(who.x,ny))who.y=ny}
 function reveal(){for(let y=Math.floor(s.player.y)-7;y<=Math.floor(s.player.y)+7;y++)for(let x=Math.floor(s.player.x)-8;x<=Math.floor(s.player.x)+8;x++)if(x>=0&&y>=0&&x<W&&y<H&&Math.hypot(x-s.player.x,y-s.player.y)<10)s.explored[idx(x,y)]=true}
 function gestureAt(p){const dx=s.player.x-p.x,dy=s.player.y-p.y;if(Math.abs(dx)>Math.abs(dy))return dx<0?'OUEST':'EST';return dy<0?'NORD':'SUD'}
 function interact(){
  if(s.paused||s.complete)return;
  const nodes=[{p:door,n:1},{p:respect,n:2},{p:reset,n:3}];
  for(const node of nodes){if(dist(s.player,node.p)<4.5){
   const g=gestureAt(node.p);
   if(node.n===1){s.refusalHeard=true;s.firstGesture=g;s.lastGesture=g;s.echoes=1;s.otherMood='observing';s.other.x=door.x+2;s.other.y=door.y; $('coopTitle').textContent='ÉCHO 1/3 · GESTE ENREGISTRÉ';$('coopText').textContent=`L’Autre reproduit ton approche : ${g}. Répète ce geste au deuxième écho.`;toast(`Premier écho mémorisé : ${g}. L’Autre copie ton mouvement.`);}
   else if(node.n===2){if(!s.firstGesture){toast('Le premier écho attend dans la salle centrale. Commence par la balise 1.');return;}if(g===s.firstGesture){s.echoes=2;s.lastGesture=g;s.otherMood='imitating';$('coopTitle').textContent='ÉCHO 2/3 · RÉPÉTITION';$('coopText').textContent=`Tu as répété ${g}. L’Autre anticipe maintenant ce même geste.`;toast(`Répétition reconnue : ${g}. Au troisième écho, change volontairement de direction.`);}else{s.echoes=1;s.firstGesture=g;s.lastGesture=g;s.brokenEcho=false;s.doorUnlocked=false;s.otherMood='confused';toast(`Le motif a changé trop tôt. L’Autre réapprend ${g} : recommence avec ce geste au deuxième écho.`);}}
   else {if(s.echoes<2){toast('Le troisième écho ne répond pas encore. Enregistre puis répète un geste aux deux premières balises.');return;}if(g!==s.firstGesture){s.echoes=3;s.brokenEcho=true;s.doorUnlocked=true;s.otherMood='surprised';s.other.x=reset.x-2;s.other.y=reset.y+1;$('coopTitle').textContent='BOUCLE ROMPUE';$('coopText').textContent='Tu as changé de geste. L’Autre distingue enfin une décision d’une répétition.';toast(`Écho brisé ! ${s.firstGesture} devient ${g} : L’Autre ne peut plus confondre habitude et décision.`);}else{s.echoes=1;s.firstGesture=g;s.lastGesture=g;s.brokenEcho=false;s.doorUnlocked=false;s.otherMood='imitating';toast('L’Autre a prédit ce geste. La boucle repart : répète-le une fois, puis change au troisième écho.');}}
   save();draw();return;
  }}
  if(dist(s.player,secret)<3.5){if(s.brokenEcho){s.secret=true;toast('Secret découvert : un enregistrement montre le tout premier geste que L’Autre a appris.')}else toast('L’alcôve reste scellée. Romps d’abord la boucle des trois échos.');save();draw();return;}
  if(dist(s.player,exit)<4){if(s.brokenEcho){finish()}else toast('La sortie est verrouillée par la boucle. Répète le même geste aux deux premières balises, puis change au troisième écho.');return;}
  if(dist(s.player,other)<4){toast(s.otherMood==='surprised'?'L’Autre hésite : « Ce geste ne ressemble pas à ce que j’attendais. »':s.otherMood==='imitating'?'L’Autre reproduit ton dernier geste.':'L’Autre observe ton approche et attend de pouvoir la répéter.');return}
  toast('Repères : écho 1 dans la salle centrale, écho 2 au nord, écho 3 au sud, secret facultatif dans les archives.');
 }
 function finish(){
  s.complete=true;s.paused=true;
  try{let p=JSON.parse(localStorage.getItem(CAMPAIGN)||'{}');p.version=1;p.completed=Array.isArray(p.completed)?p.completed:[];if(!p.completed.includes(17))p.completed.push(17);localStorage.setItem(CAMPAIGN,JSON.stringify(p));let legacy=JSON.parse(localStorage.getItem('otherPlayerCampaignV2_1')||'{}');legacy.completed=Array.isArray(legacy.completed)?legacy.completed:[];if(!legacy.completed.includes(17))legacy.completed.push(17);localStorage.setItem('otherPlayerCampaignV2_1',JSON.stringify(legacy))}catch(e){}
  save();$('completeSummary').textContent=`Voie choisie : ${s.brokenEcho?'boucle rompue':'écho non résolu'}. Secret : ${s.secret?'découvert':'non découvert'}. Réaction de L’Autre : ${s.otherMood==='surprised'?'surprise et adaptation':'observation'}.`;show('completeOverlay',true);
 }
 function show(id,v){const e=$(id);if(e){e.classList.toggle('visible',v);e.setAttribute('aria-hidden',String(!v))}}
 function draw(){
  if(!ctx)return;const rect=canvas.getBoundingClientRect(),vw=rect.width||innerWidth,vh=rect.height||innerHeight;ctx.clearRect(0,0,vw,vh);
  const scale=Math.min(vw/(W*T),vh/(H*T),1.25),cw=vw/scale,ch=vh/scale,cam={x:Math.max(0,Math.min(W*T-cw,s.player.x*T-cw/2)),y:Math.max(0,Math.min(H*T-ch,s.player.y*T-ch/2))};
  ctx.save();ctx.scale(scale,scale);const x0=Math.max(0,Math.floor(cam.x/T)),x1=Math.min(W,Math.ceil((cam.x+cw)/T)),y0=Math.max(0,Math.floor(cam.y/T)),y1=Math.min(H,Math.ceil((cam.y+ch)/T));
  for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){const i=idx(x,y),px=x*T-cam.x,py=y*T-cam.y;if(!s.explored[i]&&Math.hypot(x-s.player.x,y-s.player.y)>10){ctx.fillStyle='#070b0e';ctx.fillRect(px,py,T,T);continue}ctx.fillStyle=grid[i]?'#35454a':'#11191d';ctx.fillRect(px,py,T,T);if(!grid[i]){ctx.strokeStyle='#26383b';ctx.strokeRect(px,py,T,T)}}
  const marker=(p,color,label)=>{const x=p.x*T-cam.x,y=p.y*T-cam.y;ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y,7,0,Math.PI*2);ctx.fill();ctx.fillStyle='#eaf1ef';ctx.font='bold 9px system-ui';ctx.textAlign='center';ctx.fillText(label,x,y-11)};
  marker(door,s.echoes>=1?'#72edac':'#f06d67','ÉCHO 1');marker(respect,s.echoes>=2?'#72edac':'#7dd8ef','ÉCHO 2');marker(reset,s.brokenEcho?'#72edac':'#f4c96b','ÉCHO 3');marker(secret,s.secret?'#c2a0ff':'#71627f','SECRET');marker(exit,s.doorUnlocked?'#72edac':'#f08c69','SORTIE');marker(s.other,s.otherMood==='surprised'?'#72edda':'#df7ba7','L’AUTRE');marker(s.player,'#7be3a5','TOI');
  if(s.forced&&!s.resetDone&&performance.now()<s.trapUntil){ctx.strokeStyle='#ff716b';ctx.lineWidth=3;ctx.strokeRect((door.x-3)*T-cam.x,(door.y-2)*T-cam.y,6*T,4*T)}
  ctx.restore();
  $('gateStatus').textContent=`ÉCHOS : ${s.echoes}/3`;$('branchCount').textContent=`GESTE : ${s.firstGesture||'À DÉCOUVRIR'} · ${s.brokenEcho?'BOUCLE ROMPUE':'BOUCLE ACTIVE'}`;$('otherStatus').textContent=`L’AUTRE : ${s.otherMood==='surprised'?'SURPRIS':s.otherMood==='imitating'?'IMITE':'OBSERVE'}`;
  $('drawerOtherStatus').textContent=$('otherStatus').textContent;$('drawerGateStatus').textContent=$('gateStatus').textContent;$('drawerProgress').textContent=`ÉCHOS : ${s.echoes}/3 · BOUCLE : ${s.brokenEcho?'ROMPUE':'ACTIVE'} · SECRET : ${s.secret?'TROUVÉ':'CACHÉ'}`;
  if(s.showMap){mini.hidden=false;mctx.fillStyle='#091014';mctx.fillRect(0,0,180,116);for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(s.explored[idx(x,y)]){mctx.fillStyle=grid[idx(x,y)]?'#53636a':'#18292d';mctx.fillRect(x/W*180,y/H*116,Math.ceil(180/W),Math.ceil(116/H))}mctx.fillStyle='#72edac';mctx.fillRect(s.player.x/W*180-2,s.player.y/H*116-2,4,4);mctx.fillStyle='#df7ba7';mctx.fillRect(s.other.x/W*180-2,s.other.y/H*116-2,4,4)}else mini.hidden=true;
 }
 let keys={},joy={x:0,y:0},last=performance.now();
 function tick(now){const dt=Math.min(.05,(now-last)/1000);last=now;if(!s.paused&&!s.complete){let dx=(keys.ArrowRight||keys.d||keys.D?1:0)-(keys.ArrowLeft||keys.a||keys.A?1:0)+joy.x,dy=(keys.ArrowDown||keys.s||keys.S?1:0)-(keys.ArrowUp||keys.w||keys.W?1:0)+joy.y,n=Math.hypot(dx,dy)||1;move(s.player,dx/n,dy/n,5*dt);if(Math.abs(dx)+Math.abs(dy)>.1){s.steps++;reveal()}if(s.forced&&!s.resetDone&&now>s.trapUntil&&s.trapUntil>0){s.trapUntil=now+1000;/* warning pulses until reset; never blocks the alternate route */}draw()}requestAnimationFrame(tick)}
 window.addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();keys[e.key]=true;if(e.key.toLowerCase()==='e')interact();if(e.key.toLowerCase()==='p')togglePause()});window.addEventListener('keyup',e=>keys[e.key]=false);window.addEventListener('blur',()=>keys={});
 const joyEl=$('joystick');if(joyEl){let active=false;function setJoy(e){const r=joyEl.getBoundingClientRect(),x=(e.clientX-(r.left+r.width/2))/(r.width/2),y=(e.clientY-(r.top+r.height/2))/(r.height/2);joy={x:Math.max(-1,Math.min(1,x)),y:Math.max(-1,Math.min(1,y))};$('stick').style.transform=`translate(${joy.x*22}px,${joy.y*22}px)`}joyEl.addEventListener('pointerdown',e=>{active=true;joyEl.setPointerCapture(e.pointerId);setJoy(e)});joyEl.addEventListener('pointermove',e=>{if(active)setJoy(e)});joyEl.addEventListener('pointerup',()=>{active=false;joy={x:0,y:0};$('stick').style.transform='translate(0,0)'});joyEl.addEventListener('pointercancel',()=>{active=false;joy={x:0,y:0}})}
 $('interact').addEventListener('click',interact);$('askOther').addEventListener('click',()=>interact());$('mapToggle').addEventListener('click',()=>{s.showMap=!s.showMap;draw()});
 function togglePause(){s.paused=!s.paused;show('pauseOverlay',s.paused);$('pauseButton').setAttribute('aria-pressed',String(s.paused));save()}
 $('pauseButton').addEventListener('click',togglePause);$('resumeButton').addEventListener('click',()=>{s.paused=false;show('pauseOverlay',false);save()});$('pauseMenuButton').addEventListener('click',()=>{show('pauseOverlay',false);openMenu()});
 function openMenu(){show('sideDrawer',true);$('sideDrawer').classList.add('open');$('drawerScrim').classList.add('visible');$('drawerScrim').setAttribute('aria-hidden','false')}
 function closeMenu(){show('sideDrawer',false);$('sideDrawer').classList.remove('open');$('drawerScrim').classList.remove('visible');$('drawerScrim').setAttribute('aria-hidden','true')}
 $('menuButton').addEventListener('click',openMenu);$('drawerClose').addEventListener('click',closeMenu);$('drawerScrim').addEventListener('click',closeMenu);
 $('drawerResume').addEventListener('click',()=>{closeMenu();s.paused=false;save()});$('drawerMap').addEventListener('click',()=>{s.showMap=!s.showMap;draw()});$('drawerPause').addEventListener('click',()=>{closeMenu();s.paused=true;show('pauseOverlay',true);save()});$('drawerRestart').addEventListener('click',()=>{closeMenu();show('restartOverlay',true)});
 function restart(){try{localStorage.removeItem(KEY);localStorage.removeItem(KEY+'_backup')}catch(e){}s={player:{...start},other:{...otherStart},complete:false,paused:false,started:true,showMap:false,explored:new Array(W*H).fill(false),steps:0,doorUnlocked:false,refusalHeard:false,forced:false,trapUntil:0,resetDone:false,respected:false,secret:false,otherMood:'wary',echoes:0,firstGesture:null,lastGesture:null,brokenEcho:false};show('restartOverlay',false);show('completeOverlay',false);show('introOverlay',false);reveal();save();draw()}
 $('reset').addEventListener('click',()=>show('restartOverlay',true));$('confirmRestart').addEventListener('click',restart);$('cancelRestart').addEventListener('click',()=>show('restartOverlay',false));$('startButton').addEventListener('click',()=>{s.paused=false;s.started=true;show('introOverlay',false);reveal();save();draw()});$('completeClose').addEventListener('click',()=>{show('completeOverlay',false);closeMenu()});
 function resize(){const r=canvas.getBoundingClientRect();canvas.width=Math.max(320,Math.floor(r.width*devicePixelRatio));canvas.height=Math.max(300,Math.floor(r.height*devicePixelRatio));ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);mini.width=180;mini.height=116;draw()}
 load();s.paused=true;resize();window.addEventListener('resize',resize);if(!s.started&&!s.complete)show('introOverlay',true);if(s.complete)show('completeOverlay',true);$('coopPanel').hidden=false;reveal();draw();requestAnimationFrame(tick);
})();