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
   accountInfo: {
  username: {
    type: String,
    unique: true,
    trim: true,
    default: ""
  },

  password: {
    type: String,
    trim: true,
    default: ""
  },

  universityId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
},

    personalInfo: {
      arabFullName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
      },
      arabFullNameNormalized: {
      type: String,
       trim: true,
      lowercase: true,
     },

      englishFullName: {
        type: String,
        trim: true,
        maxlength: 100,
          default: "",
      },

      photo: {
      type: String,
      default: ""
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
        trim: true,
        maxlength: 250,
        default: "",
      },

      country: {
        type: String,
        trim: true,
        default: "مصر",
      },

      maritalStatus: {
        type: String,
        enum: ["single", "married"],
        default:null,
      },

      religion: {
        type: String,
        enum: ["muslim", "christian", "other"],
        default:null,
      },

      cardIssuePlace: {
        type: String,
        trim: true,
        maxlength: 100,
        default: "",
      },

      dataEntryDate: {
        type: Date,
         default: null,
      },
    },

    academicInfo: {
      level: {
        type: String,
        enum: ["الأول", "الثاني", "الثالث", "الرابع", "الخامس"],
        default: "الأول",
      },

      department: {
        type: String,
        enum: ["علوم الحاسب", "نظم المعلومات", "هندسة البرمجيات", "تكنولوجيا المعلومات"],
        default:null,
      },

      oneChanceStudent: {
        type: String,
        enum: ["yes", "no"],
        default:null,
      },

      studyType: {
        type: String,
        enum: ["semesters", "hours"],
         default:null
      },

      enrollmentStatus: {
        type: String,
        enum: ["new", "transferred", "repeated"],
         default:null
      },

      enrollmentType: {
        type: String,
        enum: ["general", "transferred_from_other", "reserved"],
        default:null
      },

      coordinationNumber: {
        type: String,
        trim: true,
        maxlength: 50,
        default:"",
      },
    },

    qualification: {
      qualification: {
        type: String,
        enum: ["high_school", "diploma", "other"],
        default:null
      },

      qualificationYear: {
        type: Number,
        min: 1970,
        max: 2100,
        default: null,
      },

      schoolName: {
        type: String,
        trim: true,
        maxlength: 150,
        default:"",
      },

      total: {
        type: Number,
        min: 0,
        default: null,
      },

      seatNumber: {
        type: String,
        trim: true,
        maxlength: 30,
        default:"",
      },
    },

    familyInfo: {
      fatherName: {
        type: String,
        trim: true,
        maxlength: 100,
         default:"",
      },

      motherName: {
        type: String,
        trim: true,
        maxlength: 100,
         default:"",
      },

      fatherJob: {
        type: String,
        trim: true,
        maxlength: 100,
         default:"",
      },

      motherJob: {
        type: String,
        trim: true,
        maxlength: 100,
         default:"",
      },

      fatherWorkplace: {
        type: String,
        trim: true,
        maxlength: 150,
         default:"",
      },

      motherWorkplace: {
        type: String,
        trim: true,
        maxlength: 150,
         default:"",
      },

      fatherPhone: {
        type: String,
        match: /^01[0125][0-9]{8}$/,
         default:"",
      },

      motherPhone: {
        type: String,
        match: /^01[0125][0-9]{8}$/,
         default:"",
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
