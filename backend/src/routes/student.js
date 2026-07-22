const express = require("express");
const router = express.Router();
const Student = require("../models/Student");

const {studentValidation,validateStudent} = require("../middlewares/studentValidation");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

function normalizeArabic(text) {

  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[أإآا]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/\s+/g, " ");

}


const storage = new CloudinaryStorage({

  cloudinary,

  params: {
    folder: "students",

    allowed_formats: [
      "jpg",
      "jpeg",
      "png",
      "webp"
    ],

   public_id: (req, file) => {

  return `student-${req.params.id}-${Date.now()}`;

}

  }

});


const fileFilter = (req, file, cb) => {

  const allowed = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/jpg"
  ];


  if (allowed.includes(file.mimetype)) {

    cb(null, true);

  } else {

    cb(new Error("Only images are allowed"));

  }

};


const upload = multer({

  storage,

  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024
  }

});



router.post( "/", async (req, res, next) => {
    if (req.body?.validateOnly !== true) {
      return next();
    }

    const email = req.body?.accountInfo?.email?.toString().trim().toLowerCase();

    if (!email) {
      return res.status(400).json({
        success: false,
        available: false,
        message: "البريد الإلكتروني مطلوب",
      });
    }

    try {
      const existingStudent = await Student.findOne({
        "accountInfo.email": email,
      }).lean();

      return res.json({
        success: true,
        available: !existingStudent,
        message: existingStudent
          ? "هذا البريد الإلكتروني مستخدم من قبل"
          : "البريد الإلكتروني متاح",
      });
    } catch (error) {
      console.error("Validate email error:", error);
      return res.status(500).json({
        success: false,
        available: false,
        message: "Failed to validate email.",
      });
    }
  },
  studentValidation,
  validateStudent,
  async (req, res) => {
  try {
    const payload = { ...req.body };

    payload.personalInfo = {
    ...(payload.personalInfo || {}),

   arabFullNameNormalized:normalizeArabic( payload.personalInfo?.arabFullName || "")
};

    const lastStudent = await Student.findOne()
  .sort({ "accountInfo.universityId": -1 })
  .select("accountInfo.universityId");


let nextNumber = 1;


if (lastStudent?.accountInfo?.universityId) {

  const lastId = lastStudent.accountInfo.universityId;

  const numberPart = parseInt(
    lastId.replace("STD", ""),
    10
  );

  nextNumber = numberPart + 1;
}


const universityId =
  `STD${String(nextNumber).padStart(6, "0")}`;


payload.accountInfo = {
  ...(payload.accountInfo || {}),
  universityId,
  status: "active",
};

    payload.academicInfo = {
      ...(payload.academicInfo || {}),
      level: "الأول",
      department: "علوم الحاسب",
    };

    const student = new Student(payload);
    const savedStudent = await student.save();

    const officialPayload = {
      email: savedStudent.accountInfo?.email || "",
      universityId: savedStudent.accountInfo?.universityId || "",
      status: savedStudent.accountInfo?.status || "active",
      arabFullName: savedStudent.personalInfo?.arabFullName || "",
      englishFullName: savedStudent.personalInfo?.englishFullName || "",
      address: savedStudent.personalInfo?.address || "",
      governorate: savedStudent.personalInfo?.governorate || "",
      dob: savedStudent.personalInfo?.dob || "",
      country: savedStudent.personalInfo?.country || "",
      religion: savedStudent.personalInfo?.religion || "",
      gender: savedStudent.personalInfo?.gender || "",
      maritalStatus: savedStudent.personalInfo?.maritalStatus || "",
      phone: savedStudent.personalInfo?.phone || "",
      idType: savedStudent.personalInfo?.idType || "",
      idNumber: savedStudent.personalInfo?.idNumber || "",
      cardIssuePlace: savedStudent.personalInfo?.cardIssuePlace || "",
      isFatherDeceased: savedStudent.familyInfo?.isFatherDeceased || false,
      fatherName: savedStudent.familyInfo?.fatherName || "",
      fatherWorkplace: savedStudent.familyInfo?.fatherWorkplace || "",
      fatherPhone: savedStudent.familyInfo?.fatherPhone || "",
      motherName: savedStudent.familyInfo?.motherName || "",
      motherJob: savedStudent.familyInfo?.motherJob || "",
      guardianName: savedStudent.familyInfo?.guardian?.guardianName || "",
      guardianRelation: savedStudent.familyInfo?.guardian?.guardianRelation || "",
      guardianWorkplace: savedStudent.familyInfo?.guardian?.guardianWorkplace || "",
      guardianPhone: savedStudent.familyInfo?.guardian?.guardianPhone || "",
      guardianAddress: savedStudent.familyInfo?.guardian?.guardianAddress || "",
      qualification: savedStudent.qualification?.qualification || "",
      qualificationYear: savedStudent.qualification?.qualificationYear || "",
      seatNumber: savedStudent.qualification?.seatNumber || "",
      total: savedStudent.qualification?.total || "",
      schoolName: savedStudent.qualification?.schoolName || "",
      oneChanceStudent: savedStudent.academicInfo?.oneChanceStudent || "",
      studyType: savedStudent.academicInfo?.studyType || "",
      enrollmentStatus: savedStudent.academicInfo?.enrollmentStatus || "",
      enrollmentType: savedStudent.academicInfo?.enrollmentType || "",
      coordinationNumber: savedStudent.academicInfo?.coordinationNumber || "",
      motherWorkplace: savedStudent.familyInfo?.motherWorkplace || "",
      fatherJob: savedStudent.familyInfo?.fatherJob || "",
      motherPhone: savedStudent.familyInfo?.motherPhone || "",
    };

    return res.status(201).json({
      success: true,
      message: "Student created successfully.",
      data: officialPayload,
    });
  } catch (error) {
    console.error("Create student error:", error);

    return res.status(400).json({
      success: false,
      message: "Failed to create student.",
      error: error.message,
    });
  }
});

