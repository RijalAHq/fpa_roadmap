/* Derived values from state + dates. */
/* ═══════ Derived ═════ */
function currentWeek(){
  if(!S.start)return null;
  const d0=new Date(S.start+"T00:00:00");
  const now=new Date();now.setHours(12,0,0,0);
  const days=Math.floor((now-d0)/86400000);
  const w=Math.floor(days/7)+1;
  return w>=1&&w<=36?w:(w<1?null:36);
}
function stepByWeek(w){return STEPS.filter(s=>s.weeks.includes(w))}
function weekDone(w){const ss=stepByWeek(w);return ss.length>0&&ss.every(s=>S.steps[s.n].status==="Completed")}
function weekInProgress(w){return stepByWeek(w).some(s=>S.steps[s.n].status==="In Progress")}
function fmtDate(d){return d?new Date(d+"T00:00:00").toLocaleDateString(undefined,{year:"numeric",month:"short",day:"numeric"}):""}
