/* Rendering. One renderX() per section; renderAll() orchestrates. */
function renderAll(){renderDash();renderWeeks();renderRegister();renderProjects();renderWeekly();renderFoot()}

function renderDash(){
  const done=STEPS.filter(s=>S.steps[s.n].status==="Completed").length;
  const ip=STEPS.filter(s=>S.steps[s.n].status==="In Progress").length;
  const pDone=PROJECTS.filter(p=>S.projects[p.i].status==="Completed").length;
  const pct=Math.round(done/STEPS.length*100);
  $("pctMain").textContent=pct;
  $("pctSub").textContent=done+" of "+STEPS.length+" steps marked";
  $("trackFill").style.width=pct+"%";
  $("trackbar").setAttribute("aria-valuenow",pct);
  $("stSteps").innerHTML=done+"<small>/26</small>";
  $("stProj").innerHTML=pDone+"<small>/18</small>";

  const cw=currentWeek();
  if(cw){
    $("stWeek").textContent=cw+" / 36";
    const ph=RM.PHASES[WEEKS[cw-1][2]];
    $("stPhase").textContent="P"+WEEKS[cw-1][2]+" · "+ph;
    $("asOf").textContent="Week "+cw+" of 36 · began "+fmtDate(S.start);
    $("barLabel").textContent="Week "+cw+" of 36";
  }else if(S.start){
    $("stWeek").textContent="36+";
    $("stPhase").textContent="P7 · Career Preparation";
    $("asOf").textContent="Programme window closed · began "+fmtDate(S.start);
    $("barLabel").textContent="Past week 36";
  }else{
    $("stWeek").textContent="—";
    $("stPhase").textContent="—";
    $("asOf").textContent="No start date set";
    $("barLabel").textContent="36-week timeline";
  }

  // next task
  const box=$("nextTaskBox");
  const nxt=STEPS.find(s=>S.steps[s.n].status!=="Completed");
  if(!nxt){
    box.innerHTML='<div class="next-task">Roadmap complete.</div><div class="next-note">All 26 steps marked. Update your resume and run the job pipeline.</div>';
  }else{
    const st=S.steps[nxt.n].status;
    const inWk=cw&&nxt.weeks.includes(cw);
    box.innerHTML=
      '<div class="next-task">'+nxt.title+
      '<span class="meta">Step '+nxt.n+' · Week '+nxt.wk+' · '+RM.PHASES[nxt.phase]+(st==="In Progress"?" · in progress":"")+'</span></div>'+
      '<div class="next-note">'+(inWk?"Falls inside the current week.":cw?"Ahead of the current week.":"")+' '+(nxt.goal||"")+'</div>';
  }

  // run row
  const rr=$("runRow");
  const links=[];
  if(S.start){const end=new Date(new Date(S.start+"T00:00:00").getTime()+35*7*86400000+6*86400000);links.push('<span class="item">Ends <b>'+fmtDate(end.toISOString().slice(0,10))+'</b></span>')}
  links.push('<span class="item"><a href="#register">Steps</a></span><span class="item"><a href="#weekview">Weekly view</a></span>');
  rr.innerHTML=links.join("");
}

function renderWeeks(){
  const cw=currentWeek();
  const g=$("weekgrid");g.innerHTML="";
  for(const [n,f] of WEEKS){
    const d=document.createElement("button");
    d.type="button";d.className="wk";
    if(weekDone(n))d.classList.add("done");
    if(weekInProgress(n))d.setAttribute("data-status","ip");
    if(cw===n)d.classList.add("now");
    d.innerHTML='<span class="mark">✕</span><span class="n">W'+String(n).padStart(2,"0")+'</span><span class="f">'+f+'</span>';
    d.setAttribute("aria-label","Week "+n+": "+f+(weekDone(n)?" — completed":""));
    d.addEventListener("click",()=>{const t=document.querySelector('.reg-row[data-step="'+(stepByWeek(n)[0]||{n:1}).n+'"]');if(t){t.scrollIntoView({behavior:"smooth",block:"start"});t.classList.add("open");const det=t.querySelector(".reg-main");if(det)det.setAttribute("aria-expanded","true")}});
    g.appendChild(d);
  }
}

