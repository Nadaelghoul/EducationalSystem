const mongoose = require("mongoose");

const guardianSchema = new mongoose.Schema(
  {
    guardianName: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    guardianRelation: {
      type: String,
      trim: true,
      maxlength: 50,
    },

    guardianWorkplace: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    guardianPhone: {
      type: String,
      match: /^01[0125][0-9]{8}$/,
    },

    guardianAddress: {
      type: String,
      trim: true,
      maxlength: 250,
    },
  },
  { _id: false }
);

const studentSchema = new mongoose.Schema(
  {
    personalInfo: {
      arabFullName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
      },

      englishFullName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
      },

      phone: {
        type: String,
        required: true,
        match: /^01[0125][0-9]{8}$/,
      },

      governorate: {
        type: String,
        required: true,
        enum: ["دمياط", "بورسعيد", "المنصورة", "أخرى"],
      },

      gender: {
        type: String,
        required: true,
        enum: ["male", "female"],
      },

      dob: {
        type: Date,
        required: true,
      },

      idType: {
        type: String,
        required: true,
        enum: ["national", "passport"],
      },

      idNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },

      address: {
        type: String,
        required: true,
        trim: true,
        maxlength: 250,
      },

      country: {
        type: String,
        required: true,
        trim: true,
        default: "مصر",
      },

      maritalStatus: {
        type: String,
        required: true,
        enum: ["single", "married"],
      },

      religion: {
        type: String,
        required: true,
        enum: ["muslim", "christian", "other"],
      },

      cardIssuePlace: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
      },

      dataEntryDate: {
        type: Date,
        required: true,
      },
    },

    academicInfo: {
      oneChanceStudent: {
        type: String,
        required: true,
        enum: ["yes", "no"],
      },

      studyType: {
        type: String,
        required: true,
        enum: ["semesters", "hours"],
      },

      enrollmentStatus: {
        type: String,
        required: true,
        enum: ["new", "transferred", "repeated"],
      },

      enrollmentType: {
        type: String,
        required: true,
        enum: ["general", "transferred_from_other", "reserved"],
      },

      coordinationNumber: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50,
      },
    },

    qualification: {
      qualification: {
        type: String,
        required: true,
        enum: ["high_school", "diploma", "other"],
      },

      qualificationYear: {
        type: Number,
        required: true,
        min: 1970,
        max: 2100,
      },

      schoolName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 150,
      },

      total: {
        type: Number,
        required: true,
        min: 0,
      },

      seatNumber: {
        type: String,
        required: true,
        trim: true,
        maxlength: 30,
      },
    },

    familyInfo: {
      fatherName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
      },

      motherName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
      },

      fatherJob: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
      },

      motherJob: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
      },

      fatherWorkplace: {
        type: String,
        required: true,
        trim: true,
        maxlength: 150,
      },

      motherWorkplace: {
        type: String,
        required: true,
        trim: true,
        maxlength: 150,
      },

      fatherPhone: {
        type: String,
        required: true,
        match: /^01[0125][0-9]{8}$/,
      },

      motherPhone: {
        type: String,
        required: true,
        match: /^01[0125][0-9]{8}$/,
      },

      isFatherDeceased: {
        type: Boolean,
        default: false,
      },

      guardian: guardianSchema,
    },
  },
  {
    timestamps: true,
  }
);

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
