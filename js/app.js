/* Event wiring for toolbar + dialogs, then boot. */
function openStart(){
  const d=$("dlgStart");$("startDateInput").value=S.start||"";
  d.showModal();
}
$("btnStart").addEventListener("click",openStart);
$("startSave").addEventListener("click",()=>{S.start=$("startDateInput").value||null;save();renderAll();$("dlgStart").close();toast(S.start?"Start date "+fmtDate(S.start):"Start date cleared")});
$("startClear").addEventListener("click",()=>{S.start=null;save();renderAll();$("dlgStart").close();toast("Start date cleared")});

$("btnExport").addEventListener("click",()=>{
  const blob=new Blob([JSON.stringify(S,null,2)],{type:"application/json"});
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download="fpa-roadmap-progress-"+new Date().toISOString().slice(0,10)+".json";
  a.click();URL.revokeObjectURL(a.href);
  toast("Exported");
});
$("btnImport").addEventListener("click",()=>$("importFile").click());
$("importFile").addEventListener("change",e=>{
  const f=e.target.files[0];if(!f)return;
  const rd=new FileReader();
  rd.onload=()=>{
    try{
      const j=JSON.parse(rd.result);
      if(!j.steps||!j.projects)throw 0;
      S=j;save();renderAll();toast("Progress imported");
    }catch(_){toast("Import failed — not a ledger file")}
  };
  rd.readAsText(f);
  e.target.value="";
});
$("btnReset").addEventListener("click",()=>$("dlgReset").showModal());
$("resetNo").addEventListener("click",()=>$("dlgReset").close());
$("resetYes").addEventListener("click",()=>{S=blankState();save();renderAll();$("dlgReset").close();toast("Ledger reset")});
/* ═══════ Boot ═════ */
load();renderAll();
if(!S.start)setTimeout(openStart,400);
