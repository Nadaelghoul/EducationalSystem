const { body, validationResult } = require("express-validator");
const Student = require("../models/Student");

const studentValidation = [
  // Account Information

  body("accountInfo.email")
    .trim()
    .notEmpty()
    .withMessage("البريد الإلكتروني مطلوب")
    .isEmail()
    .withMessage("البريد الإلكتروني غير صحيح")
    .custom(async (value) => {
      const normalizedEmail = (value || "").toLowerCase().trim();
      const existingStudent = await Student.findOne({
        "accountInfo.email": normalizedEmail,
      }).lean();

      if (existingStudent) {
        throw new Error("هذا البريد الإلكتروني مستخدم من قبل");
      }

      return true;
    }),

  body("accountInfo.password")
    .trim()
    .notEmpty()
    .withMessage("كلمة المرور مطلوبة")
    .isLength({ min: 8 })
    .withMessage("كلمة المرور يجب أن تكون 8 أحرف على الأقل")
    .matches(/^[A-Za-z0-9._-]+$/)
    .withMessage("A password can only contain letters, numbers, dots, dashes, and underscores"),

  body("accountInfo.status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage("الحالة غير صحيحة"),

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
  .trim()
  .notEmpty()
  .withMessage("الاسم الإنجليزي مطلوب")
  .custom((value) => {
    const names = value.trim().split(/\s+/);

    if (names.length < 4) {
      throw new Error("الاسم الإنجليزي يجب أن يكون رباعي");
    }

    // English letters only + first letter capital
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
    .matches(/^01[0125][0-9]{8}$/)
    .withMessage("رقم الهاتف غير صحيح"),

  body("personalInfo.governorate")
    .notEmpty()
    .withMessage("المحافظة مطلوبة"),

  body("personalInfo.gender")
    .isIn(["male", "female"])
    .withMessage("النوع غير صحيح"),

  body("personalInfo.dob")
    .notEmpty()
    .withMessage("تاريخ الميلاد مطلوب")
    .isISO8601()
    .withMessage("صيغة التاريخ غير صحيحة"),

  body("personalInfo.idType")
    .isIn(["national", "passport"])
    .withMessage("نوع الهوية غير صحيح"),

  body("personalInfo.idNumber")
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

    return true;
  }),

  body("personalInfo.address")
    .trim()
    .isLength({ min: 5 })
    .withMessage("العنوان غير صحيح"),

  body("personalInfo.country")
    .trim()
    .notEmpty()
    .withMessage("الدولة مطلوبة"),

  body("personalInfo.maritalStatus")
    .isIn(["single", "married"])
    .withMessage("الحالة الاجتماعية غير صحيحة"),

  body("personalInfo.religion")
    .isIn(["muslim", "christian", "other"])
    .withMessage("الديانة غير صحيحة"),

  body("personalInfo.cardIssuePlace")
    .trim()
    .notEmpty()
    .withMessage("جهة صدور البطاقة مطلوبة"),

  body("personalInfo.dataEntryDate")
    .isISO8601()
    .withMessage("تاريخ الإدخال غير صحيح"),

  // Academic Information

  body("academicInfo.oneChanceStudent")
    .isIn(["yes", "no"])
    .withMessage("قيمه غير صحيحه"),

  body("academicInfo.studyType")
    .isIn(["semesters", "hours"])
    .withMessage("قيمه غير صحيحه"),

  body("academicInfo.enrollmentStatus")
    .isIn(["new", "transferred", "repeated"])
    .withMessage("قيمه غير صحيحه"),

  body("academicInfo.enrollmentType")
    .isIn(["general", "transferred_from_other", "reserved"])
    .withMessage("قيمه غير صحيحه"),

  body("academicInfo.coordinationNumber")
    .trim()
    .notEmpty()
    .withMessage("رقم كشف التنيسق مطلوب"),

  // Qualification

  body("qualification.qualification")
    .isIn(["high_school", "diploma", "other"])
    .withMessage("المؤهل غير صحيح"),

  body("qualification.qualificationYear")
    .isInt({
      min: 1970,
      max: 2100,
    })
    .withMessage("سنة الحصول علي المؤهل غير صحيحه"),

  body("qualification.schoolName")
    .trim()
    .notEmpty()
    .withMessage("اسم المدرسة مطلوب"),

  body("qualification.total")
    .isFloat({
      min: 0,
    })
    .withMessage("المجموع غير صحيح"),

  body("qualification.seatNumber")
    .trim()
    .notEmpty()
    .withMessage("رقم الجلوس مطلوب"),

  // Family Information

  body("familyInfo.fatherName")
    .trim()
    .notEmpty()
    .withMessage("اسم الاب مطلوب"),

  body("familyInfo.motherName")
    .trim()
    .notEmpty()
    .withMessage("اسم الام مطلوب"),

  body("familyInfo.fatherJob")
    .trim()
    .notEmpty()
    .withMessage("مهنة الاب مطلوبة"),

  body("familyInfo.motherJob")
    .trim()
    .notEmpty()
    .withMessage("مهنة الام مطلوبة"),

  body("familyInfo.fatherWorkplace")
    .trim()
    .notEmpty()
    .withMessage("جهة عمل الاب مطلوبة"),

  body("familyInfo.motherWorkplace")
    .trim()
    .notEmpty()
    .withMessage("جهة عمل الام مطلوبة"),

  body("familyInfo.fatherPhone")
    .matches(/^01[0125][0-9]{8}$/)
    .withMessage("هاتف الاب غير صحيح"),

  body("familyInfo.motherPhone")
    .matches(/^01[0125][0-9]{8}$/)
    .withMessage("هاتف الام غير صحيح"),

  // Guardian Information

  body("familyInfo.guardian.guardianName")
    .custom((value, { req }) => {
      if (
        req.body.familyInfo.isFatherDeceased &&
        (!value || value.trim() === "")
      ) {
        throw new Error("اسم ولي الامر مطلوب");
      }
      return true;
    }),

  body("familyInfo.guardian.guardianRelation")
    .custom((value, { req }) => {
      if (
        req.body.familyInfo.isFatherDeceased &&
        (!value || value.trim() === "")
      ) {
        throw new Error("درجة القرابة لولي الامر مطلوبة");
      }
      return true;
    }),

  body("familyInfo.guardian.guardianWorkplace")
    .custom((value, { req }) => {
      if (
        req.body.familyInfo.isFatherDeceased &&
        (!value || value.trim() === "")
      ) {
        throw new Error("جهة عمل ولي الامر مطلوبة");
      }
      return true;
    }),

  body("familyInfo.guardian.guardianPhone")
    .custom((value, { req }) => {
      if (!req.body.familyInfo.isFatherDeceased) return true;

      if (!/^01[0125][0-9]{8}$/.test(value)) {
        throw new Error("هاتف ولي الامر غير صحيح");
      }

      return true;
    }),

  body("familyInfo.guardian.guardianAddress")
    .custom((value, { req }) => {
      if (
        req.body.familyInfo.isFatherDeceased &&
        (!value || value.trim() === "")
      ) {
        throw new Error("عنوان ولي الامر مطلوب");
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