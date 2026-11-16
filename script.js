const DEMO_TODAY=new Date("2026-11-16T12:00:00Z"),DAY=864e5,DEMO_NOW="11:00";
const addDays=(d,n)=>new Date(d.getTime()+n*DAY),dateOnly=d=>d.toISOString().slice(0,10),TODAY=dateOnly(DEMO_TODAY);
const STAGES=["result_recorded","patient_notified","patient_acknowledged","clinician_review","referral_sent","referral_accepted","appointment_scheduled","attended","closed"];
const RULES={
result_recorded:{days:3,label:"Result recorded",action:"Notify patient"},
patient_notified:{days:2,label:"Patient notified",action:"Get patient acknowledgement"},
patient_acknowledged:{days:5,label:"Acknowledged",action:"Start clinician review"},
clinician_review:{days:5,label:"Clinician review",action:"Complete review, send referral"},
referral_sent:{days:3,label:"Referral sent",action:"Referral acceptance"},
referral_accepted:{days:7,label:"Referral accepted",action:"Schedule appointment"},
appointment_scheduled:{days:7,label:"Appointment set",action:"Patient attends appointment"},
attended:{days:3,label:"Attended",action:"Document closure"},
closed:{days:0,label:"Closed",action:"None"}};
function mulberry32(a){return function(){a|=0;a=(a+0x6D2B79F5)|0;let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296}}
const rand=mulberry32(2026),pick=a=>a[Math.floor(rand()*a.length)];
const OWNERS=[{name:"Aisha Rahman, care coordinator",role:"Care coordinator"},{name:"Joseph Mathew, care coordinator",role:"Care coordinator"},{name:"Reem Al Ketbi, care coordinator",role:"Care coordinator"}];
function referralFor(i,rej){if(i<4)return"not_started";if(i===4)return rej?"rejected":"sent";if(i===5)return"accepted";if(i===6)return"appointment_pending";return"completed"}
function makeCase(k){
const n=String(k+1).padStart(3,"0"),closed=rand()<.2,stage=closed?"closed":pick(STAGES.slice(0,8)),i=STAGES.indexOf(stage),r=RULES[stage];
let entered=null,due=null,scr;
if(closed)scr=addDays(DEMO_TODAY,-(10+Math.floor(rand()*30)));
else{const d=Math.floor(rand()*(r.days*1.6+1));entered=addDays(DEMO_TODAY,-d);due=addDays(entered,r.days);scr=addDays(entered,-(i*2+1))}
const owner=!closed&&rand()<.08?null:pick(OWNERS),rej=stage==="referral_sent"&&rand()<.25,messages=[];
if(i>=1){const s=addDays(scr,1);messages.push({sentAt:dateOnly(s),approvedBy:"Nurse Example B",acknowledgedAt:i>=2?dateOnly(addDays(s,1)):null})}
return{id:"CASE-"+n,patient:{name:"Demo Patient "+n,age:45+Math.floor(rand()*35),language:pick(["en","ml"])},
screening:{type:"FIT",result:"positive",date:dateOnly(scr)},stage,stageEnteredAt:entered?dateOnly(entered):null,dueDate:due?dateOnly(due):null,owner,messages,consultNotes:[],
referral:{status:referralFor(i,rej)},
closure:closed?{evidence:"Follow-up completed and report filed (demo)",decidedBy:"Treating doctor (demo)",alternativePlan:null}:{evidence:null,decidedBy:null,alternativePlan:null}}}
const cases=Array.from({length:200},(_,i)=>makeCase(i));
const KEY="careconnect-demo-v4";
function save(){try{localStorage.setItem(KEY,JSON.stringify(cases))}catch(e){}}
try{const s=JSON.parse(localStorage.getItem(KEY)||"null");if(Array.isArray(s)&&s.length>=cases.length)cases.splice(0,cases.length,...s)}catch(e){}
const DEPTS={
gi:{n:'Gastroenterology',room:'GI Clinic, Room 201',docs:['Dr. Hana Farouk, MD, DM (Gastroenterology)','Dr. Arun Menon, MD, DM (Gastroenterology)']},
endo:{n:'Endocrinology',room:'Diabetes and Endocrine Clinic, Room 118',docs:['Dr. Salim Rahman, MD, DM (Endocrinology)','Dr. Leena Thomas, MD, DM (Endocrinology)']},
card:{n:'Cardiology',room:'Heart Clinic, Room 310',docs:['Dr. Omar Haddad, MD, DM (Cardiology)','Dr. Priya Nair, MD, DM (Cardiology)']},
ortho:{n:'Orthopaedics',room:'Bone and Joint Clinic, Room 140',docs:['Dr. Khalid Mansoor, MS (Orthopaedics)','Dr. Divya Krishnan, MS, DNB (Orthopaedics)']},
derm:{n:'Dermatology',room:'Skin Clinic, Room 122',docs:['Dr. Noor Al Hashimi, MD (Dermatology)','Dr. Rahul Varma, MD (Dermatology)']},
ped:{n:'Paediatrics',room:'Childrens Clinic, Room 105',docs:['Dr. Maryam Suleiman, MD (Paediatrics)','Dr. Anjali Pillai, MD, DCH (Paediatrics)']},
gyn:{n:'Obstetrics and Gynaecology',room:'Womens Clinic, Room 230',docs:['Dr. Fatima Zayed, MD (Obstetrics and Gynaecology)','Dr. Sreeja Kumar, MS (Obstetrics and Gynaecology)']},
nephro:{n:'Nephrology',room:'Kidney Clinic, Room 215',docs:['Dr. Yusuf Karim, MD, DM (Nephrology)','Dr. Meera Iyer, MD, DM (Nephrology)']},
pulm:{n:'Pulmonology',room:'Chest Clinic, Room 160',docs:['Dr. Tariq Bashir, MD (Pulmonary Medicine)','Dr. Jacob Mathew, MD, DNB (Pulmonary Medicine)']},
eye:{n:'Ophthalmology',room:'Eye Clinic, Room 135',docs:['Dr. Layla Nasser, MS (Ophthalmology)','Dr. Vinod Das, MS (Ophthalmology)']},
hema:{n:'Haematology',room:'Blood Disorders Clinic, Room 222',docs:['Dr. Rania Aziz, MD, DM (Haematology)','Dr. Suresh Babu, MD, DM (Haematology)']},
onco:{n:'Oncology',room:'Cancer Care Clinic, Room 301',docs:['Dr. Sami Jaber, MD, DM (Medical Oncology)','Dr. Nisha George, MD, DM (Medical Oncology)']},
gen:{n:'General Medicine',room:'General Clinic, Room 101',docs:['Dr. Ibrahim Saeed, MD (Internal Medicine)','Dr. Latha Menon, MD (Internal Medicine)']}};
const SERV={Lab:'Laboratory, Ground floor, Counter 3',Ultrasound:'Radiology, Ultrasound room 2','X-ray':'Radiology, X-ray room 1',CT:'Radiology, CT room',MRI:'Radiology, MRI room',Endoscopy:'Endoscopy suite, Level 2',ECG:'Cardiac diagnostics, Room 105',Clinic:null};
const CONDS=['Positive stool blood test (FIT)|gi|Endoscopy','Hepatitis B screening positive|gi|Lab','Hepatitis C screening positive|gi|Lab','Fatty liver on ultrasound|gi|Ultrasound',
'High blood sugar (HbA1c)|endo|Lab','Abnormal thyroid test (TSH)|endo|Lab','Low vitamin D|endo|Lab','Pre-diabetes result|endo|Lab','Raised cholesterol|endo|Lab',
'High blood pressure reading|card|ECG','Abnormal ECG|card|ECG','High heart risk score|card|Lab','Irregular heart rhythm|card|ECG','Abnormal stress test|card|ECG',
'Low bone density|ortho|X-ray','Fracture seen on X-ray|ortho|X-ray','Suspected ligament injury on scan|ortho|MRI','Scoliosis on school screening|ortho|X-ray','Joint wear on X-ray|ortho|X-ray',
'Suspicious skin lesion|derm|Clinic','Atypical mole on skin check|derm|Clinic','Abnormal skin fungal test|derm|Lab',
'Abnormal newborn blood screen|ped|Lab','Child anaemia|ped|Lab','Growth below expected|ped|Clinic','Developmental delay flag|ped|Clinic','Failed newborn hearing screen|ped|Clinic',
'Abnormal cervical screening (HPV)|gyn|Clinic','High glucose in pregnancy screen|gyn|Lab','Abnormal antenatal scan|gyn|Ultrasound','Anaemia in pregnancy|gyn|Lab','Abnormal pelvic ultrasound|gyn|Ultrasound',
'Raised creatinine|nephro|Lab','Protein in urine|nephro|Lab','Low kidney filtration (eGFR)|nephro|Lab',
'Abnormal chest X-ray|pulm|CT','Lung nodule on CT|pulm|CT','Abnormal lung function test|pulm|Clinic','TB screening positive|pulm|Lab',
'Diabetic eye screening abnormal|eye|Clinic','Raised eye pressure|eye|Clinic','Child vision screening failed|eye|Clinic',
'Low haemoglobin|hema|Lab','Low vitamin B12|hema|Lab','Abnormal blood count|hema|Lab',
'Abnormal mammogram|onco|Ultrasound','Raised PSA|onco|Lab','Breast ultrasound abnormal|onco|Ultrasound','Polyps found at colonoscopy|onco|Endoscopy','Thyroid nodule on ultrasound|onco|Ultrasound'];
function condInfo(c){if(c.cond<0)return{name:c.screening.type,dept:DEPTS[c.deptKey],test:'Clinic',testRoom:null};const [name,d,test]=CONDS[c.cond].split('|');return{name,dept:DEPTS[d],test,testRoom:SERV[test]}}
const r2=mulberry32(77);
cases.forEach((c,i)=>{if(c.cond!==undefined)return;const k=Math.floor(r2()*CONDS.length),[name,d]=CONDS[k].split('|');
c.cond=k;c.screening.type=name;c.screening.result='needs follow-up';
if(d==='ped'||/Child|school/.test(name))c.patient.age=1+Math.floor(r2()*14);
c.doctor=DEPTS[d].docs[i%2]});
const isOpen=c=>c.stage!=="closed",isOver=c=>isOpen(c)&&c.dueDate<TODAY,isUn=c=>isOpen(c)&&!c.owner,isRej=c=>isOpen(c)&&c.referral.status==="rejected";
function canClose(c){return c.stage==="attended"&&!!c.closure.decidedBy&&!!(c.closure.alternativePlan||(c.closure.evidence&&c.care&&c.care.outcome))}
function advance(c){
if(c.stage==="closed")return{ok:false,reason:"Case is already closed"};
if(!c.owner)return{ok:false,reason:"Assign an owner first"};
if(c.referral.status==="rejected")return{ok:false,reason:"Referral was rejected. Re-refer before moving on"};
if(c.stage==="patient_notified"&&!(c.messages[0]&&c.messages[0].acknowledgedAt))return{ok:false,reason:"Waiting for patient acknowledgement"};
const nx=STAGES[STAGES.indexOf(c.stage)+1];
if(c.stage==='appointment_scheduled'&&needInterp(c)&&c.appointment&&!c.appointment.support)return{ok:false,reason:'Record whether the required sign-language interpreter or other communication support was arranged first'};
if(c.stage==='clinician_review'&&c.confirm&&c.confirm.required&&!c.confirm.result)return{ok:false,reason:'Record the confirmatory test result first'};
if(c.stage==='clinician_review'&&!(c.referral&&c.referral.to))return{ok:false,reason:'Send the referral to a receiving provider first (Referral section)'};
if(c.stage==='referral_sent'&&c.referral.status!=='accepted')return{ok:false,reason:'Waiting for the receiving provider’s response'};
if(nx==="closed"&&!canClose(c))return{ok:false,reason:"Closure needs a recorded care outcome (or an approved alternative plan), evidence and a named clinician"};
c.stage=nx;return{ok:true}}
function reRefer(c){if(c.referral.status!=="rejected")return;c.referral.status="sent";c.stageEnteredAt=TODAY;c.dueDate=dateOnly(addDays(DEMO_TODAY,RULES.referral_sent.days));c.consultNotes.push({at:TODAY,text:"Referral re-sent to another provider."})}
function moveNext(c){const r=advance(c);if(!r.ok)return r;
if(c.stage==="closed"){c.stageEnteredAt=null;c.dueDate=null}else{c.stageEnteredAt=TODAY;c.dueDate=dateOnly(addDays(DEMO_TODAY,RULES[c.stage].days))}
if(STAGES.indexOf(c.stage)>=STAGES.indexOf('appointment_scheduled'))c.referral.status=referralFor(STAGES.indexOf(c.stage),false);
if(c.stage==="patient_notified"&&!c.messages.length)c.messages.push({sentAt:TODAY,approvedBy:"Staff (demo)",acknowledgedAt:null});return r}
function ack(c){if(!c.messages.length)return;c.messages[0].acknowledgedAt=TODAY;if(c.stage==="patient_notified")moveNext(c)}
function flags(c){if(!isOpen(c))return[["Closed","ok"]];const f=[];if(needInterp(c))f.push(["Interpreter needed","warn"]);if(textOnly(c))f.push(["Text only, no voice","warn"]);if(isLate(c))f.push(["Late for appointment","bad"]);if(c.origin==='outside')f.push(["Outside patient","warn"]);if(c.urgent)f.push(["Patient asked for help","bad"]);if(taskOver(c))f.push(['Task overdue','bad']);if((c.responses||[]).some(r=>r.status==='open'))f.push(['Patient response pending','warn']);if(refOver(c))f.push(['Referral overdue','bad']);if(consultAttn(c))f.push(['Consultation needs action','bad']);if(isRej(c))f.push(["Referral rejected","bad"]);if(isUn(c))f.push(["Needs owner","warn"]);if(isOver(c))f.push(["Overdue","bad"]);if(!f.length)f.push(["On track","ok"]);return f}
function timeline(c){const cur=STAGES.indexOf(c.stage),m=c.messages[0],dt={result_recorded:c.screening.date,patient_notified:m&&m.sentAt,patient_acknowledged:m&&m.acknowledgedAt};
return STAGES.map((s,i)=>({label:RULES[s].label,state:(i<cur||(s==="closed"&&cur===i))?"done":(i===cur?"current":"todo"),date:i===cur&&c.dueDate?"due "+c.dueDate:(dt[s]||"")}))}
function patientMsg(c){const o=c.owner?c.owner.name:"Your care team";
return`Hello ${c.patient.name}. Your recent result (${c.screening.type}) needs a follow-up check. This is not a diagnosis. It means more checking is needed. ${o} will help arrange the next step, which is usually a visit for a further test. Please tap a button below so we know you have seen this message.`}
const $=id=>document.getElementById(id);
function el(tag,text,cls,parent){const e=document.createElement(tag);if(text)e.textContent=text;if(cls)e.className=cls;if(parent)parent.appendChild(e);return e}
const hue=i=>`hsl(${175+i*14} 42% 38%)`;
function renderStats(){
$("s-open").textContent=cases.filter(isOpen).length;$("s-over").textContent=cases.filter(isOver).length;
$("s-un").textContent=cases.filter(isUn).length;$("s-rej").textContent=cases.filter(isRej).length;$("s-closed").textContent=cases.filter(c=>!isOpen(c)).length;$("s-late").textContent=cases.filter(isLate).length;
const pipe=$("pipe"),chips=$("chips");pipe.replaceChildren();chips.replaceChildren();
STAGES.slice(0,8).forEach((s,i)=>{const n=cases.filter(c=>c.stage===s).length,seg=el("div",String(n),"",pipe);
seg.style.flex=n+" 1 0";seg.style.background=hue(i);seg.title=RULES[s].label+": "+n;
const ch=el("span","",null,chips),dot=el("i","",null,ch);dot.style.background=hue(i);ch.append(RULES[s].label+" "+n)})}
function renderTable(){
const q=$("q").value.trim().toLowerCase(),f=$("f").value,body=$("body");body.replaceChildren();
const F={all:()=>true,open:isOpen,overdue:isOver,un:isUn,rej:isRej,closed:c=>!isOpen(c),booked:c=>isOpen(c)&&!!c.appointment&&c.appointment.date>=TODAY&&!c.appointment.noShow,late:isLate,access:c=>isOpen(c)&&(needInterp(c)||textOnly(c)),taskover:c=>isOpen(c)&&taskOver(c),resp:c=>isOpen(c)&&(c.responses||[]).some(r=>r.status==='open'),consult:c=>isOpen(c)&&consultAttn(c),refover:c=>isOpen(c)&&refOver(c),noshow:c=>!!c.appointment&&!!c.appointment.noShow,inside:c=>c.origin!=='outside',ontx:c=>isOpen(c)&&(c.stage==='attended'||(c.stage==='appointment_scheduled'&&!!c.appointment&&!!c.appointment.checkedIn)),notx:c=>isOpen(c)&&(isRej(c)||(!!c.appointment&&!!c.appointment.noShow)||(isOver(c)&&STAGES.indexOf(c.stage)>=STAGES.indexOf('referral_sent'))),outside:c=>c.origin==='outside',atrisk:c=>isOpen(c)&&(isLate(c)||c.dueDate<dateOnly(addDays(DEMO_TODAY,-5)))};
const rows=cases.filter(F[f]).filter(c=>!q||[c.id,c.patient.name,phoneOf(c),c.screening.type,c.doctor||'',(c.cond>=0||c.deptKey)?condInfo(c).dept.n:'',c.owner?c.owner.name:"unassigned",RULES[c.stage].label].join(" ").toLowerCase().includes(q))
.sort((a,b)=>((!!b.urgent)-(!!a.urgent))||(isOver(b)-isOver(a))||a.id.localeCompare(b.id));
$("count").textContent=rows.length+(rows.length===1?" case":" cases");
rows.slice(0,100).forEach(c=>{const tr=el("tr","","clk",body);tr.onclick=()=>openCase(c.id);tr.tabIndex=0;tr.onkeydown=e=>{if(e.key==="Enter")openCase(c.id)};
[c.id,RULES[c.stage].label,RULES[c.stage].action,c.owner?c.owner.name:"Unassigned",c.dueDate||"-"].forEach((t,i)=>{el("td",t,"",tr).dataset.label=["Case","Stage","Next action","Owner","Due"][i]});
const st=el("td","","",tr);st.dataset.label="Status";flags(c).forEach(([t,k])=>el("span",t,"badge "+k,st))})}
let openId=null;
function refresh(){save();renderStats();renderTable();if(!$("apptpane").hidden)renderAppts();if(openId)openCase(openId)}
function openCase(id){
if(!session||session.role==='patient')return;
if(openId!==id)logAccess('Opened '+id);
openId=id;const c=cases.find(x=>x.id===id),box=$('detail');box.replaceChildren();
const xb=el("button","Close","xbtn",box);xb.onclick=()=>{openId=null;$("dlg").close()};
el("h2",c.id+" · "+c.patient.name,"",box);
el("p","Age "+c.patient.age+" · "+c.screening.type+" · "+c.screening.date,"mut",box);
el('p',condInfo(c).dept.n+' · '+c.doctor+' · '+condInfo(c).dept.room+(condInfo(c).testRoom?' · Test: '+condInfo(c).testRoom:''),'mut',box);
if(c.appointment)el('p','Appointment: '+c.appointment.date+' '+c.appointment.time+' with '+c.appointment.doctor,'mut',box);
accessBox(box,c);el('h3','Visit plan','',box);
const ci=condInfo(c);
[['Clinic visit',c.appointment?c.appointment.date+' '+c.appointment.time+' · '+ci.dept.room+' · '+c.doctor:'Not booked yet'],['Test: '+ci.test,(c.testSlot?c.testSlot.date+' '+c.testSlot.time:'Not allocated')+' · '+(ci.testRoom||ci.dept.room)],['Next action',c.dueDate?'by '+c.dueDate:'None']].forEach(([a,b])=>el('p',a+': '+b,'mut',box));
if(isOpen(c)&&ci.testRoom){const ds=el('select','','',box);[TODAY].concat(apptDays()).forEach(x=>{el('option',x,'',ds).value=x});const ts=el('select','','',box);SLOTS.forEach(x=>{el('option',x,'',ts).value=x});const m2=el('p','','mut',box);
el('button','Allocate test slot','',box).onclick=()=>{if(cases.some(x=>x!==c&&x.testSlot&&x.testSlot.date===ds.value&&x.testSlot.time===ts.value&&condInfo(x).testRoom===ci.testRoom)){m2.textContent='That slot is already taken in '+ci.testRoom+'.';return}c.testSlot={date:ds.value,time:ts.value};notify(c,'Test booked: '+ts.value+' on '+ds.value+', '+ci.testRoom+'.');refresh()}}
const fl=el("p","","",box);flags(c).forEach(([t,k])=>el("span",t,"badge "+k,fl));
if(c.urgent)el('button','Mark help request handled','pri',box).onclick=()=>{c.consultNotes.push({at:TODAY,text:'Help request handled by '+session.name+'.'});(c.tasks||[]).filter(t=>t.type==='urgent'&&t.status==='open').forEach(t=>completeTask(c,t,'Help request handled by '+session.name+'.'));c.urgent=null;refresh()};
el("h3","Case journey","",box);const ol=el("ol","","tl",box);
timeline(c).forEach(t=>{const li=el("li","",t.state,ol);el("strong",t.label,"",li);if(t.date)el("span"," "+t.date,"mut",li)});
el("h3","Responsible care coordinator","",box);const sel=el("select","","",box);
[["","Unassigned"],...OWNERS.map(o=>[o.name,o.name])].forEach(([v,t])=>{el("option",t,"",sel).value=v});
sel.value=c.owner?c.owner.name:"";sel.disabled=!isOpen(c);
sel.onchange=()=>{const old=c.owner;c.owner=OWNERS.find(o=>o.name===sel.value)||null;(c.handoffs=c.handoffs||[]).push({at:TODAY,from:old?old.name:'unassigned',to:c.owner?c.owner.name:'unassigned'});refresh()};
taskBox(box,c);careBox(box,c);referralBox(box,c);aiBox(box,c);consultBox(box,c);fhirBox(box,c);
el("h3","Clinician consultation notes","",box);
c.consultNotes.forEach(n=>el("p",n.at+": "+n.text,"mut",box));
if(isOpen(c)){const ta=el("textarea","","",box);ta.rows=2;ta.placeholder="Add a consultation note (demo data only)";
el("button","Add note","",box).onclick=()=>{if(!ta.value.trim())return;c.consultNotes.push({at:TODAY,text:ta.value.trim()});refresh()};
el("h3","Move case forward","",box);
if(c.stage==="attended"){el("p","Closing needs evidence or an approved alternative plan, plus a named clinician.","mut",box);
const ev=el("input","","",box);ev.placeholder="Evidence or approved alternative plan";
const who=el("input","","",box);who.placeholder="Deciding clinician";
el("button","Save closure record","",box).onclick=()=>{c.closure.evidence=ev.value.trim()||null;c.closure.decidedBy=who.value.trim()||null;refresh()}}
if(isRej(c))el("button","Re-refer to another provider","",box).onclick=()=>{reRefer(c);refresh()};
const go=el("button",c.stage==="attended"?"Close case":"Advance to next stage","pri",box);
go.disabled=c.stage==="attended"&&!canClose(c);
const msg=el("p",go.disabled?"Locked: closure evidence and clinician decision required.":"","mut",box);
go.onclick=()=>{const r=moveNext(c);if(!r.ok){msg.textContent=r.reason;return}refresh()}}
el("h3","Patient view (simulated)","",box);const pv=el("div","","pv",box);el("p",patientMsg(c),"",pv);
const a=c.messages[0]&&c.messages[0].acknowledgedAt;
if(!c.messages.length)el("p","Not yet sent. Advance the case to “Patient notified” first.","mut",pv);
else if(a)el("p","Acknowledged on "+a+".","mut",pv);
else{el("button","I understand","pri",pv).onclick=()=>{ack(c);refresh()};
el("button","I need help","",pv).onclick=()=>{c.consultNotes.push({at:TODAY,text:"Patient requested help. Staff to call."});refresh()}}
el("button","Close window","",box).onclick=()=>{openId=null;$("dlg").close()};
if(!$("dlg").open)$("dlg").showModal()}
$("dlg").addEventListener("close",()=>{openId=null});
$("today").textContent=TODAY;
document.querySelectorAll(".stats .card").forEach((card,i)=>{const v=["open","overdue","un","rej","closed","late"][i];card.tabIndex=0;card.setAttribute("role","button");card.onclick=()=>{$("f").value=v;renderTable();$("f").scrollIntoView({behavior:"smooth",block:"center"})};card.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();card.click()}}});
$("reset").onclick=()=>{try{localStorage.removeItem(KEY)}catch(e){}location.reload()};$("q").oninput=renderTable;$("f").onchange=renderTable;
const NEXT={result_recorded:'Your result has been recorded. Your care team will contact you soon.',patient_notified:'Please confirm you have seen your result by tapping “I understand”.',patient_acknowledged:'A clinician will review your result and decide the next step with you.',clinician_review:'A clinician is reviewing your case. You may be referred for a further test.',referral_sent:'A referral has been sent. We are waiting for the specialist team to accept it.',referral_accepted:'The specialist team accepted your referral. An appointment will be arranged.',appointment_scheduled:'Your appointment is booked. Please attend, and tell your care team if you cannot.',attended:'Thank you for attending. Your care team is recording the outcome.',closed:'Your case is complete. Contact your care team if you have new concerns.',rejected:'Your first referral was not accepted. Your care team is arranging another provider.'};
const STAFF={staff01:{pin:'2468',name:'Aisha Rahman (coordinator)',role:'staff'},admin01:{pin:'1357',name:'Admin',role:'admin'}};
let session=null;const tries={};
const VIEWS=['home','plogin','newacct','pprofile','portal','slogin','staff'];
const phoneOf=c=>c.patient.phone||String(1234567890+(+c.id.slice(5)));
const LOGKEY='careconnect-log-v1';
function logAccess(m){try{const l=JSON.parse(localStorage.getItem(LOGKEY)||'[]');l.unshift({t:new Date().toLocaleString(),u:session?session.name:'unknown',m});localStorage.setItem(LOGKEY,JSON.stringify(l.slice(0,200)))}catch(e){}}
function show(v){VIEWS.forEach(x=>{$(x).hidden=x!==v});$('bar').hidden=!session;
if(session){$('who').textContent=session.name+' · '+({patient:'Patient',staff:'Hospital staff',admin:'Admin'})[session.role];$('logbtn').hidden=session.role!=='admin'}
if(v==='staff'){tab('d');renderStats();renderTable()}window.scrollTo(0,0)}
function authOk(key,ok,out){if((tries[key]||0)>=3){out.textContent='Too many attempts. Locked for this session.';return false}
if(!ok){tries[key]=(tries[key]||0)+1;out.textContent='Details not recognised.';return false}
tries[key]=0;out.textContent='';return true}
function raiseHelp(c,why){c.urgent={at:TODAY,reason:why};c.consultNotes.push({at:TODAY,text:why+'. Staff to contact the patient.'});save();logAccess('Help request '+c.id)}
function assist(c,q){const s=q.toLowerCase();
if(/bleed|severe|faint|chest|breath|emergency|suicid|hurt myself|kill myself|overdose/.test(s)){raiseHelp(c,'Possible urgent symptoms mentioned to the assistant');return 'If this may be an emergency, call your local emergency number now. I have also asked your care team to contact you.'}
if(/colonoscop/.test(s))return 'A colonoscopy is a test where a doctor looks inside the bowel with a thin flexible camera. You normally get instructions beforehand, and your care team will explain what to expect.';
if(/cancer|positive|serious|worried/.test(s))return 'A result that needs follow-up is not a diagnosis. It means more checking is needed, and a further test or visit is the usual next step. Only a clinician can tell you what it means for you.';
if(/\bnext\b|what (do|should) i do/.test(s))return c.referral.status==='rejected'?NEXT.rejected:NEXT[c.stage];
if(/care team|who|contact|call|speak|talk|doctor|human|help/.test(s)){raiseHelp(c,'Patient asked to speak to the care team');return 'I have asked your care team to contact you. '+(c.owner?c.owner.name+' is responsible for your case.':'An owner is being assigned to your case.')}
return 'I can not answer that safely. I can explain your next step or common tests, or ask your care team to contact you.'}
function renderProfile(c){$('fname').value=c.patient.name;$('fage').value=c.patient.age;$('flang').value=c.patient.language;$('fcons').checked=false;$('ferr').textContent='';{const cm=c.patient.comm||{};$('ftext').checked=!!cm.text;$('finterp').checked=!!cm.interp;$('fsign').value=cm.sign||'';$('fassist').value=cm.assist||''}show('pprofile');
$('fsave').onclick=()=>{const n=$('fname').value.trim(),a=parseInt($('fage').value,10);
if(!n||!(a>0&&a<121)){$('ferr').textContent='Please enter your name and a valid age.';return}
if(!$('fcons').checked){$('ferr').textContent='Please agree to share your details to continue.';return}
c.patient.name=n;c.patient.age=a;c.patient.language=$('flang').value;c.patient.comm=Object.assign(c.patient.comm||{},{text:$('ftext').checked,interp:$('finterp').checked,sign:$('fsign').value,assist:$('fassist').value.trim()});c.patient.consent=TODAY;session.name=n;save();renderPortal(c)}}
function renderPortal(c){show('portal');const b=$('pbody');b.replaceChildren();
const card=t=>{const d=el('div','','pcard',b);el('h3',t,'',d);return d};
el('h2','Hello, '+c.patient.name,'',b);
el('p','Emergency 999 · Ambulance 998 · Hospital emergency line +971 2 000 0000 (demo number)','',el('div','','pcard emerg',b));
let d=card('Your screening test');
el('p',c.screening.type+' on '+c.screening.date+'. Result: needs a follow-up check.','',d);
el('p','This is not a diagnosis. Your care team will explain what it means.','mut',d);
d=card('Where you are');const ol=el('ol','','tl',d);
timeline(c).forEach(t=>{const li=el('li','',t.state,ol);el('strong',t.label,'',li);if(t.date)el('span',' '+t.date,'mut',li)});
d=card('What happens next');
el('p',c.referral.status==='rejected'?NEXT.rejected:NEXT[c.stage],'',d);
if(isOpen(c))el('p','Care coordinator: '+(c.owner?c.owner.name:'being assigned')+(c.dueDate?' · next step by '+c.dueDate:''),'mut',d);
el('p','Your doctor: '+c.doctor+' · '+condInfo(c).dept.room+(condInfo(c).testRoom?' · Test location: '+condInfo(c).testRoom:''),'mut',d);
const m=c.messages[0];
if(m&&!m.acknowledgedAt)el('button','I understand','pri',d).onclick=()=>{ack(c);save();renderPortal(c)};
if(isOpen(c))el('button','I need help','',d).onclick=()=>{raiseHelp(c,'Patient tapped I need help');renderPortal(c)};
if(c.urgent)el('p','Your care team has been asked to contact you.','mut',d);
d=card('Book an appointment');
if(c.appointment&&c.appointment.date<TODAY&&c.appointment.checkedIn){el('p','Last visit: '+c.appointment.date+' with '+c.appointment.doctor+'. Attended.','mut',d)}
else if(c.appointment){el('p','Booked: '+c.appointment.date+' at '+c.appointment.time+' with '+c.appointment.doctor,'',d);el('button','Cancel appointment','',d).onclick=()=>{notify(c,'Your appointment was cancelled. You can book a new one in writing on this page.');c.appointment=null;save();logAccess('Appointment cancelled '+c.id);renderPortal(c)}}
else{const docs=suggestDocs(c);el('p',(c.patient.age<=14?'Children are seen by Paediatrics. ':'')+'Suggested for your result: '+docs[0],'mut',d);
const ds=el('select','','',d);docs.forEach((x,i)=>{el('option',x+(i?'':' (best match)'),'',ds).value=x});
const dt=el('select','','',d);apptDays().forEach(x=>{el('option',x,'',dt).value=x});
const grid=el('div','','slots',d);
const draw=()=>{grid.replaceChildren();SLOTS.forEach(t=>{const b=el('button',t,'',grid);b.disabled=slotTaken(ds.value,dt.value,t,c);b.onclick=()=>{if(slotTaken(ds.value,dt.value,t,c))return;c.appointment={doctor:ds.value,date:dt.value,time:t};notify(c,'Appointment booked: '+t+' on '+dt.value+' with '+ds.value+'.'+(needInterp(c)?' The care team will arrange a sign-language interpreter and confirm in writing.':''));save();logAccess('Appointment booked '+c.id);renderPortal(c)}})};
ds.onchange=draw;dt.onchange=draw;draw()}
d=card('While you wait');const dk=Object.keys(DEPTS).find(k=>DEPTS[k]===condInfo(c).dept);
el('p','Do: keep your appointment, bring your reports and medicine list, and write down your questions. Follow any preparation steps sent for your test.','',d);
el('p','Avoid: starting or stopping medicines on your own, or delaying your visit.','',d);
el('p','Get urgent care now for: '+URG[dk]+'. Call ambulance 998 or emergency 999.','',d).style.color='var(--bad)';
el('p','Sample guidance for this demo. A clinician must review it before real use.','mut',d);
const unread=(c.notices||[]).filter(n=>!n.read).length;
if(unread){const bn=el('div','New: '+unread+' written message'+(unread>1?'s':'')+' for you. See “Messages for you” below.','pcard',b);bn.setAttribute('role','alert');bn.style.borderColor='var(--warn)';b.prepend(bn);if(commOf(c).vibrate&&navigator.vibrate)navigator.vibrate([200,100,200])}
d=card('Messages for you (text)');
(c.notices||[]).slice(-8).reverse().forEach(n=>{const p=el('p',n.at+' · '+n.text,n.read?'mut':'',d);if(!n.read){const sp=document.createElement('span');sp.className='badge warn';sp.textContent='New';p.prepend(sp,' ')}});
if(!(c.notices||[]).length)el('p','No messages yet.','mut',d);
(c.notices||[]).forEach(n=>{n.read=true});
d=card('My communication needs');const cmn=c.patient.comm=c.patient.comm||{text:false,interp:false,sign:'',assist:''};
const mk=(label,key)=>{const l=el('label','','',d),i=el('input','','',l);i.type='checkbox';i.checked=!!cmn[key];i.style.width='auto';l.append(' '+label);return i};
const t1=mk('I prefer text-based communication (no voice calls)','text'),t2=mk('I need a sign-language interpreter','interp'),t3=mk('Vibrate my phone for new messages (works on some phones only)','vibrate');
const sg=el('select','','',d);['','Indian Sign Language (ISL)','American Sign Language (ASL)','British Sign Language (BSL)','Other sign language'].forEach(x=>{el('option',x||'Preferred sign language (if needed)','',sg).value=x});sg.value=cmn.sign||'';
const as=el('input','','',d);as.placeholder='Other communication help (optional)';as.value=cmn.assist||'';
el('button','Save my communication needs','',d).onclick=()=>{cmn.text=t1.checked;cmn.interp=t2.checked;cmn.vibrate=t3.checked;cmn.sign=sg.value;cmn.assist=as.value.trim();save();logAccess('Communication needs updated '+c.id);renderPortal(c)};
el('p','The AI assistant writes text only. It cannot translate sign language and does not replace a qualified interpreter. Interpreters are arranged by the care team (simulated in this demo).','mut',d);
if(!navigator.vibrate)el('p','This device does not support vibration alerts.','mut',d);
save();
d=card('Tell us if something is a problem');
const rf=el('div','','',d);
const form=type=>{rf.replaceChildren();const L=type==='cannot_attend'?RS_ATT:RS_ACC;el('p',type==='cannot_attend'?'What is stopping you from attending?':'What makes it hard to access this service?','',rf);const s=el('select','','',rf);L.forEach(x=>{el('option',x,'',s).value=x});const tx=el('input','','',rf);tx.placeholder='Anything else we should know? (optional)';el('button','Send to care team','pri',rf).onclick=()=>{respond(c,type,s.value,tx.value.trim());renderPortal(c)}};
if(isOpen(c)){el('button','I cannot attend','',d).onclick=()=>form('cannot_attend');el('button','I cannot access this service','',d).onclick=()=>form('cannot_access')}
(c.responses||[]).forEach(r=>el('p',(r.type==='cannot_attend'?'Cannot attend':'Cannot access service')+' ('+r.reason+') · '+r.at+' · '+(r.status==='resolved'?'Resolved by the care team.':'Received. A team member will follow up. This is not resolved yet.'),'mut',d));
d=card('Upload a report');el('p','Your file goes to your care team to review. It is not analysed automatically. In this prototype only the file name is recorded.','mut',d);
const up=el('input','','',d);up.type='file';up.accept='image/*,.pdf';
up.onchange=()=>{const f=up.files[0];if(!f)return;c.consultNotes.push({at:TODAY,text:'Patient uploaded a report: '+f.name+' (for clinician review).'});save();logAccess('Report uploaded '+c.id);renderPortal(c)};
d=card('Care assistant');const chat=el('div','','chat',d);
const say=(t,k)=>{el('div',t,'msg '+k,chat);chat.scrollTop=chat.scrollHeight};
say('May I help you? I can explain your next step and common questions. I do not read test results or give medical advice. My replies are written by AI and can contain mistakes.','bot');
const hist=[];const ask=async q=>{say(q,'me');const bot=el('div','…','msg bot',chat);if(c.patient.language==='ar')bot.dir='rtl';let r=null;if(!SAFE.test(q))r=await aiReply(c,q,hist);r=r||assist(c,q);bot.textContent=r;hist.push('Patient: '+q,'Assistant: '+r);chat.scrollTop=chat.scrollHeight};
['What do I do next?','What is a colonoscopy?','Is my result serious?','Talk to my care team'].forEach(q=>{el('button',q,'',d).onclick=()=>ask(q)});
const row=el('input','','',d);row.placeholder='Type a question';row.onkeydown=e=>{if(e.key==='Enter'&&row.value.trim()){ask(row.value.trim());row.value=''}}}
const SLOTS=['09:00','09:30','10:00','10:30','11:00','11:30','14:00','14:30','15:00','15:30'];
const URG={gi:'black or bloody stools, vomiting blood, severe belly pain',endo:'extreme thirst with vomiting, confusion, fainting',card:'chest pain, breathlessness, fainting, a very fast or irregular heartbeat',ortho:'severe pain, numbness, a deformed limb, or being unable to bear weight',derm:'a fast-growing or bleeding lesion, or spreading redness with fever',ped:'fever in a baby under 3 months, trouble breathing, refusing feeds, unusual drowsiness',gyn:'heavy bleeding, severe belly pain, or reduced baby movements in pregnancy',nephro:'passing very little urine, swelling with breathlessness, severe back pain',pulm:'severe breathlessness, coughing blood, blue lips',eye:'sudden loss of vision, severe eye pain, flashes of light',hema:'heavy bleeding, fainting, severe weakness or breathlessness',onco:'uncontrolled bleeding, severe pain, fever with chills, sudden weakness',gen:'chest pain, severe breathlessness, confusion, fainting'};
function apptDays(){const o=[];let d=addDays(DEMO_TODAY,1);while(o.length<5){const w=d.getUTCDay();if(w!==0&&w!==6)o.push(dateOnly(d));d=addDays(d,1)}return o}
const hsh=s=>{let h=0;for(const ch of s)h=(h*31+ch.charCodeAt(0))|0;return Math.abs(h)};
function slotTaken(doc,date,time,me){return hsh(doc+date+time)%4===0||cases.some(x=>x!==me&&x.appointment&&x.appointment.doctor===doc&&x.appointment.date===date&&x.appointment.time===time)}
function suggestDocs(c){return (c.patient.age<=14?DEPTS.ped:condInfo(c).dept).docs}
function routeDept(t,age){if(age<=14)return'ped';const s=t.toLowerCase(),R=[['ortho',/bone|fractur|joint|knee|back pain|accident|sprain|spine/],['derm',/skin|rash|mole|itch/],['card',/heart|chest|blood pressure|ecg/],['gi',/stomach|liver|stool|bowel|digest|hepatitis/],['endo',/sugar|diabet|thyroid|vitamin|cholesterol/],['gyn',/pregnan|period|cervi|uterus/],['nephro',/kidney|urine|creatinine/],['pulm',/lung|breath|cough|tb\b|asthma/],['eye',/eye|vision|sight/],['hema',/anaemia|anemia|haemoglobin|blood count/],['onco',/lump|cancer|mammogram|psa|tumou?r/]];for(const [k,r] of R)if(r.test(s))return k;return 'gen'}
const isLate=c=>c.stage==='appointment_scheduled'&&c.appointment&&!c.appointment.checkedIn&&!c.appointment.noShow&&(c.appointment.date<TODAY||(c.appointment.date===TODAY&&c.appointment.time<DEMO_NOW));
function seedAppts(){const r=mulberry32(99),off=[-3,0,0,0,1,1,2,3,4];
cases.forEach(c=>{if(c.appointment!==undefined||c.stage!=='appointment_scheduled')return;
const date=dateOnly(addDays(DEMO_TODAY,off[Math.floor(r()*off.length)])),k=Math.floor(r()*SLOTS.length),t=SLOTS.slice(k).concat(SLOTS.slice(0,k)).find(x=>!slotTaken(c.doctor,date,x,c));
if(!t){c.appointment=null;return}
c.appointment={doctor:c.doctor,date,time:t,checkedIn:date===TODAY&&t<DEMO_NOW?hsh(c.id)%3!==0:false}})}
seedAppts();
cases.forEach(c=>{if(c.appointment!==undefined||!(c.stage==='attended'||c.stage==='closed'))return;const h=hsh(c.id);
c.appointment={doctor:c.doctor,date:dateOnly(addDays(DEMO_TODAY,-(2+h%12))),time:SLOTS[h%10],checkedIn:true};if(h%7===0)c.missedBefore=1});
let apptDay=TODAY;
function tab(t){['d','a','m','t','s','i'].forEach(k=>{$({d:'dashpane',a:'apptpane',m:'metpane',t:'taskpane',s:'setpane',i:'imppane'}[k]).hidden=t!==k;$('tab-'+k).classList.toggle('on',t===k)});if(t==='a')renderAppts();if(t==='m')renderMetrics();if(t==='t')renderTasks();if(t==='s')renderSettings();if(t==='i')renderImpact()}
function renderAppts(){const pane=$('apptpane');pane.replaceChildren();
const days=[TODAY].concat(apptDays().slice(0,4)),bar=el('div','','tabs',pane);
days.forEach((d,i)=>{const n=cases.filter(c=>c.appointment&&c.appointment.date===d).length;const b=el('button',(i===0?'Today':d===dateOnly(addDays(DEMO_TODAY,1))?'Tomorrow':d.slice(5))+' ('+n+')','',bar);if(d===apptDay)b.className='on';b.onclick=()=>{apptDay=d;renderAppts()}});
const late=cases.filter(isLate);
el('h3','Late for appointment (not yet checked in): '+late.length+' · no-shows recorded: '+cases.filter(c=>c.appointment&&c.appointment.noShow).length,'',pane);
late.slice(0,8).forEach(c=>el('p',c.appointment.date+' '+c.appointment.time+' · '+c.patient.name+' ('+c.id+') · '+(textOnly(c)?'TEXT ONLY, do not call: ':'call ')+phoneOf(c)+commTag(c),'arow late',pane));
const list=cases.filter(c=>c.appointment&&c.appointment.date===apptDay).sort((a,b)=>a.appointment.time.localeCompare(b.appointment.time));
el('h3',list.length+' appointment'+(list.length===1?'':'s')+' on '+apptDay,'',pane);
const rooms={};list.forEach(c=>{const r=c.appointment.room||condInfo(c).dept.room;(rooms[r]=rooms[r]||[]).push(c)});
Object.keys(rooms).sort().forEach(r=>{el('div',r+' · '+rooms[r].length+' patient'+(rooms[r].length===1?'':'s'),'rm',pane);
rooms[r].forEach(c=>{const row=el('div','','arow'+(isLate(c)?' late':''),pane);
el('div',c.appointment.time+' · '+c.patient.name+' ('+c.id+') · '+c.doctor+(c.appointment.checkedIn?' · checked in':c.appointment.noShow?' · NO-SHOW':isLate(c)?' · LATE, not checked in':'')+commTag(c),'',row);
el('div',(textOnly(c)?'TEXT ONLY, no voice calls. Contact: ':'Phone ')+phoneOf(c)+(condInfo(c).testRoom?' · Test: '+condInfo(c).testRoom:''),'mut',row);
const rs=el('select','','',row);ROOMS2.forEach(x=>{el('option',x,'',rs).value=x});rs.value=c.appointment.room||condInfo(c).dept.room;
rs.onchange=()=>{const v=rs.value;if(cases.some(x=>x!==c&&x.appointment&&(x.appointment.room||condInfo(x).dept.room)===v&&x.appointment.date===c.appointment.date&&x.appointment.time===c.appointment.time)){el('p','That room is already in use at that time.','mut',row);rs.value=c.appointment.room||condInfo(c).dept.room;return}c.appointment.room=v;notify(c,'Appointment room changed to '+v+'.');logAccess('Room changed '+c.id);refresh()};
if(!c.appointment.checkedIn)el('button','Check in','',row).onclick=()=>{c.appointment.checkedIn=true;if(c.appointment.noShow){c.appointment.noShow=false;c.consultNotes.push({at:TODAY,text:'No-show status corrected: the patient arrived and was checked in.'})}refresh()};
if(!c.appointment.checkedIn&&!c.appointment.noShow)el('button','No-show','',row).onclick=()=>{c.appointment.noShow=true;c.consultNotes.push({at:TODAY,text:'Marked as no-show for the appointment.'});logAccess('No-show '+c.id);refresh()};
el('button',textOnly(c)?'Log text contact':'Log call','',row).onclick=()=>{c.consultNotes.push({at:TODAY,text:'Staff called the patient about the appointment.'});logAccess('Call logged '+c.id);refresh()}})})}
$('tab-d').onclick=()=>tab('d');$('tab-a').onclick=()=>tab('a');$('tab-m').onclick=()=>tab('m');$('tab-t').onclick=()=>tab('t');$('tab-s').onclick=()=>tab('s');$('tab-i').onclick=()=>tab('i');
const LANGN={en:'English',ml:'Malayalam',ar:'Arabic'};
const ALLDOCS=Object.values(DEPTS).flatMap(d=>d.docs);
const ROOMS2=[...new Set(Object.values(DEPTS).map(d=>d.room))];
const SAFE=/bleed|severe|faint|chest|breath|emergency|care team|speak to|talk to|human|suicid|hurt myself|kill myself|overdose/i;
async function ai(prompt){try{const sm=window.claude&&await window.claude.use('sample');if(!sm)return null;const r=await sm(prompt,{cache:false});return (r&&r.text||'').trim()||null}catch(e){return null}}
function caseFacts(c){const i=condInfo(c);return 'Case '+c.id+'; age '+c.patient.age+'; result: '+c.screening.type+'; department: '+i.dept.n+'; doctor: '+c.doctor+'; stage: '+RULES[c.stage].label+'; next action: '+RULES[c.stage].action+'; due '+(c.dueDate||'none')+'; coordinator: '+(c.owner?c.owner.name:'unassigned')+'; referral: '+c.referral.status+'; appointment: '+(c.appointment?c.appointment.date+' '+c.appointment.time+(c.appointment.noShow?' (no-show)':''):'none')+'; recent notes: '+c.consultNotes.slice(-4).map(n=>n.text).join(' | ')}
async function aiReply(c,q,hist){return ai('You are the CareConnect care assistant in a hospital patient portal (UAE demo, all data fictional). Reply in '+(LANGN[c.patient.language]||'English')+', in plain words, under 90 words. You may explain the patient next step, what a test or department does in general terms, how to use this portal (booking, cancelling, uploading), and answer general questions helpfully. Never diagnose, interpret result values, say a result is normal or serious, advise on medicines or doses, or give personal treatment advice: for those say a clinician must answer and suggest tapping I need help. Do not invent facts. Never claim to translate sign language or to replace a qualified interpreter; if the patient needs sign-language support, say the care team arranges a qualified interpreter. Case facts: '+caseFacts(c)+'\nConversation so far:\n'+hist.slice(-6).join('\n')+'\nPatient: '+q+'\nAssistant:')}
function aiBox(box,c){el('h3','AI help for the care team','',box);const out=el('p','','pv',box);out.style.whiteSpace='pre-wrap';
const run=async instr=>{out.textContent='Thinking…';const t=await ai(instr+' Do not diagnose or recommend treatment. Case facts: '+caseFacts(c));out.textContent=t?t+'\n\nAI draft. A clinician must review it before use.':'AI is not available here, or permission was declined.'};
el('button','Handover summary','',box).onclick=()=>run('Write a clinician handover summary in under 120 words: where the case is, what is overdue or blocked, who owns the next step, and what to do next.');
el('button','Draft patient message','',box).onclick=()=>run('Draft a short, warm, plain-language message to this patient about their next step and appointment, under 70 words.');
el('button','Flag risks','',box).onclick=()=>run('List up to 3 follow-up risks (for example overdue, rejected referral, no-show, unassigned) with a suggested action each, one line each.');
el('button','Save draft as note','',box).onclick=()=>{const t=out.textContent.split('\n\nAI draft')[0];if(t&&!t.startsWith('Thinking')&&!t.startsWith('AI is not')){c.consultNotes.push({at:TODAY,text:'AI draft saved by '+session.name+': '+t});refresh()}}}
function consultBox(box,c){el('h3','Consultation and hand-offs','',box);
(c.consults||[]).forEach(k=>el('p',k.at+' · to '+k.to+': '+k.q+(k.reply?' → Reply: '+k.reply:' (waiting for reply)'),'mut',box));
(c.handoffs||[]).forEach(h=>el('p',h.at+' · coordinator: '+h.from+' → '+h.to,'mut',box));
if(!isOpen(c))return;const cs=el('select','','',box);ALLDOCS.forEach(x=>{el('option',x,'',cs).value=x});const cq=el('input','','',box);cq.placeholder='Question for the specialist';
el('button','Send consultation request','',box).onclick=()=>{if(!cq.value.trim())return;(c.consults=c.consults||[]).push({at:TODAY,to:cs.value,q:cq.value.trim(),reply:null});logAccess('Consult request '+c.id);refresh()};
const op=(c.consults||[]).find(k=>!k.reply);if(op){const rp=el('input','','',box);rp.placeholder='Specialist reply';el('button','Record reply','',box).onclick=()=>{if(!rp.value.trim())return;op.reply=rp.value.trim();logAccess('Consult reply '+c.id);refresh()}}}
const med=a=>{if(!a.length)return null;const s=[...a].sort((x,y)=>x-y),m=Math.floor(s.length/2);return s.length%2?s[m]:(s[m-1]+s[m])/2};
const dd=(a,b)=>Math.round((new Date(b)-new Date(a))/864e5);
const pct=(n,d)=>d?Math.round(100*n/d)+'%':'n/a';
function renderMetrics(){const box=$('metpane');box.replaceChildren();
el('p','Simulated data. These numbers describe the demo dataset, not real patients. They are a baseline for measuring a future pilot and are not evidence of clinical improvement.','pv',box);
const sent=cases.filter(c=>c.messages[0]),ackd=sent.filter(c=>c.messages[0].acknowledgedAt);
const referred=cases.filter(c=>c.referral.status!=='not_started'),accepted=referred.filter(c=>['accepted','appointment_pending','completed'].includes(c.referral.status));
const due=cases.filter(c=>c.appointment&&(c.appointment.date<TODAY||(c.appointment.date===TODAY&&c.appointment.time<DEMO_NOW))),attended=due.filter(c=>c.appointment.checkedIn);
const closed=cases.filter(c=>!isOpen(c)),closedOk=closed.filter(c=>c.closure.decidedBy&&(c.closure.evidence||c.closure.alternativePlan));
const allT=cases.flatMap(c=>c.tasks||[]),tOpen=allT.filter(t=>t.status==='open').length,tOver=allT.filter(t=>t.status==='open'&&t.due<TODAY).length,tEsc=allT.filter(t=>t.status==='open'&&t.escalations.length).length;
const allC=cases.flatMap(c=>c.consults||[]),cAll=allC.length,cOk=allC.filter(k=>k.status==='completed').length,rSent=cases.filter(c=>c.referral&&c.referral.sentAt).length,rResp=cases.filter(c=>c.referral&&c.referral.sentAt&&(c.referral.acceptedAt||c.referral.rejectedAt)).length,rOver=cases.filter(c=>isOpen(c)&&refOver(c)).length;
const cfReq=cases.filter(c=>c.confirm&&c.confirm.required).length,cfOk=cases.filter(c=>c.confirm&&c.confirm.required&&c.confirm.result).length,careEligible=cases.filter(c=>c.stage==='attended'||c.stage==='closed').length,careStarted=cases.filter(c=>c.care&&c.care.startedAt).length,careOut=cases.filter(c=>c.care&&c.care.outcome).length;
const open=cases.filter(isOpen),over=open.filter(isOver),surfaced=open.filter(c=>flags(c)[0][0]!=='On track');
const tn=med(sent.map(c=>dd(c.screening.date,c.messages[0].sentAt))),ta=med(ackd.map(c=>dd(c.messages[0].sentAt,c.messages[0].acknowledgedAt)));
const g=el('section','','stats',box);
[['Median days, result to patient notified',tn===null?'n/a':tn],['Median days, notified to acknowledged',ta===null?'n/a':ta],['Patients who acknowledged',pct(ackd.length,sent.length)],['Referrals accepted or further',pct(accepted.length,referred.length)],['Appointments attended',pct(attended.length,due.length+cases.reduce((s,c)=>s+(c.missedBefore||0),0))],['Unresolved actionable results',open.length],['Of those, overdue',over.length],['Closed with documented evidence',pct(closedOk.length,closed.length)],['Open cases surfaced for action',surfaced.length],['Confirmatory tests completed',pct(cfOk,cfReq)],['Treatment or surveillance started',pct(careStarted,careEligible)],['Care outcomes documented',pct(careOut,careStarted)],['Consultations completed',pct(cOk,cAll)],['Referrals with a recorded response',pct(rResp,rSent)],['Referrals past response deadline',rOver],['Open tasks',tOpen],['Overdue tasks',tOver],['Overdue tasks escalated',tEsc]].forEach(([l,v])=>{const k=el('div','','card',g);el('span',String(v),'num',k);el('small',l,'',k)});
el('h3','Reasons for delay or drop-off (open cases, one case can have several)','',box);
const R={'No coordinator assigned':open.filter(isUn).length,'Referral rejected':open.filter(isRej).length,'Patient no-show':open.filter(c=>c.appointment&&c.appointment.noShow).length,'Patient has not acknowledged and is overdue':open.filter(c=>c.stage==='patient_notified'&&isOver(c)).length,'Overdue at its current stage':over.length};
const bars=(obj,mx)=>Object.entries(obj).forEach(([k,n])=>{el('div',k+' · '+n,'mut',box);el('div','','mbar',box).append(Object.assign(document.createElement('i'),{style:'width:'+Math.max(2,Math.round(100*n/(mx||1)))+'%'}))});
bars(R,Math.max(...Object.values(R),1));
el('h3','How far cases have progressed (cases that reached each stage)','',box);
const F2={};STAGES.forEach((s,k)=>{F2[RULES[s].label]=cases.filter(c=>STAGES.indexOf(c.stage)>=k).length});bars(F2,cases.length);
el('h3','By department','',box);const D={};
cases.forEach(c=>{const n=condInfo(c).dept.n,d=D[n]=D[n]||{o:0,v:0,c:0};if(isOpen(c)){d.o++;if(isOver(c))d.v++}else d.c++});
const w=el('div','','wrap',box),t=el('table','','',w);const h=el('tr','','',el('thead','','',t));['Department','Open','Overdue','Closed'].forEach(x=>el('th',x,'',h));
Object.entries(D).sort((a,b)=>b[1].v-a[1].v).forEach(([n,d])=>{const r=el('tr','','',el('tbody','','',t));[n,d.o,d.v,d.c].forEach(x=>el('td',String(x),'',r))});
el('p','Pilot plan: record the same measures for a real screening programme before and after introducing the tool, then compare. Clinical outcomes would need their own ethical review.','note',box)}
let LANG='en',LANGSET=false;
const PREF={'Hello, ':['مرحباً، ','നമസ്കാരം, '],'Your doctor: ':['طبيبك: ','നിങ്ങളുടെ ഡോക്ടർ: '],'Care coordinator: ':['منسّق الرعاية: ','കെയർ കോഓർഡിനേറ്റർ: ']};
const TR={
'From screening result to completed care.':['من نتيجة الفحص إلى اكتمال الرعاية.','സ്ക്രീനിംഗ് ഫലം മുതൽ പൂർണ്ണ പരിചരണം വരെ.'],
'Track every result':['تتبّع كل نتيجة','ഓരോ ഫലവും ട്രാക്ക് ചെയ്യുക'],
'Guide every patient':['أرشد كل مريض','ഓരോ രോഗിയെയും നയിക്കുക'],
'Close every loop':['أغلق كل حلقة متابعة','ഓരോ തുടർനടപടിയും പൂർത്തിയാക്കുക'],
'Prototype · simulated data':['نموذج أولي · بيانات تجريبية','പ്രോട്ടോടൈപ്പ് · സിമുലേറ്റഡ് ഡാറ്റ'],
'Who are you?':['من أنت؟','നിങ്ങൾ ആരാണ്?'],
'I am a patient':['أنا مريض','ഞാൻ ഒരു രോഗിയാണ്'],
'See my result, my next steps and get help':['اطّلع على نتيجتي وخطواتي التالية واحصل على المساعدة','എന്റെ ഫലം, അടുത്ത ഘട്ടങ്ങൾ കാണുക, സഹായം നേടുക'],
'I am from the hospital':['أنا من المستشفى','ഞാൻ ആശുപത്രിയിൽ നിന്നാണ്'],
'Track and manage patient cases':['تتبّع حالات المرضى وإدارتها','രോഗികളുടെ കേസുകൾ ട്രാക്ക് ചെയ്യുക, നിയന്ത്രിക്കുക'],
'Demo only. All people and results are fictional.':['للعرض التجريبي فقط. جميع الأشخاص والنتائج وهمية.','ഡെമോ മാത്രം. എല്ലാ ആളുകളും ഫലങ്ങളും സാങ്കൽപ്പികമാണ്.'],
'Patient sign in':['تسجيل دخول المريض','രോഗി സൈൻ ഇൻ'],
'Phone number':['رقم الهاتف','ഫോൺ നമ്പർ'],
'MPIN':['الرقم السري (MPIN)','MPIN'],
'Sign in':['تسجيل الدخول','സൈൻ ഇൻ'],
'Back':['رجوع','തിരികെ'],
'Cancel':['إلغاء','റദ്ദാക്കുക'],
'New patient? Create account':['مريض جديد؟ أنشئ حساباً','പുതിയ രോഗിയാണോ? അക്കൗണ്ട് ഉണ്ടാക്കുക'],
'Sign out':['تسجيل الخروج','സൈൻ ഔട്ട്'],
'Confirm your details':['أكّد بياناتك','നിങ്ങളുടെ വിവരങ്ങൾ സ്ഥിരീകരിക്കുക'],
'Full name':['الاسم الكامل','പൂർണ്ണ നാമം'],
'Age':['العمر','പ്രായം'],
'Preferred language':['اللغة المفضلة','ഇഷ്ടപ്പെട്ട ഭാഷ'],
'I agree to share my details with my care team.':['أوافق على مشاركة بياناتي مع فريق الرعاية.','എന്റെ വിവരങ്ങൾ എന്റെ പരിചരണ സംഘവുമായി പങ്കിടാൻ ഞാൻ സമ്മതിക്കുന്നു.'],
'Continue':['متابعة','തുടരുക'],
'Create your account':['أنشئ حسابك','നിങ്ങളുടെ അക്കൗണ്ട് ഉണ്ടാക്കുക'],
'Create account':['إنشاء الحساب','അക്കൗണ്ട് ഉണ്ടാക്കുക'],
'Translated by AI. Please check anything important with your care team.':['ترجمة بالذكاء الاصطناعي. يرجى التأكد من أي أمر مهم مع فريق الرعاية.','എഐ വിവർത്തനം. പ്രധാന കാര്യങ്ങൾ പരിചരണ സംഘത്തോട് ഉറപ്പാക്കുക.'],
'Emergency 999 · Ambulance 998 · Hospital emergency line +971 2 000 0000 (demo number)':['الطوارئ 999 · الإسعاف 998 · خط طوارئ المستشفى +971 2 000 0000 (رقم تجريبي)','അടിയന്തരം 999 · ആംബുലൻസ് 998 · ആശുപത്രി എമർജൻസി ലൈൻ +971 2 000 0000 (ഡെമോ നമ്പർ)'],
'Your screening test':['فحص الكشف الخاص بك','നിങ്ങളുടെ സ്ക്രീനിംഗ് പരിശോധന'],
'This is not a diagnosis. Your care team will explain what it means.':['هذا ليس تشخيصاً. سيشرح لك فريق الرعاية معناه.','ഇത് രോഗനിർണയമല്ല. ഇതിന്റെ അർത്ഥം നിങ്ങളുടെ പരിചരണ സംഘം വിശദീകരിക്കും.'],
'Where you are':['أين وصلت حالتك','നിങ്ങൾ ഇപ്പോൾ എവിടെയാണ്'],
'What happens next':['ما الذي سيحدث بعد ذلك','അടുത്തതായി എന്ത് സംഭവിക്കും'],
'I understand':['فهمت','ഞാൻ മനസ്സിലാക്കി'],
'I need help':['أحتاج إلى مساعدة','എനിക്ക് സഹായം വേണം'],
'Your care team has been asked to contact you.':['تم إبلاغ فريق الرعاية بالتواصل معك.','നിങ്ങളെ ബന്ധപ്പെടാൻ പരിചരണ സംഘത്തോട് ആവശ്യപ്പെട്ടിട്ടുണ്ട്.'],
'Book an appointment':['احجز موعداً','അപ്പോയിന്റ്മെന്റ് ബുക്ക് ചെയ്യുക'],
'Cancel appointment':['إلغاء الموعد','അപ്പോയിന്റ്മെന്റ് റദ്ദാക്കുക'],
'While you wait':['أثناء الانتظار','കാത്തിരിക്കുമ്പോൾ'],
'Do: keep your appointment, bring your reports and medicine list, and write down your questions. Follow any preparation steps sent for your test.':['افعل: التزم بموعدك، وأحضر تقاريرك وقائمة أدويتك، ودوّن أسئلتك. اتبع أي تعليمات تحضير تصلك لفحصك.','ചെയ്യേണ്ടത്: അപ്പോയിന്റ്മെന്റിന് എത്തുക, റിപ്പോർട്ടുകളും മരുന്നുകളുടെ പട്ടികയും കൊണ്ടുവരിക, ചോദ്യങ്ങൾ എഴുതി വയ്ക്കുക. പരിശോധനയ്ക്കുള്ള തയ്യാറെടുപ്പ് നിർദ്ദേശങ്ങൾ പാലിക്കുക.'],
'Avoid: starting or stopping medicines on your own, or delaying your visit.':['تجنّب: بدء الأدوية أو إيقافها من تلقاء نفسك، أو تأخير زيارتك.','ഒഴിവാക്കേണ്ടത്: സ്വയം മരുന്ന് തുടങ്ങുകയോ നിർത്തുകയോ ചെയ്യുന്നത്, സന്ദർശനം വൈകിക്കുന്നത്.'],
'Sample guidance for this demo. A clinician must review it before real use.':['إرشادات تجريبية لهذا العرض. يجب أن يراجعها طبيب قبل الاستخدام الفعلي.','ഈ ഡെമോയ്ക്കുള്ള സാമ്പിൾ മാർഗ്ഗനിർദ്ദേശം. യഥാർത്ഥ ഉപയോഗത്തിന് മുമ്പ് ഒരു ക്ലിനിഷ്യൻ പരിശോധിക്കണം.'],
'Upload a report':['ارفع تقريراً','റിപ്പോർട്ട് അപ്‌ലോഡ് ചെയ്യുക'],
'Care assistant':['مساعد الرعاية','പരിചരണ സഹായി'],
'Type a question':['اكتب سؤالاً','ഒരു ചോദ്യം ടൈപ്പ് ചെയ്യുക'],
'What do I do next?':['ماذا أفعل بعد ذلك؟','ഞാൻ അടുത്തതായി എന്ത് ചെയ്യണം?'],
'What is a colonoscopy?':['ما هو تنظير القولون؟','കൊളോണോസ്കോപ്പി എന്നാൽ എന്താണ്?'],
'Is my result serious?':['هل نتيجتي خطيرة؟','എന്റെ ഫലം ഗുരുതരമാണോ?'],
'Talk to my care team':['التحدث إلى فريق الرعاية','എന്റെ പരിചരണ സംഘവുമായി സംസാരിക്കുക'],
'May I help you? I can explain your next step and common questions. I do not read test results or give medical advice. My replies are written by AI and can contain mistakes.':['هل يمكنني مساعدتك؟ يمكنني شرح خطوتك التالية والأسئلة الشائعة. لا أقرأ نتائج الفحوص ولا أقدّم نصائح طبية. ردودي مكتوبة بواسطة الذكاء الاصطناعي وقد تحتوي على أخطاء.','ഞാൻ സഹായിക്കട്ടെ? നിങ്ങളുടെ അടുത്ത ഘട്ടവും സാധാരണ ചോദ്യങ്ങളും വിശദീകരിക്കാൻ എനിക്ക് കഴിയും. ഞാൻ പരിശോധനാ ഫലങ്ങൾ വായിക്കുകയോ വൈദ്യോപദേശം നൽകുകയോ ചെയ്യില്ല. എന്റെ മറുപടികൾ എഐ എഴുതുന്നതാണ്, തെറ്റുകൾ ഉണ്ടാകാം.'],
'Result recorded':['تم تسجيل النتيجة','ഫലം രേഖപ്പെടുത്തി'],'Patient notified':['تم إبلاغ المريض','രോഗിയെ അറിയിച്ചു'],'Acknowledged':['تم الإقرار','അംഗീകരിച്ചു'],'Clinician review':['مراجعة الطبيب','ക്ലിനിഷ്യൻ പരിശോധന'],'Referral sent':['أُرسلت الإحالة','റഫറൽ അയച്ചു'],'Referral accepted':['قُبلت الإحالة','റഫറൽ സ്വീകരിച്ചു'],'Appointment set':['تم تحديد الموعد','അപ്പോയിന്റ്മെന്റ് നിശ്ചയിച്ചു'],'Attended':['تم الحضور','എത്തി'],'Closed':['مغلقة','അടച്ചു'],
'Your result has been recorded. Your care team will contact you soon.':['تم تسجيل نتيجتك. سيتواصل معك فريق الرعاية قريباً.','നിങ്ങളുടെ ഫലം രേഖപ്പെടുത്തി. പരിചരണ സംഘം ഉടൻ നിങ്ങളെ ബന്ധപ്പെടും.'],
'Please confirm you have seen your result by tapping “I understand”.':['يرجى تأكيد اطلاعك على نتيجتك بالضغط على «فهمت».','“ഞാൻ മനസ്സിലാക്കി” അമർത്തി നിങ്ങൾ ഫലം കണ്ടു എന്ന് സ്ഥിരീകരിക്കുക.'],
'A clinician will review your result and decide the next step with you.':['سيراجع الطبيب نتيجتك ويقرر معك الخطوة التالية.','ഒരു ക്ലിനിഷ്യൻ നിങ്ങളുടെ ഫലം പരിശോധിച്ച് അടുത്ത ഘട്ടം നിങ്ങളോടൊപ്പം തീരുമാനിക്കും.'],
'A clinician is reviewing your case. You may be referred for a further test.':['يراجع الطبيب حالتك. قد يتم تحويلك لإجراء فحص إضافي.','ഒരു ക്ലിനിഷ്യൻ നിങ്ങളുടെ കേസ് പരിശോധിക്കുകയാണ്. കൂടുതൽ പരിശോധനയ്ക്ക് നിങ്ങളെ റഫർ ചെയ്തേക്കാം.'],
'A referral has been sent. We are waiting for the specialist team to accept it.':['تم إرسال الإحالة. ننتظر قبول فريق الأخصائيين لها.','റഫറൽ അയച്ചു. സ്പെഷ്യലിസ്റ്റ് സംഘം അത് സ്വീകരിക്കാൻ കാത്തിരിക്കുന്നു.'],
'The specialist team accepted your referral. An appointment will be arranged.':['قبل فريق الأخصائيين إحالتك. سيتم ترتيب موعد.','സ്പെഷ്യലിസ്റ്റ് സംഘം നിങ്ങളുടെ റഫറൽ സ്വീകരിച്ചു. ഒരു അപ്പോയിന്റ്മെന്റ് ക്രമീകരിക്കും.'],
'Your appointment is booked. Please attend, and tell your care team if you cannot.':['تم حجز موعدك. يرجى الحضور، وأبلغ فريق الرعاية إن لم تستطع.','നിങ്ങളുടെ അപ്പോയിന്റ്മെന്റ് ബുക്ക് ചെയ്തു. ദയവായി എത്തുക; കഴിയില്ലെങ്കിൽ പരിചരണ സംഘത്തെ അറിയിക്കുക.'],
'Thank you for attending. Your care team is recording the outcome.':['شكراً لحضورك. يسجّل فريق الرعاية النتيجة.','എത്തിയതിന് നന്ദി. നിങ്ങളുടെ പരിചരണ സംഘം ഫലം രേഖപ്പെടുത്തുന്നു.'],
'Your case is complete. Contact your care team if you have new concerns.':['اكتملت حالتك. تواصل مع فريق الرعاية إن كانت لديك مخاوف جديدة.','നിങ്ങളുടെ കേസ് പൂർത്തിയായി. പുതിയ ആശങ്കകളുണ്ടെങ്കിൽ പരിചരണ സംഘത്തെ ബന്ധപ്പെടുക.'],
'Your first referral was not accepted. Your care team is arranging another provider.':['لم تُقبل إحالتك الأولى. يرتّب فريق الرعاية جهة أخرى.','നിങ്ങളുടെ ആദ്യ റഫറൽ സ്വീകരിച്ചില്ല. പരിചരണ സംഘം മറ്റൊരു ദാതാവിനെ ക്രമീകരിക്കുന്നു.']};
function applyLang(){const k={en:-1,ar:0,ml:1}[LANG];
['home','plogin','newacct','pprofile','portal','bar'].forEach(id=>{const root=$(id);if(id!=='bar')root.dir=LANG==='ar'?'rtl':'ltr';
const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;
while(n=w.nextNode()){const o=n.__en!==undefined?n.__en:(n.__en=n.nodeValue),t=o.trim();if(!t)continue;let r=o;
if(k>=0){const v=TR[t];if(v)r=o.replace(t,v[k]);else for(const p in PREF)if(t.startsWith(p)){r=o.replace(p,PREF[p][k]);break}}
if(n.nodeValue!==r)n.nodeValue=r}
root.querySelectorAll('[placeholder]').forEach(e=>{const o=e.__ph!==undefined?e.__ph:(e.__ph=e.getAttribute('placeholder')),v=TR[o];e.setAttribute('placeholder',k>=0&&v?v[k]:o)})});
$('trnote').hidden=k<0;$('langsel').value=LANG;document.querySelectorAll('#langs button').forEach(b=>b.classList.toggle('on',b.dataset.l===LANG))}
function setLang(l){LANG=l;LANGSET=true;if(session&&session.role==='patient'){const c=cases.find(x=>x.id===session.id);if(c){c.patient.language=l;save()}}applyLang()}
{const _s=show;show=function(v){_s(v);applyLang()};const _r=renderPortal;renderPortal=function(c){if(!LANGSET&&c.patient.language&&LANGN[c.patient.language])LANG=c.patient.language;_r(c);applyLang()}}
document.querySelectorAll('#langs button').forEach(b=>{b.onclick=()=>setLang(b.dataset.l)});$('langsel').onchange=()=>setLang($('langsel').value);
cases.forEach(c=>{if(c.confirm!==undefined)return;const h=hsh(c.id+'cf'),i=STAGES.indexOf(c.stage);
c.confirm={required:h%5<2};
if(c.confirm.required&&i>=STAGES.indexOf('referral_sent')){c.confirm.orderedAt=dateOnly(addDays(DEMO_TODAY,-(8+h%5)));c.confirm.result='Confirmed, referral appropriate (demo)';c.confirm.resultAt=dateOnly(addDays(DEMO_TODAY,-(4+h%3)));c.confirm.by='Treating doctor (demo)'}
else if(c.confirm.required&&c.stage==='clinician_review'&&h%2)c.confirm.orderedAt=dateOnly(addDays(DEMO_TODAY,-(1+h%3)));
if((c.stage==='attended'||c.stage==='closed')&&c.care===undefined)c.care=Object.assign({type:h%3===0?'surveillance':'treatment',startedAt:dateOnly(addDays(DEMO_TODAY,-(1+h%6))),plan:'Plan set by treating doctor (demo)'},(c.stage==='closed'||h%2)?{outcome:'Outcome recorded (demo)',outcomeAt:dateOnly(addDays(DEMO_TODAY,-1))}:{})});
function careBox(box,c){if(!isOpen(c)&&!c.care)return;el('h3','Confirmatory test and care','',box);
const cf=c.confirm=c.confirm||{required:false};
const lab=el('label','','',box),cb=el('input','','',lab);cb.type='checkbox';cb.checked=!!cf.required;cb.style.width='auto';lab.append(' Confirmatory test required');cb.disabled=!isOpen(c);
cb.onchange=()=>{cf.required=cb.checked;logAccess('Confirm flag '+c.id);refresh()};
if(cf.required){el('p',cf.result?'Result recorded '+cf.resultAt+': '+cf.result:(cf.orderedAt?'Test ordered '+cf.orderedAt+', waiting for result':'Not yet ordered'),'mut',box);
if(isOpen(c)&&!cf.orderedAt)el('button','Order test','',box).onclick=()=>{cf.orderedAt=TODAY;refresh()};
if(isOpen(c)&&cf.orderedAt&&!cf.result){const ri=el('input','','',box);ri.placeholder='Confirmation result';el('button','Record result','',box).onclick=()=>{if(!ri.value.trim())return;cf.result=ri.value.trim();cf.resultAt=TODAY;cf.by=session.name;refresh()}}}
const cr=c.care;
if(cr){el('p',(cr.type==='surveillance'?'Surveillance':'Treatment')+' started '+cr.startedAt+(cr.plan?': '+cr.plan:'')+(cr.outcome?' · Outcome ('+cr.outcomeAt+'): '+cr.outcome:' · outcome not yet recorded'),'mut',box);
if(isOpen(c)&&!cr.outcome){const oi=el('input','','',box);oi.placeholder='Outcome of care';el('button','Record outcome','',box).onclick=()=>{if(!oi.value.trim())return;cr.outcome=oi.value.trim();cr.outcomeAt=TODAY;refresh()}}}
else if(isOpen(c)&&STAGES.indexOf(c.stage)>=STAGES.indexOf('appointment_scheduled')){const ty=el('select','','',box);[['treatment','Treatment'],['surveillance','Surveillance']].forEach(([v,t])=>{el('option',t,'',ty).value=v});const pl=el('input','','',box);pl.placeholder='Plan (set by the clinician)';el('button','Record care started','',box).onclick=()=>{if(!pl.value.trim())return;c.care={type:ty.value,startedAt:TODAY,plan:pl.value.trim(),by:session.name};refresh()}}}
const SLA={consultAccept:2,consultSchedule:3,referralResponse:3};
const dAdd=(d,n)=>dateOnly(addDays(new Date(d+'T12:00:00Z'),n));
const PROV_EXT=['Al Noor Specialist Hospital (demo)','Gulf Care Medical Centre (demo)'];
const provOpts=c=>[...condInfo(c).dept.docs,...PROV_EXT];
const REJ=['Capacity full','Outside our specialty','Missing clinical information','Patient needs another service'];
function consultState(k){if(k.status==='requested')return{next:k.to,due:dAdd(k.requestedAt,SLA.consultAccept)};
if(k.status==='accepted')return{next:k.acceptedBy||k.to,due:dAdd(k.acceptedAt,SLA.consultSchedule)};
if(k.status==='scheduled')return{next:k.to,due:k.scheduledFor.date};
if(k.status==='rejected')return{next:k.from,due:k.rejectedAt};return null}
const consultOver=k=>{const s=consultState(k);return !!s&&k.status!=='rejected'&&s.due<TODAY};
const consultAttn=c=>(c.consults||[]).some(k=>k.status==='rejected'||consultOver(k));
const refOver=c=>!!c.referral&&c.referral.status==='sent'&&!!c.referral.sentAt&&dAdd(c.referral.sentAt,SLA.referralResponse)<TODAY;
cases.forEach((c,n)=>{const h=hsh(c.id+'rf'),r=c.referral;
if(r.status!=='not_started'&&r.sentAt===undefined){const o=provOpts(c),base=c.stageEnteredAt||dAdd(c.screening.date,5),later=['accepted','appointment_pending','completed'].includes(r.status);
r.from=c.doctor;r.to=o[h%o.length];r.history=[];r.sentAt=later?dAdd(base,-2):base;
if(later){r.acceptedAt=dAdd(r.sentAt,1);r.response='Accepted. Please book the first available visit (demo).'}
if(r.status==='rejected'){const d=dAdd(r.sentAt,1);r.rejectedAt=d>TODAY?TODAY:d;r.rejectReason=REJ[h%REJ.length];r.response='Rejected: '+r.rejectReason}}
if(c.consults)c.consults=c.consults.map(k=>k.status?k:{id:'K0',from:c.doctor,to:k.to,q:k.q,status:'requested',requestedAt:k.at,response:k.reply||null});
if(!c.consultSeeded){c.consultSeeded=true;const i=STAGES.indexOf(c.stage);
if(h%4===0&&isOpen(c)&&i>=3){const s=Math.floor(h/7)%6,to=ALLDOCS[h%ALLDOCS.length],k={id:'K1',from:c.doctor,to,q:'Please advise on the follow-up plan (demo).',status:'requested',requestedAt:dAdd(TODAY,s===0?-4:-1)};
if(s>=2){k.status='accepted';k.acceptedAt=dAdd(TODAY,-1);k.acceptedBy=to}
if(s===3){k.status='scheduled';k.scheduledFor={date:dAdd(TODAY,2),time:'10:00'};k.scheduledBy='Care coordinator (demo)'}
if(s===4){k.status='completed';k.scheduledFor={date:dAdd(TODAY,-1),time:'10:00'};k.scheduledBy='Care coordinator (demo)';k.completedAt=dAdd(TODAY,-1);k.outcome='Specialist advises referral and follow-up as planned (demo).'}
if(s===5){k.status='rejected';k.rejectedAt=TODAY;k.rejectReason='Outside my specialty'}
c.consults=[k]}}});
function doRerefer(c,prov){const r=c.referral;r.history=r.history||[];r.history.push('Rejected by '+r.to+' on '+r.rejectedAt+' ('+r.rejectReason+')');r.to=prov;r.sentAt=TODAY;r.status='sent';delete r.rejectedAt;delete r.rejectReason;delete r.response;c.stageEnteredAt=TODAY;c.dueDate=dateOnly(addDays(DEMO_TODAY,RULES.referral_sent.days));c.consultNotes.push({at:TODAY,text:'Referral re-sent to '+prov+'.'})}
function reRefer(c){if(c.referral.status!=='rejected')return;doRerefer(c,provOpts(c).find(x=>x!==c.referral.to))}
function referralBox(box,c){const r=c.referral;el('h3','Referral','',box);
const nm={not_started:'Not sent',sent:'Sent, awaiting the receiving provider’s response',accepted:'Accepted',rejected:'Rejected',appointment_pending:'Accepted, appointment pending',completed:'Completed'};
el('p','Status: '+(nm[r.status]||r.status)+(refOver(c)?' · OVERDUE, no response by '+dAdd(r.sentAt,SLA.referralResponse):''),'',box);
if(r.sentAt)el('p','From '+(r.from||c.doctor)+' to '+r.to+' · sent '+r.sentAt+(r.acceptedAt?' · accepted '+r.acceptedAt:'')+(r.rejectedAt?' · rejected '+r.rejectedAt+' ('+r.rejectReason+')':''),'mut',box);
if(r.response)el('p','Receiving provider: '+r.response,'mut',box);
(r.history||[]).forEach(x=>el('p',x,'mut',box));
if(!isOpen(c))return;const msg=el('p','','mut',box);
if(c.stage==='clinician_review'&&!r.to){const s=el('select','','',box);provOpts(c).forEach(x=>{el('option',x,'',s).value=x});
el('button','Send referral','',box).onclick=()=>{r.from=c.doctor;r.to=s.value;r.sentAt=TODAY;r.status='sent';const m=moveNext(c);if(!m.ok){r.to=null;r.sentAt=null;r.status='not_started';msg.textContent=m.reason;return}refresh()}}
if(r.status==='sent'){const rs=el('input','','',box);rs.placeholder='Receiving provider’s response';
el('button','Record accepted','',box).onclick=()=>{if(!rs.value.trim()){msg.textContent='Enter the receiving provider’s response first.';return}r.status='accepted';r.acceptedAt=TODAY;r.response=rs.value.trim();const m=moveNext(c);if(!m.ok){msg.textContent=m.reason;return}logAccess('Referral accepted '+c.id);refresh()};
const rj=el('select','','',box);REJ.forEach(x=>{el('option',x,'',rj).value=x});const rt=el('input','','',box);rt.placeholder='Details (optional)';
el('button','Record rejected','',box).onclick=()=>{r.status='rejected';r.rejectedAt=TODAY;r.rejectReason=rj.value;r.response='Rejected: '+rj.value+(rt.value.trim()?' - '+rt.value.trim():'');logAccess('Referral rejected '+c.id);refresh()}}
if(r.status==='rejected'){const s=el('select','','',box);provOpts(c).filter(x=>x!==r.to).forEach(x=>{el('option',x,'',s).value=x});el('button','Re-refer to selected provider','',box).onclick=()=>{doRerefer(c,s.value);logAccess('Re-referred '+c.id);refresh()}}
if(r.sentAt)el('p','Next: '+(r.status==='rejected'?'choose an alternative provider':r.status==='sent'?'the receiving provider must respond':'schedule and confirm the appointment'),'mut',box)}
function consultBox(box,c){el('h3','Consultations (clinician to clinician)','',box);
const cs=c.consults||[];if(!cs.length)el('p','No consultation requests yet.','mut',box);
cs.forEach(k=>{const s=consultState(k),ov=consultOver(k),row=el('div','','pv',box);
el('p',k.status.toUpperCase()+(ov?' · OVERDUE':'')+' · '+k.from+' → '+k.to+': '+k.q,'',row);
const tl=['Requested '+k.requestedAt];if(k.acceptedAt)tl.push('accepted '+k.acceptedAt+' by '+(k.acceptedBy||k.to));if(k.scheduledFor)tl.push('scheduled '+k.scheduledFor.date+' '+k.scheduledFor.time+' (set by '+k.scheduledBy+')');if(k.completedAt)tl.push('completed '+k.completedAt);if(k.rejectedAt)tl.push('rejected '+k.rejectedAt+': '+k.rejectReason);
el('p',tl.join(' · '),'mut',row);(k.history||[]).forEach(x=>el('p',x,'mut',row));if(k.outcome)el('p','Outcome: '+k.outcome,'mut',row);else if(k.response)el('p','Reply (not a completed consultation): '+k.response,'mut',row);
if(s)el('p','Next action: '+s.next+(k.status==='rejected'?' (choose another clinician)':' by '+s.due),'mut',row);
if(!isOpen(c))return;
const act=(label,fn)=>{el('button',label,'',row).onclick=()=>{fn();logAccess('Consultation '+label+' '+c.id);refresh()}};
if(k.status==='requested'){act('Accept',()=>{k.status='accepted';k.acceptedAt=TODAY;k.acceptedBy=k.to});
const rr=el('input','','',row);rr.placeholder='Reason if rejecting';el('button','Reject','',row).onclick=()=>{if(!rr.value.trim())return;k.status='rejected';k.rejectedAt=TODAY;k.rejectReason=rr.value.trim();logAccess('Consultation rejected '+c.id);refresh()}}
if(k.status==='accepted'){const d=el('select','','',row);apptDays().forEach(x=>{el('option',x,'',d).value=x});const t=el('select','','',row);SLOTS.forEach(x=>{el('option',x,'',t).value=x});act('Schedule',()=>{k.status='scheduled';k.scheduledFor={date:d.value,time:t.value};k.scheduledBy=session.name})}
if(k.status==='scheduled'){const o=el('input','','',row);o.placeholder='Consultation outcome';el('button','Record outcome and complete','',row).onclick=()=>{if(!o.value.trim())return;k.status='completed';k.completedAt=TODAY;k.outcome=o.value.trim();logAccess('Consultation completed '+c.id);refresh()}}
if(k.status==='rejected'){const s2=el('select','','',row);ALLDOCS.filter(x=>x!==k.to).forEach(x=>{el('option',x,'',s2).value=x});act('Reassign',()=>{const old=k.to,why=k.rejectReason;k.history=(k.history||[]).concat('Rejected by '+old+' on '+k.rejectedAt+' ('+why+')');k.status='requested';k.to=s2.value;k.requestedAt=TODAY;delete k.rejectedAt;delete k.rejectReason})}});
(c.handoffs||[]).forEach(h=>el('p',h.at+' · coordinator: '+h.from+' → '+h.to,'mut',box));
if(!isOpen(c))return;const sel=el('select','','',box);ALLDOCS.filter(x=>x!==c.doctor).forEach(x=>{el('option',x,'',sel).value=x});const q=el('input','','',box);q.placeholder='Question for the clinician';
el('button','Request consultation','',box).onclick=()=>{if(!q.value.trim())return;(c.consults=c.consults||[]).push({id:'K'+(c.consults.length+1),from:c.doctor,to:sel.value,q:q.value.trim(),status:'requested',requestedAt:TODAY});logAccess('Consultation requested '+c.id);refresh()}}
const CFG={dueSoonDays:1,escalateAfterDays:2,responseFollowUpDays:1},CFGLOG=[];
try{const s=JSON.parse(localStorage.getItem('careconnect-cfg-v1')||'null');if(s){Object.assign(CFG,s.cfg||{});Object.assign(SLA,s.sla||{});Object.entries(s.days||{}).forEach(([k,v])=>{if(RULES[k])RULES[k].days=v});(s.log||[]).forEach(x=>CFGLOG.push(x))}}catch(e){}
function saveCfg(){try{localStorage.setItem('careconnect-cfg-v1',JSON.stringify({cfg:CFG,sla:SLA,days:Object.fromEntries(Object.entries(RULES).map(([k,v])=>[k,v.days])),log:CFGLOG}))}catch(e){}}
const RS_ATT=['Work or family commitment','Transport problem','Feeling unwell','Other'],RS_ACC=['Cost','Transport or distance','Language or communication','Technology or documents','Other'];
const T_OWNERS=[...OWNERS.map(o=>o.name),'Triage coordinator (default)','Care coordination lead','Clinical lead (on-call clinician)',...ALLDOCS];
const ESC_TO={urgent:'Clinical lead (on-call clinician)',consult:'Head of department'};
const stamp=()=>TODAY+' '+new Date().toTimeString().slice(0,5);
const actor=()=>session?(session.role==='patient'?session.name+' (patient)':session.name):'System';
const tState=t=>t.status==='completed'?'completed':t.due<TODAY?'overdue':t.due<=dAdd(TODAY,CFG.dueSoonDays)?'duesoon':'pending';
const taskOver=c=>(c.tasks||[]).some(t=>t.status==='open'&&t.due<TODAY);
function mkTask(c,key,type,title,owner,due,why){c.tasks=c.tasks||[];if(c.tasks.some(t=>t.key===key))return null;
const t={id:c.id+'-T'+(c.tasks.length+1),key,type,title,owner,due,status:'open',createdAt:stamp(),by:actor(),history:[],escalations:[]};
t.history.push({at:t.createdAt,by:t.by,type:'created',text:'Task created. '+why+' Owner: '+owner+', due '+due+'.'});c.tasks.push(t);return t}
function syncTasks(c){if(!isOpen(c))return;const co=c.owner?c.owner.name:'Triage coordinator (default)';
mkTask(c,'stage:'+c.stage,'stage',RULES[c.stage].action+' ('+RULES[c.stage].label+')',co,c.dueDate||TODAY,'Next action for this case.'+(c.owner?'':' No coordinator is assigned, so it sits in the triage queue.'));
if(c.stage==='patient_notified'&&c.messages[0]&&isOver(c))mkTask(c,'auto:noack:'+c.messages[0].sentAt,'followup','Follow up: patient has not acknowledged',co,dAdd(TODAY,1),'The patient did not acknowledge by the deadline.');
(c.consults||[]).forEach(k=>{if(k.status==='rejected')mkTask(c,'auto:crej:'+k.id+k.rejectedAt,'consult','Reassign rejected consultation ('+k.id+')',co,dAdd(TODAY,1),'Consultation rejected: '+k.rejectReason+'.');else if(consultOver(k))mkTask(c,'auto:cover:'+k.id+k.status,'consult','Consultation overdue ('+k.id+', '+k.status+')',k.to,dAdd(TODAY,1),'The consultation is past its deadline, so the responsible team must act.')});
if(isRej(c))mkTask(c,'auto:rrej:'+c.referral.rejectedAt,'referral','Re-refer: referral was rejected',co,dAdd(TODAY,1),'Rejected by '+c.referral.to+': '+c.referral.rejectReason+'.');
if(c.appointment&&(c.appointment.noShow||isLate(c)))mkTask(c,'auto:miss:'+c.appointment.date,'followup','Patient follow-up: missed or late appointment',co,dAdd(TODAY,1),'The appointment on '+c.appointment.date+' was missed or the patient is late.');
if(c.urgent)mkTask(c,'auto:urgent:'+c.urgent.at,'urgent','URGENT: patient asked for help',c.doctor,TODAY,'Qualified clinical staff must respond. '+c.urgent.reason+'.')}
function escalate(c,t,by,reason){const to=ESC_TO[t.type]||'Care coordination lead',e={to,at:stamp(),by,responsible:t.owner,reason};t.escalations.push(e);t.history.push({at:e.at,by,type:'escalation',from:null,to,text:'Escalated to '+to+'. Responsible person: '+t.owner+'. '+reason})}
function autoEsc(c){(c.tasks||[]).forEach(t=>{if(t.status!=='open'||t.escalations.length)return;const od=Math.round((new Date(TODAY)-new Date(t.due))/864e5);if(t.type==='urgent'||od>=CFG.escalateAfterDays)escalate(c,t,'Escalation rule (automatic)',t.type==='urgent'?'Urgent patient request.':'Overdue by '+od+' days.')})}
function completeTask(c,t,note){if(t.status!=='open'||t.type==='stage')return false;if((t.type==='response'||t.type==='urgent')&&!note)return false;
t.status='completed';t.completedAt=stamp();t.completedBy=actor();t.history.push({at:t.completedAt,by:t.completedBy,type:'status',from:'open',to:'completed',text:note||'Completed.'});
if(t.responseId){const r=(c.responses||[]).find(x=>x.id===t.responseId);if(r){r.status='resolved';r.resolvedAt=t.completedAt;r.resolvedBy=t.completedBy;r.resolution=note}}return true}
function respond(c,type,reason,text){const r={id:'R'+((c.responses||[]).length+1),type,reason,text,at:stamp(),status:'open'};(c.responses=c.responses||[]).push(r);
const co=c.owner?c.owner.name:'Triage coordinator (default)',t=mkTask(c,'resp:'+c.id+r.id,'response',(type==='cannot_attend'?'Follow up: patient cannot attend':'Follow up: patient cannot access the service')+' ('+reason+')',co,dAdd(TODAY,CFG.responseFollowUpDays),'Patient response. Barrier: '+reason+(text?' - '+text:'')+'.');
if(t)t.responseId=r.id;c.consultNotes.push({at:TODAY,text:'Patient response: '+(type==='cannot_attend'?'cannot attend':'cannot access service')+' ('+reason+(text?'; '+text:'')+'). Follow-up task created.'});save();logAccess('Patient response '+c.id)}
function save(){cases.forEach(c=>{syncTasks(c);autoEsc(c)});try{localStorage.setItem(KEY,JSON.stringify(cases))}catch(e){}}
function refresh(){save();renderStats();renderTable();renderAppts();renderTasks();if(openId)openCase(openId)}
{const _mn=moveNext;moveNext=function(c){const old=c.stage,r=_mn(c);if(r.ok){const t=(c.tasks||[]).find(x=>x.key==='stage:'+old&&x.status==='open');if(t){t.status='completed';t.completedAt=stamp();t.completedBy=actor();t.history.push({at:t.completedAt,by:t.completedBy,type:'status',from:'open',to:'completed',text:'Completed by moving the case on from '+RULES[old].label+'.'})}syncTasks(c)}return r}}
cases.forEach(c=>{if(c.tasksSeeded)return;c.tasksSeeded=true;const i=STAGES.indexOf(c.stage),h=hsh(c.id+'rs');
if(isOpen(c)&&i>=1){const prev=STAGES[i-1],who=c.owner?c.owner.name:'Care coordinator (demo)',d=c.stageEnteredAt||TODAY,t={id:c.id+'-T0',key:'stage:'+prev,type:'stage',title:RULES[prev].action+' ('+RULES[prev].label+')',owner:who,due:d,status:'completed',createdAt:c.screening.date+' 09:00',by:'System (demo seed)',completedAt:d+' 10:00',completedBy:who,history:[],escalations:[]};
t.history.push({at:t.createdAt,by:t.by,type:'created',text:'Task created (demo seed).'},{at:t.completedAt,by:who,type:'status',from:'open',to:'completed',text:'Completed when the case moved on (demo seed).'});(c.tasks=c.tasks||[]).push(t)}
if(isOpen(c)&&c.owner&&h%23===0&&i>=1&&i<=6)respond(c,h%2?'cannot_attend':'cannot_access',h%2?'Transport problem':'Cost','')});
save();
let tFilt='open',tQ='';
function renderTasks(){const box=$('taskpane');box.replaceChildren();const all=cases.flatMap(c=>(c.tasks||[]).map(t=>({c,t})));
const ok=(x,k)=>k==='all'||(k==='open'?x.t.status==='open':k==='esc'?x.t.status==='open'&&x.t.escalations.length>0:tState(x.t)===k);
const bar=el('div','','tabs',box);[['open','Open'],['pending','Pending'],['duesoon','Due soon'],['overdue','Overdue'],['esc','Escalated'],['completed','Completed'],['all','All']].forEach(([k,l])=>{el('button',l+' ('+all.filter(x=>ok(x,k)).length+')',k===tFilt?'on':'',bar).onclick=()=>{tFilt=k;renderTasks()}});
el('p','Deadlines are demo settings, not clinical standards (see Settings).','mut',box);
const q=el('input','','',box);q.placeholder='Search owner, case, patient or task, then press Enter';q.value=tQ;q.onchange=()=>{tQ=q.value;renderTasks()};
const s=tQ.trim().toLowerCase(),rows=all.filter(x=>ok(x,tFilt)&&(!s||[x.t.owner,x.c.id,x.c.patient.name,x.t.title].join(' ').toLowerCase().includes(s))).sort((a,b)=>(a.t.due<b.t.due?-1:a.t.due>b.t.due?1:0));
el('p',rows.length+' task'+(rows.length===1?'':'s')+(rows.length>80?' (showing the 80 most urgent)':''),'mut',box);
rows.slice(0,80).forEach(({c,t})=>{const row=el('div','','pv',box);row.style.cursor='pointer';row.onclick=()=>openTask(c.id,t.id);const st=tState(t);
el('p',t.title,'',row);const l=el('p','','mut',row);l.append(c.id+' · '+c.patient.name+' · owner: '+t.owner+' · due '+t.due+' ');
el('span',st==='duesoon'?'Due soon':st[0].toUpperCase()+st.slice(1),'badge '+(st==='overdue'?'bad':st==='completed'?'ok':st==='duesoon'?'warn':''),l);if(t.escalations.length&&t.status==='open')el('span','Escalated to '+t.escalations.at(-1).to,'badge bad',l)})}
function openTask(cid,tid){const c=cases.find(x=>x.id===cid),t=c.tasks.find(x=>x.id===tid),box=$('tbody');box.replaceChildren();
const redo=()=>{save();openTask(cid,tid);renderTasks();renderTable();renderStats()};
el('h2',t.title,'',box);el('p',c.id+' · '+c.patient.name+' · '+condInfo(c).dept.n,'mut',box);
if(textOnly(c))el('p','TEXT ONLY patient: contact in writing, not by voice call.','',box);if(needInterp(c))el('p','Interpreter required ('+(commOf(c).sign||'language not stated')+').','',box);
const st=tState(t),sp=el('p','','',box);el('span',st==='duesoon'?'Due soon':st[0].toUpperCase()+st.slice(1),'badge '+(st==='overdue'?'bad':st==='completed'?'ok':st==='duesoon'?'warn':''),sp);t.escalations.forEach(e=>el('span','Escalated to '+e.to,'badge bad',sp));
el('p','Owner: '+t.owner+' · Due: '+t.due+(t.status==='completed'?' · Completed '+t.completedAt+' by '+t.completedBy:''),'',box);
t.escalations.forEach(e=>el('p','Escalation: to '+e.to+' · '+e.at+' · by '+e.by+' · responsible: '+e.responsible+' · '+e.reason,'mut',box));const msg=el('p','','mut',box);
if(t.status==='open'){el('h3','Owner','',box);const os=el('select','','',box);[...new Set([t.owner,...T_OWNERS])].forEach(x=>{el('option',x,'',os).value=x});os.value=t.owner;
el('button','Reassign','',box).onclick=()=>{if(os.value===t.owner)return;const old=t.owner;t.owner=os.value;t.history.push({at:stamp(),by:actor(),type:'owner',from:old,to:t.owner,text:'Owner changed.'});logAccess('Task owner '+t.id);redo()};
el('h3','Deadline','',box);const di=el('input','','',box);di.type='date';di.value=t.due;const dr=el('input','','',box);dr.placeholder='Reason for changing the deadline (required)';
el('button','Change deadline','',box).onclick=()=>{if(!di.value||di.value===t.due){return}if(!dr.value.trim()){msg.textContent='Enter a reason for the new deadline.';return}const old=t.due;t.due=di.value;t.history.push({at:stamp(),by:actor(),type:'deadline',from:old,to:t.due,text:dr.value.trim()});logAccess('Task deadline '+t.id);redo()};
el('h3','Escalation','',box);const er=el('input','','',box);er.placeholder='Reason for escalating';el('button','Escalate now','',box).onclick=()=>{escalate(c,t,actor(),er.value.trim()||'Escalated manually.');logAccess('Task escalated '+t.id);redo()};
el('h3','Complete','',box);if(t.type==='stage')el('p','This task completes automatically when the case moves to the next stage.','mut',box);
else{const cn=el('input','','',box);cn.placeholder=(t.type==='response'||t.type==='urgent')?'Resolution note (required)':'Completion note';el('button','Complete task','pri',box).onclick=()=>{if(!completeTask(c,t,cn.value.trim())){msg.textContent='A resolution note is required for this task.';return}logAccess('Task completed '+t.id);redo()}}}
el('h3','Action history (never edited, only added to)','',box);
t.history.forEach(h=>el('p',h.at+' · '+h.by+' · '+h.type+': '+h.text+((h.from!=null||h.to!=null)?' ('+h.from+' → '+h.to+')':''),'mut',box));
el('button','Open case','',box).onclick=()=>{$('tdlg').close();openCase(cid)};el('button','Close','',box).onclick=()=>$('tdlg').close();if(!$('tdlg').open)$('tdlg').showModal()}
function taskBox(box,c){el('h3','Tasks','',box);const ts=c.tasks||[],op=ts.filter(t=>t.status==='open'),dn=ts.filter(t=>t.status!=='open').slice(-2);if(!op.length&&!dn.length)el('p','No tasks.','mut',box);
op.concat(dn).forEach(t=>{const row=el('p','','',box),s=tState(t);row.append(t.title+' · '+t.owner+' · due '+t.due+' · '+(s==='duesoon'?'due soon':s)+(t.escalations.length&&t.status==='open'?' · escalated to '+t.escalations.at(-1).to:'')+' ');el('button','Open','',row).onclick=()=>{$('dlg').close();openId=null;openTask(c.id,t.id)}})}
function renderSettings(){const box=$('setpane');box.replaceChildren();const adm=!!session&&session.role==='admin',fields=[];
el('p','Demo settings, not clinical standards. Only an admin can change them. Changes apply to tasks and due dates created from now on; existing due dates are not rewritten. Every change is logged below.','pv',box);
const add=(label,get,set)=>{const r=el('div','','',box);el('label',label,'',r);const i=el('input','','',r);i.type='number';i.min='0';i.value=get();i.disabled=!adm;i.style.width='5rem';fields.push({label,i,get,set})};
Object.keys(RULES).filter(k=>k!=='closed').forEach(k=>add('Stage deadline: '+RULES[k].label+' (days)',()=>RULES[k].days,v=>{RULES[k].days=v}));
[['consultAccept','Consultation: accept within (days)'],['consultSchedule','Consultation: schedule within (days)'],['referralResponse','Referral: response within (days)']].forEach(([k,l])=>add(l,()=>SLA[k],v=>{SLA[k]=v}));
[['dueSoonDays','Task counts as due soon within (days)'],['escalateAfterDays','Escalate a task overdue by (days)'],['responseFollowUpDays','Follow up patient responses within (days)']].forEach(([k,l])=>add(l,()=>CFG[k],v=>{CFG[k]=v}));
if(adm)el('button','Save settings','pri',box).onclick=()=>{fields.forEach(f=>{const v=parseInt(f.i.value,10),old=f.get();if(Number.isFinite(v)&&v>=0&&v!==old){f.set(v);CFGLOG.unshift({at:stamp(),by:actor(),what:f.label,from:old,to:v})}});saveCfg();logAccess('Settings changed');renderSettings()};else el('p','Sign in as admin01 to edit.','mut',box);
el('h3','Settings change log','',box);if(!CFGLOG.length)el('p','No changes yet.','mut',box);CFGLOG.slice(0,20).forEach(x=>el('p',x.at+' · '+x.by+' · '+x.what+': '+x.from+' → '+x.to,'mut',box))}
const ALERT_SKIP=['Outside patient','On track'];
const closureOk=c=>!isOpen(c)&&!!c.closure.decidedBy&&!!(c.closure.alternativePlan||(c.closure.evidence&&c.care&&c.care.outcome));
const apptPast=c=>!!c.appointment&&(c.appointment.date<TODAY||(c.appointment.date===TODAY&&c.appointment.time<DEMO_NOW));
const apptClass=c=>{const a=c.appointment;if(!a)return null;if(a.checkedIn&&a.noShow)return'conflict';if(a.checkedIn)return'attended';if(a.noShow)return'noshow';return apptPast(c)?'pastNoOutcome':'upcoming'};
const C=f=>cases.filter(f).length,TK=()=>cases.flatMap(c=>c.tasks||[]),KS=()=>cases.flatMap(c=>c.consults||[]),nd=(n,d)=>({n,d});
const AP=k=>C(c=>apptClass(c)===k);
const elig=c=>c.stage==='attended'||c.stage==='closed';
const refRe=()=>cases.reduce((s,c)=>s+(c.referral.history||[]).length,0);
const refInit=()=>C(c=>!!c.referral.sentAt);
const refTot=()=>refInit()+refRe();
const refAccN=()=>C(c=>['accepted','appointment_pending','completed'].includes(c.referral.status));
const refRejN=()=>refRe()+C(c=>c.referral.status==='rejected');
const refAwaitN=()=>C(c=>c.referral.status==='sent');
const missedBefore=()=>cases.reduce((s,c)=>s+(c.missedBefore||0),0);
const medM=(a)=>{const m=med(a);if(!a.length)return{n:null,v:'n/a',flag:'No records yet.'};if(new Set(a).size===1)return{n:m,v:'n/a',flag:'The demo dataset has insufficient variation to assess communication time (all '+a.length+' seeded values are identical).'};return{n:m,v:m}};
const GRP={pr:'Referrals (counted per referral)',pc:'Referrals (counted per case)'};
const METRICS=[
['Cases','open','Open cases','cases',0,'Cases that are not closed.','stage is not “closed”','case.stage',()=>nd(C(isOpen))],
['Cases','overdue','Overdue cases','cases',1,'Open cases whose current-stage deadline has passed.','open AND case.dueDate is before the demo date','case.dueDate, case.stage',()=>nd(C(isOver))],
['Cases','unassigned','Unassigned cases','cases',0,'Open cases with no care coordinator.','open AND no coordinator','case.owner',()=>nd(C(isUn))],
['Cases','attention','Open cases needing attention','cases',1,'Open cases that carry at least one alert flag.','open AND any flag except On track and Outside patient','flags()',()=>nd(C(c=>isOpen(c)&&flags(c).some(f=>!ALERT_SKIP.includes(f[0]))))],
['Cases','closed','Closed cases','cases',0,'Cases whose follow-up loop is closed.','stage = closed','case.stage',()=>nd(C(c=>!isOpen(c)))],
['Cases','closedOk','Closed records meeting the closure rule (seeded demo data)','closed cases',0,'Share of closed demo records whose evidence and care outcome satisfy the closure rule. It measures rule compliance in seeded records, not real-world success.','closed AND clinician named AND (approved alternative plan OR (evidence AND care outcome))','case.closure, case.care',()=>nd(C(closureOk),C(c=>!isOpen(c))),1,'Seeded records comply by design. Not a real-world success rate.'],
[GRP.pr,'refInit','Initial referrals sent','referrals',0,'First-time referrals: one per case that has a sent referral.','cases with a referral sent date','case.referral.sentAt',()=>nd(refInit())],
[GRP.pr,'refReSent','Re-referrals sent','referrals',0,'Referrals sent again after a rejection.','sum of recorded earlier rejections that led to a re-send','case.referral.history',()=>nd(refRe())],
[GRP.pr,'refTot','Referrals sent in total','referrals',0,'Initial referrals plus re-referrals.','initial + re-referrals','case.referral',()=>nd(refTot())],
[GRP.pr,'refAccN','Referrals accepted','referrals',0,'Referrals the receiving provider accepted.','current referral accepted, appointment pending or completed (earlier ones in history were rejected)','case.referral.status',()=>nd(refAccN())],
[GRP.pr,'refRejN','Referrals rejected','referrals',0,'Referrals the receiving provider rejected, including ones later re-sent.','earlier rejections in history + current rejected','case.referral',()=>nd(refRejN())],
[GRP.pr,'refAwait','Referrals awaiting a response','referrals',0,'Referrals sent with no response yet.','current referral status = sent','case.referral.status',()=>nd(refAwaitN())],
[GRP.pr,'refResp','Referral response rate','referrals',0,'Share of sent referrals with a recorded acceptance or rejection.','(accepted + rejected) ÷ referrals sent in total','case.referral',()=>nd(refAccN()+refRejN(),refTot()),1],
[GRP.pr,'refAccRate','Acceptance rate among responded referrals','referrals',0,'Of referrals that got a response, how many were accepted.','accepted ÷ (accepted + rejected)','case.referral',()=>nd(refAccN(),refAccN()+refRejN()),1],
[GRP.pr,'refOver','Referrals past their response deadline','referrals',1,'Referrals awaiting a response after the demo deadline.','open case AND status = sent AND sent date + deadline is before the demo date','case.referral.sentAt, Settings',()=>nd(C(c=>isOpen(c)&&refOver(c)))],
[GRP.pc,'refCases','Cases with a referral','cases',0,'Cases that have had a referral sent.','referral status other than not started','case.referral.status',()=>nd(C(c=>c.referral.status!=='not_started'))],
[GRP.pc,'refCaseAcc','Cases whose current referral is accepted or further','cases',0,'Of cases with a referral, how many have an accepted (or later) current referral.','status accepted, appointment pending or completed ÷ cases with a referral','case.referral.status',()=>nd(refAccN(),C(c=>c.referral.status!=='not_started')),1],
[GRP.pc,'rejref','Cases with a rejected referral','cases',0,'Open cases whose current referral was rejected and not yet re-sent.','open AND referral.status = rejected','case.referral.status',()=>nd(C(isRej))],
[GRP.pc,'reref','Cases re-referred at least once','cases',0,'Cases with at least one rejected referral that was re-sent.','referral history is not empty','case.referral.history',()=>nd(C(c=>(c.referral.history||[]).length>0))],
['Consultations','cReq','Consultations requested','consultations',0,'All clinician-to-clinician consultation requests.','every consultation record','case.consults',()=>nd(KS().length)],
['Consultations','cAcc','Accepted (or later)','consultations',0,'Consultations that were accepted at some point.','acceptedAt recorded','consult.acceptedAt',()=>nd(KS().filter(k=>k.acceptedAt).length,KS().length)],
['Consultations','cSch','Scheduled (or later)','consultations',0,'Consultations given a date and time.','scheduledFor recorded','consult.scheduledFor',()=>nd(KS().filter(k=>k.scheduledFor).length,KS().length)],
['Consultations','cDone','Completed','consultations',0,'Consultations with a recorded outcome. A reply alone does not count.','status = completed','consult.status',()=>nd(KS().filter(k=>k.status==='completed').length,KS().length)],
['Consultations','cRej','Rejected, awaiting reassignment','consultations',0,'Consultations currently rejected.','status = rejected','consult.status',()=>nd(KS().filter(k=>k.status==='rejected').length)],
['Consultations','cOver','Overdue consultations','consultations',1,'Consultations past their accept, schedule or visit deadline.','requested, accepted or scheduled AND deadline before the demo date','consult dates, Settings',()=>nd(KS().filter(consultOver).length)],
['Tasks','tOpen','Open tasks','tasks',0,'Tasks not yet completed. One case can have several tasks.','status = open','case.tasks',()=>nd(TK().filter(t=>t.status==='open').length)],
['Tasks','tPend','Pending tasks','tasks',1,'Open tasks not yet due soon or overdue.','open AND due after the due-soon window','task.due, Settings',()=>nd(TK().filter(t=>tState(t)==='pending').length)],
['Tasks','tSoon','Due soon tasks','tasks',1,'Open tasks due within the due-soon window.','open AND due within the window and not overdue','task.due, Settings',()=>nd(TK().filter(t=>tState(t)==='duesoon').length)],
['Tasks','tOver','Overdue tasks','tasks',1,'Open tasks past their deadline.','open AND due before the demo date','task.due',()=>nd(TK().filter(t=>tState(t)==='overdue').length)],
['Tasks','tEsc','Open tasks that were escalated','tasks',0,'Open tasks with at least one escalation, overdue or not (for example urgent requests).','open AND escalations recorded','task.escalations',()=>nd(TK().filter(t=>t.status==='open'&&t.escalations.length).length)],
['Tasks','tOverEsc','Overdue tasks that were escalated','tasks',1,'Overdue open tasks with an escalation recorded.','open AND overdue AND escalations recorded ÷ overdue open tasks','task.due, task.escalations',()=>nd(TK().filter(t=>tState(t)==='overdue'&&t.escalations.length).length,TK().filter(t=>tState(t)==='overdue').length),1],
['Tasks','tDone','Completed tasks','tasks',0,'Tasks completed, each with who and when.','status = completed','task.status',()=>nd(TK().filter(t=>t.status==='completed').length)],
['Patient barriers','bRep','Barriers reported by patients','barrier reports',0,'“I cannot attend” and “I cannot access this service” responses.','every patient response record','case.responses',()=>nd(cases.reduce((s,c)=>s+(c.responses||[]).length,0))],
['Patient barriers','bRes','Barriers resolved','barrier reports',0,'Responses resolved by a completed staff task. A patient response alone is never resolved.','response.status = resolved ÷ barriers reported','case.responses',()=>nd(cases.reduce((s,c)=>s+(c.responses||[]).filter(r=>r.status==='resolved').length,0),cases.reduce((s,c)=>s+(c.responses||[]).length,0)),1],
['Patient barriers','bOpen','Barriers still open','barrier reports',0,'Responses with a follow-up task not yet completed.','response.status = open','case.responses',()=>nd(cases.reduce((s,c)=>s+(c.responses||[]).filter(r=>r.status==='open').length,0))],
['Appointments','apTot','Appointments on record','appointments',0,'Current appointment record for each case that has one. Earlier missed visits are counted separately.','cases with an appointment','case.appointment',()=>nd(C(c=>!!c.appointment))],
['Appointments','apAtt','Attended (checked in)','appointments',0,'Appointments where staff recorded a check-in.','appointment.checkedIn = true','case.appointment.checkedIn',()=>nd(AP('attended'))],
['Appointments','apNo','No-show (recorded)','appointments',0,'Appointments staff explicitly marked as no-show.','appointment.noShow = true and not checked in','case.appointment.noShow',()=>nd(AP('noshow'))],
['Appointments','apUp','Upcoming','appointments',1,'Appointments still ahead with no outcome yet.','no outcome AND date after the demo date, or today before the demo clock time','case.appointment, demo clock 11:00',()=>nd(AP('upcoming'))],
['Appointments','apPast','Past, no outcome recorded','appointments',1,'Appointments whose time has passed with no check-in and no recorded no-show. Not assumed attended or missed.','no outcome AND date before the demo date, or today before the demo clock time','case.appointment, demo clock 11:00',()=>nd(AP('pastNoOutcome')),0,'Staff should record an outcome.'],
['Appointments','late','Late today (subset of past, no outcome)','cases',1,'Patients not yet checked in after today’s appointment time, at the appointment-scheduled stage.','stage = appointment scheduled AND no outcome AND time already passed on the demo clock','case.appointment, demo clock 11:00',()=>nd(C(isLate))],
['Appointments','apPrev','Earlier missed visits on record','visits',0,'Seeded record of earlier missed visits for some patients.','sum of earlier missed visits','case.missedBefore',()=>nd(missedBefore())],
['Appointments','apRate','Attendance rate (recorded outcomes only)','appointments with a recorded outcome',0,'Attended ÷ appointments with an explicit outcome. Upcoming and past-without-outcome appointments are excluded, so nothing is inferred from dates.','attended ÷ (attended + recorded no-shows + earlier missed visits on record)','case.appointment, case.missedBefore',()=>nd(AP('attended'),AP('attended')+AP('noshow')+missedBefore()),1],
['Care journey','cfDone','Confirmatory tests completed','cases',0,'Of cases that need a confirmatory test, how many have a recorded result.','confirm.required AND result recorded ÷ confirm.required','case.confirm',()=>nd(C(c=>c.confirm&&c.confirm.required&&c.confirm.result),C(c=>c.confirm&&c.confirm.required)),1],
['Care journey','careSt','Treatment or surveillance started','cases at Attended or Closed',0,'Of cases at the Attended or Closed stage, how many have treatment or surveillance recorded as started.','attended or closed AND care started ÷ attended or closed','case.care',()=>nd(C(c=>elig(c)&&c.care&&c.care.startedAt),C(elig)),1,'Eligible group: cases at the Attended or Closed stage.'],
['Care journey','careOut','Outcomes documented','cases with care started',0,'Of cases where care started, how many have an outcome recorded.','attended or closed AND care outcome ÷ attended or closed AND care started','case.care',()=>nd(C(c=>elig(c)&&c.care&&c.care.outcome),C(c=>elig(c)&&c.care&&c.care.startedAt)),1],
['Communication','ack','Patients who acknowledged their message','patients (one case each)',0,'Of patients sent a message, how many acknowledged it.','message sent AND acknowledged ÷ message sent','case.messages',()=>nd(C(c=>c.messages[0]&&c.messages[0].acknowledgedAt),C(c=>c.messages[0])),1],
['Communication','tNot','Median days, result to patient notified','days',0,'Median time from screening date to the written message.','median of (message sent date minus screening date)','case.screening.date, messages',()=>medM(cases.filter(c=>c.messages[0]).map(c=>dd(c.screening.date,c.messages[0].sentAt)))],
['Communication','tAck','Median days, notified to acknowledged','days',0,'Median time from the message to the patient acknowledging it.','median of (acknowledged date minus message date)','case.messages',()=>medM(cases.filter(c=>c.messages[0]&&c.messages[0].acknowledgedAt).map(c=>dd(c.messages[0].sentAt,c.messages[0].acknowledgedAt)))]];
const MI=id=>METRICS.find(m=>m[1]===id),MV=id=>MI(id)[8]();
const mval=(m,r)=>r.v!==undefined?r.v:(m[9]?pct(r.n,r.d):r.n);
function renderStats(){const v=id=>MV(id).n;$('s-open').textContent=v('open');$('s-over').textContent=v('overdue');$('s-un').textContent=v('unassigned');$('s-rej').textContent=v('rejref');$('s-closed').textContent=v('closed');$('s-late').textContent=v('late');
const pipe=$('pipe'),chips=$('chips');pipe.replaceChildren();chips.replaceChildren();
STAGES.slice(0,8).forEach((s,i)=>{const n=cases.filter(c=>c.stage===s).length,seg=el('div',String(n),'',pipe);seg.style.flex=n+' 1 0';seg.style.background=hue(i);seg.title=RULES[s].label+': '+n;const ch=el('span','',null,chips),dot=el('i','',null,ch);dot.style.background=hue(i);ch.append(RULES[s].label+' '+n)})}
const DEPT_COLS=['Department','Open','Overdue','Closed'];
function deptStats(){const D={};cases.forEach(c=>{const n=condInfo(c).dept.n,d=D[n]=D[n]||{o:0,v:0,c:0};if(isOpen(c)){d.o++;if(isOver(c))d.v++}else d.c++});return Object.entries(D).sort((a,b)=>b[1].v-a[1].v||a[0].localeCompare(b[0])).map(([n,d])=>[n,d.o,d.v,d.c])}
function integrity(){const ck=[],add=(n,ok,d)=>ck.push({n,ok:!!ok,d:d||''}),N=id=>MV(id).n,D=id=>MV(id).d;
add('Open + closed = all cases',N('open')+N('closed')===cases.length,N('open')+' + '+N('closed')+' = '+cases.length);
const pp=STAGES.slice(0,8).reduce((s,st)=>s+C(c=>c.stage===st),0);add('Cases per open stage add up to open cases',pp===N('open'),pp+' vs '+N('open'));
add('Overdue, unassigned and rejected-referral cases are subsets of open cases',N('overdue')<=N('open')&&N('unassigned')<=N('open')&&N('rejref')<=N('open'));
add('Pending + due soon + overdue tasks = open tasks',N('tPend')+N('tSoon')+N('tOver')===N('tOpen'),N('tPend')+' + '+N('tSoon')+' + '+N('tOver')+' = '+N('tOpen'));
add('Every open case has at least one open task',C(c=>isOpen(c)&&!(c.tasks||[]).some(t=>t.status==='open'))===0);
add('Every open task has an owner and a deadline',TK().filter(t=>t.status==='open'&&(!t.owner||!t.due)).length===0);
add('Every completed task records who and when',TK().filter(t=>t.status==='completed'&&(!t.completedBy||!t.completedAt)).length===0);
add('Escalated tasks do not exceed open or overdue tasks',N('tEsc')<=N('tOpen')&&N('tOverEsc')<=N('tOver'));
add('Consultations: requested ≥ accepted ≥ scheduled ≥ completed',N('cReq')>=N('cAcc')&&N('cAcc')>=N('cSch')&&N('cSch')>=N('cDone'),N('cReq')+' ≥ '+N('cAcc')+' ≥ '+N('cSch')+' ≥ '+N('cDone'));
add('Referrals (per referral): initial + re-referrals = sent in total',N('refInit')+N('refReSent')===N('refTot'),N('refInit')+' + '+N('refReSent')+' = '+N('refTot'));
add('Referrals (per referral): accepted + rejected + awaiting = sent in total',N('refAccN')+N('refRejN')+N('refAwait')===N('refTot'),N('refAccN')+' + '+N('refRejN')+' + '+N('refAwait')+' vs '+N('refTot'));
add('Response-rate denominator = referrals sent; acceptance-rate denominator = responded referrals',D('refResp')===N('refTot')&&D('refAccRate')===N('refAccN')+N('refRejN'));
add('Per-case referral rates use cases only (denominator ≤ all cases)',D('refCaseAcc')<=cases.length&&N('refCaseAcc')<=D('refCaseAcc'));
const ac=['attended','noshow','upcoming','pastNoOutcome'].reduce((s,k)=>s+AP(k),0);
add('Appointment classes (attended, no-show, upcoming, past without outcome) add up to appointments on record',ac===N('apTot')&&AP('conflict')===0,ac+' vs '+N('apTot')+', conflicts '+AP('conflict'));
add('Late-today patients are a subset of past appointments without an outcome',N('late')<=N('apPast'));
add('Past appointments without an outcome carry no check-in and no no-show flag (nothing inferred from dates)',C(c=>apptClass(c)==='pastNoOutcome'&&(c.appointment.checkedIn||c.appointment.noShow))===0);
add('Attendance denominator = attended + recorded no-shows + earlier missed visits',D('apRate')===N('apAtt')+N('apNo')+N('apPrev'),D('apRate')+' vs '+(N('apAtt')+N('apNo')+N('apPrev')));
add('Barriers: resolved + open = reported',N('bRes')+N('bOpen')===N('bRep'));
add('Care started ≤ eligible; outcomes ≤ started',N('careSt')<=D('careSt')&&N('careOut')<=D('careOut'));
add('Closed records meeting the closure rule ≤ closed cases',N('closedOk')<=N('closed'));
const ds=deptStats();add('Department totals match open and closed cases',ds.reduce((s,r)=>s+r[1],0)===N('open')&&ds.reduce((s,r)=>s+r[3],0)===N('closed'));
const tb=document.getElementById('dept-table');
if(tb){const hd=[...tb.querySelectorAll('thead th')].map(x=>x.textContent),rows=[...tb.querySelectorAll('tbody tr')];
add('Department table column labels are '+DEPT_COLS.join(', '),JSON.stringify(hd)===JSON.stringify(DEPT_COLS));
add('Department rows map each value to its column label and match the records',rows.length===ds.length&&rows.every((r,i)=>{const cs=[...r.children];return cs.length===4&&cs.every((c,j)=>c.dataset.label===DEPT_COLS[j]&&c.textContent===String(ds[i][j]))}))}
add('Every percentage has a valid denominator (n/a when zero) and stays within 0% to 100%',METRICS.filter(m=>m[9]).every(m=>{const r=m[8]();return r.d===0||(r.n>=0&&r.n<=r.d)}));
return ck}
function renderMetrics(){const box=$('metpane');box.replaceChildren();
el('p','Synthetic-data prototype, not a production clinical system. Every figure is calculated from the demo records on this page (nothing is hardcoded). They describe the demo dataset, not real patients, and they are a baseline for a future pilot, not evidence of clinical impact.','pv',box);
let grp='',grid=null;METRICS.forEach(m=>{if(m[0]!==grp){grp=m[0];el('h3',grp,'',box);grid=el('section','','stats',box)}
const r=m[8](),k=el('div','','card mcard',grid);k.title=m[5];el('span',String(mval(m,r)),'num',k);el('small',m[2],'',k);
const sub=el('div',(m[9]?(r.d===0?'no records yet':r.n+' of '+r.d+' '+m[3]):(r.d!==undefined?'of '+r.d+' '+m[3]:m[3]))+(m[4]?' · demo date':''),'mut',k);sub.style.fontSize='.72rem';
[r.flag,m[10]].filter(Boolean).forEach(t=>{const f=el('div',t,'mut',k);f.style.fontSize='.72rem'})});
el('h3','Reasons for delay or drop-off (open cases, one case can have several)','',box);
const open=cases.filter(isOpen),R={'No coordinator assigned':open.filter(isUn).length,'Referral rejected':open.filter(isRej).length,'Patient no-show':open.filter(c=>c.appointment&&c.appointment.noShow).length,'Patient has not acknowledged and is overdue':open.filter(c=>c.stage==='patient_notified'&&isOver(c)).length,'Overdue at its current stage':open.filter(isOver).length};
const bars=(obj,mx)=>Object.entries(obj).forEach(([k,n])=>{el('div',k+' · '+n,'mut',box);el('div','','mbar',box).append(Object.assign(document.createElement('i'),{style:'width:'+Math.max(2,Math.round(100*n/(mx||1)))+'%'}))});
bars(R,Math.max(...Object.values(R),1));
el('h3','How far cases have progressed (inferred from each case’s current stage)','',box);
const F2={};STAGES.forEach((s,k)=>{F2[RULES[s].label]=cases.filter(c=>STAGES.indexOf(c.stage)>=k).length});bars(F2,cases.length);
el('h3','By department (cases)','',box);
const w=el('div','','wrap',box),t=el('table','','',w);t.id='dept-table';const h=el('tr','','',el('thead','','',t));DEPT_COLS.forEach(x=>el('th',x,'',h));
const tb=el('tbody','','',t);deptStats().forEach(row=>{const r=el('tr','','',tb);row.forEach((x,i)=>{const td=el('td',String(x),'',r);td.dataset.label=DEPT_COLS[i]})});
const ic=integrity(),pass=ic.filter(x=>x.ok).length;el('h3','Integrity checks: '+pass+' of '+ic.length+' pass','',box);
ic.forEach(x=>el('p',(x.ok?'✓ ':'✗ FAILED: ')+x.n+(x.d?' ('+x.d+')':''),x.ok?'mut':'',box));
const dt=document.createElement('details');box.appendChild(dt);el('summary','Metric definitions and formulas','',dt);
const w2=el('div','','wrap',dt),t2=el('table','','',w2),h2=el('tr','','',el('thead','','',t2)),HC=['Metric','Counts','Demo date','Definition','Inclusion','Source'];HC.forEach(x=>el('th',x,'',h2));
const tb2=el('tbody','','',t2);METRICS.forEach(m=>{const r=el('tr','','',tb2);[m[2],m[3],m[4]?'yes':'no',m[5],m[6],m[7]].forEach((x,i)=>{const td=el('td',x,'',r);td.dataset.label=HC[i]})});
el('p','Stage 3 definition changes: referral metrics are now split into per-referral and per-case groups with matching units, and initial referrals and re-referrals are shown separately; attendance uses recorded outcomes only, and attended, no-show, upcoming and past-without-outcome appointments are separate counts; treatment and outcome rates use only cases at Attended or Closed; the closure measure is renamed as a compliance check on seeded records; communication-time medians show n/a when the seeded values do not vary; escalated tasks are split into open escalated and overdue escalated.','note',box);
el('p','Pilot plan: record the same measures for a real screening programme before and after introducing the tool, then compare. Clinical outcomes would need their own ethical review.','note',box)}
const IMP={n:10000,base:70,rec:20};
function impCalc(){const n=Math.max(0,Math.round(+IMP.n||0)),b=Math.min(100,Math.max(0,+IMP.base||0)),r=Math.min(100,Math.max(0,+IMP.rec||0)),lost=n*(100-b)/100,rec=lost*r/100,after=b+(100-b)*r/100;return{n,b,r,lost:Math.round(lost),rec:Math.round(rec),after:Math.round(after*10)/10}}
function renderImpact(){const box=$('imppane');box.replaceChildren();
el('p','Illustrative projection, not a measured result. The inputs below are assumptions you can change. No real-world impact is claimed. A real pilot would replace them with measured values.','pv',box);
el('h3','1. What the demo shows (seeded demo data)','',box);const g=el('section','','stats',box);
[['Cases tracked end to end',MV('open').n+MV('closed').n,'all demo cases'],['Open cases flagged for attention',MV('attention').n,'of '+MV('open').n+' open cases'],['Overdue tasks escalated',MV('tOverEsc').n,'of '+MV('tOverEsc').d+' overdue tasks'],['Patient barriers captured',MV('bRep').n,MV('bOpen').n+' still open'],['Closed records meeting the closure rule',MV('closedOk').n,'of '+MV('closedOk').d+' (by design)']].forEach(([l,v,s])=>{const k=el('div','','card mcard',g);el('span',String(v),'num',k);el('small',l,'',k);const x=el('div',s,'mut',k);x.style.fontSize='.72rem'});
el('p','These show what the tool makes visible in the demo records. They are not outcomes for real patients.','mut',box);
el('h3','2. What-if estimator (assumptions, editable)','',box);
const f=(label,key,suffix)=>{const r=el('div','','',box);el('label',label,'',r);const i=el('input','','',r);i.type='number';i.min='0';i.value=IMP[key];i.style.width='7rem';i.oninput=()=>{IMP[key]=i.value;draw()};r.append(' '+suffix)};
f('Abnormal screening results per year in a programme','n','results');f('Share completing follow-up in time today (replace with the programme’s own figure)','base','%');f('Share of the missed ones the tool recovers through reminders, ownership and escalation (assumption)','rec','%');
const out=el('div','','pv',box);const tb=el('div','','',box);
function draw(){const c=impCalc();out.replaceChildren();
el('p','Results per year: '+c.n.toLocaleString(),'',out);el('p','Not completed in time at baseline: '+c.lost.toLocaleString()+' ('+(100-c.b)+'%)','',out);
el('p','Recovered under the stated assumption: '+c.rec.toLocaleString()+' people','',out);el('p','Follow-up completion in time: '+c.b+'% → '+c.after+'%','',out);
tb.replaceChildren();const w=el('div','','wrap',tb),t=el('table','','',w),h=el('tr','','',el('thead','','',t));['If recovery is','People recovered','Completion'].forEach(x=>el('th',x,'',h));const body=el('tbody','','',t);
[10,20,30,40].forEach(rr=>{const lost=c.n*(100-c.b)/100,r=el('tr','','',body);[rr+'%',String(Math.round(lost*rr/100)),(Math.round((c.b+(100-c.b)*rr/100)*10)/10)+'%'].forEach((x,i)=>{const td=el('td',x,'',r);td.dataset.label=['If recovery is','People recovered','Completion'][i]})})}
draw();
el('p','The default numbers are placeholders chosen to show how the model works. They are not findings. Change them to a programme’s real figures.','mut',box);
el('h3','3. How a pilot would measure the real effect','',box);
['Record the same measures from the Metrics tab for a real screening programme before the tool: time to notification, referral response rate, attendance rate, unresolved cases and documented closure.','Run the tool for a set period with human oversight, then record the same measures again and compare.','Review clinical safety and ethics before any use with real patients.'].forEach(x=>el('p','• '+x,'',box))}
function commOf(c){return c.patient.comm||{}}
function textOnly(c){return !!commOf(c).text}
function needInterp(c){return !!commOf(c).interp}
function commTag(c){const m=commOf(c);return (m.interp?' · INTERPRETER: '+(m.sign||'language not stated'):'')+(m.text?' · TEXT ONLY':'')}
function notify(c,text){(c.notices=c.notices||[]).push({at:stamp(),text,read:false})}
cases.forEach(c=>{const h=hsh(c.id+'cm');if(c.patient.comm===undefined)c.patient.comm=h%17===0?{text:true,interp:true,sign:'Indian Sign Language (ISL)',assist:''}:h%11===0?{text:true,interp:false,sign:'',assist:''}:{text:false,interp:false,sign:'',assist:''};
if(!c.noticesSeeded){c.noticesSeeded=true;if(c.messages[0])(c.notices=c.notices||[]).push({at:c.messages[0].sentAt+' 09:00',text:'Your result has been recorded and your care team has sent you a written message. Please read “What happens next”. This is not a diagnosis.',read:c.stage!=='patient_notified'})}});
function syncAccess(c){if(!isOpen(c)||!c.appointment)return;const a=c.appointment,co=c.owner?c.owner.name:'Triage coordinator (default)';
if(needInterp(c)&&!a.support&&a.date>=TODAY)mkTask(c,'auto:interp:'+a.date+a.time,'access','Arrange a sign-language interpreter for the appointment on '+a.date+' ('+(commOf(c).sign||'language not stated')+')',co,a.date>TODAY?dAdd(a.date,-1):TODAY,'The patient needs sign-language interpretation and no arrangement is recorded.');
if(a.support&&!a.support.arranged)mkTask(c,'auto:interpfail:'+a.date+a.time,'access','Alternative communication support needed',co,TODAY,'Required communication support could not be arranged for the appointment.')}
{const _sv=save;save=function(){cases.forEach(syncAccess);_sv()}}
{const _m2=moveNext;moveNext=function(c){const r=_m2(c);if(r.ok)notify(c,c.referral.status==='rejected'?NEXT.rejected:(NEXT[c.stage]||'Your case was updated.'));return r}}
{const _rs=respond;respond=function(c,t,r,x){_rs(c,t,r,x);notify(c,'We received your message about '+(t==='cannot_attend'?'not being able to attend':'difficulty accessing the service')+'. A team member will follow up in writing'+(textOnly(c)?' (text only, no voice call)':'')+'. It is not resolved yet.');save()}}
{const _ct=completeTask;completeTask=function(c,t,n){const ok=_ct(c,t,n);if(ok&&t.responseId)notify(c,'Your message was resolved by the care team: '+(n||'completed')+'.');return ok}}
function accessBox(box,c){const cm=commOf(c),need=cm.text||cm.interp||cm.assist;el('h3','Communication access','',box);const row=el('div','','pv',box);
if(!need)el('p','No special communication needs recorded.','mut',row);
if(cm.text)el('p','TEXT ONLY: do not use voice calls or audio-only instructions. Use written messages.','',row).style.fontWeight='700';
if(cm.interp)el('p','SIGN-LANGUAGE INTERPRETER REQUIRED: '+(cm.sign||'language not stated')+'. An AI tool is not a substitute for a qualified interpreter.','',row).style.fontWeight='700';
if(cm.assist)el('p','Other: '+cm.assist,'',row);
const a=c.appointment;
if(a&&cm.interp){const s=a.support;el('p',s?'Support for the appointment ('+a.date+' '+a.time+'): '+(s.arranged?'ARRANGED':'NOT ARRANGED')+' · '+s.type+(s.detail?' · '+s.detail:'')+' · recorded '+s.at+' by '+s.by:'Support for the appointment ('+a.date+' '+a.time+'): NOT YET RECORDED. The visit cannot be marked attended until it is.','mut',row);
if(isOpen(c)){const ty=el('select','','',row);['Qualified interpreter booked','Video relay interpreter booked','Written communication arranged instead','Could not be arranged'].forEach(x=>{el('option',x,'',ty).value=x});const dt=el('input','','',row);dt.placeholder='Details (interpreter or agency, or why not arranged)';
el('button','Record communication support','',row).onclick=()=>{a.support={arranged:ty.value!=='Could not be arranged',type:ty.value,detail:dt.value.trim(),at:stamp(),by:actor()};c.consultNotes.push({at:TODAY,text:'Communication support recorded: '+ty.value+(dt.value.trim()?' ('+dt.value.trim()+')':'')+'.'});notify(c,'Communication support for your appointment: '+ty.value+'.');logAccess('Support recorded '+c.id);refresh()}}}
if(isOpen(c)){const mi=el('input','','',box);mi.placeholder='Text message to the patient (follow-up instructions)';el('button','Send text message','',box).onclick=()=>{if(!mi.value.trim())return;notify(c,'Message from your care team: '+mi.value.trim());c.consultNotes.push({at:TODAY,text:'Text message sent to the patient: '+mi.value.trim()});logAccess('Text message '+c.id);refresh()}}}
METRICS.push(
['Access','accNeed','Patients with communication support needs','patients',0,'Patients who asked for text-only contact, an interpreter or other help.','text only OR interpreter OR other assistance recorded','patient.comm',()=>nd(C(c=>!!(commOf(c).text||commOf(c).interp||commOf(c).assist)))],
['Access','accInterp','Patients needing a sign-language interpreter','patients',0,'Patients who need sign-language interpretation.','interpreter required','patient.comm.interp',()=>nd(C(needInterp))],
['Access','accSup','Interpreter appointments with a support decision recorded','appointments',0,'Of appointments for interpreter patients, how many have a recorded decision on support.','needs interpreter AND appointment AND support recorded ÷ needs interpreter AND appointment','appointment.support',()=>nd(C(c=>needInterp(c)&&c.appointment&&c.appointment.support),C(c=>needInterp(c)&&c.appointment)),1]);
ALERT_SKIP.push('Interpreter needed','Text only, no voice');
{const _ig=integrity;integrity=function(){const ck=_ig();ck.push({n:'Interpreter appointments with a recorded support decision ≤ interpreter appointments',ok:MV('accSup').n<=MV('accSup').d,d:''});return ck}}
const FH_REF={not_started:'draft',sent:'active',accepted:'active',appointment_pending:'active',completed:'completed',rejected:'on-hold'};
function fhirBundle(c){const E=[],res=r=>E.push({resource:r}),sub={reference:'Patient/'+c.id},cm=commOf(c);
res({resourceType:'Patient',id:c.id,meta:{tag:[{system:'urn:demo',code:'synthetic-demo',display:'Synthetic demo data, illustrative mapping, not validated'}]},name:[{text:c.patient.name}],communication:[{language:{text:cm.interp?(cm.sign||'sign language'):(c.patient.language==='ar'?'Arabic':c.patient.language==='ml'?'Malayalam':'English')},preferred:true}],extension:[{url:'urn:demo:age',valueInteger:c.patient.age}]});
res({resourceType:'Observation',id:c.id+'-screening',status:'final',code:{text:c.screening.type},subject:sub,effectiveDateTime:c.screening.date,valueString:'needs follow-up'});
if(c.referral.sentAt)res({resourceType:'ServiceRequest',id:c.id+'-referral',status:FH_REF[c.referral.status]||'unknown',intent:'order',subject:sub,authoredOn:c.referral.sentAt,requester:{display:c.referral.from||c.doctor},performer:[{display:c.referral.to}],note:[{text:(c.referral.response||'No response yet')+(c.referral.rejectReason?' (rejected: '+c.referral.rejectReason+')':'')}]});
if(c.appointment){const a=c.appointment;res({resourceType:'Appointment',id:c.id+'-appointment',status:a.noShow?'noshow':a.checkedIn?(a.date<TODAY?'fulfilled':'checked-in'):'booked',start:a.date+'T'+a.time+':00+04:00',participant:[{actor:sub,status:'accepted'},{actor:{display:a.doctor},status:'accepted'}],comment:a.support?'Communication support: '+a.support.type+(a.support.arranged?'':' (not arranged)'):undefined})}
(c.tasks||[]).forEach(t=>res({resourceType:'Task',id:t.id,status:t.status==='completed'?'completed':'requested',intent:'order',priority:t.type==='urgent'?'urgent':'routine',description:t.title,for:sub,owner:{display:t.owner},authoredOn:t.createdAt.slice(0,10),restriction:{period:{end:t.due}},note:t.history.slice(-3).map(h=>({text:h.at+' '+h.by+': '+h.text}))}));
return{resourceType:'Bundle',type:'collection',meta:{tag:[{system:'urn:demo',code:'synthetic-demo',display:'Synthetic demo data, illustrative mapping, not validated'}]},entry:E}}
function fhirBox(box,c){const dt=document.createElement('details');box.appendChild(dt);el('summary','Export record (FHIR-style, illustrative)','',dt);
el('p','Illustrative mapping of this synthetic record to FHIR-style resources, using plain-text codes only. It has not been validated against a FHIR server and is not for clinical use.','mut',dt);
const pre=el('pre','','',dt);pre.style.cssText='white-space:pre-wrap;word-break:break-word;font-size:.7rem;max-height:240px;overflow:auto';
const cp=el('p','','mut',dt);dt.addEventListener('toggle',()=>{if(dt.open&&!pre.textContent)pre.textContent=JSON.stringify(fhirBundle(c),null,1)});
el('button','Copy JSON','',dt).onclick=async()=>{try{await navigator.clipboard.writeText(JSON.stringify(fhirBundle(c),null,1));cp.textContent='Copied.'}catch(e){cp.textContent='Copy was blocked by the browser. Select the text above instead.'}}}
$('go-new').onclick=()=>show('newacct');
$('nsave').onclick=()=>{const n=$('nname').value.trim(),ph=$('nphone').value.trim(),a=parseInt($('nage').value,10),pin=$('npin').value,pr=$('nprob').value.trim(),e=$('nerr');
if(!n||!(a>0&&a<121)){e.textContent='Please enter your name and a valid age.';return}
if(!/^\d{10}$/.test(ph)||cases.some(x=>phoneOf(x)===ph)){e.textContent='Enter a 10-digit phone number that is not already registered.';return}
if(!/^\d{4}$/.test(pin)){e.textContent='MPIN must be 4 digits.';return}
if(!pr){e.textContent='Tell us briefly what your problem or report is about.';return}
const dk=routeDept(pr,a),f=$('nfile').files[0],id='OUT-'+String(cases.filter(x=>x.origin==='outside').length+1).padStart(3,'0');
const c={id,origin:'outside',cond:-1,deptKey:dk,patient:{name:n,age:a,language:'en',phone:ph,mpin:pin,consent:TODAY},screening:{type:'Outside report: '+pr.slice(0,60),date:TODAY,result:'needs review'},stage:'result_recorded',stageEnteredAt:TODAY,dueDate:dateOnly(addDays(DEMO_TODAY,RULES.result_recorded.days)),owner:null,messages:[],consultNotes:[{at:TODAY,text:'Outside patient registered. Problem: '+pr+(f?'. Report uploaded: '+f.name:'')+'. Suggested department: '+DEPTS[dk].n+' (suggestion only, staff to confirm).'}],referral:{status:'not_started'},closure:{evidence:null,decidedBy:null,alternativePlan:null},doctor:DEPTS[dk].docs[0]};
cases.push(c);save();session={role:'patient',id,name:n};logAccess('Outside patient registered '+id);
['nname','nphone','nage','npin','nprob'].forEach(i=>{$(i).value=''});e.textContent='';renderPortal(c)};
$('go-p').onclick=()=>show('plogin');$('go-s').onclick=()=>show('slogin');
document.querySelectorAll('[data-home]').forEach(b=>{b.onclick=()=>show('home')});
$('pgo').onclick=()=>{const ph=$('pphone').value.trim(),c=cases.find(x=>phoneOf(x)===ph);
if(!authOk('p'+ph,!!c&&$('ppin').value===(c.patient.mpin||'1234'),$('perr')))return;
session={role:'patient',id:c.id,name:c.patient.name};$('ppin').value='';logAccess('Patient signed in '+c.id);
if(c.patient.consent)renderPortal(c);else renderProfile(c)};
$('sgo').onclick=()=>{const id=$('sid').value.trim().toLowerCase(),u=STAFF[id];
if(!authOk('s'+id,!!u&&u.pin===$('spin').value,$('serr')))return;
session={role:u.role,id,name:u.name};$('spin').value='';logAccess('Signed in ('+u.role+')');show('staff')};
$('logbtn').onclick=()=>{const b=$('logbody');b.replaceChildren();el('h2','Access log (admin)','',b);let l=[];try{l=JSON.parse(localStorage.getItem(LOGKEY)||'[]')}catch(e){}
if(!l.length)el('p','No entries yet.','mut',b);
l.slice(0,40).forEach(x=>el('p',x.t+' · '+x.u+' · '+x.m,'mut',b));
el('button','Close','',b).onclick=()=>$('logdlg').close();$('logdlg').showModal()};
$('out').onclick=()=>{logAccess('Signed out');session=null;openId=null;if($('dlg').open)$('dlg').close();show('home')};
renderStats();renderTable();show('home');
