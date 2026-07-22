require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3000;
const cors = require("cors");
const studentRoutes = require("./routes/student");

app.use(
  cors({
    origin: "*",
    methods: [
      "GET",
      "POST",
      "PATCH",
      "DELETE",
      "PUT"
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization"
    ]
  })
);
 
app.use(express.json());
app.use("/api/students", studentRoutes);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected"))
  .catch((err) => console.log(err));

if(process.env.NODE_ENV !== "production"){
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
}

module.exports = app;


