
const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const stores = ["Bremen-1","Hamburg-1","Frankfurt-1","Cologne-1","Munich-1","Stuttgart-1"];
const categories = ["Electronics","Apparel","Groceries","Home"];
const answerKey = { q1:"Munich-1", q2:"Electronics", q3:"Hamburg-1", q4:"Oct", q5:"Groceries" };

const tasks = [
  {id:"q1", title:"Task 1 — Lookup", question:"Which store had the highest total revenue in Q3 (July, August, September)?", options:stores},
  {id:"q2", title:"Task 2 — Comparison", question:"Which product category showed the largest percentage decline in units sold between January and December?", options:categories},
  {id:"q3", title:"Task 3 — Multi-criteria decision", question:"Management wants to invest additional inventory in the store that has BOTH above-average annual revenue growth (January → December) AND above-average gross margin. Which store should receive the investment?", options:stores},
  {id:"q4", title:"Task 4 — Outlier detection", question:"In which month did Bremen-1 experience an unusual inventory spike in the Groceries category (more than twice its average monthly Groceries inventory)?", options:months},
  {id:"q5", title:"Task 5 — Recommendation", question:"Based on full-year gross margin, which product category should management deprioritize?", options:categories}
];

const state = {
  page: "welcome",
  condition: null,
  participant: `P${Date.now()}${Math.floor(Math.random()*1000)}`,
  controls: {},
  answers: {},
  times: {},
  cognitive: {},
  manipulation: {},
  feedback: "",
  taskOrder: shuffle([...tasks]),
  taskIndex: 0,
  pageStart: null
};

function $(id){ return document.getElementById(id); }
function fmtEuro(n){ return new Intl.NumberFormat('en-US').format(Math.round(n)); }
function sum(arr, fn){ return arr.reduce((a,x)=>a+(fn?fn(x):x),0); }
function groupBy(arr, keyFn){ return arr.reduce((m,x)=>{const k=keyFn(x); (m[k] ||= []).push(x); return m;},{}); }
function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]];} return a; }
function getParam(name){ return new URLSearchParams(location.search).get(name); }
function setProgress(pct){ return `<div class="progress"><div style="width:${pct}%"></div></div>`; }
function setBadge(){
  const names = {A:"Condition A · Excel table", B:"Condition B · Static dashboard", C:"Condition C · Guided dashboard"};
  $("conditionBadge").textContent = state.condition ? names[state.condition] : "Prototype";
}
function render(html){ $("app").innerHTML = html; setBadge(); }
function startTimer(){ state.pageStart = performance.now(); }
function stopTimer(id){ if(state.pageStart){ state.times[id] = Math.round((performance.now()-state.pageStart)/1000); state.pageStart=null; } }

function decideCondition(){
  const forced = (getParam('condition') || '').toUpperCase();
  if(["A","B","C"].includes(forced)) return forced;
  return ["A","B","C"][Math.floor(Math.random()*3)];
}

function welcome(){
  render(`${setProgress(5)}
    <section class="card info">
      <h2>Welcome</h2>
      <p>You are invited to participate in a short study about how different data presentation formats influence operational decision-making.</p>
      <p>You will review a fictional retail dataset from <strong>RegioMart</strong> and answer five decision-making questions. Please answer as quickly and accurately as you can.</p>
      <p class="small">This prototype randomly assigns participants to one of three formats: Excel table, static dashboard, or guided dashboard.</p>
    </section>
    <section class="card">
      <label><input type="checkbox" id="consent"> I understand the task and agree to participate.</label>
    </section>
    <div class="actions"><button onclick="goControls()">Continue</button></div>`);
}
function goControls(){ if(!$("consent").checked){alert("Please confirm consent before continuing.");return;} state.condition = decideCondition(); controls(); }

