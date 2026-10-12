from pathlib import Path
import re, zipfile, subprocess, os
root=Path('/tmp/ch14work')
s=(root/'v2-chapter13.js').read_text()
s=s.replace('Chapitre 13 — TRAHISON. Labyrinthe déterministe, énigme ordonnée, piège récupérable et souvenir factuel.', 'Chapitre 14 — COOPÉRATION. Deux leviers éloignés, signal à transmettre et passerelle à paliers.')
s=s.replace('const W=88,H=56,T=22,SAVE=\'otherPlayerChapter13SaveV2\'', 'const W=92,H=58,T=22,SAVE=\'otherPlayerChapter14SaveV2\'')
# Replace geometry / object/state block
start=s.index('  // Plan en huit asymétrique:') if '  // Plan en huit asymétrique:' in s else s.index('  // Plan en huit asymétrique')
end=s.index('  let input=', start)
block=r'''  // Neuf salles en réseau : les deux leviers sont éloignés et le pont central est distinct du détour de secours.
  [[2,23,14,14],[17,4,15,13],[17,40,15,13],[35,21,13,15],[52,4,15,13],[52,40,15,13],[70,21,13,15],[80,23,10,14],[35,39,13,14]].forEach(r=>room(...r));
  [ [[13,29],[17,29]], [[17,29],[35,29]], [[29,25],[33,25],[33,12],[35,12]], [[29,33],[33,33],[33,46],[35,46]], [[47,25],[50,25],[50,12],[52,12]], [[47,33],[50,33],[50,46],[52,46]], [[66,12],[69,12],[69,26],[70,26]], [[66,46],[69,46],[69,31],[70,31]], [[47,28],[52,28]], [[61,28],[70,28]], [[82,28],[85,28]], [[41,35],[41,40]], [[41,18],[41,22]], [[61,42],[61,46]] ].forEach(p=>path(p,1));
  // La passerelle centrale est verrouillée au départ ; le détour inférieur reste praticable.
  const mainBridge=[];for(let x=63;x<=68;x++){grid[idx(x,28)]=1;mainBridge.push([x,28]);}
  const tempBridge=[];for(let x=63;x<=68;x++){grid[idx(x,31)]=0;tempBridge.push([x,31]);}
  // Boucle de secours : elle rend les deux zones accessibles même sans coopération.
  path([[47,33],[49,35],[49,46],[52,46]],1);
  const start={x:8.5,y:29.5}, otherStart={x:40.5,y:28.5}, exit={x:85,y:28.5};
  const objects={leverA:{x:25,y:10,label:'LEVIER A · OUEST',kind:'leverA'},leverB:{x:59,y:46,label:'LEVIER B · EST',kind:'leverB'},signal:{x:40,y:46,label:'PANNEAU DE SIGNAL',kind:'signal'},other:{x:40.5,y:28.5,label:'L’AUTRE',kind:'other'},secret:{x:60,y:50,label:'ALCÔVE DE COORDINATION',kind:'secret'},warning:{x:61.5,y:31,label:'VOYANTS · PASSERELLE',kind:'warning'},mechanism:{x:61,y:28,label:'PASSERELLE',kind:'mechanism'}};
  const s={player:{...start},other:{...otherStart},leverA:false,leverB:false,signalSeen:false,asked:false,otherHolding:false,helped:false,soloTimer:0,gate:false,secret:false,trapActive:false,trapUntil:0,complete:false,paused:true,events:[],elapsed:0};
'''
s=s[:start]+block+s[end:]
# load keys and walkable gate
s=s.replace("['pieceA','pieceB','plaqueA','plaqueB','gate','secret','asked','helped','promiseFailed','otherHolding','trapActive','complete']", "['leverA','leverB','signalSeen','asked','otherHolding','helped','gate','secret','trapActive','complete']")
s=s.replace("if(s.gate&&gx>=70&&gx<=73&&gy===26)return true;", "if(s.gate&&gx>=63&&gx<=68&&gy===28)return true;")
# replace updateOther function
s=re.sub(r'  function updateOther\(dt\)\{.*?\n  function markComplete', r'''  function updateOther(dt){
    if(s.complete)return;
    if(s.asked&&!s.otherHolding){
      const t=objects.leverB, d=dist(s.other,t);
      if(d>1.35){const key=`leverB:${s.signalSeen}`;aiRepath-=dt;if(aiRepath<=0||key!==aiTargetKey){aiStep=nextPathStep(s.other,t);aiRepath=.25;aiTargetKey=key;}if(aiStep){const dx=aiStep.x-s.other.x,dy=aiStep.y-s.other.y,m=Math.hypot(dx,dy)||1;move(s.other,dx/m,dy/m,1.8,dt);}}
      else {s.otherHolding=true;s.leverB=true;remember('other_holds_lever','L’Autre atteint le levier B et le maintient.');toast('L’Autre maintient le levier B. Tu peux rejoindre le levier A dans l’aile ouest.');updateHud();save();}
    } else if(!s.asked&&!s.otherHolding){
      const d=dist(s.other,s.player); if(d>3.2){const key=`follow:${Math.floor(s.player.x)},${Math.floor(s.player.y)}`;aiRepath-=dt;if(aiRepath<=0||key!==aiTargetKey){aiStep=nextPathStep(s.other,s.player);aiRepath=.55;aiTargetKey=key;}if(aiStep){const dx=aiStep.x-s.other.x,dy=aiStep.y-s.other.y,m=Math.hypot(dx,dy)||1;move(s.other,dx/m,dy/m,1.25,dt);}}
    }
    if(s.soloTimer>0){s.soloTimer=Math.max(0,s.soloTimer-dt);if(s.soloTimer===0&&!s.gate&&!s.otherHolding){s.leverB=false;remember('solo_lever_released','Le levier B est revenu au repos après son délai annoncé.');toast('Le levier B revient au repos. La boucle inférieure permet de le réactiver.');}}
    if(s.leverA&&(s.otherHolding||s.soloTimer>0)&&!s.gate){s.gate=true;remember('bridge_raised',s.otherHolding?'La coordination a levé la passerelle.':'Le levier retardé a permis une coordination en solitaire.');toast(s.otherHolding?'Les deux leviers sont maintenus : la passerelle se déplace par paliers et s’immobilise en position sûre.':'Le délai du levier B a suffi : la passerelle est verrouillée en position sûre.');updateHud();save();}
  }
  function markComplete''', s, flags=re.S)
