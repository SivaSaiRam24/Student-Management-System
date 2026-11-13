let students = JSON.parse(localStorage.getItem("students")) || [
  {roll:"101",name:"Rahul Kumar",course:"B.Tech",year:"3rd Year",marks:85,phone:"9876543210"},
  {roll:"102",name:"Sivani Reddy",course:"BCA",year:"2nd Year",marks:92,phone:"9123456780"},
  {roll:"103",name:"Arjun Rao",course:"MCA",year:"1st Year",marks:78,phone:"9988776655"}
];

const $ = id => document.getElementById(id);
function save(){localStorage.setItem("students",JSON.stringify(students)); render();}
function render(){
  const q=$("search").value.toLowerCase(), filter=$("courseFilter").value;
  const list=students.filter(s=>
    (s.name.toLowerCase().includes(q)||s.roll.toLowerCase().includes(q)||s.course.toLowerCase().includes(q)) &&
    (filter==="all"||s.course===filter)
  );
  $("studentTable").innerHTML=list.map((s,i)=>{
    const real=students.indexOf(s);
    return `<tr><td>${s.roll}</td><td><b>${s.name}</b></td><td>${s.course}</td><td>${s.year}</td>
    <td>${s.marks}%</td><td>${s.phone}</td><td><div class="actions">
    <button class="btn edit" onclick="editStudent(${real})">Edit</button>
    <button class="btn delete" onclick="deleteStudent(${real})">Delete</button></div></td></tr>`;
  }).join("");
  $("empty").style.display=list.length?"none":"block";
  $("totalStudents").textContent=students.length;
  $("avgMarks").textContent=students.length ? Math.round(students.reduce((a,s)=>a+Number(s.marks),0)/students.length)+"%" : "0%";
  $("topStudent").textContent=students.length ? students.reduce((a,b)=>Number(a.marks)>Number(b.marks)?a:b).name : "-";
}
function openModal(index=null){
  $("modal").classList.add("show");
  $("studentForm").reset();
  $("editIndex").value=index===null?"":index;
  $("modalTitle").textContent=index===null?"Add Student":"Edit Student";
  if(index!==null){
    const s=students[index];
    ["roll","name","course","year","marks","phone"].forEach(k=>$(k).value=s[k]);
  }
}
function closeModal(){$("modal").classList.remove("show")}
function editStudent(i){openModal(i)}
function deleteStudent(i){
  if(confirm("Delete this student record?")){students.splice(i,1);save();}
}
$("studentForm").addEventListener("submit",e=>{
  e.preventDefault();
  const data={roll:$("roll").value.trim(),name:$("name").value.trim(),course:$("course").value,
    year:$("year").value,marks:Number($("marks").value),phone:$("phone").value.trim()};
  const idx=$("editIndex").value;
  if(idx==="") students.push(data); else students[Number(idx)]=data;
  save(); closeModal();
});
$("search").addEventListener("input",render);
$("courseFilter").addEventListener("change",render);
$("modal").addEventListener("click",e=>{if(e.target===$("modal"))closeModal()});
render();
