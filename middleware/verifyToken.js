const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  // Access Authorization from req header
  const Authorization = req.header("authorization");
  if (!Authorization) {
    res.sendStatus(401);
  }

  //Get token
  const token = Authorization.replace("Bearer ", "");

  try {
    //Verify token
    const { id } = jwt.verify(token, process.env.APP_SECRET);

    //Assign req
    req.user = { id };
    next();
  } catch (error) {
    res.sendStatus(403);
  }
};

exports.destroyToken = (res) => {
  // Access Authorization from req header
  token = undefined; //value undefined
  res.sendStatus(200);
};
