/* Persistence. localStorage key + shape, seed, load/save. */
/* ═══════ State ═════ */
const KEY="fpa-ledger-v1";
const SEED_STEPS=[3,4,5,6];
function blankState(){
  const steps={},projects={};
  for(const s of STEPS) steps[s.n]={status:"Not Started",notes:""};
  for(const p of PROJECTS) projects[p.i]={status:"Not Started",progress:0,start:"",target:"",done:"",link:""};
  return {start:null,steps,projects};
}
function seedState(){
  const st=blankState();
  for(const n of SEED_STEPS){st.steps[n].status="Completed"}
  for(const p of PROJECTS) if(SEED_STEPS.includes(p.step)){st.projects[p.i]={status:"Completed",progress:100,start:"",target:"",done:"",link:""}}
  return st;
}
let S;
function load(){
  try{
    const raw=localStorage.getItem(KEY);
    if(!raw){S=seedState();save();return}
    S=JSON.parse(raw);
    // merge new fields if structure evolves
    const b=blankState();
    for(const k of Object.keys(b.steps)) if(!S.steps[k])S.steps[k]=b.steps[k];
    for(const k of Object.keys(b.projects)) if(!S.projects[k])S.projects[k]=b.projects[k];
    if(S.start===undefined)S.start=null;
  }catch(e){S=blankState()}
}
function save(){localStorage.setItem(KEY,JSON.stringify(S))}