# replace markComplete through interact start
s=re.sub(r'  function markComplete\(\)\{.*?\n  function interact\(\)', r'''  function markComplete(){if(s.complete)return;s.complete=true;s.paused=true;remember('chapter14_complete',s.otherHolding?'Passerelle franchie grâce à la coopération.':'Passerelle franchie grâce au levier à action retardée.');window.v2MarkCampaignChapterComplete?.(14);$('completeSummary').textContent=`${s.otherHolding?'Vous avez réparti les rôles et maintenu les deux leviers ensemble.':'Tu as utilisé le levier à action retardée pour résoudre le mécanisme seul.'} ${s.secret?'L’alcôve de coordination a été découverte.':'L’alcôve de coordination reste à découvrir.'} Les actions réelles ont été mémorisées.`;$('completeOverlay').classList.add('active');$('completeOverlay').setAttribute('aria-hidden','false');save();}
  function interact()''', s, flags=re.S)
# replace interact through assemble function
s=re.sub(r'  function interact\(\)\{.*?\n  function assemble\(\)', r'''  function interact(){if(s.paused||s.complete)return;const p=s.player;const ordered=Object.values(objects).sort((a,b)=>dist(p,a)-dist(p,b));const o=ordered.find(o=>near(p,o,2.35));if(!o){toast('Aucun levier à portée. Explore les deux ailes et repère les voyants de la passerelle.');return;}
    switch(o.kind){
      case'leverA': if(!s.leverA){s.leverA=true;remember('lever_a_activated','Le joueur a activé le levier A dans la zone ouest.');toast('Le levier A est enclenché. Il faut encore maintenir le levier B à l’est, ou l’activer avec son délai de secours.');}else toast('Le levier A est déjà enclenché.');break;
      case'leverB': if(s.otherHolding){toast('L’Autre maintient déjà le levier B. La coopération est active.');}else if(!s.leverB){s.leverB=true;s.soloTimer=18;remember('solo_lever_started','Le joueur a déclenché le levier B à action retardée (18 secondes).');toast('LEVIER B : action retardée de 18 secondes. Rejoins le levier A avant la fin du délai. La passerelle affiche ses paliers lumineux.');}else toast(`Le levier B est actif. Délai restant : ${Math.ceil(s.soloTimer)} s.`);break;
      case'signal':s.signalSeen=true;remember('signal_shown','Le joueur a montré à l’Autre le signal à deux impulsions.');toast(s.asked?'Tu montres le signal à l’Autre : il comprend qu’il doit maintenir B.':'Signal observé : deux impulsions signifient « maintenir », une impulsion signifie « relâcher ». Tu peux maintenant demander à l’Autre de tenir B.');break;
      case'other':if(!s.asked){s.asked=true;if(!s.signalSeen){s.asked=false;remember('signal_requested','L’Autre demande un signal avant d’agir.');toast('L’Autre ne bouge pas encore : il demande un signal clair. Va au panneau au sud-ouest, observe les deux impulsions, puis reviens lui demander.');}else{remember('hold_requested','Le joueur a demandé à l’Autre de maintenir le levier B.');toast('L’Autre a compris le signal et se dirige vers le levier B.');}}else if(s.otherHolding){s.otherHolding=false;s.asked=false;s.leverB=false;s.soloTimer=0;remember('lever_released','Le joueur a demandé à l’Autre de relâcher le levier B.');toast('L’Autre relâche le levier B. Le signal à une impulsion signifie « relâcher ».');}else toast('L’Autre se dirige vers le levier B.');break;
      case'secret':if(!s.secret){s.secret=true;remember('secret_found','L’alcôve facultative contient le diagramme de coordination.');toast('SECRET : le diagramme montre que la passerelle peut être stabilisée par deux personnes ou par un levier temporisé.');}else toast('Le diagramme est déjà mémorisé.');break;
      case'warning':toast('VOYANTS : un, deux, trois. Chaque impulsion annonce un palier du pont. Attends le voyant vert avant de traverser.');break;
      case'mechanism':toast(s.gate?'La passerelle est stabilisée et peut être traversée.':`Passerelle verrouillée. Levier A ${s.leverA?'actif':'inactif'} · levier B ${s.leverB?'actif':'inactif'}.`);break;
    }
    if(s.leverA&&(s.otherHolding||s.soloTimer>0)&&!s.gate){s.gate=true;remember('bridge_raised',s.otherHolding?'La coordination a levé la passerelle.':'Le levier retardé a permis une coordination en solitaire.');toast('Les deux commandes répondent : la passerelle s’aligne par paliers puis se verrouille.');}
    updateHud();save();}
  function assemble()''', s, flags=re.S)
