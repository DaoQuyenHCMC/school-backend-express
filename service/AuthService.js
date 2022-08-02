var Status = require("../common/core");
var Auth = require("../models/Auth");
var Student = require("../models/Student");
var Teacher = require("../models/Teacher");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

var model = new Auth();
var modelTeacher = new Teacher();
var modelStudent = new Student();

module.exports = function () {
  this.login = async (username, password, result) => {
    try {
      if (username && password) {
        // Tạo token
        var token = jwt.sign({ id: username }, process.env.APP_SECRET, {
          expiresIn: "10h",
        });

        // check login cho học sinh
        dataStudent = await model.loginStudent(username);
        if (
          dataStudent.recordset.length != 0 &&
          dataStudent.recordset[0].password &&
          bcrypt.compareSync(password, dataStudent.recordset[0].password)
        ) {
          //Status, Data,	Message, Total, Headers
          return result(
            Status.APIStatus.Ok,
            {
              username: username,
              name: dataStudent.recordset[0].name,
              roleId: dataStudent.recordset[0].roleId,
              roleName: dataStudent.recordset[0].roleName,
              schoolId: dataStudent.recordset[0].schoolId,
              schoolName: dataStudent.recordset[0].schoolName,
              token,
            },
            "Lấy dữ liệu thành công",
            1,
            null
          );
        }

        // check login cho giáo viên
        dataTeacher = await model.loginTeacher(username);

        if (
          dataTeacher.recordset.length != 0 &&
          dataTeacher.recordset[0].password &&
          bcrypt.compareSync(password, dataTeacher.recordset[0].password)
        ) {
          //Status, Data,	Message, Total, Headers
          return result(
            Status.APIStatus.Ok,
            {
              username: username,
              name: dataTeacher.recordset[0].name,
              roleId: dataTeacher.recordset[0].roleId,
              roleName: dataTeacher.recordset[0].roleName,
              schoolId: dataTeacher.recordset[0].schoolId,
              schoolName: dataTeacher.recordset[0].schoolName,
              token,
            },
            "Lấy dữ liệu thành công",
            1,
            null
          );
        }

        // check login cho gia đình
        dataFamily = await model.loginFamily(username);

        if (
          dataFamily.recordset.length != 0 &&
          dataFamily.recordset[0].password &&
          bcrypt.compareSync(password, dataFamily.recordset[0].password)
        ) {
          //Status, Data,	Message, Total, Headers
          return result(
            Status.APIStatus.Ok,
            {
              username: username,
              name: dataFamily.recordset[0].name,
              roleId: dataFamily.recordset[0].roleId,
              roleName: dataFamily.recordset[0].roleName,
              token,
            },
            "Lấy dữ liệu thành công",
            1,
            null
          );
        }

        //Status, Data,	Message, Total, Headers
        return result(
          Status.APIStatus.NotFound,
          null,
          "Tên tài khoản hoặc mật khẩu không đúng",
          0,
          null
        );
      }

      //Status, Data,	Message, Total, Headers
      return result(Status.APIStatus.Error, null, "Thiếu dữ liệu", 0, null);
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      return result(Status.APIStatus.Error, err, "Sai kiểu dữ liệu", 0, null);
    }
  };

  this.getCurrentUser = async (userId, result) => {
    try {
      if (userId) {
        const dataStudent = await modelStudent.getOne(userId.id);
        if (dataStudent.recordset.length != 0) {
          //Status, Data,	Message, Total, Headers
          return result(
            Status.APIStatus.Ok,
            dataStudent.recordset[0].name,
            "Lấy dữ liệu thành công",
            1,
            null
          );
        }

        const dataTeacher = await modelTeacher.getOne(userId.id);
        if (dataTeacher.recordset.length != 0) {
          //Status, Data,	Message, Total, Headers
          return result(
            Status.APIStatus.Ok,
            dataTeacher.recordset[0].name,
            "Lấy dữ liệu thành công",
            dataTeacher.recordset.length,
            null
          );
        }
      }
    } catch (err) {
      //Status, Data,	Message, Total, Headers
      return result(Status.APIStatus.Error, null, "Thiếu dữ liệu", 0, null);
    }
  };

  this.sendForgotPassword = async (userId, result) => {
    try {
      if (userId) {
        const dataStudent = await model.getForEmailStudent(userId);
        const dataTeacher = await model.getForEmailTeacher(userId);
        const dataFamily = await model.getForEmailFamily(userId);
        if (
          dataStudent.recordset.length == 0 &&
          dataTeacher.recordset.length == 0 &&
          dataFamily.recordset.length == 0
        ) {
          //Status, Data,	Message, Total, Headers
          return result(Status.APIStatus.Error, null, "Thiếu dữ liệu", 0, null);
        }

        var emailSend = "";
        if (dataStudent.recordset[0]) {
          emailSend = dataStudent.recordset[0].email;
        }
        if (dataTeacher.recordset[0]) {
          emailSend = dataTeacher.recordset[0].email;
        }
        if (dataFamily.recordset[0]) {
          emailSend = dataFamily.recordset[0].email;
        }

        const token = jwt.sign({ id: userId }, process.env.RESET_PASSWORD_KEY);

        // create reusable transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: "forschool2806@gmail.com",
            pass: "wykrjqmjwxoanhbo", // naturally, replace both with your real credentials or an application-specific password
          },
        });

        var passwordSend = crypto.randomBytes(8).toString("hex");

        const mainOptions = {
          from: "noreply@hello.com",
          to: emailSend,
          subject: "Quên mật khẩu",
          html: `
          <h2>Mật khẩu mới</h2>
          <h4>Hệ thống đã ghi nhận yêu cầu quên mật khẩu của bạn</h4>
          <p>Mật khẩu: ${passwordSend}</p>
          `,
        };

        transporter.sendMail(mainOptions, function (err, info) {
          if (err) {
            console.log(err);
          } else {
            console.log("Message sent: " + info.response);
          }
        });

        var passwordUpdate = await bcrypt.hash(passwordSend, 10);
        if (dataStudent.recordset.length != 0) {
          await model.updatePassswordStudent(userId, passwordUpdate);
        }
        if (dataTeacher.recordset.length != 0) {
          await model.updatePassswordTeacher(userId, passwordUpdate);
        }
        if (dataFamily.recordset.length != 0) {
          await model.updatePassswordFamily(userId, passwordUpdate);
        }
        return result(
          Status.APIStatus.Ok,
          null,
          "Gửi mail thành công",
          0,
          null
        );
      }
      return result(Status.APIStatus.Error, null, "Thiếu dữ liệu", 0, null);
    } catch (error) {
      console.log(error);
      //Status, Data,	Message, Total, Headers
      return result(Status.APIStatus.Error, null, "Thiếu dữ liệu", 0, null);
    }
  };
};
