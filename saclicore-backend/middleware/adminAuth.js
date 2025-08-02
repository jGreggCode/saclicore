import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    const { token } = req.headers;
    console.log(token);
    if (!token) {
      return res.json({ success: false, message: "Not Authorized" });
    }

    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    console.log(token_decode);
    if (token_decode !== process.env.ADMIN_AUTH) {
      return res.json({ success: false, message: "Not Authorized" });
    }

    next();
  } catch (error) {
    console.error("Error", error);
    res.json({ success: false, message: "Error in Admin Auth" });
  }
};

export default adminAuth;
