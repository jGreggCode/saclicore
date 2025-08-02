import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    rfidTag: {
      type: String,
      required: true,
      unique: true,
    },
    userType: {
      type: String,
      required: true,
      enum: ["student", "employee", "admin"],
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, minimize: false }
);

const userModel = mongoose.models.user || mongoose.model("User", userSchema);
export default userModel;
