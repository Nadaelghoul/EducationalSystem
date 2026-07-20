const express = require("express");
const router = express.Router();
const Student = require("../models/Student");

const {studentValidation,validateStudent} = require("../middlewares/studentValidation");

router.post("/", studentValidation, validateStudent, async (req, res) => {
  try {
    const student = new Student(req.body);
    const savedStudent = await student.save();

    const officialPayload = {
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

module.exports = router;