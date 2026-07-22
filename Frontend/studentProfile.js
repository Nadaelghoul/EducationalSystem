"use strict";

const API_BASE = `${SERVER_URL}/api/students`;
const STUDENTS_LIST_URL = "./index.html";
const EDIT_STUDENT_URL_BASE = "./editStudent.html";

const DEMO_MODE = false;

const state = {
  studentPendingDeletion: null,
};

const FALLBACK_PHOTO =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#e4e8f1"/><circle cx="50" cy="38" r="18" fill="#98a1b3"/><path d="M18 88c4-22 24-32 32-32s28 10 32 32" fill="#98a1b3"/></svg>'
  );

document.addEventListener("DOMContentLoaded", async () => {

  initThemeToggle();
  initNavButtons();
  initDeleteModal();

  await loadStudentProfile();

});


// Theme toggle
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


  toggleBtn?.addEventListener("click", () => {

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



// Navigation
function initNavButtons(){

  document.getElementById("backBtn")
  ?.addEventListener("click",()=>{

    window.location.href =
      STUDENTS_LIST_URL;

  });

}



// Load profile
async function loadStudentProfile(){

  const studentId =
    getStudentIdFromUrl();


  if(!studentId){

    showError(
      "لم يتم تحديد الطالب المطلوب عرضه"
    );

    return;

  }


  try{

    const student =
      await fetchStudentById(studentId);


    if(!student){

      showError(
        "لا يوجد طالب بهذا الرقم"
      );

      return;

    }


    renderProfile(student);


  }catch(error){

    showError(
      error.message ||
      "تعذر تحميل بيانات الطالب"
    );

  }

}



function getStudentIdFromUrl(){

  const params =
    new URLSearchParams(
      window.location.search
    );

  return params.get("id");

}




async function fetchStudentById(id){

  const response =
    await fetch(
      `${API_BASE}/${id}`,
      {
        method:"GET",
        headers:{
          Accept:"application/json",
        }
      }
    );


  if(!response.ok){

    throw new Error(
      "تعذر تحميل بيانات الطالب"
    );

  }


  return await response.json();

}





function renderProfile(student){

  document.getElementById("loadingState").hidden = true;


  state.student = student;



  const fullName =
    student.personalInfo?.arabFullName || "—";


  const universityId =
    student.accountInfo?.universityId || "—";


  const status =
    student.accountInfo?.status || "inactive";



    const photo =
    student.personalInfo?.photo
        ? student.personalInfo.photo
        : FALLBACK_PHOTO;


  const img =
    document.getElementById("studentPhoto");


  img.src = photo;

  img.alt = fullName;


  img.onerror = ()=>{

    img.src = FALLBACK_PHOTO;

  };





  document.getElementById("studentName")
  .textContent =
    fullName;



  document.getElementById("studentIdText")
  .textContent =
    universityId;





  const badge =
    document.getElementById("statusBadge");


  const isActive =
    status === "active";


  badge.textContent =
    isActive
    ? "مُفعل"
    : "غير مُفعل";


  badge.className =
    "badge " +
    (
      isActive
      ? "badge--active"
      : "badge--inactive"
    );






  // Personal data

  setField(
    "f_fullName",
    student.personalInfo?.arabFullName
  );


  setField(
    "f_nationalId",
    student.personalInfo?.idNumber
  );


  setField(
    "f_gender",
    genderLabel(
      student.personalInfo?.gender
    )
  );


  setField(
    "f_birthDate",
    formatDate(
      student.personalInfo?.dob
    )
  );


  setField(
    "f_address",
    student.personalInfo?.address
  );






  // Academic data


  setField(
    "f_studentId",
    student.accountInfo?.universityId
  );


  setField(
    "f_department",
    student.academicInfo?.department
  );


  setField(
    "f_level",
    student.academicInfo?.level
  );

const currentYear = new Date().getFullYear();

const academicYear = 
  `${currentYear}/${currentYear + 1}`;

setField(
  "f_academicYear",
  academicYear
);

  setField(
    "f_enrollmentDate",
    formatDate(
      student.createdAt
    )
  );


  // Contact data


  setField(
    "f_email",
    student.accountInfo?.email
  );


  setField(
    "f_phone",
    student.personalInfo?.phone
  );


  setField(
  "f_guardianPhone",
  student.familyInfo?.guardian?.guardianPhone ||
  student.familyInfo?.fatherPhone
);



  document.getElementById("editBtn")
  ?.addEventListener("click",()=>{

    window.location.href =
      `${EDIT_STUDENT_URL_BASE}?id=${student._id}`;

  });




  document.getElementById("deleteBtn")
  ?.addEventListener("click",()=>{

    openDeleteModal(student);

  });



  document.getElementById("profileCard")
  .hidden = false;

}




function setField(id,value){

  const element =
    document.getElementById(id);


  if(element){

    element.textContent =
      value || "—";

  }

}




function genderLabel(gender){

  if(gender==="male")
    return "ذكر";


  if(gender==="female")
    return "أنثى";


  return "—";

}



function formatDate(date){

  if(!date)
    return "—";


  return new Date(date)
    .toLocaleDateString("ar-EG");

}




function showError(message){

  document.getElementById("loadingState")
  .hidden = true;


  document.getElementById("errorMessage")
  .textContent = message;


  document.getElementById("errorState")
  .hidden = false;

}



// Delete modal

function initDeleteModal(){

  const overlay =
    document.getElementById("deleteOverlay");


  const closeBtn =
    document.getElementById("deleteModalClose");


  const cancelBtn =
    document.getElementById("cancelDeleteBtn");


  const confirmBtn =
    document.getElementById("confirmDeleteBtn");



  const close = ()=>{

    overlay.hidden=true;

    state.studentPendingDeletion=null;

  };



  closeBtn.onclick=close;

  cancelBtn.onclick=close;



  confirmBtn.onclick = async()=>{


    const student =
      state.studentPendingDeletion;


    if(!student)
      return;



    try{


      await deleteStudentRequest(
        student._id
      );


      close();


      showToast(
        "تم حذف الطالب بنجاح",
        "success"
      );


      setTimeout(()=>{

        window.location.href =
          STUDENTS_LIST_URL;

      },1200);



    }catch(error){


      showToast(
        error.message,
        "error"
      );


    }


  };

}




function openDeleteModal(student){

  state.studentPendingDeletion =
    student;


  document.getElementById(
    "deleteStudentName"
  )
  .textContent =
    student.personalInfo?.arabFullName;


  document.getElementById(
    "deleteOverlay"
  )
  .hidden=false;

}




async function deleteStudentRequest(id){


 const response =
   await fetch(
     `${API_BASE}/${id}`,
     {
       method:"DELETE",
        headers:{
        }
     }
   );


 if(!response.ok){

   throw new Error(
     "تعذر حذف الطالب"
   );

 }


}





let toastTimeout;


function showToast(message,type="default"){


 const toast =
   document.getElementById("toast");


 clearTimeout(toastTimeout);


 toast.textContent =
   message;


 toast.className =
   "toast toast--visible" +
   (
    type==="error"
    ? " toast--error"
    :
    type==="success"
    ? " toast--success"
    :
    ""
   );



 toastTimeout =
 setTimeout(()=>{

   toast.classList.remove(
     "toast--visible"
   );

 },3200);


}

