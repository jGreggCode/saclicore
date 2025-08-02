import userModel from "../models/userModel.js";
import userInfoModel from "../models/userInfoModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Function to create a JWT token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1m" });
};

// Route for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = createToken(user._id);
      res.json({ success: true, token });
    } else {
      return res.json({ success: false, message: "Invalid password" });
    }
  } catch (error) {
    console.error("Error in register controller", error);
    res.json({ success: false, message: "Sign In Error" });
  }
};

// Route for user registration
const registerUser = async (req, res) => {
  try {
    const { rfidTag, userType, username, email, password } = req.body;

    // If fileds are empty
    if (!rfidTag || !userType || !username || !email || !password)
      return res
        .status(400)
        .json({ success: false, message: "Please fill all fields" });

    // Check if user exist
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res
        .status(409)
        .json({ success: false, message: "Email already exists" });
    }

    // Validate Email format and Strong Password
    if (!validator.isEmail(email)) {
      return res
        .status(422)
        .json({ success: false, message: "Please enter valid email" });
    }
    if (password.length < 8) {
      return res.status(422).json({
        success: false,
        message: "Password cannot be less than 8 characters",
      });
    }

    // Hash user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      rfidTag,
      userType,
      username,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();

    const token = createToken(user._id);

    res.json({ success: true, newUser, token });
  } catch (error) {
    console.error(
      "Error in registerUser Function (userController.js) - Line 37",
      error
    );
    res.status(500).json({ success: false, message: "Sign Up Error" });
  }
};

// Create User Info
const registerUserInfo = async (req, res) => {
  try {
    const userId = req.userId;
    const {
      firstName,
      middleName,
      lastName,
      birthday,
      phoneNumber,
      address: { street, barangay, city, country, zipcode },
      course,
      department,
      year,
      section,
    } = req.body;

    // If fileds are empty
    if (
      !firstName ||
      !middleName ||
      !lastName ||
      !birthday ||
      !phoneNumber ||
      !street ||
      !barangay ||
      !city ||
      !country ||
      !zipcode ||
      !course ||
      !department ||
      !year ||
      !section
    )
      return res
        .status(400)
        .json({ success: false, message: "Please fill all fields" });

    // Check if UserInfo already exists for this user
    const exists = await userInfoModel.findOne({ userId });
    if (exists) {
      return res
        .status(409)
        .json({ success: false, message: "User info already exists" });
    }

    // Save new UserInfo
    const newUserInfo = new userInfoModel({
      userId,
      firstName,
      middleName,
      lastName,
      birthday,
      phoneNumber,
      address: {
        street,
        barangay,
        city,
        country,
        zipcode,
      },
      course,
      department,
      year,
      section,
    });

    const savedInfo = await newUserInfo.save();

    res.status(201).json({
      success: true,
      message: "User information saved successfully",
      userInfo: savedInfo,
    });
  } catch (error) {
    console.error(
      "Error in registerUserInfo Function (userController.js) - Line 96",
      error
    );
    res
      .status(500)
      .json({ success: false, message: "Error saving user information" });
  }
};

// Route for Editing Profile
const editProfile = async (req, res) => {
  try {
    const { rfidTag, userType, username, email } = req.body;

    // User ID from token (assume middleware sets req.userId)
    const userId = req.userId;

    // Validate required fields
    if (!rfidTag || !userType || !username || !email) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    // Check if email is valid
    if (!validator.isEmail(email)) {
      return res
        .status(422)
        .json({ success: false, message: "Please enter a valid email" });
    }

    // Check if the new email is already used by another user
    const emailTaken = await userModel.findOne({
      email,
      _id: { $ne: userId }, // exclude current user
    });
    if (emailTaken) {
      return res
        .status(409)
        .json({ success: false, message: "Email is already in use" });
    }

    // Update user
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { rfidTag, userType, username, email },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error in editProfile Function", error);
    res.status(500).json({ success: false, message: "Edit Profile Error" });
  }
};

// Admin Login
// const adminLogin = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const admin = await adminModel.findOne({ email });

//     if (!admin) {
//       return res.json({ success: false, message: "Admin not found!" });
//     }

//     const isMatch = await bcrypt.compare(password, admin.password);

//     if (isMatch) {
//       const token = jwt.sign(process.env.ADMIN_AUTH, process.env.JWT_SECRET);
//       res.json({ success: true, token });
//     } else {
//       return res.json({ success: false, message: "Invalid password" });
//     }
//   } catch (error) {
//     console.error("Error in adminLogin controller", error);
//     res.json({ success: false, message: "Sign In Error" });
//   }
// };

// const adminRegister = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
//     // Check if user exist

//     const exists = await adminModel.findOne({ email });
//     if (exists) {
//       return res.json({ success: false, message: "Email already exists" });
//     }

//     // Validate Email format and Strong Password
//     if (!validator.isEmail(email)) {
//       return res.json({ success: false, message: "Please enter valid email" });
//     }
//     if (password.length < 8) {
//       return res.json({
//         success: false,
//         message: "Password cannot be less than 8 characters",
//       });
//     }

//     // Hash user password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const newAdmin = new adminModel({
//       name,
//       email,
//       password: hashedPassword,
//     });

//     const admin = await newAdmin.save();

//     const token = jwt.sign(process.env.ADMIN_AUTH, process.env.JWT_SECRET);

//     res.json({ success: true, token });
//   } catch (error) {
//     console.error("Error in login controller", error);
//     res.json({ success: false, message: "Sign Up Error" });
//   }
// };

export { loginUser, registerUser, editProfile, registerUserInfo };
