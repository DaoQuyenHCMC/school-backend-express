const jwt = require("jsonwebtoken");

exports.checkCurrentUser = (req, res, next) => {
  // Access Authorization from req header
  const Authorization = req.header("authorization");
  if (!Authorization) {
    req.user = null;
    next();
  }

  //Get token
  const token = Authorization.replace("Bearer", "");

  if (!token) res.sendStatus(401);

  try {
    //Verify token
    const { id } = jwt.verify(token, process.env.APP_SECRET);
    //Assign req
    req.user = { id };
    next();
  } catch {
    req.user = null;
    next();
  }
};