// GET all students
router.get("/", async (req, res) => {
  try {

    const {
      search = "",
      department = "",
      level = "",
      status = ""
    } = req.query;


    let query = {};


    // البحث بالاسم أو الرقم الجامعي
    if(search){

      const normalizedSearch = normalizeArabic(search);


      query.$or = [
        {
         "personalInfo.arabFullNameNormalized": {
          $regex: normalizeArabic(search),
          $options: "i"
        }
        },
        {
          "accountInfo.universityId": {
            $regex: search,
            $options: "i"
          }
        }
      ];

    }



    if(department){
      query["academicInfo.department"] = department;
    }


    if(level){
      query["academicInfo.level"] = level;
    }


    if(status){
      query["accountInfo.status"] = status;
    }



    const students = await Student.find(query)
      .select(
        "accountInfo.universityId accountInfo.status personalInfo.arabFullName academicInfo.department academicInfo.level"
      );


    res.json(students);



  } catch(error){

    res.status(500).json({
      message:error.message
    });

  }
});

// GET student by ID
router.get("/:id", async (req, res) => {
  try {

    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    res.json(student);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
});

router.patch("/:id/photo", upload.single("photo"), async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image selected",
      });
    }


    const student = await Student.findById(req.params.id);


    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }


    // Cloudinary returns the image URL in req.file.path
    student.personalInfo.photo = req.file.path;


    await student.save();

   res.json({
  success: true,
  message: "Photo uploaded successfully",
  data: student
   });


  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
});

router.patch("/:id/status", async (req, res) => {

  try {

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          "accountInfo.status": req.body.status
        }
      },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    res.json(student);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

});

// DELETE student by ID
router.delete("/:id", async (req, res) => {
  try {

    const student = await Student.findByIdAndDelete(
      req.params.id
    );


    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }


    res.json({
      success: true,
      message: "Student deleted successfully"
    });


  } catch (error) {

    console.error("Delete student error:", error);


    res.status(500).json({
      success: false,
      message: error.message
    });

  }
});

router.patch("/:id", async(req,res)=>{

try{

const student = await Student.findByIdAndUpdate(

req.params.id,

{
$set:{

"personalInfo.address":
req.body.address,


"academicInfo.department":
req.body.department,


"academicInfo.level":
req.body.level,


"familyInfo.guardian.guardianPhone":
req.body.guardianPhone,


"familyInfo.fatherPhone":
req.body.fatherPhone

}

},

{
new:true,
runValidators:true
}

);


if(!student){

return res.status(404).json({
message:"Student not found"
});

}


res.json({
success:true,
data:student
});


}catch(error){

res.status(500).json({
message:error.message
});

}

});

module.exports = router;