function renderRegister(){
  const r=$("register");r.innerHTML="";
  let lastPhase=-1;
  for(const s of STEPS){
    if(s.phase!==lastPhase){
      lastPhase=s.phase;
      const ph=document.createElement("div");
      ph.style.cssText="padding:9px 14px;background:var(--ink);color:var(--paper);font-family:var(--font-mono);font-size:10px;letter-spacing:.18em;text-transform:uppercase";
      ph.textContent="Phase "+s.phase+" — "+RM.PHASES[s.phase];
      r.appendChild(ph);
    }
    const st=S.steps[s.n];
    const row=document.createElement("div");
    row.className="reg-row"+(st.status==="Completed"?" done":"");
    row.setAttribute("data-status",st.status==="Completed"?"done":st.status==="In Progress"?"ip":"");
    row.setAttribute("data-step",s.n);
    const learnHtml=s.learn.length?'<div class="dcol"><h4>Learn</h4><ul>'+s.learn.map(x=>"<li>"+x+"</li>").join("")+'</ul></div>':"";
    const pracHtml='<div class="dcol"><h4>Practice</h4><ul>'+s.practice.map(x=>"<li>"+x+"</li>").join("")+'</ul><div class="done-when"><b>Completed when</b>'+s.done+"</div></div>";
    row.innerHTML=
      '<div class="reg-main" role="button" tabindex="0" aria-expanded="false">'+
        '<div class="reg-no">'+String(s.n).padStart(2,"0")+'<span class="wkl">W'+s.wk+"</span></div>"+
        '<div class="reg-title"><span class="t">'+s.title+'</span><span class="p">'+RM.PHASES[s.phase]+"</span></div>"+
        '<div class="reg-goal"><span>'+s.goal+'</span><span class="sep">→</span><span class="out">'+s.output+"</span></div>"+
        '<div class="reg-act"><select class="stamp" aria-label="Status for step '+s.n+'">'+
          ["Not Started","In Progress","Completed"].map(o=>'<option'+(o===st.status?" selected":"")+">"+o+"</option>").join("")+
        '</select><span class="caret">▶</span></div>'+
      "</div>"+
      '<div class="reg-detail"><div class="reg-detail-in">'+learnHtml+pracHtml+
        '<div class="notes-wrap"><label for="notes-'+s.n+'">Notes</label><textarea class="notes" id="notes-'+s.n+'" placeholder="Insights, blockers, evidence…">'+st.notes+"</textarea></div>"+
      "</div></div>";
    const main=row.querySelector(".reg-main");
    const toggle=()=>{row.classList.toggle("open");main.setAttribute("aria-expanded",row.classList.contains("open"))};
    main.addEventListener("click",e=>{if(e.target.closest(".stamp"))return;toggle()});
    main.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){if(e.target.closest(".stamp"))return;e.preventDefault();toggle()}});
    const sel=row.querySelector(".stamp");
    sel.addEventListener("change",()=>{
      st.status=sel.value;save();renderAll();
      toast("Step "+s.n+" — "+sel.value);
    });
    sel.addEventListener("click",e=>e.stopPropagation());
    const ta=row.querySelector(".notes");
    ta.addEventListener("input",()=>{st.notes=ta.value;save()});
    r.appendChild(row);
  }
  const done=STEPS.filter(s=>S.steps[s.n].status==="Completed").length;
  $("regCount").textContent=done+" / 26 steps completed";
}

function renderProjects(){
  const b=$("projBody");b.innerHTML="";
  for(const p of PROJECTS){
    const ps=S.projects[p.i];
    const tr=document.createElement("tr");
    if(ps.status==="Completed")tr.className="pdone";
    tr.innerHTML=
      '<td class="pname">'+p.name+'<span class="ph">Phase '+p.phase+" · Step "+p.step+"</span></td>"+
      '<td><select class="stamp" data-p="'+p.i+'" aria-label="Status for '+p.name+'">'+
        ["Not Started","In Progress","Completed"].map(o=>'<option'+(o===ps.status?" selected":"")+">"+o+"</option>").join("")+"</select></td>"+
      '<td><div class="pprog"><span class="pbar"><i style="width:'+ps.progress+'%"></i></span><span class="pnum">'+ps.progress+"%</span></div></td>"+
      '<td><input type="date" data-p="'+p.i+'" data-f="start" value="'+ps.start+'"></td>'+
      '<td><input type="date" data-p="'+p.i+'" data-f="target" value="'+ps.target+'"></td>'+
      '<td><input type="date" data-p="'+p.i+'" data-f="done" value="'+ps.done+'"></td>'+
      '<td><input type="url" data-p="'+p.i+'" data-f="link" placeholder="github.com/…" value="'+(ps.link||"").replace(/"/g,"&quot;")+'"></td>';
    b.appendChild(tr);
  }
  b.querySelectorAll("select.stamp").forEach(sel=>{
    sel.addEventListener("change",()=>{
      const i=+sel.dataset.p;const ps=S.projects[i];
      ps.status=sel.value;
      ps.progress=sel.value==="Completed"?100:sel.value==="Not Started"?0:Math.max(ps.progress,50);
      if(sel.value==="Completed"&&!ps.done)ps.done=new Date().toISOString().slice(0,10);
      // sync step
      const p=PROJECTS.find(x=>x.i===i);const st=S.steps[p.step];
      if(sel.value==="Completed"&&st.status!=="Completed"){st.status="Completed"}
      else if(sel.value!=="Completed"&&st.status==="Completed"){st.status="In Progress"}
      save();renderAll();toast(p.name+" — "+sel.value);
    });
  });
  b.querySelectorAll("input").forEach(inp=>{
    inp.addEventListener("change",()=>{
      const i=+inp.dataset.p;const f=inp.dataset.f;
      S.projects[i][f]=f==="link"?inp.value.trim():inp.value;
      if(f==="done"&&inp.value){S.projects[i].status="Completed";S.projects[i].progress=100}
      save();renderAll();
    });
  });
  const done=PROJECTS.filter(p=>S.projects[p.i].status==="Completed").length;
  $("projCount").textContent=done+" / 18 portfolio outputs";
}

function renderWeekly(){
  const cw=currentWeek();
  const g=$("wvGrid");g.innerHTML="";
  for(const [n,f,ph] of WEEKS){
    const ss=stepByWeek(n);
    const cell=document.createElement("div");
    cell.className="wv-cell"+(cw===n?" now":"")+(weekDone(n)?" done":"");
    cell.innerHTML=
      '<div class="wv-top"><span class="wn">WEEK '+n+'</span><span class="wf">P'+ph+' · '+f+'</span></div>'+
      '<ul class="wv-steps">'+ss.map(s=>'<li class="'+(S.steps[s.n].status==="Completed"?"done":"")+'"><span class="sn">'+String(s.n).padStart(2,"0")+'</span>'+s.title+'</li>').join("")+'</ul>'+
      '<div class="wv-out"><b>Deliverable:</b> '+ss.map(s=>s.output).join(" · ")+'</div>';
    g.appendChild(cell);
  }
  $("wvCount").textContent=cw?("Current: week "+cw):"36 weeks";
}

function renderFoot(){
  $("ftData").textContent="Data lives in this browser · export before switching devices";
}
