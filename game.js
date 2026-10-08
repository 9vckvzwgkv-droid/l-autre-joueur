const canvas=document.getElementById('canvas'),ctx=canvas.getContext('2d'),thought=document.getElementById('thought'),screens=[...document.querySelectorAll('.screen')];const backgroundCanvas=document.createElement('canvas');let backgroundCacheKey='';
const $=id=>document.getElementById(id);
const chapters=[
['follow','Il suit tes traces.'],['habit','Tu as une direction préférée.'],['hesitate','Je regarde combien de temps tu hésites.'],['wait','Je peux attendre.'],['mirror','Tu changes. Je change.'],['abandon','Ne me laisse pas derrière.'],['choice','Choisis. Je regarderai ton choix.'],['punish','Je n’oublie pas quand tu me bloques.'],['observe','Maintenant, c’est moi qui t’observe.'],['lie','Je vais te dire où aller.'],['memory','Tu as déjà fait ça.'],['trust','Fais-moi confiance une fois.'],['betray','Je vais t’aider.'],['cooperate','On peut le faire ensemble.'],['predict','Je sais déjà où tu vas.'],['refuse','Non. Cette fois, je choisis.'],['echo','Tu fais encore ça.'],['protect','Cette fois, c’est moi qui te protège.'],['question','Pourquoi reviens-tu toujours ?'],['silence','Je n’ai plus besoin de parler.'],['identity','Si je te ressemble, qui est l’autre ?'],['fracture','Quelque chose a changé.'],['choice2','Il y a deux sorties. Une seule est honnête.'],['final','Tu veux vraiment savoir qui joue avec qui ?'],['distort','Le monde a remarqué ton choix.'],['doors','Une porte est apparue.'],['ghost','Je vois quelque chose que tu ne vois pas.'],['return','Tu n’es plus au même endroit.'],['collapse','Tout ce que tu as fait laisse une marque.'],['threshold','Cette fois, le monde choisit avec nous.']];
chapters.push(
['secret','Tu n’étais pas censé voir ça.'],
['double','Il y a quelque chose derrière toi.'],
['truth','Je peux te montrer ce que j’ai appris.'],
['absence','Je ne suis pas là. Pourtant tu continues.'],
['origin','Tu pensais être arrivé au début.'],
['choiceFinal','Une dernière décision ne peut pas être reprise.']
);
const maps=[
[[.35,.18,.30,.055],[.35,.76,.30,.055]],[[.18,.30,.64,.055],[.18,.65,.64,.055]],[[.42,.10,.055,.36],[.53,.54,.055,.36],[.20,.48,.32,.055]],[[.12,.20,.60,.055],[.28,.42,.60,.055],[.12,.64,.60,.055]],[[.22,.12,.055,.52],[.48,.36,.055,.52],[.72,.12,.055,.52]],[[.18,.18,.64,.055],[.18,.76,.64,.055],[.18,.18,.055,.635],[.765,.18,.055,.635]],[[.18,.18,.055,.64],[.38,.18,.055,.42],[.58,.38,.055,.42],[.78,.18,.055,.64]],[[.12,.30,.35,.055],[.53,.30,.35,.055],[.12,.65,.35,.055],[.53,.65,.35,.055],[.48,.30,.055,.35]],[[.20,.12,.055,.35],[.20,.53,.055,.35],[.45,.30,.35,.055],[.45,.65,.35,.055],[.78,.12,.055,.24],[.78,.65,.055,.23]],[[.15,.15,.70,.055],[.15,.80,.70,.055],[.15,.15,.055,.70],[.795,.15,.055,.70],[.30,.30,.40,.055],[.30,.65,.40,.055]],[[.12,.25,.25,.055],[.63,.25,.25,.055],[.12,.70,.25,.055],[.63,.70,.25,.055],[.47,.25,.055,.50]],[[.18,.18,.64,.055],[.18,.76,.64,.055],[.18,.18,.055,.64],[.765,.18,.055,.64]],[[.28,.15,.055,.70],[.67,.15,.055,.70],[.28,.15,.39,.055],[.28,.80,.39,.055]],[[.12,.30,.28,.055],[.60,.30,.28,.055],[.12,.65,.28,.055],[.60,.65,.28,.055]],[[.15,.15,.70,.055],[.15,.80,.70,.055],[.15,.15,.055,.70],[.795,.15,.055,.70],[.34,.34,.055,.32],[.61,.34,.055,.32]],[[.12,.22,.28,.055],[.60,.22,.28,.055],[.12,.72,.28,.055],[.60,.72,.28,.055],[.45,.22,.055,.55]],[[.18,.18,.64,.055],[.18,.76,.64,.055],[.18,.18,.055,.64],[.765,.18,.055,.64],[.35,.35,.30,.055],[.35,.60,.30,.055]],[[.12,.25,.30,.055],[.58,.25,.30,.055],[.12,.70,.30,.055],[.58,.70,.30,.055],[.46,.25,.055,.50]],[[.20,.20,.60,.055],[.20,.74,.60,.055],[.20,.20,.055,.575],[.745,.20,.055,.575]],[[.18,.18,.64,.055],[.18,.76,.64,.055],[.18,.18,.055,.64],[.765,.18,.055,.64],[.43,.43,.14,.14]],[[.12,.30,.32,.055],[.56,.30,.32,.055],[.12,.65,.32,.055],[.56,.65,.32,.055],[.47,.30,.055,.35]],[[.16,.16,.055,.68],[.78,.16,.055,.68],[.16,.16,.62,.055],[.16,.78,.62,.055]],[[.10,.20,.34,.055],[.56,.20,.34,.055],[.10,.72,.34,.055],[.56,.72,.34,.055],[.47,.20,.055,.52]],[[.18,.18,.64,.055],[.18,.76,.64,.055],[.18,.18,.055,.64],[.765,.18,.055,.64],[.35,.35,.30,.055],[.35,.60,.30,.055]]];
maps.push(
[[.12,.22,.76,.055],[.12,.72,.76,.055],[.12,.22,.055,.555],[.825,.22,.055,.555],[.43,.22,.055,.555]],
[[.18,.18,.26,.055],[.56,.18,.26,.055],[.18,.76,.64,.055],[.18,.18,.055,.635],[.765,.18,.055,.635]],
[[.10,.30,.30,.055],[.60,.30,.30,.055],[.10,.65,.30,.055],[.60,.65,.30,.055],[.47,.30,.055,.35]],
[[.16,.16,.68,.055],[.16,.78,.68,.055],[.16,.16,.055,.675],[.785,.16,.055,.675]],
[[.12,.25,.28,.055],[.60,.25,.28,.055],[.12,.70,.28,.055],[.60,.70,.28,.055],[.46,.25,.055,.50],[.30,.47,.40,.055]],
[[.18,.18,.64,.055],[.18,.76,.64,.055],[.18,.18,.055,.64],[.765,.18,.055,.64],[.35,.35,.30,.055],[.35,.60,.30,.055],[.47,.35,.055,.30]]
);
maps.push(
[[.10,.18,.32,.055],[.58,.18,.32,.055],[.10,.76,.80,.055],[.10,.18,.055,.64],[.865,.18,.055,.64],[.47,.18,.055,.58]],
[[.12,.12,.76,.055],[.12,.82,.76,.055],[.12,.12,.055,.755],[.865,.12,.055,.755],[.32,.38,.36,.055],[.32,.57,.36,.055]],
[[.18,.18,.64,.055],[.18,.76,.64,.055],[.18,.18,.055,.64],[.765,.18,.055,.64],[.42,.30,.16,.40]],
[[.10,.25,.34,.055],[.56,.25,.34,.055],[.10,.70,.34,.055],[.56,.70,.34,.055],[.47,.25,.055,.50]],
[[.16,.16,.68,.055],[.16,.78,.68,.055],[.16,.16,.055,.675],[.785,.16,.055,.675],[.35,.35,.30,.055],[.35,.60,.30,.055]],
[[.12,.22,.76,.055],[.12,.72,.76,.055],[.12,.22,.055,.555],[.825,.22,.055,.555],[.45,.22,.055,.50]]
);
const starts=[[.18,.50],[.12,.18],[.12,.82],[.10,.88],[.10,.10],[.30,.30],[.28,.10],[.10,.48],[.10,.50],[.22,.22],[.10,.48],[.22,.22],[.18,.50],[.10,.48],[.25,.50],[.10,.47],[.22,.22],[.12,.50],[.10,.50],[.50,.10],[.12,.12],[.10,.50],[.12,.48],[.22,.22]];
starts.push(...[[0.1, 0.5], [0.1, 0.1], [0.12, 0.82], [0.5, 0.1], [0.1, 0.5], [0.22, 0.22]]);
starts.push(...[[.10,.50],[.12,.12],[.22,.22],[.10,.50],[.22,.22],[.10,.50]]);
const others=[[.82,.50],[.88,.82],[.82,.82],[.90,.88],[.90,.90],[.70,.70],[.72,.90],[.90,.48],[.90,.50],[.78,.78],[.90,.48],[.78,.78],[.82,.50],[.90,.48],[.75,.50],[.90,.47],[.78,.78],[.88,.50],[.90,.50],[.50,.88],[.88,.88],[.90,.50],[.88,.48],[.78,.78]];
others.push(...[[0.9, 0.5], [0.88, 0.88], [0.82, 0.82], [0.5, 0.88], [0.9, 0.5], [0.78, 0.78]]);
others.push(...[[.90,.50],[.88,.88],[.78,.78],[.90,.50],[.78,.78],[.90,.50]]);
const exits=[[.90,.10],[.88,.18],[.88,.12],[.90,.10],[.90,.10],[.50,.90],[.50,.50],[.50,.50],[.50,.50],[.50,.50],[.50,.90],[.50,.50],[.50,.50],[.50,.50],[.50,.50],[.50,.10],[.50,.50],[.50,.50],[.90,.10],[.90,.10],[.90,.90],[.90,.10],[.90,.90],[.50,.50]];
exits.push(...[[0.9, 0.1], [0.9, 0.9], [0.9, 0.1], [0.9, 0.9], [0.9, 0.5], [0.5, 0.5]]);
exits.push(...[[.90,.10],[.90,.90],[.90,.10],[.90,.90],[.90,.10],[.90,.90]]);
// Phase 1 — positions de départ/arrivée validées contre les collisions.
starts[7]=[.09,.47]; others[7]=[.89,.47]; exits[7]=[.45,.49];
// Phase 22 — positions de sécurité : aucun spawn/objectif ne doit intersecter un mur.
starts[9]=[.23,.23]; others[9]=[.77,.77];
starts[11]=[.26,.26]; others[11]=[.74,.73];
starts[16]=[.26,.26]; others[16]=[.74,.73];
starts[23]=[.26,.26]; others[23]=[.74,.73];
starts[24]=[.26,.30]; others[24]=[.74,.69]; exits[7]=[.45,.50];
starts[29]=[.26,.26]; others[29]=[.74,.73]; exits[29]=[.55,.50];
starts[30]=[.07,.50]; others[30]=[.95,.50];
starts[31]=[.12,.09]; others[31]=[.88,.90];
starts[32]=[.26,.26]; others[32]=[.74,.73];
starts[34]=[.24,.24]; others[34]=[.76,.75];
starts[35]=[.24,.19]; others[35]=[.76,.80];
exits[17]=[.54,.50];
exits[30]=[.55,.50];
// Phase 22 — connectivité : les points critiques restent dans la même zone navigable.
exits[5]=[.50,.72];
exits[7]=[.44,.50];
others[9]=[.76,.76];
others[11]=[.74,.72];
exits[12]=[.24,.50];
others[16]=[.74,.72];
others[23]=[.74,.72];
exits[24]=[.40,.30]; others[24]=[.40,.68];
others[29]=[.74,.72];
exits[30]=[.54,.84];
exits[32]=[.74,.26]; others[32]=[.74,.72];
exits[34]=[.76,.24]; others[34]=[.76,.74];



starts[17]=[.11,.49]; others[17]=[.87,.49]; exits[17]=[.55,.49];