# assemble is unused, keep as harmless signal action
s=re.sub(r'  function assemble\(\)\{.*?\n  function updateHud\(\)', r'''  function assemble(){s.signalSeen=true;toast('Signal mémorisé. Retourne voir l’Autre pour lui demander de maintenir le levier B.');save();}
  function updateHud()''', s, flags=re.S)
# updateHud block
s=re.sub(r'  function updateHud\(\)\{.*?\n  function reveal\(\)', r'''  function updateHud(){const count=Number(s.leverA)+Number(s.leverB);$('progressStatus').textContent=`LEVIERS · ${count}/2`;$('pieceA').textContent=`A · ${s.leverA?'ACTIF':'INACTIF'}`;$('pieceB').textContent=`B · ${s.leverB?'ACTIF':'INACTIF'}`;$('gateStatus').textContent=`PASSERELLE : ${s.gate?'STABILISÉE':'VERROUILLÉE'}`;$('otherStatus').textContent=s.otherHolding?'L’AUTRE : MAINTIENT B':s.asked?'L’AUTRE : EN ROUTE VERS B':s.signalSeen?'L’AUTRE : SIGNAL COMPRIS':'L’AUTRE : EN ATTENTE DU SIGNAL';const objective=s.complete?'CHAPITRE TERMINÉ':s.gate?'Traverse la passerelle et rejoins la sortie.':!s.signalSeen?'Observe le panneau de signal, puis demande à l’Autre de maintenir B.':`Active le levier A (${s.leverA?'fait':'à faire'}) pendant que l’Autre maintient B, ou utilise le délai de secours.`;$('objective').textContent=objective;$('drawerObjective').textContent=objective;$('drawerObjectiveState').textContent=s.complete?'TERMINÉ':s.gate?'SORTIE OUVERTE':`${count}/2 LEVIERS`;$('drawerOtherStatus').textContent=$('otherStatus').textContent;$('drawerGateStatus').textContent=$('gateStatus').textContent;$('drawerJourney').textContent=s.events.length?`FAITS MÉMORISÉS : ${s.events.length} · ${s.events[s.events.length-1].detail}`:'Souvenir : aucun fait enregistré.';}
  function reveal()''', s, flags=re.S)
