const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: "first name is required",
    },
    lastName: {
      type: String,
      trim: true,
      required: "last name is required",
    },
    email: {
      type: String,
      trim: true,
      required: "email is required",
      unique: "email already exists",
      match: [/.+\@.+\..+/, "Please fill a valid email address"],
    },
    password: {
      type: String,
      required: "password is required",
    },
    photoUrl: {
      type: String,
      default: "http://0.0.0.0:9000/api/photos/default.png",
    },
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);
