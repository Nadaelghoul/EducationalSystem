"use strict";

const API_BASE = `${SERVER_URL}/api/students`;
const PROFILE_URL_BASE = "./studentProfile.html";
const ADD_STUDENT_URL = "./addStudent.html";


const state = {
  all: [],
  filtered: [],
  currentPage: 1,
  pageSize: 10,
};


document.addEventListener("DOMContentLoaded", async () => {

  initSidebarToggle();
  initNavButtons();
  initFilters();
  initPagination();
  initRowNavigation();
  initThemeToggle();

  await loadStudents();

});



function initThemeToggle() {

  const toggleBtn = document.getElementById("themeToggleBtn");
  const icon = document.getElementById("themeIcon");
  const root = document.documentElement;


  const applyIcon = () => {

    const isDark =
      root.getAttribute("data-theme") === "dark";

    icon.className =
      isDark
      ? "fa-solid fa-moon"
      : "fa-solid fa-sun";

  };


  applyIcon();


  toggleBtn?.addEventListener("click",()=>{

    const isDark =
      root.getAttribute("data-theme") === "dark";


    if(isDark){

      root.removeAttribute("data-theme");
      localStorage.setItem("theme","light");

    }else{

      root.setAttribute("data-theme","dark");
      localStorage.setItem("theme","dark");

    }


    applyIcon();

  });

}



function initSidebarToggle(){

  const sidebar=document.getElementById("sidebar");
  const menuBtn=document.getElementById("menuBtn");


  menuBtn?.addEventListener("click",()=>{

    sidebar?.classList.toggle("sidebar--open");

  });

}



function initNavButtons(){

  document.getElementById("backBtn")
  ?.addEventListener("click",()=>{

    window.location.href="/main";

  });


  document.getElementById("goToAddBtn")
  ?.addEventListener("click",()=>{

    window.location.href=ADD_STUDENT_URL;

  });

}




// =========================
// LOAD FROM DATABASE
// =========================


async function loadStudents(){

  try{

    state.filtered = await fetchStudents();

    renderTable();
    renderPagination();

  }catch(err){

    showToast(
      err.message || "تعذر تحميل بيانات الطلاب",
      "error"
    );

  }

}

async function fetchStudents(params = {}) {


  const query =
    new URLSearchParams(params).toString();


  const response = await fetch(
    `${API_BASE}?${query}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json"
      }
    }
  );


  if (!response.ok) {
    throw new Error("تعذر تحميل بيانات الطلاب");
  }


  const data = await response.json();


  console.log("Students:", data);


  return data;

}


// =========================
// FILTERS
// =========================


function initFilters(){

const searchInput =
document.getElementById("searchInput");

const departmentSelect =
document.getElementById("filterDepartment");

const levelSelect =
document.getElementById("filterLevel");

const statusSelect =
document.getElementById("filterStatus");

const filterBtn =
document.getElementById("filterBtn");


let timer;


searchInput?.addEventListener("input",()=>{

clearTimeout(timer);


timer=setTimeout(async()=>{

state.currentPage=1;

await applyFilters();

},250);


});


[
departmentSelect,
levelSelect,
statusSelect

].forEach(select=>{


select?.addEventListener("change",()=>{

state.currentPage=1;
applyFilters();

});


});


filterBtn?.addEventListener("click",()=>{

state.currentPage=1;
applyFilters();

});


}

async function applyFilters(){


const search =
document.getElementById("searchInput")
.value
.trim();



const department =
document.getElementById("filterDepartment")
.value;



const level =
document.getElementById("filterLevel")
.value;



const status =
document.getElementById("filterStatus")
.value;



try{


state.filtered =
await fetchStudents({
search,
department,
level,
status
});



renderTable();
renderPagination();



}catch(error){

showToast(
"حدث خطأ أثناء البحث",
"error"
);

}


}







// =========================
// TABLE
// =========================


function renderTable(){


const tbody =
document.getElementById("tableBody");


const emptyState =
document.getElementById("tableEmpty");



const start =
(state.currentPage-1)
*
state.pageSize;



const pageItems =
state.filtered.slice(
start,
start+state.pageSize
);



tbody.innerHTML="";



if(pageItems.length===0){

emptyState.hidden=false;
return;

}



emptyState.hidden=true;



pageItems.forEach((student,index)=>{


const row =
document.createElement("tr");


row.className="row--clickable";


row.dataset.id =
student._id;



row.tabIndex=0;



row.innerHTML=`

<td>${start+index+1}</td>


<td>
${escapeHtml(
student.accountInfo.universityId
)}
</td>


<td>
<span class="student-link">
${escapeHtml(
student.personalInfo.arabFullName
)}
</span>
</td>


<td>
${escapeHtml(
student.academicInfo.department
)}
</td>


<td>
${escapeHtml(
student.academicInfo.level
)}
</td>

<td>
  <span class="badge ${
    student.accountInfo.status === "active"
      ? "badge--active"
      : "badge--inactive"
  }">
    ${
      student.accountInfo.status === "active"
        ? "مُفعل"
        : "غير مُفعل"
    }
  </span>
</td>

<td>
  <button
    class="icon-btn toggle-status-btn"
    data-id="${student._id}"
    data-status="${student.accountInfo.status}"
    title="${
      student.accountInfo.status === "active"
        ? "إلغاء التفعيل"
        : "تفعيل"
    }"
  >
    <i 
      class="fa-solid ${
        student.accountInfo.status === "active"
          ? "fa-user-check"
          : "fa-user-xmark"
      }"
      style="
        color: ${
          student.accountInfo.status === "active"
            ? "#444"
            : "#999"
        };
      "
    ></i>
  </button>