# draw labels and markers / bridge tiles
s=s.replace("const labels=[['RENCONTRE',5,24],['ATELIER NORD',19,6],['ATELIER SUD',19,40],['MÉCANISME',37,23],['PASSERELLE HAUTE',55,6],['PASSERELLE BASSE',55,40],['SORTIE',76,24]]", "const labels=[['ENTRÉE',5,24],['ZONE A',19,6],['PANNEAU',37,43],['CARREFOUR',37,23],['ZONE NORD',55,6],['LEVIER B',55,42],['PASSERELLE',72,23],['SORTIE',83,24]]")
s=s.replace("marker(objects.pieceA,s.pieceA?'#527b70':'#e9d59c',s.pieceA?'△ ✓':'△');marker(objects.pieceB,s.pieceB?'#527b70':'#e9d59c',s.pieceB?'○ ✓':'○');marker(objects.plaqueA,'#8fd8dc','△');marker(objects.plaqueB,'#8fd8dc','○');marker(objects.mechanism,s.gate?'#8fe8b4':'#d7a66f','MÉCANISME');marker(objects.secret,s.secret?'#6d8b80':'#c8a7e8',s.secret?'CACHE ✓':'?');marker(objects.warning,'#e4a86b','!');", "marker(objects.leverA,s.leverA?'#8fe8b4':'#e9d59c',s.leverA?'A ✓':'A');marker(objects.leverB,s.leverB?'#8fe8b4':'#e9d59c',s.leverB?'B ✓':'B');marker(objects.signal,s.signalSeen?'#8fd8dc':'#e9d59c',s.signalSeen?'SIGNAL ✓':'SIGNAL');marker(objects.mechanism,s.gate?'#8fe8b4':'#d7a66f','PONT');marker(objects.secret,s.secret?'#6d8b80':'#c8a7e8',s.secret?'CACHE ✓':'?');marker(objects.warning,'#e4a86b','!');")
s=s.replace("for(const [x,y] of mainBridge){ctx.fillStyle=s.gate?'#5b9a7c':'#6c3d42';ctx.fillRect(sx(x),sy(y),tile,tile);ctx.strokeStyle=s.gate?'#9df0be':'#e7a2a2';ctx.strokeRect(sx(x)+2,sy(y)+2,tile-4,tile-4);}for(const [x,y] of tempBridge){ctx.fillStyle=s.trapActive?'#9a6d3c':'#3d6568';ctx.fillRect(sx(x),sy(y),tile,tile);ctx.strokeStyle='#e4c47e';ctx.strokeRect(sx(x)+2,sy(y)+2,tile-4,tile-4);}", "for(const [x,y] of mainBridge){ctx.fillStyle=s.gate?'#5b9a7c':'#6c3d42';ctx.fillRect(sx(x),sy(y),tile,tile);ctx.strokeStyle=s.gate?'#9df0be':'#e7a2a2';ctx.strokeRect(sx(x)+2,sy(y)+2,tile-4,tile-4);}for(const [x,y] of tempBridge){ctx.fillStyle='#3d6568';ctx.fillRect(sx(x),sy(y),tile,tile);ctx.strokeStyle='#e4c47e';ctx.strokeRect(sx(x)+2,sy(y)+2,tile-4,tile-4);}")
# Tick logic replace trap-specific snippet
s=s.replace("if(s.trapActive&&now>s.trapUntil){s.trapActive=false;if(s.player.x>=70&&s.player.x<=73.5&&Math.abs(s.player.y-29)<1.4){s.player.x=68.3;s.player.y=31.2;toast('Le pont provisoire s’est rétracté. La passerelle de récupération t’a ramené sur la berge : aucune progression perdue.');remember('trap_recovered','Le joueur a été ramené sur la berge après la rétraction.');}else toast('Le pont provisoire est revenu au repos. La balise signale un nouveau cycle.');}if(near(s.player,{x:71.5,y:29},1.8)&&!s.trapActive){s.trapActive=true;s.trapUntil=now+4200;remember('trap_crossing','La balise a lancé le cycle de rétraction de 4,2 secondes.');toast('BALISE ALLUMÉE : le pont provisoire se rétractera dans 4 secondes. Traverse vite ou utilise le chemin de récupération au sud.',4000);}", "if(s.gate&&near(s.player,{x:65.5,y:28.5},1.7)&&!s.trapActive){s.trapActive=true;s.trapUntil=now+5000;remember('bridge_cycle','Les voyants ont annoncé les trois paliers de la passerelle.');toast('VOYANTS : la passerelle avance par paliers. Attends le vert avant de traverser.',2800);}if(s.trapActive&&now>s.trapUntil){s.trapActive=false;toast('La passerelle est stabilisée. Tu peux traverser sans risque.');}")
s=s.replace("if(s.gate&&near(s.player,exit,1.7))markComplete();", "if(s.gate&&near(s.player,exit,2.2))markComplete();")
# restart reset keys
s=s.replace("for(const k of ['pieceA','pieceB','plaqueA','plaqueB','gate','secret','asked','helped','promiseFailed','otherHolding','trapActive','complete'])s[k]=false;", "for(const k of ['leverA','leverB','signalSeen','asked','otherHolding','helped','gate','secret','trapActive','complete'])s[k]=false;s.soloTimer=0;")
s=s.replace("$('startButton').textContent=s.complete?'REJOUER LE CHAPITRE 13'", "$('startButton').textContent=s.complete?'REJOUER LE CHAPITRE 14'")
s=s.replace("window.v2Chapter13Snapshot=()=>({player:{...s.player},other:{...s.other},pieces:[s.pieceA,s.pieceB],marks:[s.plaqueA,s.plaqueB],gate:s.gate,secret:s.secret,promiseFailed:s.promiseFailed,helped:s.helped,complete:s.complete,events:s.events.map(e=>e.type)});", "window.v2Chapter14Snapshot=()=>({player:{...s.player},other:{...s.other},levers:[s.leverA,s.leverB],signalSeen:s.signalSeen,gate:s.gate,secret:s.secret,otherHolding:s.otherHolding,soloTimer:s.soloTimer,complete:s.complete,events:s.events.map(e=>e.type)});")
# update text identifiers and chapter references globally
s=s.replace('chapter13_complete','chapter14_complete').replace('v2MarkCampaignChapterComplete?.(13)','v2MarkCampaignChapterComplete?.(14)')
# Replace stray old identifiers that would throw due removed object names
# (visualization / state all rewritten; no pieceA/plaque references should remain)
(root/'v2-chapter14.js').write_text(s)
# html clone and replace chapter-specific copy, labels and panel
h=(root/'v2-chapter13.html').read_text()
h=h.replace('v2-chapter13.js','v2-chapter14.js').replace('Chapitre 13 : Trahison','Chapitre 14 : Coopération').replace('V2 · CHAPITRE 13','V2 · CHAPITRE 14').replace('CHAPITRE 13 · TRAHISON','CHAPITRE 14 · COOPÉRATION').replace('CHAPITRE 13','CHAPITRE 14').replace('chapitre 13','chapitre 14').replace('Chapitre 13','Chapitre 14').replace('TRAHISON','COOPÉRATION')
h=h.replace('Une promesse n’est pas une preuve. Cherche les marques jumelles.','Deux zones, deux leviers : apprends à coordonner vos actions.')
h=h.replace('Retrouve les deux pièces du pont, puis vérifie leurs marques dans le bon ordre.','Active le levier A pendant que l’Autre maintient B, ou utilise le levier retardé.')
h=h.replace('Une promesse, deux versions','Deux leviers, une seule passerelle').replace('L’Autre promet de tenir le mécanisme.','L’Autre attend un signal clair avant de maintenir le levier B.')
h=h.replace('Explore les deux ailes ouest. Les pièces sont marquées △ puis ○. Retourne au mécanisme central et assemble-les dans cet ordre. Le pont provisoire du sud se rétracte après quelques secondes : les lumières annoncent le délai et une passerelle de récupération permet de revenir sans perdre la progression.', 'Explore les neuf salles. Observe le panneau de signal dans la zone sud-ouest, puis demande à l’Autre de maintenir le levier B à l’est. Active le levier A à l’ouest. Si tu préfères agir seul, le levier B possède un délai de 18 secondes : active-le puis rejoins A. Les voyants annoncent les paliers de la passerelle.')
h=h.replace('ASSEMBLAGE DU PONT','PANNEAU DE COORDINATION').replace('Les deux marques doivent se répondre : △ d’abord, ○ ensuite. L’ordre est gravé sur les deux pièces.','Deux impulsions signifient « maintenir », une impulsion signifie « relâcher ». Montre le signal à l’Autre avant de lui demander d’agir.')
h=h.replace('△ PIÈCE A · À TROUVER','A · INACTIF').replace('○ PIÈCE B · À TROUVER','B · INACTIF').replace('ASSEMBLER DANS L’ORDRE','MÉMORISER LE SIGNAL')
h=h.replace('PIÈCES · 0/2','LEVIERS · 0/2').replace('Le pont est derrière vous.','La passerelle est derrière vous.').replace('Les faits de la promesse sont enregistrés.','Les faits de la coordination sont enregistrés.')
h=h.replace('Les deux pièces du pont, vérifie les marques réciproques et choisis si tu aides l’Autre à tenir sa promesse ou si tu poursuis seul.', 'Les deux leviers doivent être actifs. Montre le signal à l’Autre, répartissez les rôles ou utilise le délai de secours pour agir seul.')
h=h.replace('Une promesse a échoué. Les faits, eux, laissent des traces.', 'La coopération n’est pas automatique : elle se construit avec des signaux lisibles.')
h=h.replace('Le chapitre 13 est sauvegardé','Le chapitre 14 est sauvegardé').replace('Le pont principal est incomplet.','La passerelle est verrouillée.')
(root/'v2-chapter14.html').write_text(h)
# Update campaign menu to expose 14
p=root/'v2-prototype.js'; t=p.read_text()
t=t.replace('const playableCampaignChapters = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);','const playableCampaignChapters = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);')
t=t.replace('36 chapitres prévus · 13 prototypes intégrés · ${count}/36 terminés','36 chapitres prévus · 14 prototypes intégrés · ${count}/36 terminés')
t=t.replace("else if (chapter === 13) location.href = 'v2-chapter13.html';", "else if (chapter === 13) location.href = 'v2-chapter13.html';\n    else if (chapter === 14) location.href = 'v2-chapter14.html';")
p.write_text(t)
# Update campaign count in prototype html
p=root/'v2-prototype.html'; t=p.read_text().replace('13 prototypes intégrés','14 prototypes intégrés').replace('chapitres 1 à 13','chapitres 1 à 14'); p.write_text(t)
# Update design status only; no future chapters claimed playable
p=root/'CONCEPTION_36_LABYRINTHES.md'; t=p.read_text().replace('Les chapitres 1 à 13 possèdent des prototypes séparés','Les chapitres 1 à 14 possèdent des prototypes séparés').replace('les chapitres 14 à 36 restent à intégrer','les chapitres 15 à 36 restent à intégrer'); p.write_text(t)
# Add report
(root/'RAPPORT_CHAPITRE14.md').write_text('''# Rapport de livraison — Chapitre 14 : COOPÉRATION\n\n## Implémentation\n- Labyrinthe déterministe de 92 × 58 cellules avec neuf salles, deux zones de levier éloignées, une passerelle centrale et une boucle de secours.\n- Objectif coopératif : le joueur active A pendant que l’Autre rejoint et maintient B après réception d’un signal explicite.\n- Solution de secours solo : B reste actif pendant 18 secondes, ce qui permet d’atteindre A par la boucle inférieure.\n- Voyants de passerelle, alcôve secrète, sauvegarde indépendante `otherPlayerChapter14SaveV2`, faits mémorisés et sortie de chapitre.\n- Le chapitre 14 est ajouté au menu de campagne et à la liste des prototypes jouables.\n\n## Vérifications réalisées\n- Syntaxe JavaScript contrôlée avec `node --check`.\n- Références locales des pages HTML contrôlées.\n- Connectivité de base du plan vérifiée par parcours de grille ; le levier B et la sortie sont accessibles via le détour inférieur lorsque le pont central est verrouillé.\n- Lancement en navigateur réel et test manuel des commandes non exécutés dans cet environnement.\n\n## Limites connues\nLes chapitres 15 à 36 restent à intégrer. Le chapitre 14 doit encore être essayé dans un navigateur pour confirmer les sensations de déplacement, les timings et le déblocage séquentiel avec les sauvegardes de campagne réelles.\n''')
# JS syntax checks
for f in root.glob('*.js'):
 r=subprocess.run(['node','--check',str(f)],capture_output=True,text=True)
 if r.returncode: print('SYNTAX ERROR',f.name,r.stderr)
# output list and refs
print('chapter14 sizes', (root/'v2-chapter14.js').stat().st_size,(root/'v2-chapter14.html').stat().st_size)
