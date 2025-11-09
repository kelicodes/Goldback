import JWT from "jsonwebtoken";

export const UserAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const tokenCheck = JWT.verify(token, process.env.SECRETWORD);

    if (tokenCheck.id) {
      req.user = { _id: tokenCheck.id };
      return next();
    }

    return res.status(401).json({ success: false, message: "Invalid token" });

  } catch (e) {
    console.log(e)
    return res.status(401).json({ success: false, message: "Error in userAuth middleware" });
  }
};


export default UserAuth