</td>

<td>

<div class="row-actions">

<button 
class="icon-btn icon-btn--view"
data-view-id="${student._id}"
title="عرض الملف الشخصي">

<i class="fa-solid fa-eye"></i>

</button>

</div>

</td>

`;



tbody.appendChild(row);


});


}





function escapeHtml(str){

const div=document.createElement("div");

div.textContent=str ?? "";

return div.innerHTML;

}




// =========================
// PROFILE NAVIGATION
// =========================


function initRowNavigation(){

const tableBody =
document.getElementById("tableBody");


if(!tableBody) return;

tableBody.addEventListener("click", async (e) => {

  const toggleBtn = e.target.closest(".toggle-status-btn");

  if (toggleBtn) {

    e.stopPropagation();

    const id = toggleBtn.dataset.id;

    const currentStatus = toggleBtn.dataset.status;

    const newStatus =
      currentStatus === "active"
        ? "inactive"
        : "active";

    await updateStudentStatus(id, newStatus);

    return;
  }

  const row = e.target.closest("tr[data-id]");

  if (!row) return;

  goToProfile(row.dataset.id);

});

}




function goToProfile(id){

window.location.href =
`${PROFILE_URL_BASE}?id=${encodeURIComponent(id)}`;

}

// UPDATE STATUS

async function updateStudentStatus(id, status) {

  try {

    const response = await fetch(
      `${API_BASE}/${id}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status })
      }
    );

    if (!response.ok)
      throw new Error();

    const student = state.filtered.find(s => s._id === id);

    if (student)
      student.accountInfo.status = status;

    const studentAll = state.all.find(s => s._id === id);

    if (studentAll)
      studentAll.accountInfo.status = status;

    renderTable();

    showToast(
      status === "active"
        ? "تم تفعيل الطالب"
        : "تم إلغاء تفعيل الطالب"
    );

  } catch {

    showToast(
      "تعذر تحديث الحالة",
      "error"
    );

  }

}

// =========================
// PAGINATION
// =========================


function initPagination(){

document
.getElementById("pageSizeSelect")
?.addEventListener("change",(e)=>{


state.pageSize =
Number(e.target.value);


state.currentPage=1;


renderTable();
renderPagination();


});


}



function renderPagination(){

const container =
document.getElementById("paginationPages");


const totalPages =
Math.max(
1,
Math.ceil(
state.filtered.length/state.pageSize
)
);



container.innerHTML="";


for(let i=1;i<=totalPages;i++){


const btn=document.createElement("button");

btn.className="page-btn";

btn.textContent=i;


btn.onclick=()=>{

state.currentPage=i;

renderTable();

renderPagination();

};



container.appendChild(btn);


}



}





let toastTimeout;


function showToast(message,type="default"){

const toast =
document.getElementById("toast");


clearTimeout(toastTimeout);


toast.textContent=message;


toast.className =
"toast toast--visible"
+
(type==="error"
?" toast--error"
:"");


toastTimeout=setTimeout(()=>{

toast.classList.remove("toast--visible");

},3200);


}