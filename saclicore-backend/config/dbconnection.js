import mongoose from "mongoose";

const conn = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("✅ Database Connected Successfully");
    });
    await mongoose.connect(`${process.env.MONGO_URI}/saclicore`);
  } catch (error) {
    console.error("DB Connection Error:", error);
    process.exit(1); // Exit process with failure
  }
};

export default conn;
