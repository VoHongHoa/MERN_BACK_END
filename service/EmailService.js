require("dotenv").config();
const nodemailer = require("nodemailer");
let sentSimpleEmail = async (dataSent) => {
  console.log(dataSent);
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_APP, // generated ethereal user
      pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Cập nhập Password 👻" <vohonghoa8e@gmail.com>', // sender address
    to: dataSent.email, // list of receivers
    subject: "Cập nhập mật khẩu......", // Subject line
    text: "Hello from UITPHONE", // plain text body
    html: `
    <h3>Xin chào ${dataSent.email}!</h3>
    <p>Bạn nhận được email này vì đã quên mật khẩu </p>
    <div><b>Password mới của bạn là: ${dataSent.newPassword}</b></div>
    <p>Vui lòng click vào đường link bên dưới để tiến hành đăng nhập lại và xác nhận hoàn tất thủ tục cập nhập mật khẩu</p>
    <div>
    <a href = ${dataSent.redirectLink} target="_blank">click here</a>
    </div>
    <div>Xin chân thành cảm ơn</div>
    `, // html body
  });
};
// async..await is not allowed in global scope, must use a wrapper
async function main() {}

module.exports = {
  sentSimpleEmail: sentSimpleEmail,
};