function controls(){
  render(`${setProgress(12)}<h2>Background Questions</h2><p class="small">These questions help us control for previous experience with data tools.</p>
  <div class="grid">
    <div><label>Age</label><input id="age" type="number" min="16" max="90" placeholder="e.g., 27"></div>
    <div><label>Highest completed education</label><select id="education"><option value="">Select</option><option>Secondary school</option><option>Vocational training</option><option>Bachelor's</option><option>Master's</option><option>Doctorate</option><option>Other</option></select></div>
    <div><label>Full-time work experience</label><select id="workexp"><option value="">Select</option><option>None</option><option>Less than 1 year</option><option>1–3 years</option><option>4–7 years</option><option>8 or more years</option></select></div>
    <div><label>Excel proficiency (1 = none, 7 = expert)</label><input id="excel" type="range" min="1" max="7" value="4" oninput="excelv.textContent=this.value"><span id="excelv">4</span></div>
    <div><label>Dashboard use frequency</label><select id="dashfreq"><option value="">Select</option><option>Never</option><option>Rarely</option><option>Monthly</option><option>Weekly</option><option>Daily</option></select></div>
    <div><label>Data-analysis experience (1 = none, 7 = very experienced)</label><input id="dataexp" type="range" min="1" max="7" value="4" oninput="dataexpv.textContent=this.value"><span id="dataexpv">4</span></div>
  </div>
  <div><label>Color-vision deficiency</label><select id="colorvision"><option value="">Select</option><option>No</option><option>Yes</option><option>Prefer not to say</option></select></div>
  <div class="actions"><button onclick="saveControls()">Continue</button></div>`);
}
function saveControls(){
  state.controls = {
    age: $("age").value, education: $("education").value, workexp: $("workexp").value,
    excel: $("excel").value, dashfreq: $("dashfreq").value, dataexp: $("dataexp").value, colorvision: $("colorvision").value
  };
  instructions();
}

function instructions(){
  const txt = {
    A: "You are reviewing one year of sales data as a read-only Excel-style table. You can scroll through the table, but you cannot sort, filter, or use formulas.",
    B: "You are reviewing one year of sales data as a static dashboard. The dashboard shows charts and key figures, but you cannot click or filter it.",
    C: "You are reviewing one year of sales data as a guided dashboard. It has the same charts as the static dashboard, but organized into simple tabs. There are no complex filters."
  }[state.condition];
  render(`${setProgress(20)}<h2>Instructions</h2>
  <section class="card info"><p>${txt}</p><p>You will answer five questions. Each question appears on its own page. You cannot go back. Please work quickly and accurately.</p></section>
  <section class="card warning"><strong>Practice example:</strong> Imagine a store sold 100 units in January and 120 in February. If asked which month had higher units sold, the answer is February.</section>
  <div class="actions"><button onclick="practiceCheck()">Continue to practice check</button></div>`);
}
function practiceCheck(){
  render(`${setProgress(24)}<h2>Comprehension Check</h2>
  <p>Practice example: Store A revenue is €10,000 and Store B revenue is €12,000.</p>
  <label>Which store has higher revenue?</label>
  <select id="practice"><option value="">Select</option><option>Store A</option><option>Store B</option></select>
  <div class="actions"><button onclick="checkPractice()">Start tasks</button></div>`);
}
function checkPractice(){ if($("practice").value!=="Store B"){alert("Please read the example carefully. The correct answer is Store B.");return;} state.taskIndex=0; taskPage(); }

