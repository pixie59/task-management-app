import jwt from "jsonwebtoken";
const middle = (req, res, next) => {
  try {const token = req.headers.authorization;
    if (!token) {return res.status(401).json("Invalid token");}
    const decoded = jwt.verify(token, "sk");
    req.user = decoded;
    next();
  }
  catch (error) {console.log(error);
    return res.status(401).json(error.message);
  }
};

export default middle;