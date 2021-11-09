var Student = require("../models/Student");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.login = async (req, res) => {
  model.getOne(req.params.id, function (err, data) {
    if(data && bcrypt.compareSync(req.body.password, data.password)){
        const token = jwt.sign({id: data.id}, process.env.APP_SECRET)
        res.status(200).send({
            data: {token, data},
            status: "success",
          })
    }
  });
};
