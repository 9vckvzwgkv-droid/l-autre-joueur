/* Chapitre 30 — LE MONDE CHOISIT. Chaque décision modifie la manière dont le labyrinthe répond. */
'use strict';
(() => {
  const W=92,H=58,T=22,SAVE='otherPlayerChapter30SaveV2',CAMPAIGN='otherPlayerCampaignV2_1';
  const $=id=>document.getElementById(id), canvas=$('world'),ctx=canvas.getContext('2d',{alpha:false}),map=$('minimap'),mctx=map.getContext('2d');
  const grid=new Uint8Array(W*H).fill(1), explored=new Uint8Array(W*H), idx=(x,y)=>y*W+x;
  const floor=(x,y)=>{if(x>0&&y>0&&x<W-1&&y<H-1)grid[idx(x,y)]=0;};
  function room(x,y,w,h){for(let yy=y+1;yy<y+h-1;yy++)for(let xx=x+1;xx<x+w-1;xx++)floor(xx,yy);}
  function path(points,r=1){for(let i=1;i<points.length;i++){let [x,y]=points[i-1], [tx,ty]=points[i],dx=Math.sign(tx-x),dy=Math.sign(ty-y);while(x!==tx||y!==ty){for(let oy=-r;oy<=r;oy++)for(let ox=-r;ox<=r;ox++)floor(x+ox,y+oy);if(x!==tx)x+=dx;else y+=dy;}for(let oy=-r;oy<=r;oy++)for(let ox=-r;ox<=r;ox++)floor(x+ox,y+oy);}}
  // Réseau du seuil : trois marques anciennes rétablissent progressivement les passages.
  [[2,23,14,14],[17,4,16,13],[17,40,16,13],[35,21,13,16],[52,4,16,13],[52,40,16,13],[70,21,13,16],[80,23,10,14],[35,39,13,14]].forEach(r=>room(...r));
  [ [[13,29],[17,29]], [[17,29],[35,29]], [[29,25],[33,25],[33,12],[35,12]], [[29,12],[35,12]], [[29,33],[33,33],[33,46],[35,46]], [[47,25],[50,25],[50,12],[52,12]], [[47,33],[50,33],[50,46],[52,46]], [[66,12],[69,12],[69,26],[70,26]], [[66,46],[69,46],[69,31],[70,31]], [[47,28],[70,28]], [[82,28],[85,28]], [[41,35],[41,40]], [[41,18],[41,22]], [[61,42],[61,46]] ].forEach(p=>path(p,1));
  // Les trois liaisons principales sont fermées au départ. Chaque repère ouvre la liaison suivante et referme celle que tu viens de quitter.
  const mainBridge=[];for(let x=63;x<=68;x++){grid[idx(x,28)]=1;mainBridge.push([x,28]);} const thresholdBridge=[];for(let x=29;x<=34;x++){grid[idx(x,28)]=1;thresholdBridge.push([x,28]);} const pastBridge=[];for(let x=15;x<=20;x++){grid[idx(x,29)]=1;pastBridge.push([x,29]);} [[51,12],[51,46],[35,12],[35,46]].forEach(([x,y])=>grid[idx(x,y)]=1);
  function applyFractureRoute(step){
    // Une seule liaison principale reste ouverte à la fois : le retour se ferme derrière le joueur.
    for(const [x,y] of mainBridge) grid[idx(x,y)]=step===1?0:1;
    for(const [x,y] of thresholdBridge) grid[idx(x,y)]=step===2?0:1;
    for(const [x,y] of pastBridge) grid[idx(x,y)]=step>=3?0:1;
  }
  const tempBridge=[];
  // Détour inférieur : permet d’explorer les balises et la cache facultative.
  path([[47,33],[49,35],[49,46],[52,46]],1);
  const start={x:85.5,y:28.5}, otherStart={x:83.5,y:29.5}, exit={x:8.5,y:29.5};
  const objects={shelter1:{x:70,y:28,label:'DÉCISION A · DROITE',kind:'shelter1'},shelter2:{x:46,y:28,label:'DÉCISION B · CENTRE',kind:'shelter2'},shelter3:{x:22,y:29,label:'DÉCISION C · GAUCHE',kind:'shelter3'},other:{x:83.5,y:29.5,label:'L’AUTRE · REPÈRE MOBILE',kind:'other'},secret:{x:56,y:49,label:'SECRET · OMBRE',kind:'secret'},signal:{x:76,y:27,label:'INDICE · TA TRACE',kind:'signal'},warning:{x:60,y:9,label:'INDICE · COMMUNE',kind:'warning'},mechanism:{x:58,y:45,label:'INDICE · L’AUTRE',kind:'mechanism'},fissure1:{x:58,y:10,label:'INDICE · CONSÉQUENCE',kind:'worldClue'},fissure2:{x:39,y:47,label:'INDICE · MÉMOIRE',kind:'worldClue'},fissure3:{x:26,y:8,label:'INDICE · INTENTION',kind:'worldClue'}};
  const s={player:{...start},other:{...otherStart},leverA:false,leverB:false,signalSeen:false,asked:false,otherHolding:false,helped:false,soloTimer:0,gate:false,secret:false,trapActive:false,trapUntil:0,complete:false,paused:true,events:[],elapsed:0,predictionChecks:0,deviationChosen:false,echoProgress:0,echoLearned:false,shelters:0,pendingEcho:0,echoReleased:false,lastSafe:{...start},beamHitAt:0,collapseTimer:0,collapseWarning:false,collapses:0,pendingStation:0,trustChoices:0,verifyChoices:0,lastChoice:'none'};
  let input={x:0,y:0},held=new Map(),last=0,drawer=false,drawerWasPaused=false,restartWasPaused=false,focusBeforeRestart=null,pointer=null,joy=null,toastUntil=0,camera={x:0,y:0},aiRepath=0,aiStep=null,aiTargetKey='';
  const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y), near=(a,b,r=2.1)=>dist(a,b)<r;
  function remember(type,detail=''){s.events.push({type,detail,t:Math.round(s.elapsed)});if(s.events.length>80)s.events.shift();save();}
  function toast(msg,ms=3200){$('toast').textContent=msg;$('toast').classList.add('visible');toastUntil=performance.now()+ms;$('storylog').textContent=msg;}
  function save(){try{localStorage.setItem(SAVE,JSON.stringify({...s,explored:Array.from(explored)}));}catch{}}
  function load(){try{const d=JSON.parse(localStorage.getItem(SAVE)||'null');if(!d||typeof d!=='object')return;for(const k of ['leverA','leverB','signalSeen','asked','otherHolding','helped','gate','secret','trapActive','complete'])s[k]=!!d[k];for(const k of ['player','other'])if(d[k]&&Number.isFinite(d[k].x)&&Number.isFinite(d[k].y)&&d[k].x>1&&d[k].x<W-1&&d[k].y>1&&d[k].y<H-1)s[k]={x:d[k].x,y:d[k].y};s.events=Array.isArray(d.events)?d.events.slice(-80):[];s.predictionChecks=Math.max(0,Math.min(3,Number(d.predictionChecks)||0));s.deviationChosen=!!d.deviationChosen;s.echoProgress=Math.max(0,Math.min(3,Number(d.echoProgress)||0));s.echoLearned=!!d.echoLearned;s.shelters=Math.max(0,Math.min(3,Number(d.shelters)||0));s.pendingEcho=Math.max(0,Math.min(3,Number(d.pendingEcho)||0));s.echoReleased=!!d.echoReleased;if(d.lastSafe&&Number.isFinite(d.lastSafe.x)&&Number.isFinite(d.lastSafe.y))s.lastSafe={x:d.lastSafe.x,y:d.lastSafe.y};s.beamHitAt=Number(d.beamHitAt)||0;s.collapseTimer=Math.max(0,Math.min(24,Number(d.collapseTimer)||0));s.collapseWarning=!!d.collapseWarning;s.collapses=Math.max(0,Number(d.collapses)||0);s.trustChoices=Math.max(0,Math.min(3,Number(d.trustChoices)||0));s.verifyChoices=Math.max(0,Math.min(3,Number(d.verifyChoices)||0));s.lastChoice=['trust','verify'].includes(d.lastChoice)?d.lastChoice:'none';s.pendingStation=0;if(Array.isArray(d.explored)&&d.explored.length===W*H)explored.set(d.explored.map(Boolean));if(s.leverB&&!s.otherHolding&&!s.gate){s.leverB=false;s.soloTimer=0;}}catch{}}
  function cellOpen(gx,gy){if(gx<1||gy<1||gx>=W-1||gy>=H-1)return false;if((gx>=63&&gx<=68&&gy===28)||(gx===51&&(gy===12||gy===46)))return s.shelters===1;if((gx>=29&&gx<=34&&gy===28)||(gx===35&&(gy===12||gy===46)))return s.shelters===2;if(gx>=15&&gx<=20&&gy===29)return s.shelters===3;return grid[idx(gx,gy)]===0;} function walkable(x,y){return cellOpen(Math.floor(x),Math.floor(y));}
  function move(actor,dx,dy,spd,dt){const nx=actor.x+dx*spd*dt,ny=actor.y+dy*spd*dt;if(walkable(nx,actor.y))actor.x=nx;if(walkable(actor.x,ny))actor.y=ny;}
  function nextPathStep(from,to){const sx=Math.floor(from.x),sy=Math.floor(from.y),tx=Math.floor(to.x),ty=Math.floor(to.y);if(sx===tx&&sy===ty)return{x:tx+.5,y:ty+.5};const q=[[sx,sy]],prev=new Map([[`${sx},${sy}`,null]]),dirs=[[1,0],[-1,0],[0,1],[0,-1]];let found=false;for(let qi=0;qi<q.length&&qi< W*H;qi++){const [x,y]=q[qi];if(x===tx&&y===ty){found=true;break;}for(const [dx,dy]of dirs){const nx=x+dx,ny=y+dy,key=`${nx},${ny}`;if(nx<1||ny<1||nx>=W-1||ny>=H-1||prev.has(key))continue;if(!cellOpen(nx,ny))continue;prev.set(key,`${x},${y}`);q.push([nx,ny]);}}if(!found)return null;let key=`${tx},${ty}`,route=[];while(key){const [x,y]=key.split(',').map(Number);route.push({x:x+.5,y:y+.5});key=prev.get(key);}route.reverse();return route[1]||route[0];}
  function updateOther(dt){
    if(s.complete)return;
    if(s.pendingEcho&&!s.echoReleased&&dist(s.player,objects[`shelter${s.pendingEcho}`])>3.2)s.echoReleased=true;
    const target=s.pendingEcho&&s.echoReleased?objects[`shelter${s.pendingEcho}`]:s.player;
    if(dist(s.other,target)>(s.pendingEcho&&s.echoReleased?1.35:2.1)){
      const key=`${s.pendingEcho&&s.echoReleased?'echo:'+s.pendingEcho:'follow:'+Math.floor(s.player.x)+','+Math.floor(s.player.y)}`;
      aiRepath-=dt;
      if(aiRepath<=0||key!==aiTargetKey){aiStep=nextPathStep(s.other,target);aiRepath=.22;aiTargetKey=key;}
      if(aiStep){const dx=aiStep.x-s.other.x,dy=aiStep.y-s.other.y,m=Math.hypot(dx,dy)||1;move(s.other,dx/m,dy/m,s.pendingEcho&&s.echoReleased?2.05:(s.lastChoice==='trust'?2.05:1.55),dt);}
    }
    if(s.pendingEcho&&s.echoReleased&&dist(s.other,objects[`shelter${s.pendingEcho}`])<=1.35){
      const echoed=s.pendingEcho;s.pendingEcho=0;s.echoReleased=false;s.shelters=echoed;s.gate=s.shelters===3;
      remember('distortion_anchor',`L’Autre a rejoint le repère ${echoed} après le départ du joueur.`);
      toast(echoed<3?`PORTE ${echoed}/3 FRANCHIE : L’Autre a confirmé la trace. Cherche la suivante.`:'DÉCISION 3/3 ENREGISTRÉE : le passage final est révélé.');
      updateHud();save();
    }
  }
  function markComplete(){if(s.complete)return;s.complete=true;s.paused=true;s.collapseTimer=0;remember('chapter30_complete','Le joueur a traversé trois décisions et découvert comment le monde répond.');window.v2MarkCampaignChapterComplete?.(30);$('completeSummary').textContent=`Tu as traversé trois décisions et atteint la sortie. ${s.secret?'Tu as aussi découvert la cache facultative.':'La cache facultative reste à découvrir.'} Le monde a mémorisé tes choix.`;$('completeOverlay').classList.add('active');$('completeOverlay').setAttribute('aria-hidden','false');save();}
  function interact(){
    if(s.paused||s.complete)return;
    const p=s.player;
    const o=Object.values(objects).map(o=>o.kind==='other'?{...o,x:s.other.x,y:s.other.y}:o).sort((a,b)=>dist(p,a)-dist(p,b)).find(o=>near(p,o,2.4));
    if(!o){toast('Aucun mécanisme à portée. Approche-toi d’une décision ou d’un indice.');return;}
    if(o.kind==='worldClue'){
      remember('world_clue_inspected',`Le joueur a inspecté ${o.label}.`);
      toast('INDICE DU MONDE : faire confiance accélère L’Autre et donne plus de temps ; vérifier les indices révèle une partie du secteur suivant, avec un délai plus court.');
      updateHud();save();return;
    } else if(o.kind==='shelter1'||o.kind==='shelter2'||o.kind==='shelter3'){
      const n=Number(o.kind.slice(-1)), label=['','décision de droite','décision centrale','décision de gauche'][n];
      if(n>s.shelters+1){
        s.player={...s.lastSafe}; input={x:0,y:0};
        remember('world_wrong_order',`La ${label} a été tentée hors séquence.`);
        toast('ORDRE INCORRECT : le monde te ramène au dernier point stable. Suis les indices : droite → centre → gauche.');
        return;
      }
      if(n<=s.shelters){toast(`La ${label} est déjà enregistrée. Cherche la suivante.`);return;}
      if(dist(s.other,o)>4.5){
        toast('L’Autre doit être proche pour que le monde prenne votre décision en compte.');
        return;
      }
      s.pendingStation=n;
      $('choicePrompt').textContent=`Décision ${n}/3 — ${label}. Faire confiance à L’Autre accélère sa progression et te laisse plus de temps. Vérifier les indices révèle une partie du prochain secteur.`;
      $('pieceA').textContent=`DÉCISIONS · ${s.shelters}/3`;
      $('pieceB').textContent=`CHOIX · ${s.trustChoices} CONFIANCE / ${s.verifyChoices} VÉRIFICATION`;
      $('bridgePanel').hidden=false;
      s.paused=true; held.clear(); releaseJoy();
      remember('world_choice_requested',`Le joueur doit choisir une réponse du monde au point ${n}.`);
      return;
    } else if(o.kind==='signal'){
      s.signalSeen=true;remember('threshold_clue_right','La plaque indique la première trace fiable : celle de droite.');
      toast('INDICE : le monde attend une décision à droite. Tu peux faire confiance à L’Autre ou vérifier les signes avant de choisir.');
    } else if(o.kind==='warning'){
      s.predictionChecks=Math.max(1,s.predictionChecks);remember('threshold_clue_center','La plaque révèle que la trace réelle centrale vient après celle de droite.');
      toast('INDICE : le point central vient en deuxième. Vérifier cet indice révèle le prochain secteur, mais laisse moins de temps.');
    } else if(o.kind==='mechanism'){
       s.predictionChecks=Math.max(2,s.predictionChecks);remember('threshold_clue_order','La plaque confirme l’ordre des traces réelles : droite, centre, gauche.');
      toast('ORDRE : droite → centre → gauche. Chaque choix façonne le rythme du monde et la vitesse de L’Autre.');
    } else if(o.kind==='other'){
      toast(dist(s.other,s.player)<2.1?'« Tes choix modifient le chemin. Tu peux me croire, mais observe aussi ce que le monde te montre. »':'« Le monde retient la manière dont tu avances. Choisis en connaissance de cause. »');
      remember('other_identity_cooperation','L’Autre accompagne le joueur pendant la comparaison des traces.');
    } else if(o.kind==='secret'){
      if(!s.secret){s.secret=true;remember('secret_found','Une cavité au-delà du seuil cache une note facultative.');toast('SECRET : « Le monde ne choisit pas à ta place. Il répond à ce que tu lui montres. »');}
      else toast('Tu as déjà découvert le signe secret.');
    }
    updateHud();save();
  }
  function chooseWorld(choice){
    const n=s.pendingStation;
    if(!n||s.complete)return;
    s.shelters=n;s.gate=n===3;s.pendingStation=0;
    applyFractureRoute(n);
    s.lastSafe={x:objects[`shelter${n}`].x,y:objects[`shelter${n}`].y};
    s.lastChoice=choice;
    if(choice==='trust'){
      s.trustChoices++;
      s.collapseTimer=n<3?30:0;
      remember('world_trust',`Au point ${n}, le joueur a fait confiance à L’Autre. Le monde lui accorde plus de temps.`);
      toast(n<3?'TU AS FAIT CONFIANCE : L’Autre se déplace plus vite et le prochain passage reste ouvert plus longtemps.':'DERNIÈRE DÉCISION : la confiance a marqué le monde. Rejoins la sortie avec L’Autre.');
    }else{
      s.verifyChoices++;
      s.collapseTimer=n<3?24:0;
      const next=n<3?objects[`shelter${n+1}`]:objects.secret;
      for(let y=Math.floor(next.y)-5;y<=Math.floor(next.y)+5;y++)for(let x=Math.floor(next.x)-6;x<=Math.floor(next.x)+6;x++)if(x>=0&&y>=0&&x<W&&y<H&&Math.hypot(x-next.x,y-next.y)<6)explored[idx(x,y)]=1;
      remember('world_verify',`Au point ${n}, le joueur a vérifié les indices. Le prochain secteur est révélé.`);
      toast(n<3?'TU AS VÉRIFIÉ : une partie du prochain secteur apparaît sur la carte. Le temps reste limité.':'DERNIÈRE DÉCISION : tu as vérifié les indices jusqu’au bout. Rejoins la sortie avec L’Autre.');
    }
    s.collapseWarning=false;
    $('bridgePanel').hidden=true;
    s.paused=false;$('pauseButton').textContent='PAUSE';$('pauseButton').setAttribute('aria-pressed','false');
    updateHud();save();
  }
  function assemble(){chooseWorld('trust');}
    function updateHud(){
    $('progressStatus').textContent=`DÉCISIONS · ${s.shelters}/3`;
    $('pieceA').textContent=`DÉCISIONS · ${s.shelters}/3`;
    $('pieceB').textContent=`${s.trustChoices} CONFIANCE / ${s.verifyChoices} VÉRIFICATION`;
    $('gateStatus').textContent=`MONDE : ${s.gate?'A RÉPONDU':'EN OBSERVATION'}`;
    $('collapseStatus').textContent=s.collapseTimer>0?`PASSAGE : ${Math.ceil(s.collapseTimer)} s`:`MONDE : ${s.lastChoice==='trust'?'CONFIANCE':s.lastChoice==='verify'?'VÉRIFICATION':'EN ATTENTE'}`;
    $('collapseStatus').classList.toggle('warning',s.collapseTimer>0&&s.collapseTimer<=7);
    $('otherStatus').textContent=s.gate?'L’AUTRE : AVEC TOI':`L’AUTRE : ${dist(s.other,s.player)<2.1?'À TES CÔTÉS':'EN APPROCHE'} · ${s.lastChoice==='trust'?'CONFIANCE':s.lastChoice==='verify'?'INDICES':'OBSERVE'}`;
    const objective=s.complete?'CHAPITRE TERMINÉ':s.gate?'Rejoins la sortie avec L’Autre.':s.collapseTimer>0?`Le passage changera dans ${Math.ceil(s.collapseTimer)} s : rejoins la décision ${s.shelters+1}/3.`:`Choisis au point ${s.shelters+1}/3 : fais confiance à L’Autre ou vérifie les indices.`;
    $('objective').textContent=objective;$('drawerObjective').textContent=objective;$('drawerObjectiveState').textContent=s.complete?'TERMINÉ':s.gate?'SORTIE OUVERTE':`${s.shelters}/3 DÉCISIONS`;
    $('drawerOtherStatus').textContent=$('otherStatus').textContent;$('drawerGateStatus').textContent=$('gateStatus').textContent;
    $('drawerJourney').textContent=s.events.length?`FAITS MÉMORISÉS : ${s.events.length} · ${s.events[s.events.length-1].detail}`:'Le monde n’a pas encore enregistré de décision.';
  }
  function reveal(){const px=Math.floor(s.player.x),py=Math.floor(s.player.y);for(let y=py-7;y<=py+7;y++)for(let x=px-9;x<=px+9;x++)if(x>=0&&y>=0&&x<W&&y<H&&Math.hypot(x-px,y-py)<9)explored[idx(x,y)]=1;}
  function resize(){const r=canvas.parentElement.getBoundingClientRect();canvas.width=Math.max(320,Math.floor(r.width*devicePixelRatio));canvas.height=Math.max(260,Math.floor((r.height||500)*devicePixelRatio));map.width=W*3;map.height=H*3;draw();}
  function draw(){const cw=canvas.width,ch=canvas.height;if(!cw||!ch)return;ctx.fillStyle='#080d11';ctx.fillRect(0,0,cw,ch);const scale=Math.min(cw/25,ch/17),tile=scale;const viewW=cw/tile,viewH=ch/tile;camera.x=Math.max(0,Math.min(W-viewW,s.player.x-viewW/2));camera.y=Math.max(0,Math.min(H-viewH,s.player.y-viewH/2));const sx=(x)=>(x-camera.x)*tile,sy=(y)=>(y-camera.y)*tile;
    for(let y=Math.floor(camera.y);y<Math.min(H,Math.ceil(camera.y+viewH));y++)for(let x=Math.floor(camera.x);x<Math.min(W,Math.ceil(camera.x+viewW));x++){const i=idx(x,y),seen=explored[i];if(!seen)continue;const open=cellOpen(x,y);ctx.fillStyle=open?'#0e1a20':'#283940';ctx.fillRect(sx(x),sy(y),tile+.5,tile+.5);if(open){ctx.strokeStyle='#172a31';ctx.strokeRect(sx(x)+1,sy(y)+1,tile-2,tile-2);}}
    // Labeled chambers are drawn only after discovery.
    const labels=[['SORTIE',5,24],['DÉCISION C',20,25],['DÉCISION B',43,25],['DÉCISION A',67,25],['INDICES',14,6],['DÉPART',83,24]];ctx.font=`bold ${Math.max(9,tile*.42)}px system-ui`;ctx.textAlign='center';for(const [l,x,y]of labels)if(explored[idx(x,y)]){ctx.fillStyle='#8ba7ad';ctx.fillText(l,sx(x+4),sy(y+1));}
    const marker=(o,color,text)=>{if(!explored[idx(Math.floor(o.x),Math.floor(o.y))])return;const x=sx(o.x+.5),y=sy(o.y+.5);ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y,Math.max(5,tile*.28),0,Math.PI*2);ctx.fill();ctx.strokeStyle='#dbe9e9';ctx.lineWidth=1.5;ctx.stroke();ctx.fillStyle='#dbe9e9';ctx.font=`bold ${Math.max(9,tile*.42)}px system-ui`;ctx.fillText(text,x,y-tile*.55);};
    marker(objects.signal,s.signalSeen?'#8fd8dc':'#e9d59c',s.signalSeen?'ORDRE ✓':'ORDRE ?');marker(objects.mechanism,'#d7a66f','APRÈS TOI ?');marker(objects.secret,s.secret?'#6d8b80':'#c8a7e8',s.secret?'SECRET ✓':'?');marker(objects.warning,'#e4a86b','TRACE ?');
    // Les indices du monde sont visibles lorsque le joueur découvre leur secteur.
    for(const marker of [objects.fissure1,objects.fissure2,objects.fissure3]){
      if(!explored[idx(Math.floor(marker.x),Math.floor(marker.y))])continue;
      const mx=sx(marker.x+.5),my=sy(marker.y+.5),r=Math.max(7,tile*.38);
      ctx.save();ctx.strokeStyle=s.collapseTimer>0?'#ff6477':'#b98577';ctx.lineWidth=Math.max(2,tile*.09);
      ctx.beginPath();ctx.moveTo(mx-r*.65,my-r);ctx.lineTo(mx-r*.1,my-r*.25);ctx.lineTo(mx-r*.5,my+.05*r);ctx.lineTo(mx+.05*r,my+r);ctx.moveTo(mx+.1*r,my-r*.45);ctx.lineTo(mx+r*.65,my-r*.05);ctx.stroke();
      ctx.fillStyle='#f3b4a8';ctx.font=`bold ${Math.max(9,tile*.42)}px system-ui`;ctx.fillText('INDICE',mx,my-r-5);ctx.restore();
    }
    // Chaque symbole est rendu par une forme distincte : l’énigme est entièrement visuelle.
    const shape=(o,type,color,label)=>{if(!explored[idx(Math.floor(o.x),Math.floor(o.y))])return;const x=sx(o.x+.5),y=sy(o.y+.5),r=Math.max(6,tile*.32);ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineWidth=Math.max(2,tile*.09);ctx.beginPath();if(type==='triangle'){ctx.moveTo(x,y-r);ctx.lineTo(x+r,y+r*.8);ctx.lineTo(x-r,y+r*.8);ctx.closePath();}else if(type==='circle'){ctx.arc(x,y,r,0,Math.PI*2);}else{ctx.rect(x-r*.8,y-r*.8,r*1.6,r*1.6);}ctx.stroke();ctx.fillStyle='#dbe9e9';ctx.font=`bold ${Math.max(9,tile*.42)}px system-ui`;ctx.fillText(label,x,y-r-5);};
    shape(objects.shelter1,'square',s.shelters===1?'#8fe8b4':s.pendingEcho===1?'#ff8996':'#e9d59c',s.shelters===1?'A ✓':'A');shape(objects.shelter2,'circle',s.shelters===2?'#8fe8b4':s.pendingEcho===2?'#ff8996':'#e9d59c',s.shelters===2?'B ✓':'B');shape(objects.shelter3,'triangle',s.shelters===3?'#8fe8b4':s.pendingEcho===3?'#ff8996':'#e9d59c',s.shelters===3?'C ✓':'C');
    for(const o of [objects.shelter1,objects.shelter2,objects.shelter3]){ctx.strokeStyle='#80d9d5';ctx.lineWidth=2;ctx.strokeRect(sx(o.x-1.5),sy(o.y-1.5),tile*3,tile*3);}
    const actor=(a,color,label)=>{const x=sx(a.x+.5),y=sy(a.y+.5);ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y,tile*.3,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#e7f0ef';ctx.lineWidth=1.5;ctx.stroke();ctx.fillStyle='#e7f0ef';ctx.font=`bold ${Math.max(9,tile*.45)}px system-ui`;ctx.fillText(label,x,y-tile*.48);};// L’Autre observe ta prochaine décision avec toi.
    const gazeTarget=objects[`shelter${Math.min(3,s.shelters+1)}`];
    if(gazeTarget){const ox=sx(s.other.x+.5),oy=sy(s.other.y+.5),tx=sx(gazeTarget.x+.5),ty=sy(gazeTarget.y+.5);ctx.save();ctx.strokeStyle='#ff8996';ctx.globalAlpha=.52;ctx.setLineDash([tile*.25,tile*.2]);ctx.lineWidth=Math.max(1.5,tile*.07);ctx.beginPath();ctx.moveTo(ox,oy);ctx.lineTo(tx,ty);ctx.stroke();ctx.restore();}
    actor(s.other,'#ff8996','L’AUTRE');actor(s.player,'#82edaa','TOI');
    if(!map.hidden){mctx.fillStyle='#080d11';mctx.fillRect(0,0,map.width,map.height);for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(explored[idx(x,y)]){mctx.fillStyle=cellOpen(x,y)?'#9bb8b8':'#34474e';mctx.fillRect(x*3,y*3,3,3);}mctx.fillStyle='#82edaa';mctx.fillRect(s.player.x*3-2,s.player.y*3-2,5,5);mctx.fillStyle='#ff8996';mctx.fillRect(s.other.x*3-2,s.other.y*3-2,5,5);}}
  function setPaused(v){s.paused=!!v;$('pauseButton').textContent=s.paused?'REPRENDRE':'PAUSE';$('pauseButton').setAttribute('aria-pressed',String(s.paused));$('pauseOverlay').classList.toggle('active',s.paused);$('pauseOverlay').setAttribute('aria-hidden',String(!s.paused));if(s.paused){held.clear();releaseJoy();}last=performance.now();}
  function setDrawer(v){if(drawer===v)return;drawer=v;$('sideDrawer').classList.toggle('open',v);$('drawerScrim').classList.toggle('open',v);$('sideDrawer').setAttribute('aria-hidden',String(!v));$('drawerScrim').setAttribute('aria-hidden',String(!v));$('menuButton').setAttribute('aria-expanded',String(v));if(v){drawerWasPaused=s.paused;s.paused=true;$('pauseOverlay').classList.remove('active');$('pauseOverlay').setAttribute('aria-hidden','true');held.clear();releaseJoy();$('drawerClose').focus();}else if(!drawerWasPaused&&!s.complete){s.paused=false;$('pauseButton').textContent='PAUSE';$('pauseButton').setAttribute('aria-pressed','false');}else if(drawerWasPaused){$('pauseOverlay').classList.add('active');$('pauseOverlay').setAttribute('aria-hidden','false');}drawerWasPaused=false;last=performance.now();}
  function toggleMap(){map.hidden=!map.hidden;$('mapToggle').setAttribute('aria-expanded',String(!map.hidden));resize();}
  function showIntro(){s.paused=true;$('introOverlay').classList.add('active');$('introOverlay').setAttribute('aria-hidden','false');$('startButton').textContent=s.complete?'REJOUER LE CHAPITRE 30':s.events.length?'REPRENDRE':'COMMENCER';last=performance.now();}
  function enter(){if(s.complete){restart();return;}$('introOverlay').classList.remove('active');$('introOverlay').setAttribute('aria-hidden','true');s.paused=false;$('pauseButton').textContent='PAUSE';last=performance.now();}
  function askRestart(){restartWasPaused=s.paused;focusBeforeRestart=document.activeElement;if(!s.paused&&!s.complete)setPaused(true);$('restartOverlay').classList.add('active');$('restartOverlay').setAttribute('aria-hidden','false');$('confirmRestart').focus();}
  function cancelRestart(){$('restartOverlay').classList.remove('active');$('restartOverlay').setAttribute('aria-hidden','true');if(!s.complete&&!restartWasPaused)setPaused(false);if(focusBeforeRestart?.focus)focusBeforeRestart.focus();}
  function restart(){try{localStorage.removeItem(SAVE);}catch{}s.player={...start};s.other={...otherStart};for(const k of ['leverA','leverB','signalSeen','asked','otherHolding','helped','gate','secret','trapActive','complete','deviationChosen','echoLearned'])s[k]=false;s.echoProgress=0;s.predictionChecks=0;s.shelters=0;s.pendingEcho=0;s.echoReleased=false;s.collapseTimer=0;s.collapseWarning=false;s.collapses=0;s.pendingStation=0;s.trustChoices=0;s.verifyChoices=0;s.lastChoice='none';s.collapseWarning=false;s.lastSafe={...start};s.beamHitAt=0;s.events=[];s.elapsed=0;explored.fill(0);input={x:0,y:0};held.clear();$('bridgePanel').hidden=true;$('completeOverlay').classList.remove('active');$('completeOverlay').setAttribute('aria-hidden','true');$('restartOverlay').classList.remove('active');$('restartOverlay').setAttribute('aria-hidden','true');setDrawer(false);showIntro();updateHud();save();}
  function keyDown(e){const k=e.key.toLowerCase();if(k==='escape'){if($('restartOverlay').classList.contains('active'))cancelRestart();else if(drawer)setDrawer(false);else if(!$('introOverlay').classList.contains('active'))setPaused(!s.paused);return;}if(s.paused||drawer||s.complete)return;const keys={arrowleft:[-1,0],a:[-1,0],q:[-1,0],arrowright:[1,0],d:[1,0],arrowup:[0,-1],w:[0,-1],z:[0,-1],arrowdown:[0,1],s:[0,1]};if(keys[k]){e.preventDefault();held.set(k,keys[k]);let x=0,y=0;for(const [vx,vy]of held.values()){x+=vx;y+=vy;}const m=Math.hypot(x,y)||1;input={x:x/m,y:y/m};}else if(k==='e'||k==='enter'){e.preventDefault();interact();}else if(k==='p')setPaused(true);}
  function keyUp(e){if(held.delete(e.key.toLowerCase())){let x=0,y=0;for(const [vx,vy]of held.values()){x+=vx;y+=vy;}const m=Math.hypot(x,y)||1;input=held.size?{x:x/m,y:y/m}:{x:0,y:0};}}
  function joyMove(e){const r=joy.getBoundingClientRect(),max=r.width*.31;let dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2),d=Math.hypot(dx,dy);if(d>max){dx*=max/d;dy*=max/d;}input={x:Math.abs(dx/max)<.12?0:dx/max,y:Math.abs(dy/max)<.12?0:dy/max};$('stick').style.transform=`translate(${dx}px,${dy}px)`;}
  function releaseJoy(){pointer=null;input={x:0,y:0};if($('stick'))$('stick').style.transform='translate(0,0)';}
  function tick(now){requestAnimationFrame(tick);if(!last)last=now;const dt=Math.min(.08,(now-last)/1000);last=now;if(!s.paused&&!s.complete){
      s.elapsed+=dt;move(s.player,input.x,input.y,3.25,dt);updateOther(dt);
      if(s.collapseTimer>0){
        s.collapseTimer=Math.max(0,s.collapseTimer-dt);
        if(s.collapseTimer>0&&s.collapseTimer<=7&&!s.collapseWarning){s.collapseWarning=true;toast('ALERTE : le passage va changer. Rejoins la prochaine décision avant la fermeture !',4500);}
        if(s.collapseTimer<=0&&s.shelters>0&&s.shelters<3){
          s.player={...s.lastSafe};s.other={x:s.lastSafe.x+1,y:s.lastSafe.y};s.collapses++;s.collapseTimer=s.lastChoice==='trust'?30:24;s.collapseWarning=false;input={x:0,y:0};
          remember('world_route_recovery',`Le passage a changé : retour au point stable ${s.shelters}.`);
          toast('LE MONDE CHANGE : le dernier point stable te protège. Le passage s’est reformé ; tu peux réessayer.');
        }
      }
      reveal();if(s.gate&&near(s.player,exit,2.2)&&dist(s.other,exit)<7)markComplete();if(toastUntil&&now>toastUntil)$('toast').classList.remove('visible');updateHud();}draw();}
  $('assembleButton').addEventListener('click',assemble);$('verifyButton').addEventListener('click',()=>chooseWorld('verify'));$('panelClose').addEventListener('click',()=>{s.pendingStation=0;$('bridgePanel').hidden=true;s.paused=false;$('pauseButton').textContent='PAUSE';$('pauseButton').setAttribute('aria-pressed','false');updateHud();});$('interact').addEventListener('click',interact);$('pauseButton').addEventListener('click',()=>{if(!drawer&&!s.complete)setPaused(!s.paused);});$('mapToggle').addEventListener('click',toggleMap);$('menuButton').addEventListener('click',()=>setDrawer(true));$('drawerClose').addEventListener('click',()=>setDrawer(false));$('drawerScrim').addEventListener('click',()=>setDrawer(false));$('drawerResume').addEventListener('click',()=>{setDrawer(false);setPaused(false);});$('drawerMap').addEventListener('click',()=>{setDrawer(false);toggleMap();});$('drawerPause').addEventListener('click',()=>{setDrawer(false);setPaused(true);});$('drawerRestart').addEventListener('click',askRestart);$('resumeButton').addEventListener('click',()=>setPaused(false));$('pauseMenuButton').addEventListener('click',()=>setDrawer(true));$('startButton').addEventListener('click',enter);$('reset').addEventListener('click',askRestart);$('completeClose').addEventListener('click',askRestart);$('confirmRestart').addEventListener('click',restart);$('cancelRestart').addEventListener('click',cancelRestart);$('restartOverlay').addEventListener('click',e=>{if(e.target===$('restartOverlay'))cancelRestart();});$('sideDrawer').addEventListener('keydown',e=>{if(e.key==='Escape')setDrawer(false);});window.addEventListener('keydown',keyDown);window.addEventListener('keyup',keyUp);window.addEventListener('blur',()=>{held.clear();releaseJoy();});joy=$('joystick');joy.addEventListener('pointerdown',e=>{if(s.paused||drawer||s.complete)return;pointer=e.pointerId;joy.setPointerCapture(e.pointerId);joyMove(e);});joy.addEventListener('pointermove',e=>{if(e.pointerId===pointer)joyMove(e);});joy.addEventListener('pointerup',releaseJoy);joy.addEventListener('pointercancel',releaseJoy);window.addEventListener('resize',resize,{passive:true});window.visualViewport?.addEventListener('resize',resize,{passive:true});
  load();applyFractureRoute(s.shelters);reveal();resize();updateHud();if(s.complete){$('completeOverlay').classList.add('active');$('completeOverlay').setAttribute('aria-hidden','false');}else showIntro();requestAnimationFrame(tick);
  window.v2Chapter30Snapshot=()=>({player:{...s.player},other:{...s.other},decisions:s.shelters,routeTimer:s.collapseTimer,collapses:s.collapses,gate:s.gate,secret:s.secret,complete:s.complete,events:s.events.map(e=>e.type)});
})();
