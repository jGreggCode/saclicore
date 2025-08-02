import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    street: { type: String, required: true },
    barangay: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    zipcode: { type: String, required: true },
  },
  { _id: false }
);

const userInfoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // Ensures one-to-one mapping
    },
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    birthday: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: addressSchema,
    course: { type: String },
    department: { type: String },
    year: { type: Number },
    section: { type: String },
  },
  { timestamps: true }
);

const userInfoModel =
  mongoose.models.UserInfo || mongoose.model("UserInfo", userInfoSchema);
export default userInfoModel;