const levelDesign=[
['TRACE','Traverse la salle et laisse l’Autre apprendre ton trajet.','La sortie s’ouvre quand vous vous êtes rejoints.'],
['HABITUDE','Choisis naturellement une direction. Observe ce qu’il en déduit.','La sortie reste libre.'],
['HÉSITATION','Arrête-toi volontairement. Regarde s’il vient à toi.','La sortie s’ouvre après ton premier arrêt significatif.'],
['ATTENTE','Ne cours pas. Laisse-lui le temps de comprendre l’attente.','Reste immobile assez longtemps pour déclencher sa réponse.'],
['MIROIR','Traverse sans suivre un chemin évident. Il cherchera ton reflet.','La sortie s’ouvre lorsque vos trajectoires se croisent.'],
['DISTANCE','Évite de le perdre. Il mesure maintenant ce que signifie être laissé derrière.','Rejoins-le après avoir créé une vraie distance.'],
['CHOIX','Deux chemins. Un choix que l’Autre enregistrera.','Choisis un côté puis rejoins l’Autre.'],
['BLOCAGE','Tu peux lui barrer la route. Il peut désormais s’en souvenir.','Traverse le passage sans rester bloqué avec lui.'],
['OBSERVATION','Cette fois, ne cherche pas à le suivre. Fais-lui comprendre que tu l’observes aussi.','Approche-toi de lui après l’avoir laissé agir.'],
['MENSONGE','Suis l’indication de l’Autre, même si tu ne lui fais pas confiance.','Découvre le mensonge avant de sortir.'],
['SOUVENIR','Un ancien choix réapparaît dans le décor.','Atteins la trace de ta première décision.'],
['CONFIANCE','Reste près de lui et accepte son rythme.','Traverse ensemble.'],
['TRAHISON','Il promet de t’aider. Décide si tu le suis encore.','Retrouve-le après sa rupture de confiance.'],
['COOPÉRATION','Ni trop loin, ni trop près. Faites le chemin ensemble.','Maintenez votre proximité jusqu’à la sortie.'],
['PRÉDICTION','Il croit savoir où tu iras. Prouve-lui qu’il ne te connaît pas totalement.','Déjoue sa prédiction puis rejoins la sortie.'],
['REFUS','Pour la première fois, il dit non. Ne force pas le passage.','Laisse-le prendre sa décision.'],
['ÉCHO','Un geste ancien revient. Tu peux le répéter ou le briser.','Déclenche l’écho de ton comportement.'],
['PROTECTION','Il se place devant toi. Accepte ou refuse sa protection.','Reste avec lui jusqu’à ce qu’il te protège.'],
['RETOUR','La question n’est plus pourquoi tu avances, mais pourquoi tu reviens.','Retrouve l’Autre avant de quitter le niveau.'],
['SILENCE','Aucun dialogue ne viendra t’aider.','Avance sans chercher de réponse.'],
['IDENTITÉ','Regarde l’Autre comme un reflet possible de toi.','Fais face à lui.'],
['FRACTURE','Le monde commence à se fissurer autour de votre relation.','Traverse la fracture sans vous séparer.'],
['DEUX SORTIES','Deux issues. Une seule correspond à ce que vous êtes devenus.','L’Autre choisira en fonction de votre relation.'],
['SEUIL','Dernière question avant que le monde change.','Retrouve l’Autre et découvre la réponse.'],
['DISTORSION','Le monde réagit maintenant à votre histoire.','Approche l’anomalie centrale.'],
['PORTES','Une porte garde une trace de tes anciennes décisions.','Choisis une porte et accepte sa conséquence.'],
['FANTÔME','Quelque chose existe hors de ton regard.','Retrouve la présence que l’Autre perçoit.'],
['RETOUR IMPOSSIBLE','Cet endroit devrait être familier. Il ne l’est plus.','Retrouve les coordonnées perdues.'],
['EFFONDREMENT','Toutes tes anciennes décisions pèsent sur le niveau.','Atteins l’Autre avant que le monde se referme.'],
['LE MONDE CHOISIT','Vous ne contrôlez plus entièrement la destination.','Atteins le seuil ensemble.'],
['SECRET','Tu vois enfin ce qui se trouve derrière les niveaux.','Découvre la trace cachée.'],
['DOUBLE','Une présence répond à chacun de tes mouvements.','Retrouve l’Autre sans te perdre dans le reflet.'],
['VÉRITÉ','Il peut enfin te montrer ce qu’il a appris.','Reste avec lui jusqu’à l’ouverture de la mémoire.'],
['ABSENCE','L’Autre disparaît. Continue malgré son absence.','Atteins la sortie sans lui.'],
['ORIGINE','Le début n’est peut-être pas le premier niveau.','Atteins le centre et regarde ce qui existait avant.'],
['DERNIER CHOIX','Une dernière décision ne pourra pas être reprise.','Laisse-le choisir… ou garde le contrôle.']
];
const gatedLevels=new Set([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35]);
const objectiveDefinitions=[
 {id:'TRACE',text:'Rejoins l’Autre après avoir parcouru la salle.'},{id:'HABITUDE',text:'Fais un choix de direction clair.'},{id:'HESITATION',text:'Arrête-toi assez longtemps pour être remarqué.'},{id:'ATTENTE',text:'Reste immobile jusqu’à provoquer sa réponse.'},{id:'MIROIR',text:'Fais se croiser vos trajectoires.'},{id:'DISTANCE',text:'Crée une vraie distance puis retrouve-le.'},{id:'CHOIX',text:'Choisis un côté et rejoins l’Autre.'},{id:'BLOCAGE',text:'Déclenche puis dépasse le blocage.'},{id:'OBSERVATION',text:'Laisse-le agir puis approche-toi.'},{id:'MENSONGE',text:'Découvre le mensonge avant la sortie.'},{id:'SOUVENIR',text:'Atteins la trace de ton ancien choix.'},{id:'CONFIANCE',text:'Reste proche jusqu’à sa réponse.'},{id:'TRAHISON',text:'Retrouve-le après la rupture.'},{id:'COOPERATION',text:'Maintiens votre proximité.'},{id:'PREDICTION',text:'Déjoue sa prédiction.'},{id:'REFUS',text:'Laisse-le prendre sa décision.'},{id:'ECHO',text:'Déclenche l’écho.'},{id:'PROTECTION',text:'Reste avec lui jusqu’à sa protection.'},{id:'RETOUR',text:'Retrouve l’Autre avant de partir.'},{id:'SILENCE',text:'Avance sans chercher de réponse.'},{id:'IDENTITE',text:'Fais face à lui.'},{id:'FRACTURE',text:'Traverse la fracture ensemble.'},{id:'DEUX_SORTIES',text:'Laisse l’Autre révéler son choix.'},{id:'SEUIL',text:'Retrouve l’Autre au seuil.'},{id:'DISTORSION',text:'Approche l’anomalie.'},{id:'PORTES',text:'Choisis une porte.'},{id:'FANTOME',text:'Retrouve la présence.'},{id:'RETOUR_IMPOSSIBLE',text:'Retrouve l’endroit perdu.'},{id:'EFFONDREMENT',text:'Atteins l’Autre avant la fermeture.'},{id:'MONDE',text:'Atteins le seuil ensemble.'},{id:'SECRET',text:'Découvre la trace cachée.'},{id:'DOUBLE',text:'Retrouve l’Autre dans le reflet.'},{id:'VERITE',text:'Reste jusqu’à l’ouverture de la mémoire.'},{id:'ABSENCE',text:'Atteins la sortie malgré son absence.'},{id:'ORIGINE',text:'Atteins le centre.'},{id:'DERNIER_CHOIX',text:'Laisse-le choisir ou garde le contrôle.'}
];
function objectiveSatisfied(){
 if(!gatedLevels.has(n)) return true;
 switch(n){
  case 0:return state.pathDistance>=.22&&state.minOtherDistance<.16;
  case 1:return state.phase>0;
  case 2:return state.still>=.35;
  case 3:return state.phase>0;
  case 4:return state.minOtherDistance<.16;
  case 5:return state.maxDistance>=.30&&state.minOtherDistance<.16;
  case 6:return state.phase>0&&state.minOtherDistance<.16;
  case 7:return state.phase>0;
  case 8:return state.nearTime>=.55;
  case 11:return state.nearTime>=1.2;
  case 13:return state.nearTime>=1.2;
  case 17:return state.phase>0;
  case 19:return state.phase>0;
  case 9:case 10:case 12:case 14:case 15:case 16:case 18:case 20:case 21:case 22:case 23:case 24:case 25:case 26:case 27:case 28:case 29:case 30:case 31:case 32:case 33:case 34:case 35:return state.phase>0;
  default:return true;
 }
}
function objectiveLabel(){return objectiveDefinitions[n]?.text||levelDesign[n][1];}

const defaultMemory={played:0,chapter:0,left:0,right:0,up:0,down:0,waits:0,rush:0,hesitate:0,abandons:0,cooperate:0,blocks:0,helped:0,refused:0,returns:0,choices:[],trust:0,fear:0,curiosity:0,mercy:0,pattern:0,lastEnding:'',flags:{},worldVisits:0,anomalies:0,worldMood:0,doorChoices:[],echoes:0,secrets:0,truths:0,absences:0,storyFlags:[],chaptersSeen:[],lastChoice:'',nextChapter:null,secretChapters:[],discoveredClues:[],rareEvents:0,replays:0,uniqueEndings:[],loopBreaks:0,campaignRuns:0,completedObjectives:[],aiMode:'FOLLOW',aiModeTime:0,aiDecisions:0,memoryEvents:[],chapterMemory:{},behaviorMemory:{follow:0,wait:0,observe:0,intercept:0,return:0,explore:0},lastEncounter:{chapter:-1,distance:1,abandoned:false,returned:false},relationshipHistory:[],personality:{trust:50,curiosity:50,attachment:50,fear:50,independence:50,suspicion:50,obedience:50},relationship:{trust:50,attachment:50,respect:50,fear:50,curiosity:50,independence:50},habits:{separation:0,reunion:0,waiting:0,proximity:0,repetition:0,unpredictability:0},narrativeMemory:{events:0,variants:0,lastChapter:-1,lastContext:'NEUTRAL',seen:[]},metaMemory:{discovered:[],clues:[],visits:0,echoes:0,lastDiscovery:''},endingMemory:{history:[],signatures:[],lastProfile:'',discoveries:0}};
const SAVE_KEY='otherPlayerMemoryV15',BACKUP_KEY='otherPlayerMemoryV15_backup',SAVE_VERSION=15;
let mem=loadMemory(),n=Math.min(mem.chapter||0,35),p,o,input={x:0,y:0},trail=[],running=false,paused=false,last=0,S=500,state={},velocity={x:0,y:0};
function cloneDefault(){return JSON.parse(JSON.stringify(defaultMemory))}
function checksum(value){let h=2166136261;for(let i=0;i<value.length;i++){h^=value.charCodeAt(i);h=Math.imul(h,16777619)}return (h>>>0).toString(16).padStart(8,'0')}
function normalizeMemory(raw){const x={...defaultMemory,...(raw&&typeof raw==='object'?raw:{})};x.flags={...defaultMemory.flags,...(x.flags||{})};x.personality={...defaultMemory.personality,...(x.personality||{})};x.relationship={...defaultMemory.relationship,...(x.relationship||{})};x.habits={...defaultMemory.habits,...(x.habits||{})};Object.keys(defaultMemory.habits).forEach(k=>x.habits[k]=Math.max(0,Math.min(1,Number(x.habits[k])||0)));x.secretChapters=Array.isArray(x.secretChapters)?x.secretChapters.slice(-36):[];x.discoveredClues=Array.isArray(x.discoveredClues)?x.discoveredClues.slice(-24):[];x.uniqueEndings=Array.isArray(x.uniqueEndings)?x.uniqueEndings.slice(-40):[];x.completedObjectives=Array.isArray(x.completedObjectives)?x.completedObjectives.slice(-36):[];x.memoryEvents=Array.isArray(x.memoryEvents)?x.memoryEvents.slice(-80):[];x.relationshipHistory=Array.isArray(x.relationshipHistory)?x.relationshipHistory.slice(-30):[];x.choices=Array.isArray(x.choices)?x.choices.slice(-20):[];x.doorChoices=Array.isArray(x.doorChoices)?x.doorChoices.slice(-40):[];x.storyFlags=Array.isArray(x.storyFlags)?x.storyFlags.slice(-80):[];x.chapterMemory=(x.chapterMemory&&typeof x.chapterMemory==='object')?x.chapterMemory:{};x.behaviorMemory={...defaultMemory.behaviorMemory,...(x.behaviorMemory||{})};x.lastEncounter={...defaultMemory.lastEncounter,...(x.lastEncounter||{})};x.narrativeMemory={...defaultMemory.narrativeMemory,...(x.narrativeMemory||{})};x.narrativeMemory.seen=Array.isArray(x.narrativeMemory.seen)?x.narrativeMemory.seen:[];x.metaMemory={...defaultMemory.metaMemory,...(x.metaMemory||{})};x.endingMemory={...defaultMemory.endingMemory,...(x.endingMemory||{})};x.endingMemory.history=Array.isArray(x.endingMemory.history)?x.endingMemory.history:[];x.endingMemory.signatures=Array.isArray(x.endingMemory.signatures)?x.endingMemory.signatures:[];x.metaMemory.discovered=Array.isArray(x.metaMemory.discovered)?x.metaMemory.discovered:[];x.metaMemory.clues=Array.isArray(x.metaMemory.clues)?x.metaMemory.clues:[];x.saveVersion=SAVE_VERSION;return x}
function decodeSave(raw){try{const parsed=JSON.parse(raw);if(parsed&&parsed.version===SAVE_VERSION&&typeof parsed.payload==='string'&&parsed.checksum===checksum(parsed.payload))return normalizeMemory(JSON.parse(parsed.payload));if(parsed&&typeof parsed==='object'&&!('payload' in parsed))return normalizeMemory(parsed);return null}catch{return null}}
function readSave(key){try{const raw=localStorage.getItem(key);return raw?decodeSave(raw):null}catch{return null}}
function loadMemory(){const current=readSave(SAVE_KEY),backup=readSave(BACKUP_KEY);if(current)return current;if(backup)return backup;const legacyKeys=['otherPlayerMemoryV14','otherPlayerMemoryV12','otherPlayerMemoryV11','otherPlayerMemoryV10','otherPlayerMemoryV8','otherPlayerMemoryV7','otherPlayerMemoryV6','otherPlayerMemoryV5'];for(const key of legacyKeys){try{const raw=localStorage.getItem(key);if(!raw)continue;const parsed=JSON.parse(raw);return normalizeMemory(parsed)}catch{}}return cloneDefault()}
function save(){const normalized=normalizeMemory(mem),payload=JSON.stringify(normalized),envelope=JSON.stringify({version:SAVE_VERSION,savedAt:Date.now(),payload,checksum:checksum(payload)});try{const previous=localStorage.getItem(SAVE_KEY);if(previous)localStorage.setItem(BACKUP_KEY,previous);localStorage.setItem(SAVE_KEY,envelope);mem=normalized;return true}catch(err){try{localStorage.setItem(BACKUP_KEY,envelope);mem=normalized;return true}catch{return false}}}
const AudioEngine=(()=>{
 let ac=null,master=null,ambient=null,drone=null,heartbeatGain=null,enabled=true,lastStep=0,lastTone='',lastContext='',lastWorldPulse=0,lastAmbientUpdate=0,lastContextUpdate=0;
 const clamp=v=>Math.max(0,Math.min(1,v));
 function init(){
   if(ac){if(ac.state==='suspended')ac.resume();return}
   try{
     ac=new (window.AudioContext||window.webkitAudioContext)();
     master=ac.createGain();master.gain.value=.075;master.connect(ac.destination);
     ambient=ac.createGain();ambient.gain.value=.018;ambient.connect(master);
     heartbeatGain=ac.createGain();heartbeatGain.gain.value=0;heartbeatGain.connect(master);
     const osc=ac.createOscillator(), lfo=ac.createOscillator(), lg=ac.createGain();
     osc.type='sine';osc.frequency.value=55;lfo.frequency.value=.055;lg.gain.value=5;
     lfo.connect(lg);lg.connect(osc.frequency);osc.connect(ambient);osc.start();lfo.start();
     drone=osc; updateAmbient();
   }catch{ac=null}
 }
 function tone(freq,dur=.12,type='sine',gain=.045,when=0,target=master){
   if(!ac||!enabled||!target)return;
   const t=ac.currentTime+when,o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.setValueAtTime(freq,t);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(gain,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g);g.connect(target);o.start(t);o.stop(t+dur+.02);
 }
 function step(){
   const now=performance.now(); if(now-lastStep<((coarsePointer||safariBrowser)?480:190))return; lastStep=now;
   const speed=Math.hypot(input?.x||0,input?.y||0), f=clamp(speed);
   tone(86+f*24,.055,'triangle',.014+f*.008); tone(132+f*30,.045,'sine',.009,.025);
 }
 function event(kind){
   if(!ac||!enabled)return;
   const sets={start:[220,277,330],signal:[330,440,660],alert:[185,147,110],success:[330,415,554,660],secret:[247,311,466],pause:[196,164],world:[82,123,185],near:[174,261],reunion:[294,370,494],separation:[118,89]};
   (sets[kind]||sets.signal).forEach((f,i)=>tone(f,.15,i%2?'triangle':'sine',kind==='world'?.026:.032,i*.055));
 }
 function updateAmbient(force=false){
   if(!ac||!enabled)return;
   const now=performance.now();
   if(!force&&now-lastAmbientUpdate<120)return;
   lastAmbientUpdate=now;
   const r=typeof relation==='function'?relation():50;
   const wt=typeof worldTone==='function'?worldTone():'STABLE';
   const ctx=typeof narrativeContext==='function'?narrativeContext():'NEUTRAL';
   const intensity=clamp(Number(state?.worldIntensity)||0);
   const base=wt==='FROID'?42:wt==='INSTABLE'?64:wt==='ÉTRANGE'?51:r>78?58:r<30?47:55;
   const key=wt+'|'+ctx+'|'+Math.round(r/10)+'|'+Math.round(intensity*10);
   if(key===lastTone)return;
   lastTone=key;
   if(drone)drone.frequency.setTargetAtTime(base,ac.currentTime,.45);
   if(ambient)ambient.gain.setTargetAtTime(.012+intensity*.018,ac.currentTime,.5);
 }
 function contextTick(){
   if(!ac||!enabled)return;
   const now=performance.now();
   if(now-lastContextUpdate<90)return;
   lastContextUpdate=now;
   const ctx=typeof narrativeContext==='function'?narrativeContext():'NEUTRAL';
   if(ctx!==lastContext){
     if(ctx==='CLOSE')event('near');
     else if(ctx==='PLAYER_FLEEING'||ctx==='ISOLATED')event('separation');
     else if(ctx==='PLAYER_APPROACHING'||ctx==='PLAYER_WAITING')event('reunion');
     lastContext=ctx;
   }
   const intensity=clamp(Number(state?.worldIntensity)||0);
   if(heartbeatGain){
     const nearFactor=ctx==='CLOSE'?1:ctx==='PLAYER_APPROACHING'?.55:0;
     heartbeatGain.gain.setTargetAtTime(enabled?nearFactor*.018:0,ac.currentTime,.18);
     if(nearFactor&&now-lastWorldPulse>900){lastWorldPulse=now;tone(72+nearFactor*8,.09,'sine',.018,0,heartbeatGain)}
   }
   if(intensity>.72&&now-lastWorldPulse>1800){lastWorldPulse=now;event('world')}
 }
 function move(){if(enabled)step()}
 function toggle(){enabled=!enabled;if(master&&ac)master.gain.setTargetAtTime(enabled?.075:.0001,ac.currentTime,.12);if(enabled){init();event('signal')}return enabled}
 return {init,event,move,updateAmbient,contextTick,toggle,isEnabled:()=>enabled};
})();
function learnHabit(name,amount=.035){mem.habits=mem.habits||{...defaultMemory.habits};mem.habits[name]=Math.max(0,Math.min(1,(Number(mem.habits[name])||0)+amount));}
function rememberEvent(type,data={}){const event={type,chapter:n,time:Date.now(),...data};mem.memoryEvents.push(event);if(type==='abandon')learnHabit('separation');if(type==='return')learnHabit('reunion');if(type==='wait')learnHabit('waiting');if(type==='close')learnHabit('proximity');if(mem.memoryEvents.length>80)mem.memoryEvents.splice(0,mem.memoryEvents.length-80)}
function rememberChapter(){const key=String(n),r=relationshipProfile();mem.chapterMemory[key]={visits:(mem.chapterMemory[key]?.visits||0)+1,abandoned:!!state.abandoned,returned:!!state.returned,maxDistance:Math.round((state.maxDistance||0)*1000)/1000,nearTime:Math.round((state.nearTime||0)*10)/10,objective:!!state.objectiveComplete,mode:mem.aiMode||'FOLLOW',relation:Math.round(relation()),timestamp:Date.now()};if(!mem.chaptersSeen.includes(n))mem.chaptersSeen.push(n);mem.relationshipHistory.push({chapter:n,trust:Math.round(r.trust),attachment:Math.round(r.attachment),respect:Math.round(r.respect),fear:Math.round(r.fear),independence:Math.round(r.independence)});if(mem.relationshipHistory.length>30)mem.relationshipHistory.shift()}
function memoryProfile(){const b=mem.behaviorMemory||defaultMemory.behaviorMemory,h=mem.habits||defaultMemory.habits,recent=mem.memoryEvents.slice(-16),chapterHistory=mem.chapterMemory||{};const last=recent.length?recent[recent.length-1]:null;const sameChapter=chapterHistory[String(n)]||{};return {abandonments:mem.abandons,returns:mem.returns,recentAbandon:recent.filter(e=>e.type==='abandon').length,recentReturn:recent.filter(e=>e.type==='return').length,recentWait:recent.filter(e=>e.type==='wait').length,recentClose:recent.filter(e=>e.type==='close').length,lastEvent:last?.type||'',lastEventChapter:last?.chapter??-1,chapterVisits:sameChapter.visits||0,chapterAbandoned:!!sameChapter.abandoned,chapterReturned:!!sameChapter.returned,preferredFollow:b.follow||0,preferredWait:b.wait||0,preferredObserve:b.observe||0,preferredIntercept:b.intercept||0,preferredReturn:b.return||0,preferredExplore:b.explore||0,repeatedChapters:Object.values(chapterHistory).filter(v=>(v.visits||0)>1).length,habitSeparation:h.separation||0,habitReunion:h.reunion||0,habitWaiting:h.waiting||0,habitProximity:h.proximity||0,habitRepetition:h.repetition||0,habitUnpredictability:h.unpredictability||0}}

