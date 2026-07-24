const { body, validationResult } = require("express-validator");
const Student = require("../models/Student");

const studentValidation = [

  // Personal Information

 body("personalInfo.arabFullName")
  .trim()
  .notEmpty()
  .withMessage("الاسم العربي مطلوب")
  .custom((value) => {
    const names = value.trim().split(/\s+/);

    if (names.length < 4) {
      throw new Error("الاسم العربي يجب أن يكون رباعي");
    }

    // Arabic letters only
    const isArabic = names.every((name) =>
      /^[\u0600-\u06FF]+$/.test(name)
    );

    if (!isArabic) {
      throw new Error("الاسم العربي يجب أن يحتوي على حروف عربية فقط");
    }

    return true;
  }),

body("personalInfo.englishFullName")
  .optional({ checkFalsy: true })
  .trim()
  .custom((value) => {
    const names = value.trim().split(/\s+/);

    if (names.length < 4) {
      throw new Error("الاسم الإنجليزي يجب أن يكون رباعي");
    }

    // English letters only + each part starts with a capital letter
    const isValidFormat = names.every((name) =>
      /^[A-Z][a-z]+$/.test(name)
    );

    if (!isValidFormat) {
      throw new Error(
        "الاسم الإنجليزي يجب أن يكون باللغة الإنجليزية فقط وكل جزء يبدأ بحرف كبير (Example: Mohamed Ahmed Hassan Ali)"
      );
    }

    return true;
  }),

 body("personalInfo.phone")
  .notEmpty()
  .withMessage("رقم الهاتف مطلوب")
  .matches(/^01[0125][0-9]{8}$/)
  .withMessage("رقم الهاتف غير صحيح"),

 body("personalInfo.governorate")
.notEmpty()
.withMessage("المحافظة مطلوبة")
.isIn([
 "دمياط",
 "بورسعيد",
 "المنصورة",
 "أخرى"
])
.withMessage("المحافظة غير صحيحة"),

  body("personalInfo.gender")
    .isIn(["male", "female"])
    .withMessage("النوع غير صحيح"),

  body("personalInfo.dob")
    .notEmpty()
    .withMessage("تاريخ الميلاد مطلوب")
    .isISO8601()
    .withMessage("صيغة التاريخ غير صحيحة"),

  body("personalInfo.idType")
 .notEmpty()
 .withMessage("نوع الهوية مطلوب")
 .isIn(["national","passport"])
 .withMessage("نوع الهوية غير صحيح"),

  body("personalInfo.idNumber")
  .notEmpty()
  .withMessage("رقم الهوية مطلوب")

  .custom(async (value, { req }) => {

    const type = req.body.personalInfo.idType;

    if (type === "national") {
      if (!/^\d{14}$/.test(value)) {
        throw new Error("الرقم القومي يجب أن يكون 14 رقم");
      }
    }

    if (type === "passport") {
      if (value.trim().length < 4) {
        throw new Error("رقم جواز السفر غير صحيح");
      }
    }

    const student = await Student.findOne({
      "personalInfo.idNumber": value,
    });

    if (student) {
      throw new Error("رقم الهوية مستخدم بالفعل");
    }

    return true;
  }),

 
 body("personalInfo.maritalStatus")
  .optional({ checkFalsy: true })
  .isIn(["single", "married"])
  .withMessage("الحالة الاجتماعية غير صحيحة"),

  body("personalInfo.religion")
    .optional({ checkFalsy: true })
    .isIn(["muslim", "christian", "other"])
    .withMessage("الديانة غير صحيحة"),

  body("personalInfo.dataEntryDate")
  .optional({ checkFalsy: true })
  .isISO8601()
  .withMessage("تاريخ الإدخال غير صحيح"),

  // Academic Information

  body("academicInfo.oneChanceStudent")
    .optional({ checkFalsy: true })
    .isIn(["yes", "no"])
    .withMessage("قيمه غير صحيحه"),

  body("academicInfo.studyType")
    .optional({ checkFalsy: true })
    .isIn(["semesters", "hours"])
    .withMessage("قيمه غير صحيحه"),

  body("academicInfo.enrollmentStatus")
    .optional({ checkFalsy: true })
    .isIn(["new", "transferred", "repeated"])
    .withMessage("قيمه غير صحيحه"),

  body("academicInfo.enrollmentType")
    .optional({ checkFalsy: true })
    .isIn(["general", "transferred_from_other", "reserved"])
    .withMessage("قيمه غير صحيحه"),


  // Qualification

  body("qualification.qualification")
    .optional({ checkFalsy: true })
    .isIn(["high_school", "diploma", "other"])
    .withMessage("المؤهل غير صحيح"),

 body("qualification.qualificationYear")
  .optional({ checkFalsy: true })
  .isInt({
    min: 1970,
    max: 2100,
  })
  .withMessage("سنة الحصول علي المؤهل غير صحيحه"),


   body("qualification.total")
  .optional({ checkFalsy: true })
  .isFloat({ min: 0 })
  .withMessage("المجموع غير صحيح"),

  // Family Information

  body("familyInfo.fatherPhone")
  .optional({ checkFalsy: true })
  .matches(/^01[0125][0-9]{8}$/)
  .withMessage("هاتف الاب غير صحيح"),

  body("familyInfo.motherPhone")
  .optional({ checkFalsy: true })
  .matches(/^01[0125][0-9]{8}$/)
  .withMessage("هاتف الام غير صحيح"),
  // Guardian Information

   body("familyInfo.guardian.guardianPhone")
  .optional()
  .trim()
  .custom((value) => {

    if (!value) return true;

    if (!/^01[0125][0-9]{8}$/.test(value)) {
      throw new Error("هاتف ولي الأمر غير صحيح");
    }

    return true;

  }),
 
];

const validateStudent = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const formattedErrors = {};

  errors.array().forEach((error) => {
    const fieldPath = error.path || "unknown";

    if (!formattedErrors[fieldPath]) {
      formattedErrors[fieldPath] = [];
    }

    formattedErrors[fieldPath].push(error.msg);
  });

  return res.status(400).json({
    success: false,
    message: "Validation failed.",
    errors: formattedErrors,
  });
};

module.exports = {
  studentValidation,
  validateStudent
};