function tableView(){
  const rows = REGIOMART_DATA.map(r=>`<tr><td class="left">${r.Store}</td><td class="left">${r.Region}</td><td class="left">${r.Month}</td><td class="left">${r.ProductCategory}</td><td>${fmtEuro(r.UnitsSold)}</td><td>${fmtEuro(r.Revenue)}</td><td>${fmtEuro(r.Costs)}</td><td>${fmtEuro(r.Inventory)}</td></tr>`).join('');
  return `<div class="small">RegioMart data — 288 rows. Scroll to view all entries. Read-only.</div><div class="table-wrap"><table><thead><tr><th>Store</th><th>Region</th><th>Month</th><th>Product Category</th><th>Units Sold</th><th>Revenue (€)</th><th>Costs (€)</th><th>Inventory</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

function metrics(){
  const q3 = REGIOMART_DATA.filter(r=>["Jul","Aug","Sep"].includes(r.Month));
  const q3Rev = Object.entries(groupBy(q3, r=>r.Store)).map(([k,v])=>({label:k,value:sum(v,r=>r.Revenue)})).sort((a,b)=>b.value-a.value);
  const jan = REGIOMART_DATA.filter(r=>r.Month==='Jan');
  const dec = REGIOMART_DATA.filter(r=>r.Month==='Dec');
  const janCat = groupBy(jan, r=>r.ProductCategory), decCat=groupBy(dec, r=>r.ProductCategory);
  const decline = categories.map(c=>({label:c,value:((sum(decCat[c],r=>r.UnitsSold)-sum(janCat[c],r=>r.UnitsSold))/sum(janCat[c],r=>r.UnitsSold))*100})).sort((a,b)=>a.value-b.value);
  const annualStore = Object.entries(groupBy(REGIOMART_DATA,r=>r.Store)).map(([s,rows])=>{
    const rev=sum(rows,r=>r.Revenue), costs=sum(rows,r=>r.Costs);
    const janRev=sum(rows.filter(r=>r.Month==='Jan'),r=>r.Revenue), decRev=sum(rows.filter(r=>r.Month==='Dec'),r=>r.Revenue);
    return {label:s, growth:(decRev-janRev)/janRev*100, margin:(rev-costs)/rev*100};
  });
  const bremGro = REGIOMART_DATA.filter(r=>r.Store==='Bremen-1' && r.ProductCategory==='Groceries').map(r=>({label:r.Month,value:r.Inventory}));
  const catMargin = Object.entries(groupBy(REGIOMART_DATA,r=>r.ProductCategory)).map(([c,rows])=>{const rev=sum(rows,r=>r.Revenue), costs=sum(rows,r=>r.Costs);return {label:c,value:(rev-costs)/rev*100}}).sort((a,b)=>a.value-b.value);
  return {q3Rev, decline, annualStore, bremGro, catMargin};
}
function bars(items, suffix='', invert=false){
  const vals=items.map(x=>Math.abs(x.value)); const max=Math.max(...vals);
  return items.map(x=>`<div class="bar-row"><div>${x.label}</div><div class="bar-track"><div class="bar" style="width:${Math.max(4, Math.abs(x.value)/max*100)}%"></div></div><div>${x.value<0?x.value.toFixed(1):fmtEuro(x.value)}${suffix}</div></div>`).join('');
}
function lineChart(items){
  const max=Math.max(...items.map(x=>x.value)), min=Math.min(...items.map(x=>x.value));
  const pts=items.map((x,i)=>({x:i/(items.length-1)*100,y:(1-(x.value-min)/(max-min))*88+5, label:x.label, value:x.value}));
  let html='<div class="line-chart">';
  for(let i=0;i<pts.length-1;i++){ const p=pts[i], q=pts[i+1]; const dx=q.x-p.x, dy=q.y-p.y; const len=Math.sqrt(dx*dx+dy*dy); const ang=Math.atan2(dy,dx)*180/Math.PI; html+=`<div class="line-seg" style="left:${p.x}%;top:${p.y}%;width:${len}%;transform:rotate(${ang}deg)"></div>`; }
  pts.forEach(p=>html+=`<div class="point" title="${p.label}: ${p.value}" style="left:${p.x}%;top:${p.y}%"></div>`);
  html+='</div><div class="small">Months: Jan → Dec</div>'; return html;
}
function staticDashboard(){
  const m=metrics();
  return `<div class="dashboard">
    <div class="chart-card"><div class="chart-title">Q3 Revenue by Store</div><div class="chart-sub">July–September total revenue</div>${bars(m.q3Rev,'')}</div>
    <div class="chart-card"><div class="chart-title">Jan → Dec Unit Change by Category</div><div class="chart-sub">Percentage change; more negative = stronger decline</div>${bars(m.decline,'%')}</div>
    <div class="chart-card"><div class="chart-title">Store Growth and Gross Margin</div><div class="chart-sub">Used for multi-criteria operational investment decision</div>${m.annualStore.map(x=>`<div class="bar-row"><div>${x.label}</div><div class="small">Growth ${x.growth.toFixed(1)}% · Margin ${x.margin.toFixed(1)}%</div><div></div></div>`).join('')}</div>
    <div class="chart-card"><div class="chart-title">Bremen-1 Groceries Inventory</div><div class="chart-sub">Monthly inventory level</div>${lineChart(m.bremGro)}</div>
    <div class="chart-card"><div class="chart-title">Gross Margin by Category</div><div class="chart-sub">Full-year margin</div>${bars(m.catMargin,'%')}</div>
    <div class="chart-card"><div class="chart-title">Dataset Coverage</div><div class="kpi-grid"><div class="kpi"><span>Stores</span><strong>6</strong></div><div class="kpi"><span>Regions</span><strong>3</strong></div><div class="kpi"><span>Months</span><strong>12</strong></div><div class="kpi"><span>Rows</span><strong>288</strong></div></div></div>
  </div>`;
}
function guidedDashboard(tab='revenue'){
  let content=''; const m=metrics();
  if(tab==='revenue') content=`<div class="dashboard"><div class="chart-card"><div class="chart-title">Q3 Revenue by Store</div><div class="chart-sub">July–September total revenue</div>${bars(m.q3Rev,'')}</div><div class="chart-card"><div class="chart-title">Dataset Coverage</div><div class="kpi-grid"><div class="kpi"><span>Stores</span><strong>6</strong></div><div class="kpi"><span>Regions</span><strong>3</strong></div><div class="kpi"><span>Months</span><strong>12</strong></div><div class="kpi"><span>Rows</span><strong>288</strong></div></div></div></div>`;
  if(tab==='trends') content=`<div class="dashboard"><div class="chart-card"><div class="chart-title">Jan → Dec Unit Change by Category</div><div class="chart-sub">Percentage change; more negative = stronger decline</div>${bars(m.decline,'%')}</div><div class="chart-card"><div class="chart-title">Store Growth and Gross Margin</div><div class="chart-sub">Used for multi-criteria operational investment decision</div>${m.annualStore.map(x=>`<div class="bar-row"><div>${x.label}</div><div class="small">Growth ${x.growth.toFixed(1)}% · Margin ${x.margin.toFixed(1)}%</div><div></div></div>`).join('')}</div></div>`;
  if(tab==='inventory') content=`<div class="dashboard"><div class="chart-card"><div class="chart-title">Bremen-1 Groceries Inventory</div><div class="chart-sub">Monthly inventory level</div>${lineChart(m.bremGro)}</div><div class="chart-card"><div class="chart-title">Gross Margin by Category</div><div class="chart-sub">Full-year margin</div>${bars(m.catMargin,'%')}</div></div>`;
  return `<div class="tabs"><button class="tab ${tab==='revenue'?'active':''}" onclick="rerenderGuided('revenue')">Revenue overview</button><button class="tab ${tab==='trends'?'active':''}" onclick="rerenderGuided('trends')">Trends & margin</button><button class="tab ${tab==='inventory'?'active':''}" onclick="rerenderGuided('inventory')">Inventory & category margin</button></div><div id="guidedContent">${content}</div>`;
}
function rerenderGuided(tab){ $("guidedContent").outerHTML = `<div id="guidedContent">${guidedDashboard(tab).replace(/^.*<div id="guidedContent">|<\/div>$/g,'')}</div>`; }
function dataDisplay(){ if(state.condition==='A') return tableView(); if(state.condition==='B') return staticDashboard(); return guidedDashboard('revenue'); }

function taskPage(){
  const t = state.taskOrder[state.taskIndex];
  render(`${setProgress(30 + state.taskIndex*10)}<div class="task-layout"><section>${dataDisplay()}</section><aside class="question-box"><p class="small">Question ${state.taskIndex+1} of 5</p><h2>${t.title}</h2><p>${t.question}</p><div class="radio-group">${t.options.map(o=>`<label><input type="radio" name="answer" value="${o}">${o}</label>`).join('')}</div><div class="actions"><button onclick="submitTask()">Submit answer</button></div></aside></div>`);
  startTimer();
}
function submitTask(){
  const t=state.taskOrder[state.taskIndex]; const selected=document.querySelector('input[name="answer"]:checked');
  if(!selected){ alert("Please select an answer."); return; }
  stopTimer(t.id); state.answers[t.id]=selected.value; state.taskIndex++;
  if(state.taskIndex<state.taskOrder.length) taskPage(); else cognitiveLoad();
}

function cognitiveLoad(){
  const items=[
    ["mental","The task required a lot of mental effort."],
    ["difficulty","I found the task difficult."],
    ["pressure","I felt rushed while answering the questions."],
    ["effort","I had to work hard to find the information I needed."],
    ["frustration","I felt frustrated while completing the task."],
    ["confidence","I am confident my answers were correct."]
  ];
  render(`${setProgress(82)}<h2>Cognitive Load Questions</h2><p class="small">1 = strongly disagree / very low, 7 = strongly agree / very high</p><div class="likert-table">${items.map(([id,text])=>`<div class="likert-line"><span>${text}</span>${[1,2,3,4,5,6,7].map(n=>`<label><input type="radio" name="${id}" value="${n}">${n}</label>`).join('')}</div>`).join('')}</div><div class="actions"><button onclick="saveCognitive()">Continue</button></div>`);
}
function saveCognitive(){
  for(const id of ["mental","difficulty","pressure","effort","frustration","confidence"]){ const el=document.querySelector(`input[name="${id}"]:checked`); if(!el){alert("Please answer all cognitive load questions.");return;} state.cognitive[id]=el.value; }
  manipulationCheck();
}
function manipulationCheck(){
  render(`${setProgress(90)}<h2>Final Questions</h2><div class="grid"><div><label>Which format did you use?</label><select id="seen"><option value="">Select</option><option>Excel/table</option><option>Static dashboard</option><option>Guided dashboard</option><option>I am not sure</option></select></div><div><label>How interactive was the format you used? (1 = not interactive, 7 = very interactive)</label><input id="interact" type="range" min="1" max="7" value="4" oninput="interactv.textContent=this.value"><span id="interactv">4</span></div></div><label>Optional feedback</label><textarea id="feedback" rows="4" placeholder="Any problems or comments?"></textarea><div class="actions"><button onclick="finish()">Finish</button></div>`);
}
function finish(){
  state.manipulation={seen:$("seen").value, interactivity:$("interact").value}; state.feedback=$("feedback").value;
  const result=makeResult();
  localStorage.setItem('regiomart_last_result', JSON.stringify(result));
  render(`${setProgress(100)}<h2>Thank you!</h2><section class="card info"><p>Your answers have been recorded in this browser for prototype/demo purposes.</p><p><strong>Important:</strong> This static prototype does not send data to the research team automatically. Use the download button for testing, or implement the study in SoSci Survey / connect a backend for real data collection.</p></section><div class="actions"><button onclick="downloadCSV()">Download result as CSV</button><button class="secondary" onclick="location.reload()">Restart demo</button></div><h3>Preview of stored result</h3><div class="result-box">${JSON.stringify(result,null,2)}</div>`);
}
function makeResult(){
  const correct={}; let score=0; for(const t of tasks){ correct[t.id]= state.answers[t.id]===answerKey[t.id] ? 1 : 0; score+=correct[t.id]; }
  return {participant:state.participant, condition:state.condition, timestamp:new Date().toISOString(), ...state.controls, ...Object.fromEntries(tasks.map(t=>[`${t.id}_answer`, state.answers[t.id]||''])), ...Object.fromEntries(tasks.map(t=>[`${t.id}_correct`, correct[t.id]])), accuracy:score/5, ...Object.fromEntries(tasks.map(t=>[`${t.id}_time_seconds`, state.times[t.id]||''])), ...state.cognitive, format_seen:state.manipulation.seen, interactivity_rating:state.manipulation.interactivity, feedback:state.feedback};
}
function downloadCSV(){
  const r=makeResult(); const keys=Object.keys(r); const csv=keys.join(',')+'\n'+keys.map(k=>`"${String(r[k]).replaceAll('"','""')}"`).join(',');
  const blob=new Blob([csv],{type:'text/csv'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`regiomart_result_${r.participant}.csv`; a.click(); URL.revokeObjectURL(url);
}

welcome();