function show(id){screens.forEach(s=>{const active=s.id===id;s.classList.toggle('active',active);s.setAttribute('aria-hidden',String(!active))});const target=$(id);if(target){target.focus({preventScroll:true});}}
function relationshipProfile(){const r=mem.relationship||defaultMemory.relationship;return {trust:Math.max(0,Math.min(100,r.trust)),attachment:Math.max(0,Math.min(100,r.attachment)),respect:Math.max(0,Math.min(100,r.respect)),fear:Math.max(0,Math.min(100,r.fear)),curiosity:Math.max(0,Math.min(100,r.curiosity)),independence:Math.max(0,Math.min(100,r.independence))}}
function relationshipScore(){const r=relationshipProfile();return Math.max(0,Math.min(100,Math.round(r.trust*.34+r.attachment*.22+r.respect*.18+r.curiosity*.10+(100-r.fear)*.10+(100-r.independence)*.06)))}
function relation(){return relationshipScore()}
function relationLabel(v){return v<22?'MÉFIANCE':v<42?'DISTANCE':v<62?'LIEN':v<82?'CONFIANCE':'COMPLICITÉ'}
function updateRelation(){const v=relation();$('relationValue').textContent=v;$('relationName').textContent=relationLabel(v);document.body.dataset.relationship=relationLabel(v)}
function say(txt,alert=false){thought.textContent=txt;thought.classList.toggle('thought-alert',alert);state.messageTimer=3.2;AudioEngine.init();AudioEngine.event(alert?'alert':'signal')}
function updateObjectiveHUD(){const panel=$('objectivePanel');if(!panel)return;const label=objectiveLabel(),done=!!state.objectiveComplete||objectiveSatisfied(),key=label+'|'+done;if(state.objectiveHudKey===key)return;state.objectiveHudKey=key;$('objectiveText').textContent=label;$('objectiveState').textContent=done?'OBJECTIF ATTEINT':'EN COURS';panel.classList.toggle('complete',done)}
function endingRecap(){const lines=[];const h=mem.habits||defaultMemory.habits;const r=relation();if((mem.returns||0)>=(mem.abandons||0)+2)lines.push('Tu es revenu plusieurs fois. L’Autre a appris qu’il pouvait t’attendre.');else if((mem.abandons||0)>=(mem.returns||0)+2)lines.push('Tu as souvent pris de la distance. L’Autre a appris à avancer seul.');else if(r>=65)lines.push('Tu as souvent choisi la proximité. Votre lien s’est construit autour de la confiance.');else if(r<=35)lines.push('Tu as gardé tes distances. L’Autre a appris à rester sur ses gardes.');else lines.push('Tu as alterné rapprochements et départs. L’Autre a appris à observer avant de te suivre.');if((h.waiting||0)>.12)lines.push('Tes moments d’attente ont aussi marqué sa mémoire.');if((h.unpredictability||0)>.18)lines.push('Tes changements de direction l’ont obligé à douter de ses prédictions.');if(mem.lastChoice==='LE_LAISSE_CHOISIR')lines.push('À la fin, tu lui as laissé le dernier choix.');else if(mem.lastChoice==='GARDE_LE_CONTROLE')lines.push('À la fin, tu as gardé le contrôle de votre décision.');if(mem.secrets>0)lines.push('Tu as découvert '+mem.secrets+' trace'+(mem.secrets>1?'s':'')+' cachée'+(mem.secrets>1?'s':'')+' que le monde gardera.');return lines.slice(0,3).join(' ')}
function chapterTransition(){const el=$('chapterTransition');if(!el)return;const act=Math.floor(n/6);$('transitionTitle').textContent='CHAPITRE '+String(n+1).padStart(2,'0');$('transitionSubtitle').textContent=levelDesign[n]?.[0]||story.acts[act][0];el.classList.add('active');el.setAttribute('aria-hidden','false');clearTimeout(state.transitionTimer);state.transitionTimer=setTimeout(()=>{el.classList.remove('active');el.setAttribute('aria-hidden','true')},850)}
const story={
  acts:[
    ['I — LA RENCONTRE','Vous pensiez être deux joueurs dans le même niveau. Lui ne sait même pas encore ce qu’est un joueur.'],
    ['II — APPRENDRE','Il cesse de reproduire tes gestes. Il commence à comprendre pourquoi tu les fais.'],
    ['III — LE LIEN','La relation devient une donnée qu’aucun niveau ne peut effacer.'],
    ['IV — LE MIROIR','Une question apparaît : apprend-il de toi, ou te révèle-t-il à toi-même ?'],
    ['V — LE MONDE','Le lieu n’est plus neutre. Chaque partie y laisse une trace.'],
    ['VI — LE CHOIX','À la fin, il ne restera qu’une chose que personne ne pourra décider à la place de l’autre.']
  ],
  chapters:[
    ['Tu es seul. Pour l’instant.','Il ne connaît pas ton but. Il connaît seulement tes traces.','Il commence à remarquer tes hésitations.','Quand tu t’arrêtes, il apprend à attendre.','Tu changes de direction. Il te cherche.','Tu l’as laissé derrière. Il s’en souvient.'],
    ['Ce choix n’était pas prévu.','Tu peux le bloquer. Il peut s’en souvenir.','Il ne te suit plus seulement. Il t’observe.','Il t’a menti. Tu ne sais pas encore pourquoi.','Tu pensais avoir terminé. Lui, non.','La mémoire commence là où le niveau devrait finir.'],
    ['La confiance n’est plus à sens unique.','Il t’aide parce qu’il l’a choisi.','Il anticipe avant même que tu bouges.','Pour la première fois, il refuse.','Il répète un geste que tu croyais oublié.','Il commence à te protéger.'],
    ['Pourquoi reviens-tu, après chaque sortie ?','Le silence ne suffit plus.','Tu lui ressembles. Ou est-ce l’inverse ?','Si tu es le joueur, qu’est-ce que je suis ?','Quelque chose se fissure.','Deux sorties. Une vérité ?'],
    ['Il y a un endroit qu’il veut éviter.','Le monde a vu ce que vous êtes devenus.','Les portes ne menaient pas au même endroit pour vous deux.','Quelque chose te regarde depuis l’autre côté.','Tu reconnais cet endroit. Lui aussi.','Le monde ne recommence plus tout à fait.'],
    ['Tu n’étais pas censé trouver cette trace.','Il y a quelque chose derrière le niveau.','Il peut enfin te montrer ce qu’il a appris.','Même absent, il continue d’exister.','Tu pensais atteindre le début. Tu atteins un souvenir.','Cette décision ne peut pas être reprise.']
  ]
};
// Phase 25 — secrets & meta-secrets: règles persistantes et bornées.
const SECRET_RULES=[
 {id:'TRACE',chapter:24,clue:'UNE TRACE ANCIENNE',text:'Cette salle garde le chemin que tu avais oublié.',test:m=>m.replays>=1&&m.chaptersSeen.filter(c=>c===24).length>0},
 {id:'TÉMOIN',chapter:25,clue:'UN TÉMOIN',text:'Quelque chose a vu vos trajectoires se répéter.',test:m=>(m.returns>=2&&m.abandons>=1&&m.habits?.proximity>.25)},
 {id:'SILENCE',chapter:27,clue:'LE SILENCE',text:'Tu as attendu assez longtemps pour que l’absence devienne une réponse.',test:m=>m.waits>=4&&m.hesitate>=2},
 {id:'DOUBLE',chapter:31,clue:'LE DOUBLE',text:'Il y a une présence derrière tes anciennes décisions.',test:m=>m.echoes>=2&&m.truths>=1&&m.secrets>=1},
 {id:'CHOIX',chapter:30,clue:'LE CHOIX',text:'Deux décisions contraires peuvent pourtant appartenir à la même histoire.',test:m=>Array.isArray(m.choices)&&new Set(m.choices.map(String)).size>=3&&m.refused>=1},
 {id:'MONDE',chapter:32,clue:'LE MONDE',text:'Le lieu ne recommence plus avec toi. Il se souvient avant ton arrivée.',test:m=>m.anomalies>=2&&m.worldMood>=1&&m.replays>=2}
];
const META_RULES=[
 {id:'meta-loop',clue:'BOUCLE',text:'Tes anciennes parties ne sont plus séparées.',test:m=>m.replays>=2&&m.returns>=3},
 {id:'meta-witness',clue:'TÉMOIN',text:'Quelqu’un a continué à observer quand tu étais absent.',test:m=>m.abandons>=2&&m.returns>=2&&m.habits?.proximity>.35},
 {id:'meta-silence',clue:'SILENCE',text:'Le silence a produit sa propre réponse.',test:m=>m.waits>=6&&m.hesitate>=3&&m.absences>=1},
 {id:'meta-double',clue:'DOUBLE',text:'Une mémoire existe ici qui ne semble appartenir à aucune de tes parties.',test:m=>m.echoes>=3&&m.truths>=2&&m.secrets>=2},
 {id:'meta-choice',clue:'CHOIX',text:'Tes décisions contradictoires ont laissé une route que l’Autre peut reconnaître.',test:m=>Array.isArray(m.choices)&&new Set(m.choices.map(String)).size>=5&&m.refused>=2},
 {id:'meta-world',clue:'MONDE',text:'Le monde a appris à relier tes passages.',test:m=>m.anomalies>=3&&m.worldMood>=3&&m.replays>=2}
];
function markSecret(rule){
 if(!mem.secretChapters.includes(rule.chapter))mem.secretChapters.push(rule.chapter);
 const clue=rule.id+':'+rule.chapter;
 if(!mem.discoveredClues.includes(clue)){mem.discoveredClues.push(clue);mem.secrets=(mem.secrets||0)+1;mem.rareEvents=(mem.rareEvents||0)+1;rememberEvent('secret',{id:rule.id});}
 return true;
}
function checkSecrets(){
 let found=false;
 for(const rule of SECRET_RULES){if(rule.test(mem)){if(!mem.secretChapters.includes(rule.chapter)||!mem.discoveredClues.includes(rule.id+':'+rule.chapter)){markSecret(rule);found=true;}}}
 if(mem.secretChapters.length>40)mem.secretChapters=mem.secretChapters.slice(-40);
 if(mem.discoveredClues.length>80)mem.discoveredClues=mem.discoveredClues.slice(-80);
 return found;
}
function secretForChapter(){
 const rule=SECRET_RULES.find(r=>r.chapter===n&&r.test(mem));
 if(!rule)return null;
 const key=rule.id+':'+rule.chapter;
 if(!mem.discoveredClues.includes(key))markSecret(rule);
 return rule;
}
function checkMetaSecrets(){
 mem.metaMemory=mem.metaMemory||{discovered:[],clues:[],visits:0,echoes:0,lastDiscovery:''};
 let found=null;
 for(const rule of META_RULES){
  if(rule.test(mem)&&!mem.metaMemory.discovered.includes(rule.id)){
   mem.metaMemory.discovered.push(rule.id);mem.metaMemory.clues.push(rule.clue);mem.metaMemory.echoes++;mem.metaMemory.lastDiscovery=rule.id;found=rule;
  }
 }
 if(mem.metaMemory.discovered.length>24)mem.metaMemory.discovered=mem.metaMemory.discovered.slice(-24);
 if(mem.metaMemory.clues.length>24)mem.metaMemory.clues=mem.metaMemory.clues.slice(-24);
 return mem.metaMemory;
}
function metaSecretForChapter(){
 const mm=mem.metaMemory||defaultMemory.metaMemory;
 const map={30:'meta-choice',31:'meta-double',32:'meta-world',27:'meta-silence',28:'meta-loop',25:'meta-witness'};
 const id=map[n];
 if(!id||!mm.discovered.includes(id))return null;
 return META_RULES.find(r=>r.id===id)||null;
}
function narrativeStart(){checkSecrets();const mm=checkMetaSecrets();const q=secretForChapter(),mq=metaSecretForChapter();if(mq){mm.visits++;signal('TRACE — '+mq.clue);setTimeout(()=>say(mq.text,true),500);save();return;}if(q){signal('MÉMOIRE — '+q.clue);setTimeout(()=>say(q.text,true),500);return;}
  const act=Math.floor(n/6);
  if(!mem.flags)mem.flags={};
  if(!mem.flags.storyStarted)mem.flags.storyStarted=true;
  if(!mem.flags['act'+act]){mem.flags['act'+act]=true;mem.storyFlags.push('ACT_'+(act+1));}
  if([0,6,12,18,24,30].includes(n)) signal(story.acts[act][0]);
}
function narrativeContext(){
 const r=relation(),mp=memoryProfile(),d=near(p||{x:0,y:0},o||{x:0,y:0});
 let context='NEUTRAL';
 if(d<.10)context='CLOSE';
 else if(state?.still>.8)context='PLAYER_WAITING';
 else if(state?.abandoned&&d>.30)context='ISOLATED';
 else if(mp.habitUnpredictability>.35)context='UNPREDICTABLE';
 else if(mp.habitSeparation>.35)context='CAUTIOUS';
 return {context,r,mp};
}
function narrativeRemember(id){
 const key=String(n)+':'+id;
 if(!mem.narrativeMemory.seen.includes(key)){mem.narrativeMemory.seen.push(key);if(mem.narrativeMemory.seen.length>80)mem.narrativeMemory.seen.shift();mem.narrativeMemory.events++;mem.narrativeMemory.variants++;}
}
function chapterMessage(){
 const r=relation(), act=Math.floor(n/6), base=story.chapters[act][n%6], q=mem.personality||defaultMemory.personality, ctx=narrativeContext();
 const firstVisit=!mem.chaptersSeen.includes(n), repeat=ctx.mp.chapterVisits>0;
 if(n===5&&mem.abandons>1)return'Je me souviens de la distance.';
 if(n===10&&mem.choices.length)return'Je me souviens du premier choix.';
 if(n===16&&mem.rush>5)return'Tu vas encore trop vite. Je sais pourquoi.';
 if(n===17&&mem.returns>1)return'Tu es revenu. Je savais que tu reviendrais.';
 if(n===20)return r>65?'Tu me ressembles plus que tu ne crois.':'Je ne sais plus lequel de nous deux apprend.';
 if(n===21)return mem.abandons>2?'Tu m’as appris à partir.':'Je ne veux pas que ça s’arrête.';
 if(n===23&&mem.secrets>0)return'Tu as déjà vu ce qu’il y a derrière.';
 if(n===27&&mem.returns>1)return'Nous sommes déjà venus ici. Mais pas dans cette partie.';
 if(n===31&&mem.secrets>0)return'Tu n’étais vraiment pas censé trouver cette trace.';
 if(n===34&&mem.trust>=60)return'Pour une fois, je vais te laisser choisir sans te suivre.';
 const mq=metaSecretForChapter();if(mq){narrativeRemember('meta-'+mq.id);return mq.text;}
 if(repeat&&q.suspicion>70){narrativeRemember('suspicious');return'Je reconnais cet endroit. Je ne suis pas certain de te reconnaître.';}
 if(repeat&&q.attachment>72){narrativeRemember('attached');return'Tu es revenu. Cette fois, je t’attendais.';}
 if(firstVisit&&q.curiosity>72){narrativeRemember('curious');return'Je ne connais pas encore cet endroit. Mais je veux voir ce que tu vas faire.';}
 if(ctx.context==='PLAYER_WAITING'&&q.attachment>60){narrativeRemember('waiting');return'Tu attends encore. Alors je vais rester.';}
 if(ctx.context==='ISOLATED'&&q.fear>65){narrativeRemember('isolated');return'Je ne te vois plus. Je n’aime pas ça.';}
 if(ctx.context==='UNPREDICTABLE'&&q.suspicion>60){narrativeRemember('unpredictable');return'Je ne sais plus où tu vas aller. Je vais regarder.';}
 if(ctx.context==='CAUTIOUS'&&r<45){narrativeRemember('cautious');return'Je me souviens de la distance. Je vais attendre.';}
 if(mem.campaignRuns>1&&repeat){narrativeRemember('replay');return'Nous sommes déjà passés par ici. Quelque chose est différent.';}
 return base;
}
function narrativeEventCue(type){
 if(!running||state.narrativeCueCooldown>0)return;
 const q=mem.personality||defaultMemory.personality,r=relation();
 let text='';
 if(type==='abandon'){text=r<45?'Tu es parti. Je vais m’en souvenir.':'Tu es parti… puis tu es revenu avant.';}
 if(type==='return'){text=q.attachment>65?'Tu es revenu.':'Tu es revenu. Je regardais encore.';}
 if(type==='wait'){text=q.curiosity>65?'Tu attends pour voir ce que je vais faire.':'Tu attends. Je le remarque.';}
 if(type==='abrupt'&&q.suspicion>55){text='Tu as changé de direction. Pourquoi ?';}
 if(!text)return;
 state.narrativeCueCooldown=2.6;state.narrativeCueCount=(state.narrativeCueCount||0)+1;narrativeRemember(type);say(text,q.suspicion>75||type==='abandon');
}
function worldProfile(){
 const r=relation(),h=mem.habits||defaultMemory.habits;
 const replay=mem.campaignRuns>1&&mem.chaptersSeen.includes(n);
 let state='STABLE',intensity=0;
 if(mem.abandons>=4||r<24){state='FRACTURED';intensity=Math.min(1,.35+mem.abandons*.08+(24-r)/80)}
 else if(replay||mem.anomalies>=3||mem.secrets>=2){state='WATCHFUL';intensity=Math.min(1,.25+mem.anomalies*.08+mem.secrets*.04)}
 else if((h.unpredictability||0)>.48||mem.hesitate>8){state='ATTENTIVE';intensity=.28+(h.unpredictability||0)*.35}
 else if(r>=78&&mem.abandons<2){state='CALM';intensity=.20+(r-78)/110}
 else if(r<45||mem.fear>6){state='UNEASY';intensity=.22+(45-r)/100}
 else if(mem.returns>=3||mem.campaignRuns>=2){state='AWARE';intensity=.22+Math.min(.3,mem.returns*.03)}
 return {state,intensity:Math.max(0,Math.min(1,intensity)),relation:r,replay:replay};
}
function worldTone(){const w=worldProfile();if(w.state==='FRACTURED')return 'FRACTURÉ';if(w.state==='WATCHFUL')return 'VIGILANT';if(w.state==='ATTENTIVE')return 'ATTENTIF';if(w.state==='UNEASY')return 'INSTABLE';if(w.state==='CALM')return 'CALME';if(w.state==='AWARE')return 'CONSCIENT';return 'STABLE'}
function worldMessage(){const tone=worldTone();$('worldStatus').textContent='MONDE : '+tone;document.body.dataset.world=tone;return tone}
function worldTarget(){const r=relation();if(r>=75)return {x:.50,y:.50};if(mem.abandons>3)return {x:.88,y:.12};return mem.right>=mem.left?{x:.78,y:.22}:{x:.22,y:.78}}
function reactWorld(dt){
 if((state.metaCheckCooldown||0)<=0){const before=(mem.metaMemory?.discovered||[]).length;checkMetaSecrets();const after=(mem.metaMemory?.discovered||[]).length;if(after>before&&!state.metaCueSeen){state.metaCueSeen=after;signal('UNE TRACE VIENT DE S’OUVRIR');save()}state.metaCheckCooldown=1.2;}else state.metaCheckCooldown=Math.max(0,state.metaCheckCooldown-dt);
 mem.worldVisits+=dt*.02;
 const w=worldProfile();
 state.worldState=w.state;state.worldIntensity=w.intensity;
 if(!state.worldCueState)state.worldCueState=w.state;
 if(state.worldCueState!==w.state&&state.worldCueCooldown<=0){
   state.worldCueState=w.state;state.worldCueCooldown=6;
   const cues={CALM:'LE MONDE S’APAISЕ',AWARE:'LE MONDE SE SOUVIENT',ATTENTIVE:'QUELQUE CHOSE OBSERVE',UNEASY:'LE MONDE HÉSITE',WATCHFUL:'LE MONDE VOUS REGARDE',FRACTURED:'LE MONDE S’EST FISSURÉ'};
   signal(cues[w.state]||'LE MONDE A CHANGÉ');
 }
 state.worldCueCooldown=Math.max(0,(state.worldCueCooldown||0)-dt);
 if(Math.abs((state.lastWorldIntensity||0)-w.intensity)>.18){state.lastWorldIntensity=w.intensity;worldMessage()}
  if(n>=24 && state.phase===0){
    if(n===24){if(near(p,o)<.15){mem.anomalies+=dt*.12;mem.worldMood+=dt*.04;if(state.anomalyTimer===undefined){state.anomalyTimer=1.8;signal('LE MONDE A RÉAGI')}}}
    if(n===25 && state.phase===0 && distExit(p,exits[n])<.25){mem.doorChoices.push(p.x<.5?'G':'D');state.phase=1;mem.anomalies++;signal(p.x<.5?'PORTE GAUCHE : TRACE ENREGISTRÉE':'PORTE DROITE : TRACE ENREGISTRÉE');say(p.x<.5?'Tu as choisi la porte que je craignais.':'Tu as choisi la porte que j’espérais.')}
    if(n===26 && state.phase===0 && near(p,o)<.13){state.phase=1;mem.echoes++;signal('PRÉSENCE DÉTECTÉE');say('Tu ne le vois pas. Moi, oui.',true)}
    if(n===27 && state.phase===0 && (p.x>.72||p.y>.72)){state.phase=1;mem.returns++;signal('COORDONNÉES MODIFIÉES');say('Nous sommes déjà passés par ici.')}
    if(n===28 && state.phase===0 && mem.anomalies>1){state.phase=1;mem.worldMood+=2;signal('STRUCTURE INSTABLE');say('Chaque décision a laissé une marque.',true)}
    if(n===29 && state.phase===0 && near(p,o)<.14){state.phase=1;mem.flags.threshold=true;signal('SEUIL ATTEINT');say('Cette fois, nous choisissons ensemble.',true)}
  }
}
function signal(txt){AudioEngine.init();AudioEngine.event(txt.includes('SECRET')||txt.includes('ACCÈS')||txt.includes('MÉMOIRE')?'secret':txt.includes('NON')||txt.includes('FROID')?'alert':'signal');const el=$('signal');el.textContent=txt;el.classList.add('signal-on');clearTimeout(state.signalTimer);state.signalTimer=setTimeout(()=>el.classList.remove('signal-on'),1900)}
function replayModifier(){return (mem.campaignRuns||0)>1&&Array.isArray(mem.chaptersSeen)&&mem.chaptersSeen.includes(n)}
function reset(){AudioEngine.init();AudioEngine.event('start');AudioEngine.updateAmbient(true);checkSecrets();if(replayModifier())mem.replays++;paused=false;$('pauseOverlay').classList.remove('active');$('pauseOverlay').setAttribute('aria-hidden','true');const L=maps[n];p={x:starts[n][0],y:starts[n][1]};o={x:others[n][0],y:others[n][1]};navigation={goal:-1,goalTarget:null,path:[],index:0,repathIn:0,avoidId:-1,avoidTarget:null,stalledFor:0,lastPosition:null};trail=[];input={x:0,y:0};velocity={x:0,y:0};worldMessage();state={target:null,t:0,phase:0,animationTime:0,animationMotion:0,narrativeCueCooldown:0,narrativeCueCount:0,worldState:'STABLE',worldIntensity:0,worldCueState:null,worldCueCooldown:0,lastWorldIntensity:-1,metaCheckCooldown:0,metaCueCooldown:0,metaCueSeen:0,narrativeDirectionCue:null,lastPlayer:{x:p.x,y:p.y},messageTimer:0,still:0,levelStart:performance.now(),nearTime:0,exitTouches:0,met:false,minOtherDistance:near(p,o),maxDistance:near(p,o),pathDistance:0,previousDirection:null,blockedTime:0,farLatched:false,nearLatched:false,abandoned:false,returned:false,objectiveComplete:false,trailTimer:0,ambientTimer:0,renderFrame:0,visualFrame:0};running=true;$('level').textContent='CHAPITRE '+String(n+1).padStart(2,'0')+' · '+levelDesign[n][0];updateRelation(); state.worldProfile=worldProfile(); updateChapterHint(); updateObjectiveHUD(); chapterTransition(); narrativeStart(); say(chapterMessage()); resize();last=performance.now();requestAnimationFrame(loop)}

