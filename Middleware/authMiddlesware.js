const jwt = require("jsonwebtoken");

exports.appMiddleware = (req, res, next) => {
   console.log("Inside middleware");
   next();
};

exports.jwtMiddleware = (req, res, next) => {
   console.log("Inside jwtMiddleware");

   const token = req.headers["access-token"];

   try {
      const { loginAcno } = jwt.verify(token, "thesecretkey");
      console.log(loginAcno);
      req.loginData = loginAcno;
      next();
   } catch {
      res.status(406).json("Please login");
   }
};
