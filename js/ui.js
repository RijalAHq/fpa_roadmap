/* DOM helper + toast. */
/* ═══════ Render ═════ */
const $=id=>document.getElementById(id);

/* Toast */
let toastT;
function toast(msg){const t=$("toast");t.textContent=msg;t.classList.add("show");clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove("show"),1800)}