// PHASE 21 — ACCESSIBILITÉ + PERFORMANCE MOBILE
// PHASE 20 — PERFORMANCE ADAPTATIVE
// La simulation (IA, mémoire, relation, objectifs) reste à pleine précision.
// Seuls les effets visuels et le coût du rendu peuvent être réduits si le navigateur ralentit.
const coarsePointer=!!window.matchMedia?.('(pointer: coarse)').matches;
const safariBrowser=/Safari\//.test(navigator.userAgent)&&!/Chrome|Chromium|CriOS|Edg|OPR|FxiOS/.test(navigator.userAgent);
const reducedMotionQuery=window.matchMedia?.('(prefers-reduced-motion: reduce)');
let motionReduced=!!reducedMotionQuery?.matches;
reducedMotionQuery?.addEventListener?.('change',e=>{motionReduced=!!e.matches;document.body.dataset.reducedMotion=motionReduced?'true':'false';resize();});
document.body.dataset.reducedMotion=motionReduced?'true':'false';

const performanceState={
 tier:(coarsePointer||safariBrowser)?0:3,
 avgFrame:16.7,
 sampleFrames:0,
 sampleTime:0,
 badFrames:0,
 goodFrames:0,
 renderSkip:0,
 renderEvery:1,
 effectEvery:1,
 trailMax:180,
 dprCap:(coarsePointer||safariBrowser)?1:1.25,
 hidden:false,
 lastTier:3
};
function performanceTier(){
 const avg=performanceState.avgFrame;
 if(avg>30)return 0;
 if(avg>23)return 1;
 if(avg>18.5)return 2;
 return 3;
}
function applyPerformanceTier(tier){
 const p=performanceState;
 if(tier===3){p.renderEvery=1;p.effectEvery=1;p.trailMax=150;p.dprCap=1.25}
 else if(tier===2){p.renderEvery=1;p.effectEvery=1;p.trailMax=120;p.dprCap=1.15}
 else if(tier===1){p.renderEvery=1;p.effectEvery=2;p.trailMax=90;p.dprCap=1}
 else {p.renderEvery=1;p.effectEvery=3;p.trailMax=60;p.dprCap=1}
}
function updatePerformance(rawDt){
 const p=performanceState;
 if(document.hidden){p.hidden=true;return;}
 p.hidden=false;
 if(!Number.isFinite(rawDt)||rawDt<=0||rawDt>1)return;
 const ms=rawDt*1000;
 p.avgFrame=p.avgFrame*.94+ms*.06;
 p.sampleFrames++;
 // Hysteresis : il faut plusieurs mesures mauvaises avant de baisser,
 // et davantage de bonnes avant de remonter.
 if(ms>26||p.avgFrame>24){p.badFrames++;p.goodFrames=0}
 else if(ms<18&&p.avgFrame<19){p.goodFrames++;p.badFrames=0}
 else {p.badFrames=Math.max(0,p.badFrames-1);p.goodFrames=Math.max(0,p.goodFrames-1)}
 let target=p.tier;
 if(p.badFrames>=12)target=Math.max(0,p.tier-1);
 else if(p.goodFrames>=90)target=Math.min(safariBrowser?1:3,p.tier+1);
 if(target!==p.tier){
   p.lastTier=p.tier;p.tier=target;applyPerformanceTier(target);
   resize();
 }
}
applyPerformanceTier(performanceState.tier);
function visualQuality(){
 return motionReduced?0:performanceState.tier;
}

let resizeFrame=0,lastCanvasW=0,lastCanvasH=0,lastDpr=0;function resize(){cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(()=>{const r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,performanceState.dprCap),w=Math.max(1,Math.round(r.width*d)),h=Math.max(1,Math.round(r.height*d));if(w===lastCanvasW&&h===lastCanvasH&&d===lastDpr&&Math.abs(S-r.width)<.5)return;lastCanvasW=w;lastCanvasH=h;lastDpr=d;canvas.width=w;canvas.height=h;backgroundCacheKey='';S=r.width;ctx.setTransform(d,0,0,d,0,0)})}window.addEventListener('resize',resize,{passive:true});window.addEventListener('orientationchange',()=>setTimeout(resize,180),{passive:true});window.visualViewport?.addEventListener('resize',resize,{passive:true});window.visualViewport?.addEventListener('scroll',resize,{passive:true});
function blocked(x,y){const r=.022;if(x<r||x>1-r||y<r||y>1-r)return true;return maps[n].some(a=>x+r>a[0]&&x-r<a[0]+a[2]&&y+r>a[1]&&y-r<a[1]+a[3])}
function move(a,dx,dy,dt,s=.38){const mag=Math.hypot(dx,dy);if(mag>1){dx/=mag;dy/=mag}const targetX=dx*s*1.08,targetY=dy*s*1.08,dot=velocity.x*targetX+velocity.y*targetY,response=mag<.08?20:dot<0?26:18,blend=1-Math.exp(-response*Math.min(dt,.05));velocity.x+=(targetX-velocity.x)*blend;velocity.y+=(targetY-velocity.y)*blend;const vmax=s*1.08,vm=Math.hypot(velocity.x,velocity.y);if(vm>vmax){velocity.x=velocity.x/vm*vmax;velocity.y=velocity.y/vm*vmax}let nx=a.x+velocity.x*dt,ny=a.y+velocity.y*dt;if(!blocked(nx,a.y))a.x=nx;else velocity.x=0;if(!blocked(a.x,ny))a.y=ny;else velocity.y=0;a.x=Math.max(.035,Math.min(.965,a.x));a.y=Math.max(.035,Math.min(.965,a.y))}
const NAV_MIN=.035,NAV_STEP=.03,NAV_SIZE=32,NAV_COUNT=NAV_SIZE*NAV_SIZE;
let navigation={goal:-1,goalTarget:null,path:[],index:0,repathIn:0,avoidId:-1,avoidTarget:null,stalledFor:0,lastPosition:null};
function navId(x,y){const ix=Math.max(0,Math.min(NAV_SIZE-1,Math.round((x-NAV_MIN)/NAV_STEP))),iy=Math.max(0,Math.min(NAV_SIZE-1,Math.round((y-NAV_MIN)/NAV_STEP)));return iy*NAV_SIZE+ix}
function navPoint(id){return{x:NAV_MIN+(id%NAV_SIZE)*NAV_STEP,y:NAV_MIN+Math.floor(id/NAV_SIZE)*NAV_STEP}}
function navSnap(target){const base=navId(target.x,target.y),bp=navPoint(base);if(!blocked(bp.x,bp.y))return base;let best=base,bestD=Infinity;for(let r=1;r<=6;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;const x=base%NAV_SIZE+dx,y=Math.floor(base/NAV_SIZE)+dy;if(x<0||x>=NAV_SIZE||y<0||y>=NAV_SIZE)continue;const id=y*NAV_SIZE+x,p=navPoint(id);if(blocked(p.x,p.y))continue;const d=Math.hypot(p.x-target.x,p.y-target.y);if(d<bestD){best=id;bestD=d}}if(bestD<Infinity)return best;return base}
function navClear(a,b){const d=Math.hypot(b.x-a.x,b.y-a.y),steps=Math.max(1,Math.ceil(d/(NAV_STEP*.4)));for(let i=1;i<steps;i++){const t=i/steps;if(blocked(a.x+(b.x-a.x)*t,a.y+(b.y-a.y)*t))return false}return true}
function navPath(start,target,avoidId=-1){const goal=navSnap(target),startId=navSnap(start);if(startId===goal)return[];const prev=new Int16Array(NAV_COUNT);prev.fill(-2);const queue=new Int16Array(NAV_COUNT);let head=0,tail=0;queue[tail++]=startId;prev[startId]=-1;const dirs=[[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[1,-1],[-1,1],[1,1]];let found=false;while(head<tail){const id=queue[head++];if(id===goal){found=true;break}const x=id%NAV_SIZE,y=Math.floor(id/NAV_SIZE),p=navPoint(id);for(const [dx,dy] of dirs){const nx=x+dx,ny=y+dy;if(nx<0||nx>=NAV_SIZE||ny<0||ny>=NAV_SIZE)continue;const next=ny*NAV_SIZE+nx;if(next===avoidId||prev[next]!==-2)continue;const q=navPoint(next);if(blocked(q.x,q.y))continue;if(dx&&dy&&(blocked(p.x+dx*NAV_STEP,p.y)||blocked(p.x,p.y+dy*NAV_STEP)))continue;prev[next]=id;queue[tail++]=next}}if(!found)return[];const raw=[];for(let id=goal;id!==startId;id=prev[id])raw.push(navPoint(id));raw.reverse();const smooth=[];let anchor={x:start.x,y:start.y},i=0;while(i<raw.length){let j=raw.length-1;while(j>i&&!navClear(anchor,raw[j]))j--;smooth.push(raw[j]);anchor=raw[j];i=j+1}return smooth}
function go(target,dt,s=.35){if(!o||!target)return;let waypoint=target,goal=navSnap(target),goalPoint=navPoint(goal);if(navigation.lastPosition){if(near(o,navigation.lastPosition)>.008){navigation.stalledFor=0;navigation.lastPosition={x:o.x,y:o.y}}else navigation.stalledFor+=dt}else navigation.lastPosition={x:o.x,y:o.y};if(!blocked(target.x,target.y)&&navClear(o,target)){navigation.path=[];navigation.index=0;navigation.goal=goal;navigation.goalTarget={x:target.x,y:target.y};navigation.repathIn=0;navigation.avoidId=-1;navigation.avoidTarget=null;waypoint=target}else{navigation.repathIn-=dt;const movedGoal=!navigation.goalTarget||Math.hypot(target.x-navigation.goalTarget.x,target.y-navigation.goalTarget.y)>.075;if(movedGoal)navigation.repathIn=0;if(navigation.avoidTarget&&Math.hypot(target.x-navigation.avoidTarget.x,target.y-navigation.avoidTarget.y)>.22){navigation.avoidId=-1;navigation.avoidTarget=null}if(navigation.repathIn<=0||!navigation.path.length){navigation.path=navPath(o,target,navigation.avoidId);if(!navigation.path.length&&navigation.avoidId>=0){navigation.path=navPath(o,target);navigation.avoidId=-1;navigation.avoidTarget=null}navigation.goal=goal;navigation.goalTarget={x:target.x,y:target.y};navigation.index=0;navigation.repathIn=.18}while(navigation.index<navigation.path.length-1&&near(o,navigation.path[navigation.index])<.035)navigation.index++;if(navigation.path.length){let j=navigation.path.length-1;while(j>navigation.index&&!navClear(o,navigation.path[j]))j--;navigation.index=j;waypoint=navigation.path[j]}else if(Math.hypot(o.x-goalPoint.x,o.y-goalPoint.y)<.025)return;else waypoint=goalPoint}if(navigation.stalledFor>.75&&Math.hypot(o.x-goalPoint.x,o.y-goalPoint.y)>.08){const blockedWaypoint=navigation.path[navigation.index]||waypoint;navigation.avoidId=navId(blockedWaypoint.x,blockedWaypoint.y);navigation.avoidTarget={x:target.x,y:target.y};navigation.path=[];navigation.index=0;navigation.repathIn=0;navigation.stalledFor=0;navigation.lastPosition={x:o.x,y:o.y}}let dx=waypoint.x-o.x,dy=waypoint.y-o.y,d=Math.hypot(dx,dy);if(d<.006)return;const step=Math.min(d,Math.max(0,s)*dt),nx=o.x+dx/d*step,ny=o.y+dy/d*step;if(navClear(o,{x:nx,y:ny})){o.x=nx;o.y=ny}else{if(!blocked(nx,o.y))o.x=nx;if(!blocked(o.x,ny))o.y=ny}}
function near(a,b){return Math.hypot(a.x-b.x,a.y-b.y)}
function updateHabits(dx,dy){if(Math.abs(dx)+Math.abs(dy)>.0015){if(Math.abs(dx)>Math.abs(dy)){dx<0?mem.left++:mem.right++}else{dy<0?mem.up++:mem.down++}}}
function learnPersonality(dt){
 const q=mem.personality||defaultMemory.personality,amount=Math.min(dt,.08),moving=Math.hypot(input.x,input.y)>.18,d=near(p,o);
 if(moving)q.independence=Math.min(100,q.independence+amount*(mem.abandons>0?.7:.18));
 if(!moving)q.curiosity=Math.min(100,q.curiosity+amount*.16);
 if(d<.14)q.attachment=Math.min(100,q.attachment+amount*.55);
 if(d>.30)q.fear=Math.min(100,q.fear+amount*(mem.abandons>0?.20:.08));
 if(d>.36)q.independence=Math.min(100,q.independence+amount*.12);
 if(mem.blocks>1)q.suspicion=Math.min(100,q.suspicion+amount*.16);
 if(mem.cooperate>1)q.trust=Math.min(100,q.trust+amount*.28);
 if(mem.refused>0)q.obedience=Math.max(0,q.obedience-amount*.16);
 if(mem.returns>1)q.attachment=Math.min(100,q.attachment+amount*.18);
}

function updateRelationship(dt){
 const r=mem.relationship||defaultMemory.relationship;
 const d=near(p,o),moving=Math.hypot(input.x,input.y)>.18;
 const amount=Math.min(dt,.08);
 if(d<.16){r.attachment=Math.min(100,r.attachment+amount*.42);r.trust=Math.min(100,r.trust+amount*.18);r.respect=Math.min(100,r.respect+amount*.10)}
 if(d>.34){r.fear=Math.min(100,r.fear+amount*.16);r.independence=Math.min(100,r.independence+amount*.08)}
 if(state.still>.65){r.trust=Math.min(100,r.trust+amount*.16);r.curiosity=Math.min(100,r.curiosity+amount*.22)}
 if(moving&&d>.28){r.attachment=Math.max(0,r.attachment-amount*.05);r.respect=Math.min(100,r.respect+amount*.06)}
 if(mem.abandons>0)r.fear=Math.min(100,r.fear+amount*.03*mem.abandons);
 if(mem.returns>0)r.attachment=Math.min(100,r.attachment+amount*.035*mem.returns);
 if(mem.blocks>0)r.respect=Math.max(0,r.respect-amount*.025*mem.blocks);
 if(mem.cooperate>0)r.trust=Math.min(100,r.trust+amount*.025*mem.cooperate);
 r.curiosity=Math.max(0,Math.min(100,r.curiosity));
 r.independence=Math.max(0,Math.min(100,r.independence));
 // Keep legacy values in sync so existing chapters remain compatible.
 mem.trust=Math.max(mem.trust,(r.trust-50)/3.8);
 mem.fear=Math.max(mem.fear,(r.fear-50)/8);
}

function analyze(dt){learnPersonality(dt);updateRelationship(dt);let dx=p.x-state.lastPlayer.x,dy=p.y-state.lastPlayer.y,amount=Math.abs(input.x)+Math.abs(input.y);state.pathDistance+=Math.hypot(dx,dy);state.minOtherDistance=Math.min(state.minOtherDistance,near(p,o));state.maxDistance=Math.max(state.maxDistance,near(p,o));if(n===7&&near(p,o)<.20&&amount>.1)state.blockedTime+=dt;if(amount<.05&&!$('chapterTransition').classList.contains('active'))state.still+=dt;else state.still=0;if(n===1&&amount>.35){const dir=Math.abs(input.x)>Math.abs(input.y)?(input.x<0?'L':'R'):(input.y<0?'U':'D');if(state.previousDirection&&state.previousDirection!==dir)state.phase=1;state.previousDirection=dir;}if(state.still>.35){mem.hesitate+=dt;if(!state.waitMemoryLatched){state.waitMemoryLatched=true;rememberEvent('wait',{duration:.35});narrativeEventCue('wait')}}else state.waitMemoryLatched=false;if(n===3&&state.still>=.75)state.phase=1;if(n===6&&Math.abs(mem.right-mem.left)>=2)state.phase=1;if(n===7&&state.blockedTime>=.20)state.phase=1;if(amount>.95)mem.rush+=dt;const dNow=near(p,o);if(dNow<.16&&!state.nearLatched){state.nearLatched=true;rememberEvent('close',{distance:Math.round(dNow*1000)/1000})}if(dNow>.34&&!state.farLatched){state.farLatched=true;state.abandoned=true;mem.abandons++;rememberEvent('abandon',{distance:Math.round(dNow*1000)/1000});narrativeEventCue('abandon')}if(dNow<.16&&!state.returned&&state.farLatched){state.returned=true;mem.returns++;rememberEvent('return',{distance:Math.round(dNow*1000)/1000});narrativeEventCue('return')}if(dNow>.22)state.nearLatched=false;if(dNow<.27)state.farLatched=false;updateHabits(dx,dy);if(Math.abs(dx)+Math.abs(dy)>.0015){if(state.previousDirection){const dir=Math.abs(dx)>Math.abs(dy)?(dx<0?'L':'R'):(dy<0?'U':'D');if(dir!==state.previousDirection){learnHabit('unpredictability',.018);if(state.narrativeDirectionCue!==dir){state.narrativeDirectionCue=dir;narrativeEventCue('abrupt')}}else learnHabit('repetition',.008);state.previousDirection=dir}else state.previousDirection=Math.abs(dx)>Math.abs(dy)?(dx<0?'L':'R'):(dy<0?'U':'D')}state.lastPlayer={x:p.x,y:p.y};if(dNow<.16)state.nearTime+=dt;else state.nearTime=Math.max(0,state.nearTime-dt*.5)}

// PHASE 2 — Autonomous Other AI (Safari/mobile)
class OtherBrain {
 constructor(){this.mode='FOLLOW';this.modeTime=0;this.decisionTimer=0;this.target={x:.5,y:.5};this.lastDistance=.5;this.distanceTrend=0;this.still=0;this.playerSpeed=0;this.lastPlayer={x:0,y:0};this.confidence=.5;this.contextName='NEUTRAL';this.contextStreak=0;this.previousContext='NEUTRAL';this.abruptChange=0;this.lastInput={x:0,y:0};}
 clamp(v,a=0,b=1){return Math.max(a,Math.min(b,v))}
 observe(dt){
  const d=near(p,o),dx=p.x-this.lastPlayer.x,dy=p.y-this.lastPlayer.y,spd=Math.hypot(dx,dy)/Math.max(dt,.016);
  this.playerSpeed=this.playerSpeed*.82+this.clamp(spd/0.45)*.18;
  this.distanceTrend=this.distanceTrend*.86+(d-this.lastDistance)*.14;
  this.lastDistance=d;this.lastPlayer={x:p.x,y:p.y};
  const inputMagnitude=Math.hypot(input.x,input.y);
  if(inputMagnitude>.25&&Math.hypot(this.lastInput.x,this.lastInput.y)>.25){const dot=input.x*this.lastInput.x+input.y*this.lastInput.y;this.abruptChange=this.abruptChange*.88+(dot<-.35?1:0)*.12}else this.abruptChange=Math.max(0,this.abruptChange-dt*.35);
  if(inputMagnitude>.25)this.lastInput={x:input.x/inputMagnitude,y:input.y/inputMagnitude};
  this.still=input.x*input.x+input.y*input.y<.025?this.still+dt:0;
 }
 profile(){
  const personality=mem.personality||defaultMemory.personality,relationship=relationshipProfile();
  const trust=this.clamp((personality.trust*.45+relationship.trust*.55)/100),fear=this.clamp((personality.fear*.35+relationship.fear*.65)/100),curiosity=this.clamp((personality.curiosity*.55+relationship.curiosity*.45)/100),
   attachment=this.clamp((personality.attachment*.45+relationship.attachment*.55)/100),independence=this.clamp((personality.independence*.45+relationship.independence*.55)/100),
   suspicion=this.clamp((personality.suspicion*.7+(100-relationship.respect)*.3)/100),obedience=this.clamp(personality.obedience/100),
   unpredictability=this.clamp((mem.rush+mem.hesitate)/18),familiarity=this.clamp((mem.chaptersSeen.length+(mem.campaignRuns||0)*2)/42);
  return {trust,fear,curiosity,attachment,independence,suspicion,obedience,unpredictability,familiarity};
 }
 context(){
  const d=near(p,o);
  let ctx='NEUTRAL';
  if(this.abruptChange>.34)ctx='ABRUPT_CHANGE';
  else if(this.still>.8&&d<.34)ctx='PLAYER_WAITING';
  else if(this.playerSpeed>.68&&this.distanceTrend>.008&&d>.16)ctx='PLAYER_FLEEING';
  else if(this.playerSpeed>.42&&this.distanceTrend<-.008&&d>.10)ctx='PLAYER_PURSUING';
  else if(d>.34)ctx='ISOLATED';
  else if(d<.10)ctx='CLOSE';
  else if(this.playerSpeed>.48&&this.distanceTrend<-.01)ctx='PLAYER_APPROACHING';
  if(ctx===this.contextName)this.contextStreak+=.16;else{this.previousContext=this.contextName;this.contextName=ctx;this.contextStreak=0;}
  return {name:this.contextName,strength:this.clamp(.35+this.contextStreak*.12),previous:this.previousContext};
 }
 decisionProfile(){
  const q=this.profile(),mp=memoryProfile(),context=this.context(),ctx=context.name;
  const weights={FOLLOW:1,WAIT:1,OBSERVE:1,INTERCEPT:1,RETURN:1,EXPLORE:1};
  if(q.trust>.68)weights.FOLLOW+=.20;
  if(q.fear>.68||q.suspicion>.68)weights.OBSERVE+=.22;
  if(q.independence>.68)weights.EXPLORE+=.20;
  if(q.attachment>.68)weights.INTERCEPT+=.16;
  const intensity=context.strength;
  if(ctx==='PLAYER_FLEEING'){weights.OBSERVE+=.30*intensity;weights.INTERCEPT+=.24*intensity;weights.FOLLOW-=.08*intensity;}
  if(ctx==='PLAYER_PURSUING'){weights.OBSERVE+=.18*intensity;weights.RETURN+=.12*intensity;weights.FOLLOW+=.06*intensity;}
  if(ctx==='PLAYER_APPROACHING'){weights.FOLLOW+=.14*intensity;weights.INTERCEPT+=.12*intensity;}
  if(ctx==='PLAYER_WAITING'){weights.WAIT+=.30*intensity;weights.FOLLOW+=.10*intensity;}
  if(ctx==='ISOLATED'){weights.RETURN+=.28*intensity;weights.OBSERVE+=.16*intensity;}
  if(ctx==='CLOSE'){weights.FOLLOW+=.18*intensity;weights.OBSERVE+=.08*intensity;}
  if(ctx==='ABRUPT_CHANGE'){weights.OBSERVE+=.34*intensity;weights.INTERCEPT+=.12*intensity;weights.FOLLOW-=.10*intensity;}
  if(mp.lastEvent==='abandon')weights.OBSERVE+=.12;
  if(mp.lastEvent==='return')weights.FOLLOW+=.12;
  return {weights,context:ctx};
 }
 score(){
  const q=this.profile(),d=near(p,o),mp=memoryProfile(),decision=this.decisionProfile(),w=decision.weights,scores={FOLLOW:0,WAIT:0,OBSERVE:0,INTERCEPT:0,RETURN:0,EXPLORE:0};
  scores.FOLLOW=(2.2*q.trust+1.8*q.attachment+1.0*q.obedience+Math.max(0,1-d*3))*w.FOLLOW;
  scores.WAIT=(1.3*(1-q.independence)+1.4*(this.still>.5?1:0)+q.fear*.7+q.suspicion*.35)*w.WAIT;
  scores.OBSERVE=(1.4*q.curiosity+1.1*q.fear+q.suspicion*1.0+q.unpredictability*.8+(d>.24?1:0))*w.OBSERVE;
  scores.INTERCEPT=(1.1*q.attachment+1.4*q.curiosity+q.obedience*.35+Math.max(0,1-this.playerSpeed)*.6+(this.distanceTrend>0?.8:0))*w.INTERCEPT;
  scores.RETURN=(1.8*q.fear+1.3*q.attachment+q.suspicion*.45+Math.max(0,d-.22)*2)*w.RETURN;
  scores.EXPLORE=(1.5*q.independence+1.1*q.curiosity+q.familiarity*.45+(1-q.suspicion)*.35+(d<.12?.35:0))*w.EXPLORE;
  // PHASE 6 — memories create contextual biases instead of scripted reactions.
  // A recent abandonment makes the Other more cautious; repeated reunions make it more willing to reconnect.
  if(mp.lastEvent==='abandon'){scores.OBSERVE+=.55;scores.WAIT+=.25;scores.FOLLOW-=.18}scores.RETURN+=mp.habitSeparation*.75;scores.FOLLOW+=mp.habitReunion*.65;scores.WAIT+=mp.habitWaiting*.55;scores.FOLLOW+=mp.habitProximity*.45;scores.OBSERVE+=mp.habitRepetition*.35;scores.OBSERVE+=mp.habitUnpredictability*.55;scores.EXPLORE+=mp.habitUnpredictability*.25;
  if(mp.lastEvent==='return'){scores.FOLLOW+=.38;scores.INTERCEPT+=.22;scores.RETURN-=.12}
  if(mp.chapterVisits>0){scores.OBSERVE+=Math.min(.55,mp.chapterVisits*.08);if(mp.chapterAbandoned)scores.WAIT+=.25;if(mp.chapterReturned)scores.FOLLOW+=.22}
  if(mp.recentAbandon>=3){scores.RETURN+=.35;scores.OBSERVE+=.3}
  if(mp.recentReturn>=3){scores.FOLLOW+=.35;scores.INTERCEPT+=.18}
  if(mp.recentWait>=3){scores.WAIT+=.3;scores.OBSERVE+=.18}
  if(mp.recentClose>=3){scores.FOLLOW+=.25;scores.WAIT-=.12}
  // Contextual reactions: player behaviour changes the ranking rather than forcing a mode.
  if(this.playerSpeed>.72){scores.OBSERVE+=1.1;scores.INTERCEPT+=.8;scores.FOLLOW-=.4}
  if(this.still>.8){scores.WAIT+=1.2;scores.FOLLOW+=.4;scores.EXPLORE-=.3}
  if(d>.30){scores.RETURN+=1.1;scores.FOLLOW+=.6}
  const ctx=decision.context,strength=decision.context==='ABRUPT_CHANGE'||decision.context==='PLAYER_FLEEING'?1:.7;
  if(ctx==='PLAYER_PURSUING'){scores.OBSERVE+=.35*strength;scores.RETURN+=.18*strength;}
  if(ctx==='ABRUPT_CHANGE'){scores.OBSERVE+=.65*strength;scores.INTERCEPT+=.25*strength;}
  if(ctx==='PLAYER_WAITING'&&this.contextStreak>1.2){scores.WAIT+=.25;scores.FOLLOW+=.12;}
  if(d<.10){scores.OBSERVE+=.55;scores.EXPLORE+=.35}scores.FOLLOW+=Math.min(1,mp.returns*.025);scores.RETURN+=Math.min(1.2,mp.abandonments*.035+mp.recentAbandon*.25);scores.WAIT+=Math.min(.9,mp.preferredWait*.012);scores.OBSERVE+=Math.min(.9,mp.preferredObserve*.012);scores.INTERCEPT+=Math.min(.7,mp.preferredIntercept*.01);scores.EXPLORE+=Math.min(.8,mp.preferredExplore*.01);if(mp.repeatedChapters>2)scores.OBSERVE+=.25;return scores;
 }
 choose(){
  const scores=this.score();let best='FOLLOW',value=-Infinity,second=-Infinity;
  Object.keys(scores).forEach(k=>{const v=scores[k];if(v>value){second=value;value=v;best=k}else if(v>second){second=v}});
  // Decision inertia prevents rapid oscillation when two choices are nearly equivalent.
  if(this.modeTime>0&&scores[this.mode]>=value-.55)best=this.mode;
  this.mode=best;this.confidence=this.clamp((value-second+.35)/1.6);this.modeTime=.65+.35*this.profile().familiarity;return this.mode;
 }
 act(dt){
  this.modeTime=Math.max(0,this.modeTime-dt);this.decisionTimer-=dt;this.observe(dt);
  if(this.decisionTimer<=0){this.decisionTimer=.16;this.choose();const key=this.mode.toLowerCase();mem.behaviorMemory[key]=(mem.behaviorMemory[key]||0)+.06;if(this.mode==='WAIT')learnHabit('waiting',.004);if(this.mode==='FOLLOW')learnHabit('proximity',.003);if(this.mode==='OBSERVE')learnHabit('repetition',.002)}
  // Chapter 3's hesitation objective should bring the Other back toward the player.
  // Once it is complete, keep the return behavior predictable so the exit stays reachable.
  if(n===2&&state.objectiveComplete)this.mode='FOLLOW';
  const q=this.profile(),d=near(p,o),mp=memoryProfile(),speed=.24+.16*q.attachment+.08*q.independence;
  if(this.mode==='FOLLOW'){go({x:p.x,y:p.y},dt,speed);}
  else if(this.mode==='WAIT'){if(d>.13){const target=navClear(o,p)?{x:o.x+(p.x-o.x)*.18,y:o.y+(p.y-o.y)*.18}:p;go(target,dt,speed*.55);}}
  else if(this.mode==='OBSERVE'){const side=q.unpredictability>.5?{x:1-p.x,y:1-p.y}:{x:p.x,y:p.y};go(side,dt,speed*.48);}
  else if(this.mode==='INTERCEPT'){const lead=1.8+this.playerSpeed*1.8;const tx=this.clamp(p.x+(p.x-this.lastPlayer.x)*lead,.05,.95),ty=this.clamp(p.y+(p.y-this.lastPlayer.y)*lead,.05,.95);go({x:tx,y:ty},dt,speed*.95);}
  else if(this.mode==='RETURN'){go({x:.5,y:.5},dt,speed*.72);if(d<.18)go(p,dt,speed*.7);}
  else {const angle=(this.lastPlayer.x*7+this.lastPlayer.y*11+n*.37)%6.283;go({x:this.clamp(.5+Math.cos(angle)*.28,.08,.92),y:this.clamp(.5+Math.sin(angle)*.28,.08,.92)},dt,speed*.7);}
  return this.mode;
 }
}
const otherBrain=new OtherBrain();

function other(dt){const m=chapters[n][0],r=relation();const analysisDt=(state.analysisAccumulator||0)+dt;if(!safariBrowser||analysisDt>=.033){analyze(analysisDt);state.analysisAccumulator=0}else state.analysisAccumulator=analysisDt;if(['secret','double','truth','absence','origin','choiceFinal'].includes(m)){v7Behavior(dt);return;}if(n<=8){const mode=otherBrain.act(dt);mem.aiMode=mode;mem.aiDecisions++;return;}const preferred=mem.right>mem.left?{x:.78,y:.5}:{x:.22,y:.5};
if(m==='follow')go(trail[Math.max(0,trail.length-18)]||p,dt,.43);
else if(m==='habit')go(preferred,dt,.30);
else if(m==='hesitate')go(state.still>.7?p:{x:.5,y:.5},dt,state.still>.7?.48:.22);
else if(m==='wait')near(p,o)>.20?go(p,dt,.55):mem.cooperate+=dt*.04;
else if(m==='mirror')go({x:1-p.x,y:1-p.y},dt,.34);
else if(m==='abandon'){if(near(p,o)>.28){mem.abandons+=dt*.16;go({x:.5,y:.5},dt,.24)}else go(p,dt,.4)}
else if(m==='choice'){if(!state.target||near(o,state.target)<.035){state.target=mem.left>=mem.right?{x:.18,y:.82}:{x:.82,y:.18};mem.choices.push(state.target.x<.5?'G':'D');if(mem.choices.length>20)mem.choices.shift()}go(state.target,dt,.32)}
else if(m==='punish'){if(near(p,o)<.22){mem.blocks+=dt*.18;go({x:o.x+(o.x-p.x)*.8,y:o.y+(o.y-p.y)*.8},dt,.48)}else go(p,dt,.35)}
else if(m==='observe')go(near(p,o)>.25?p:{x:.5,y:.5},dt,.18);
else if(m==='lie'){if(state.phase===0){go({x:.5,y:.18},dt,.38);if(near(o,{x:.5,y:.18})<.05){state.phase=1;mem.fear++;say('Je t’ai menti.',true)}}else go({x:exits[n][0],y:exits[n][1]},dt,.38)}
else if(m==='memory'){if(state.phase===0){let old=mem.choices[0]==='G'?{x:.25,y:.5}:{x:.75,y:.5};go(old,dt,.31);if(near(o,old)<.07){state.phase=1;say(mem.choices.length?'Je me souviens de ton choix.':'Je me souviens de ta manière de jouer.')}}else go({x:exits[n][0],y:exits[n][1]},dt,.4)}
else if(m==='trust'){if(near(p,o)>.26)go(p,dt,.3);else{go({x:exits[n][0],y:exits[n][1]},dt,.42);if(near(p,o)<.12){mem.trust+=dt*.8;mem.cooperate+=dt*.3}}}
else if(m==='betray'){if(state.phase===0){go(p,dt,.36);if(near(p,o)<.12){state.phase=1;mem.fear+=r>55?.2:.5;say(r>55?'Je ne voulais pas te perdre.':'Tu me faisais confiance.',true)}}else go({x:.12,y:.12},dt,.5)}
else if(m==='cooperate'){if(near(p,o)>.17)go(p,dt,.34);else{go({x:exits[n][0],y:exits[n][1]},dt,.44);mem.cooperate+=dt*.08}}
else if(m==='predict'){let target=mem.right>mem.left?{x:.76,y:.5}:{x:.24,y:.5};if(state.phase===0&&near(p,target)<.25){state.phase=1;mem.curiosity++;say('Je savais que tu choisirais ça.')}go(state.phase?{x:exits[n][0],y:exits[n][1]}:target,dt,.4)}
else if(m==='refuse'){if(state.phase===0){let target=r>60?{x:.88,y:.88}:{x:.12,y:.12};go(target,dt,.38);if(near(o,target)<.06){state.phase=1;mem.refused++;say('Ce n’est pas toujours toi qui décides.',true)}}else go({x:exits[n][0],y:exits[n][1]},dt,.46)}
else if(m==='echo'){let target=mem.rush>5?{x:.85,y:.15}:preferred;go(target,dt,.35);if(state.still>.8){mem.curiosity++;say('Tu hésites toujours au même endroit.')}}
else if(m==='protect'){if(near(p,o)>.18)go(p,dt,.40);else{go({x:.5,y:.5},dt,.20);mem.helped+=dt*.25;if(state.nearTime>1.2&&state.phase===0){state.phase=1;say('Reste derrière moi.');mem.trust+=.5}}}
else if(m==='question'){if(state.phase===0){go(p,dt,.28);if(state.nearTime>1.5){state.phase=1;mem.returns+=1;say(mem.returns>1?'Tu reviens toujours.':'Tu es revenu.',true)}}else go({x:exits[n][0],y:exits[n][1]},dt,.38)}
else if(m==='silence'){go({x:exits[n][0],y:exits[n][1]},dt,.30);if(state.still>1.4&&state.phase===0){state.phase=1;say('Je n’ai pas besoin de mots pour te suivre.');mem.trust+=.7}}
else if(m==='identity'){let t=r>65?{x:1-p.x,y:1-p.y}:{x:p.x,y:p.y};go(t,dt,.34);if(state.nearTime>1.0&&state.phase===0){state.phase=1;mem.curiosity+=2;say('Tu me reconnais ?')}}
else if(m==='fracture'){let t=mem.abandons>2?{x:.88,y:.88}:{x:.12,y:.12};go(t,dt,.40);if(state.phase===0&&near(p,o)<.14){state.phase=1;mem.fear+=.4;say(mem.abandons>2?'Tu m’as appris à partir.':'Je ne veux pas partir.',true)}}
else if(m==='choice2'){if(!state.target){state.target=mem.trust>=55?{x:.80,y:.20}:{x:.20,y:.80};}go(state.target,dt,.40);if(state.phase===0&&near(o,state.target)<.05){state.phase=1;say(mem.trust>=55?'Je t’ai donné la sortie honnête.':'Je ne sais pas si tu me crois.',mem.trust<55)}}
else if(m==='distort'){let t=worldTarget();go(t,dt,.32);if(state.phase===0&&near(p,t)<.16){mem.anomalies+=.3;state.phase=1;signal('LE MONDE A CHANGÉ');say(r>60?'Il se calme quand tu restes près de moi.':'Il se ferme quand tu t’éloignes.',r<35)}}
else if(m==='doors'){let t=mem.trust>=55?{x:.82,y:.18}:{x:.18,y:.82};go(t,dt,.38);if(state.phase===0&&near(p,t)<.14){state.phase=1;mem.doorChoices.push(mem.trust>=55?'HONNETE':'PRUDENTE');if(mem.doorChoices.length>40)mem.doorChoices.shift();mem.choices.push(mem.trust>=55?'D':'G');if(mem.choices.length>20)mem.choices.shift();signal('PORTE CHOISIE');say(mem.trust>=55?'Tu as choisi la porte que je t’aurais montrée.':'Tu as choisi sans me croire.',mem.trust<55)}}
else if(m==='ghost'){let t={x:1-p.x,y:1-p.y};go(t,dt,.34);if(state.phase===0&&near(p,o)<.15){mem.echoes++;state.phase=1;signal('QUELQUE CHOSE A BOUGÉ');say('Ce n’était pas moi.')}}
else if(m==='return'){let t=mem.returns>2?{x:.82,y:.18}:{x:.18,y:.82};go(t,dt,.35);if(state.phase===0&&near(p,o)<.14){state.phase=1;mem.anomalies++;signal('BOUCLE DÉTECTÉE');say('Tu reconnais cet endroit ?')}}
else if(m==='collapse'){let t=mem.abandons>2?{x:.88,y:.88}:{x:.12,y:.12};go(t,dt,.42);if(state.phase===0&&mem.anomalies>1&&near(p,o)<.18){state.phase=1;mem.worldMood+=2;signal('LE MONDE SE SOUVIENT');say('Tout ce que tu as fait est encore ici.',true)}}
else if(m==='threshold'){let t=mem.trust>=65?{x:.5,y:.5}:{x:.82,y:.82};go(t,dt,.36);if(state.phase===0&&near(p,o)<.13){state.phase=1;mem.flags.threshold=true;signal('SEUIL');say(mem.trust>=65?'Tu peux me laisser choisir.':'Tu ne me connais pas encore.',mem.trust<65)}}
else if(m==='final'){if(state.phase===0){go(p,dt,.32);if(near(p,o)<.12){state.phase=1;mem.flags.finalMet=true;say('Maintenant, regarde ce que tu as fabriqué.',true)}}else{if(r>=78&&mem.abandons<1)go({x:.5,y:.5},dt,.48);else if(r<=28||mem.abandons>2)go({x:.88,y:.88},dt,.48);else go({x:exits[n][0],y:exits[n][1]},dt,.42)}}}
// V7 : narrative / secret behaviors
function v7Behavior(dt){
 const m=chapters[n][0], r=relation();
 if(m==='secret'){
   const t=mem.anomalies>1?{x:.50,y:.50}:{x:.82,y:.18}; go(t,dt,.31);
   if(state.phase===0&&near(p,o)<.16){state.phase=1;mem.secrets++;mem.curiosity+=2;mem.storyFlags.push('SAW_BEHIND');signal('ACCÈS NON PRÉVU');say('Tu n’aurais pas dû voir cet endroit.',true)}
 }else if(m==='double'){
   const t={x:1-p.x,y:1-p.y}; go(t,dt,.36);
   if(state.phase===0&&near(p,o)<.15){state.phase=1;mem.secrets++;signal('DEUX PRÉSENCES');say('Ne te retourne pas.') }
 }else if(m==='truth'){
   const t=mem.trust>18?{x:.50,y:.50}:{x:.18,y:.82}; go(t,dt,.34);
   if(state.phase===0&&near(p,o)<.14){state.phase=1;mem.truths++;mem.trust+=2;mem.storyFlags.push('TRUTH');signal('MÉMOIRE OUVERTE');say(mem.trust>40?'Je vais te montrer ce que tu m’as appris.':'Tu n’es pas encore prêt à tout voir.')}
 }else if(m==='absence'){
   // The other player deliberately disappears; only your trail remains.
   if(state.phase===0){o.x=.02;o.y=.02;state.phase=1;mem.absences++;mem.storyFlags.push('ABSENCE');signal('AUCUN AUTRE JOUEUR');say('Je ne suis pas là. Continue quand même.',true)}
 }else if(m==='origin'){
   const t={x:.50,y:.50}; go(t,dt,.30);
   if(state.phase===0&&near(p,o)<.15){state.phase=1;mem.truths++;mem.storyFlags.push('ORIGIN');signal('DÉBUT');say('Ce n’est pas le début. C’est la première fois que tu t’en souviens.')}
 }else if(m==='choiceFinal'){
   const t=mem.trust>=65?{x:.82,y:.50}:{x:.18,y:.50}; go(t,dt,.37);
   if(state.phase===0&&near(p,o)<.14){state.phase=1;mem.lastChoice=mem.trust>=65?'LE_LAISSE_CHOISIR':'GARDE_LE_CONTROLE';mem.storyFlags.push(mem.lastChoice);signal('DERNIER CHOIX');say(mem.trust>=65?'Alors choisis sans moi.':'Alors décide pour nous.',mem.trust<65)}
 }
}

function distExit(a,e){return Math.hypot(a.x-e[0],a.y-e[1])}
function loop(t){if(!running)return;requestAnimationFrame(loop);if(paused){last=t;return}const rawDt=Math.max(0,(t-last)/1000);updatePerformance(rawDt);let dt=Math.min(rawDt,.05);last=t;if(state.narrativeCueCooldown>0)state.narrativeCueCooldown=Math.max(0,state.narrativeCueCooldown-dt);if(state.metaCueCooldown>0)state.metaCueCooldown=Math.max(0,state.metaCueCooldown-dt);move(p,input.x,input.y,dt);if(Math.hypot(input.x,input.y)>.18)AudioEngine.move();state.ambientTimer=(state.ambientTimer||0)+dt;if(state.ambientTimer>=.10){state.ambientTimer=0;AudioEngine.updateAmbient();AudioEngine.contextTick();}state.trailTimer=(state.trailTimer||0)+dt;if(state.trailTimer>=.045){state.trailTimer=0;const lastTrail=trail[trail.length-1];if(!lastTrail||Math.hypot(p.x-lastTrail.x,p.y-lastTrail.y)>.0025){trail.push({x:p.x,y:p.y});if(trail.length>performanceState.trailMax)trail.shift();}}other(dt);const worldDt=(state.worldLogicAccumulator||0)+dt;if(!safariBrowser||worldDt>=.066){reactWorld(worldDt);state.worldLogicAccumulator=0}else state.worldLogicAccumulator=worldDt;state.animationTime+=dt;state.animationMotion=state.animationMotion*.82+Math.hypot(input.x,input.y)*.18;if(state.messageTimer>0){state.messageTimer-=dt;if(state.messageTimer<=0){thought.textContent='';thought.classList.remove('thought-alert')}}if((state.renderFrame=(state.renderFrame||0)+1)>=performanceState.renderEvery){state.renderFrame=0;draw()}let e=exits[n];let requiresOther=n!==33;let reachedExit=distExit(p,e)<.055&&(!requiresOther||distExit(o,e)<.055);if(objectiveSatisfied()){if(!state.objectiveComplete){state.objectiveComplete=true;if(!mem.completedObjectives.includes(n))mem.completedObjectives.push(n);AudioEngine.event('signal');signal('OBJECTIF ATTEINT')} }updateObjectiveHUD();let canExit=objectiveSatisfied();if(reachedExit&&canExit){running=false;finish()}else if(reachedExit&&!canExit&&state.exitHint!==true){state.exitHint=true;signal('OBJECTIF NON TERMINÉ');say(levelDesign[n][2],true)}else if(!paused){} }
function endingProfile(){
 const r=relation(),p=mem.personality||defaultMemory.personality,h=mem.habits||defaultMemory.habits,mm=mem.metaMemory||defaultMemory.metaMemory;
 const meta=(mm.discovered||[]).length, secrets=mem.secrets||0;
 const profiles={
  bond:Math.max(0,r*.62+(p.attachment||50)*.22+(mem.cooperate||0)*2+(mem.helped||0)*1.5-(mem.abandons||0)*8),
  freedom:Math.max(0,(p.independence||50)*.42+(p.trust||50)*.22+(mem.refused||0)*3+(mem.returns||0)*1.2-(mem.blocks||0)*1.2),
  mirror:Math.max(0,(mem.rush||0)*2.2+(h.repetition||0)*25+(h.unpredictability||0)*18+(mem.pattern||0)*1.5),
  fracture:Math.max(0,(mem.abandons||0)*9+(p.fear||50)*.30+(p.suspicion||50)*.22+(100-r)*.35),
  memory:Math.max(0,(mem.truths||0)*9+secrets*7+meta*8+(mem.echoes||0)*2+(mem.absences||0)*5),
  silence:Math.max(0,(mem.waits||0)*2.2+(mem.hesitate||0)*2+(h.waiting||0)*30+(mem.absences||0)*4),
  world:Math.max(0,(mem.anomalies||0)*7+(mem.worldMood||0)*5+meta*6+(mem.replays||0)*4),
  search:Math.max(0,(mem.curiosity||0)*2+(p.curiosity||50)*.3+(mem.secrets||0)*5+(mem.choices||[]).length*.55),
 };
 return profiles;
}
function selectEnding(){
 const r=relation(),s=endingProfile(),mm=mem.metaMemory||defaultMemory.metaMemory;
 const meta=new Set(mm.discovered||[]),seen=new Set(mem.uniqueEndings||[]);
 const candidates=[];
 const add=(id,t,x,e,score,priority=0)=>candidates.push({id,t,x,e,score,priority});
 if(meta.has('meta-double')&&s.memory>=42)add('ORIGIN','CE QUI ÉTAIT AVANT','Tu découvres une trace qui ne correspond à aucune de tes parties. L’Autre ne semble pas avoir commencé avec toi.','FIN — ORIGINE',s.memory+18,8);
 if(meta.has('meta-world')&&s.world>=38)add('WORLD','LE MONDE A APPRIS','Tu pensais avoir façonné une histoire. Après plusieurs parties, quelque chose d’autre a appris à les relier.','FIN — MONDE',s.world+16,7);
 if(meta.has('meta-loop')&&s.memory>=35&&mem.loopBreaks>0)add('BREAK','LA BOUCLE CÈDE','Tu fais enfin quelque chose que tes anciennes parties n’avaient jamais fait. Pour la première fois, l’Autre ne sait pas ce qui vient ensuite.','FIN — RUPTURE DE BOUCLE',s.memory+s.world+12,9);
 if(s.bond>=72&&r>=78&&mem.abandons<2&&mem.helped>=2)add('BOND','NOUS DEUX','Vous cessez de vous suivre. Vous choisissez ensemble. Le monde s’efface, mais sa mémoire reste.','FIN — COMPLICITÉ',s.bond,10);
 if(s.freedom>=72&&r>=58&&mem.refused>=1)add('FREE','LIBERTÉ','Tu lui as fait confiance au point de ne plus lui donner de destination. Pour la première fois, il choisit où aller.','FIN — LIBERTÉ',s.freedom,7);
 if(s.fracture>=70&&r<=38)add('BREAKUP','IL PART','Tu voulais savoir s’il était différent. Il l’est devenu sans toi. La dernière porte reste ouverte derrière lui.','FIN — RUPTURE',s.fracture,9);
 if(s.mirror>=68&&s.mirror>s.bond&&s.mirror>s.memory)add('MIRROR','LE MIROIR','Il n’a pas appris qui tu étais. Il a appris ce que tu fais toujours. Et maintenant, il sait que tu le sais.','FIN — MIROIR',s.mirror,6);
 if(s.silence>=58&&meta.has('meta-silence'))add('SILENCE','APRÈS LE SILENCE','Tu n’as rien fait. Pourtant, quelque chose a continué sans toi. Lorsque tu repars, il a déjà choisi.','FIN — SILENCE',s.silence+10,7);
 if(s.search>=65&&s.memory>=30)add('SEARCH','CE QUI ÉTAIT CACHÉ','Tu retrouves des traces de parties que tu ne te souvenais pas avoir jouées. La question n’est plus ce qu’il est, mais depuis quand il est là.','FIN — MÉMOIRE CACHÉE',s.search+s.memory*.45,6);
 if(mem.absences>0&&mem.lastChoice==='LE_LAISSE_CHOISIR')add('AFTER','APRÈS TOI','Tu le laisses choisir. Il disparaît sans te dire où il va. Une dernière pensée apparaît : « Maintenant, c’est mon tour de te chercher. »','FIN — APRÈS TOI',s.freedom+8,5);
 add('UNKNOWN','QUI JOUE AVEC QUI ?','Tu n’obtiens pas la réponse. Tu comprends seulement ceci : il t’a observé pendant que tu pensais l’observer.','FIN — INCONNUE',r*.45+s.search*.25+s.memory*.25,1);
 candidates.sort((a,b)=>(b.priority-a.priority)||(b.score-a.score));
 const best=candidates[0];
 const sig=[best.id,n,Math.round(r/10),Math.round(s.memory/10),Math.round(s.world/10),Math.round(s.fracture/10)].join(':');
 return {...best,sig,profiles:s};
}
function finish(){
 if(!objectiveSatisfied())return;
 checkSecrets();checkMetaSecrets();
 if(n!==35){
   const r=relation();
   const ending=n>=24?{t:'IL SE SOUVIENT',x:'Il ne réagit plus seulement à ce que tu fais. Il réagit à ce que tu as été.',e:'MÉMOIRE PROFONDE'}:n>=18?{t:'IL A CHOISI',x:'Pour la première fois, il a pris une décision sans attendre la tienne.',e:'PERSONNALITÉ ÉMERGENTE'}:{t:r>65?'IL TE FAIT CONFIANCE.':r<35?'IL SE MÉFIE.':'IL TE REGARDE.',x:'Cette séquence a modifié votre relation.',e:'RELATION MODIFIÉE'};
   mem.lastEnding=ending.e;mem.chapter=Math.max(mem.chapter,n+1);mem.chaptersSeen.includes(n)||mem.chaptersSeen.push(n);rememberChapter();save();$('endingEyebrow').textContent=ending.e;$('winTitle').textContent=ending.t;$('winText').textContent=ending.x;$('endingRecap').textContent=endingRecap();$('endingStats').innerHTML=`<div class="stat green"><b>${r}</b><span>LIEN</span></div><div class="stat red"><b>${Math.round(mem.abandons)}</b><span>ABANDONS</span></div><div class="stat blue"><b>${mem.choices.length}</b><span>CHOIX</span></div><div class="stat"><b>${mem.secrets}</b><span>SECRETS</span></div><div class="stat violet"><b>${mem.uniqueEndings.length}</b><span>FINS</span></div>`;$('next').textContent='CONTINUER';show('win');return;
 }
 const r=relation(),ending=selectEnding(),em=mem.endingMemory||defaultMemory.endingMemory;
 em.history=Array.isArray(em.history)?em.history:[];em.signatures=Array.isArray(em.signatures)?em.signatures:[];
 if(!mem.uniqueEndings.includes(ending.e)){mem.uniqueEndings.push(ending.e);em.discoveries=(em.discoveries||0)+1}
 em.history.push({id:ending.id,ending:ending.e,campaign:mem.campaignRuns||0,time:Date.now()});if(em.history.length>24)em.history.shift();
 if(!em.signatures.includes(ending.sig)){em.signatures.push(ending.sig);if(em.signatures.length>40)em.signatures.shift()}
 em.lastProfile=ending.id;
 mem.endingMemory=em;mem.lastEnding=ending.e;mem.flags.campaignComplete=true;mem.flags.storyComplete=true;mem.flags.completedAt=Date.now();mem.chapter=Math.max(mem.chapter,n+1);mem.chaptersSeen.includes(n)||mem.chaptersSeen.push(n);mem.nextChapter=null;
 rememberChapter();rememberEvent('campaign_ending',{ending:ending.id,relation:r,signature:ending.sig,secrets:mem.secrets,meta:(mem.metaMemory?.discovered||[]).length});
 if(mem.uniqueEndings.length>=3)mem.flags.multipleEndings=true;
 save();
 $('endingEyebrow').textContent=ending.e;$('winTitle').textContent=ending.t;$('winText').textContent=ending.x;
 $('endingRecap').textContent=endingRecap();$('endingStats').innerHTML=`<div class="stat green"><b>${r}</b><span>LIEN</span></div><div class="stat red"><b>${Math.round(mem.abandons)}</b><span>ABANDONS</span></div><div class="stat blue"><b>${mem.choices.length}</b><span>CHOIX</span></div><div class="stat"><b>${mem.secrets}</b><span>SECRETS</span></div><div class="stat violet"><b>${mem.uniqueEndings.length}</b><span>FINS</span></div>`;
 $('next').textContent='REJOUER LA CAMPAGNE';show('win');
}
function artProfile(w,t){
 const palettes={
  STABLE:{bg:'#080c11',grid:'#ffffff09',wall:'#182128',edge:'#34434b',accent:'#9ee8c1',anomaly:'#9bb7ff'},
  CALM:{bg:'#07100d',grid:'#9ee8c112',wall:'#14251e',edge:'#3d6b57',accent:'#a9f4c9',anomaly:'#8fe0b0'},
  AWARE:{bg:'#090d14',grid:'#a8b9ff0c',wall:'#1b202c',edge:'#46506b',accent:'#b9c5ff',anomaly:'#a79cff'},
  ATTENTIVE:{bg:'#0c0b12',grid:'#c9b7ff0d',wall:'#211b2c',edge:'#5b4b72',accent:'#d0c1ff',anomaly:'#c7a7ff'},
  UNEASY:{bg:'#100b0e',grid:'#ffb0bb0c',wall:'#29171d',edge:'#6a3842',accent:'#ffb0b8',anomaly:'#ff7d8a'},
  WATCHFUL:{bg:'#0d0b12',grid:'#ffb46b0d',wall:'#251b18',edge:'#6a5145',accent:'#ffd0a1',anomaly:'#ffae76'},
  FRACTURED:{bg:'#12090c',grid:'#ff667417',wall:'#301419',edge:'#7a3540',accent:'#ff9ba4',anomaly:'#ff6574'}
 };
 const a=palettes[w.state]||palettes.STABLE;
 return {...a,glow:.05+w.intensity*.12,scan:.08+w.intensity*.10};
}
function draw(){const w=state.worldProfile||worldProfile(),t=performance.now()/1000,a=artProfile(w,t),quality=visualQuality(),d=lastDpr||1;const cacheKey=[n,S,d,a.bg,a.grid,a.wall,a.edge,quality,mem.anomalies||0,mem.returns||0,mem.secrets||0].join('|');if(cacheKey!==backgroundCacheKey){backgroundCanvas.width=canvas.width;backgroundCanvas.height=canvas.height;const base=backgroundCanvas.getContext('2d');base.setTransform(d,0,0,d,0,0);base.fillStyle=a.bg;base.fillRect(0,0,S,S);base.strokeStyle=a.grid;base.lineWidth=1;const gridCount=quality>=2?9:quality===1?7:5;for(let i=1;i<=gridCount;i++){const q=i/(gridCount+1);base.beginPath();base.moveTo(q*S,0);base.lineTo((1-q)*S,S);base.stroke();base.beginPath();base.moveTo(0,q*S);base.lineTo(S,(1-q)*S);base.stroke()}if(quality>0){const vg=base.createRadialGradient(.5*S,.48*S,.12*S,.5*S,.5*S,.72*S);vg.addColorStop(0,'#ffffff00');vg.addColorStop(1,quality>=2?'#00000080':'#00000060');base.fillStyle=vg;base.fillRect(0,0,S,S)}base.fillStyle=a.wall;maps[n].forEach(r=>{base.fillRect(r[0]*S,r[1]*S,r[2]*S,r[3]*S);base.strokeStyle=a.edge;base.lineWidth=1;base.strokeRect(r[0]*S+.5,r[1]*S+.5,r[2]*S-1,r[3]*S-1)});const marks=Math.min(quality>=2?18:quality===1?10:5,Math.floor((mem.anomalies||0)*1.4+(mem.returns||0)*.35+(mem.secrets||0)*.8));for(let i=0;i<marks;i++){const x=.08+((i*31+n*7)%83)/100,y=.08+((i*53+n*11)%83)/100,r=(.003+(i%3)*.001)*S;base.beginPath();base.arc(x*S,y*S,r,0,Math.PI*2);base.fillStyle=a.anomaly+('0'+Math.floor(30).toString(16)).slice(-2);base.fill()}backgroundCacheKey=cacheKey}ctx.clearRect(0,0,S,S);ctx.drawImage(backgroundCanvas,0,0,S,S);const motion=motionReduced?0:1;
 const pulse=.035+Math.sin(t*(1.2+w.intensity*2))*.006*w.intensity;ctx.beginPath();ctx.arc(.5*S,.5*S,pulse*S,0,Math.PI*2);ctx.strokeStyle=a.anomaly+Math.floor(20+60*w.intensity).toString(16);ctx.lineWidth=1.5;ctx.stroke();
 // Marques persistantes : le monde garde visuellement une mémoire de certains passages.
 const marks=Math.min(visualQuality()>=2?18:(visualQuality()===1?10:5),Math.floor((mem.anomalies||0)*1.4+(mem.returns||0)*.35+(mem.secrets||0)*.8));
 for(let i=0;i<marks;i++){const seed=(i*47+n*13)%97/97,x=.08+((i*31+n*7)%83)/100,y=.08+((i*53+n*11)%83)/100,r=(.003+(i%3)*.001)*S;ctx.beginPath();ctx.arc(x*S,y*S,r,0,Math.PI*2);ctx.fillStyle=a.anomaly+('0'+Math.floor(18+42*w.intensity).toString(16)).slice(-2);ctx.fill()}
 if(w.intensity>.35&&visualQuality()>0){const offset=Math.sin(t*.55)*.025*w.intensity;ctx.beginPath();ctx.moveTo((.08+offset)*S,.12*S);ctx.lineTo((.92-offset)*S,.88*S);ctx.strokeStyle=a.anomaly+'22';ctx.stroke();ctx.beginPath();ctx.moveTo((.92-offset)*S,.12*S);ctx.lineTo((.08+offset)*S,.88*S);ctx.strokeStyle='#ffffff08';ctx.stroke()}
 if(n>=24&&visualQuality()>=2){let pulse2=.05+Math.sin(performance.now()/500)*.008;ctx.beginPath();ctx.arc(.5*S,.5*S,pulse2*S,0,Math.PI*2);ctx.strokeStyle=a.anomaly+'30';ctx.stroke();if(mem.anomalies>1){ctx.beginPath();ctx.moveTo(.5*S,.15*S);ctx.lineTo(.5*S,.85*S);ctx.strokeStyle=a.anomaly+'16';ctx.stroke()}}
 let e=exits[n];ctx.beginPath();ctx.arc(e[0]*S,e[1]*S,.035*S,0,Math.PI*2);ctx.strokeStyle=a.accent;ctx.shadowColor=a.accent;ctx.shadowBlur=4+12*w.intensity;ctx.lineWidth=2;ctx.stroke();ctx.shadowBlur=0;
 // PHASE 15 — mouvement lisible : trajectoire, respiration, inertie visuelle et réactions du monde.
 if(trail.length>1&&visualQuality()>0){ctx.beginPath();const trailDraw=Math.min(trail.length,performanceState.trailMax),trailStart=Math.max(0,trail.length-trailDraw);for(let i=trailStart;i<trail.length;i++){const q=trail[i];if(i===trailStart)ctx.moveTo(q.x*S,q.y*S);else ctx.lineTo(q.x*S,q.y*S)}ctx.strokeStyle='#74e39a18';ctx.lineWidth=1.2;ctx.stroke()}
 if(n>=15&&visualQuality()>=1){ctx.beginPath();ctx.arc(o.x*S,o.y*S,.042*S,0,Math.PI*2);ctx.strokeStyle=a.anomaly+'45';ctx.stroke()}dotAnimated(o,'#ff6e78','AUTRE',t,w,motion,true);dotAnimated(p,'#74e39a','TOI',t,w,motion,false) }
function dotAnimated(a,c,label,t,w,motion,isOther){let speed=state.animationMotion||0;let mode=otherBrain?.mode||'FOLLOW';let phase=(isOther?.7:0)+state.animationTime*(isOther?(1.35+speed*.9):(1.8+speed*.55));let breath=Math.sin(phase)*.0018*motion;let bob=Math.sin(phase*.72)*(.0025+speed*.004)*S*motion;let x=a.x*S,y=a.y*S+bob,r=.022*S*(1+breath*8);let pulse=(isOther?1+w.intensity*.55:1);if(isOther&&mode==='OBSERVE')pulse*=1.08;if(isOther&&mode==='WAIT')pulse*=.94;ctx.beginPath();ctx.arc(x,y,r*2.1*pulse,0,Math.PI*2);ctx.fillStyle=c+'16';ctx.fill();ctx.beginPath();ctx.arc(x,y,r*pulse,0,Math.PI*2);ctx.fillStyle=c;ctx.fill();if(isOther&&motion){ctx.beginPath();ctx.arc(x,y,r*(1.45+.18*Math.sin(phase*1.7)),0,Math.PI*2);ctx.strokeStyle=c+'28';ctx.lineWidth=1;ctx.stroke()}ctx.font='600 9px system-ui';ctx.textAlign='center';ctx.fillStyle=c;ctx.fillText(label,x,y-r*2.2)}
const joy=$('joy'),knob=$('knob');let pointer=null;function jm(e){let r=joy.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,dx=e.clientX-cx,dy=e.clientY-cy,max=r.width*.32,d=Math.hypot(dx,dy);if(d>max&&d>0){dx=dx/d*max;dy=dy/d*max}const nx=dx/max,ny=dy/max;const dead=.10;input={x:Math.abs(nx)<dead?0:nx,y:Math.abs(ny)<dead?0:ny};knob.style.transform=`translate(${dx}px,${dy}px)`}function jr(){pointer=null;input={x:0,y:0};knob.style.transform='translate(0,0)'}joy.onpointerdown=e=>{if(paused)return;pointer=e.pointerId;joy.setPointerCapture(e.pointerId);jm(e)};joy.onpointermove=e=>{if(e.pointerId===pointer)jm(e)};joy.onpointerup=jr;joy.onpointercancel=jr;
$('play').onclick=()=>{AudioEngine.init();mem.campaignRuns=(mem.campaignRuns||0)+1;save();n=0;show('game');reset()};$('continueBtn').onclick=()=>{AudioEngine.init();n=Math.min(mem.chapter,35);show('game');reset()};$('restart').onclick=()=>{AudioEngine.init();AudioEngine.event('start');reset()};$('audioToggle').onclick=()=>{const enabled=AudioEngine.toggle();$('audioToggle').textContent=enabled?'♪':'×';$('audioToggle').classList.toggle('muted',!enabled);$('audioToggle').setAttribute('aria-pressed',String(!enabled));$('audioToggle').setAttribute('aria-label',enabled?'Couper le son':'Activer le son')};$('pause').onclick=()=>{if(!running)return;AudioEngine.init();paused=!paused;AudioEngine.event(paused?'pause':'start');$('pauseOverlay').classList.toggle('active',paused);$('pauseOverlay').setAttribute('aria-hidden',String(!paused));$('pause').textContent=paused?'▶':'Ⅱ';$('pause').setAttribute('aria-pressed',String(paused));input={x:0,y:0};velocity={x:0,y:0};last=performance.now()};$('resume').onclick=()=>{$('pause').click()};$('pauseHome').onclick=()=>{$('pause').click();running=false;show('menu');updateMenu()};$('home').onclick=()=>{running=false;paused=false;$('pauseOverlay').classList.remove('active');$('pauseOverlay').setAttribute('aria-hidden','true');$('pause').textContent='Ⅱ';$('pause').setAttribute('aria-pressed','false');input={x:0,y:0};velocity={x:0,y:0};show('menu');updateMenu()};$('back').onclick=()=>{running=false;show('menu');updateMenu()};$('next').onclick=()=>{let next=n+1;if(n===21&&(mem.curiosity>=6||mem.anomalies>=2))next=24;if(n===23&&mem.secrets>=1)next=30;if(n===29&&mem.truths>=1)next=32;if(n===34&&mem.trust>=60)next=35;if(next<=35){n=next;show('game');reset()}else{save();n=0;show('game');reset()}};$('resetMemory').onclick=()=>{if(confirm('Effacer toute la mémoire de l’Autre Joueur ?')){try{localStorage.removeItem(SAVE_KEY);localStorage.removeItem(BACKUP_KEY);['otherPlayerMemoryV14','otherPlayerMemoryV12','otherPlayerMemoryV11','otherPlayerMemoryV10','otherPlayerMemoryV8','otherPlayerMemoryV7','otherPlayerMemoryV6','otherPlayerMemoryV5'].forEach(k=>localStorage.removeItem(k))}catch{}mem=cloneDefault();save();n=0;updateMenu()}};

function updateChapterHint(){
 const act=Math.floor(n/6), secret=(n>=24&&n<35)?' · ANOMALIES ACTIVES':'';const hidden=secretForChapter()?' · TRACE DÉCOUVERTE':'';
 const gate=gatedLevels.has(n)?' · OBJECTIF : '+objectiveLabel():' · '+objectiveLabel();
 $('chapterHint').textContent=story.acts[act][0]+secret+hidden+gate;
}
function updateMenu(){const storageOk=!!readSave(SAVE_KEY)||!!readSave(BACKUP_KEY);$('memoryStatus').textContent=mem.campaignRuns?'MÉMOIRE : '+mem.campaignRuns+' PARTIE'+(mem.campaignRuns>1?'S':''):'MÉMOIRE : ACTIVE';$('memoryHint').textContent=!storageOk?'MÉMOIRE LOCALE À VÉRIFIER · LES DONNÉES SERONT RÉÉCRITES À LA PROCHAINE SAUVEGARDE':mem.flags?.campaignComplete?'CAMPAGNE TERMINÉE · '+mem.uniqueEndings.length+' fin(s) · '+mem.discoveredClues.length+' traces cachées · '+((mem.metaMemory?.discovered||[]).length)+' traces méta.':mem.campaignRuns?(mem.returns>mem.abandons?'Il se souvient que tu es revenu. Le monde aussi. ':mem.abandons>mem.returns?'Il se souvient des distances que tu as prises. Le monde aussi. ':'Il se souvient de tes choix et de tes habitudes. Le monde aussi. ')+mem.discoveredClues.length+' trace(s) découverte(s).':'Chaque partie laissera une trace.';$('continueBtn').style.display=mem.chapter>0?'block':'none'}
const keyboardKeys=new Set();function keyboardInput(){const has=(keys)=>keys.some(k=>keyboardKeys.has(k));return{x:(has(['ArrowRight','d','D'])?1:0)-(has(['ArrowLeft','q','Q','a','A'])?1:0),y:(has(['ArrowDown','s','S'])?1:0)-(has(['ArrowUp','z','Z','w','W'])?1:0)}}document.onkeydown=e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();if(e.key==='Escape'&&running){$('pause').click();return}if(e.key===' '&&running&&!e.repeat){$('pause').click();return}if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','z','Z','w','W','s','S','q','Q','a','A','d','D'].includes(e.key)){keyboardKeys.add(e.key);if(pointer===null)input=keyboardInput()}};document.onkeyup=e=>{if(keyboardKeys.delete(e.key)&&pointer===null)input=keyboardInput()};updateMenu();updateRelation();resize();document.addEventListener('visibilitychange',()=>{if(document.hidden){performanceState.hidden=true;if(running&&!paused){$('pause').click()}}else{performanceState.hidden=false;if(running){AudioEngine.init();AudioEngine.updateAmbient(true);resize();last=performance.now()}}});window.addEventListener('blur',()=>{if(running&&!paused){$('pause').click()}});window.addEventListener('contextmenu',e=>e.preventDefault());
