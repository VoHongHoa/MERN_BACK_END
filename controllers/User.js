const User = require("../models/User");
const EmailService = require("../service/EmailService");
const argon2 = require("argon2");
const mongoose = require("mongoose");
require("dotenv").config();
//ADMIN
// Tìm tất cả user
// router.get("/all", verifyToken, verifyAdmin, async (req, res) => {
//   try {
//     const users = await User.find();
//     return res.status(200).json({
//       success: true,
//       users,
//       message: "Find all user successfully",
//       errorCode: 1,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error,
//       errorCode: 0,
//     });
//   }
// });
class UserController {
  getAllUsers = async (req, res) => {
    let currentPage = 0;
    if (req.query.page) {
      currentPage = req.query.page;
    }
    let sumOfPage = 0;
    try {
      let sumOfUser = await User.countDocuments();
      if (sumOfUser % process.env.LIMIT_PAGING === 0) {
        sumOfPage = sumOfUser / process.env.LIMIT_PAGING;
      } else {
        sumOfPage =
          (sumOfUser - (sumOfUser % process.env.LIMIT_PAGING)) /
            process.env.LIMIT_PAGING +
          1;
      }
      const users = await User.find({}, { password: 0, username: 0 })
        .limit(process.env.LIMIT_PAGING)
        .skip(currentPage * process.env.LIMIT_PAGING);
      return res.status(200).json({
        success: true,
        users,
        message: "Find all user successfully",
        errorCode: 1,
        sumOfPage: sumOfPage,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error,
        errorCode: 0,
      });
    }
  };

  // Tìm 1 USER
  findUser = (req, res) => {
    let { keyword } = req.query;
    User.find({
      $or: [
        { fullname: { $regex: keyword, $options: "i" } },
        { username: { $regex: keyword, $options: "i" } },
        { role: { $regex: keyword, $options: "i" } },
        { address: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } },
      ],
    })
      .exec()
      .then((result) => {
        //console.log(result);
        if (result.length >= 1) {
          res.status(200).json({
            errorCode: 1,
            result,
            message: `Có ${result.length} kết quả`,
          });
        } else {
          res.status(200).json({
            errorCode: 1,
            result,
            message: "Nobody has this name",
          });
        }
      })
      .catch((error) => {
        res.status(500).json({
          errorCode: 0,
          error: error,
          message: "Error",
        });
      });
  };

  // Admin cập nhật người dùng
  updateUser = async (req, res) => {
    const { fullname, address, email, phonenumber, role } = req.body;
    const id = req.params.id;
    //console.log(id);
    try {
      const user = await User.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            fullname: fullname,
            address: address,
            email: email,
            phonenumber: phonenumber,
            role: role,
          },
        },
        { new: true }
      ).lean();
      // if (user && user.img) {
      //   let base64Img = user.img.toString("binary");
      //   user.base64Img = base64Img;
      //   delete user.img;
      // }
      return res.status(200).json({
        success: true,
        user,
        message: "Successfully",
        errorCode: 1,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error,
        message: "Error",
      });
    }
  };

  // Admin xem số tài khoản đc tạo
  statusAccounts = async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

    try {
      const data = await User.aggregate([
        { $match: { createdAt: { $gte: lastYear } } },
        {
          $project: {
            month: { $month: "$createdAt" },
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: 1 },
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
      ]);
      res.status(200).json({
        data,
        message: "Successfully",
        errorCode: 1,
      });
    } catch (err) {
      res.status(500).json({
        error: err,
        message: "Error",
        errorCode: 0,
      });
    }
  };

  //Sửa quyền người dùng
  // router.put("/:id", verifyToken, verifyAdmin, async (req, res) => {
  //     const { role } = req.body;
  //     const { id } = req.params;
  //     try {
  //       const userUpdate = await User.findOneAndUpdate(
  //         { _id: mongoose.Types.ObjectId(id) },
  //         {
  //           $set: {
  //             role: role,
  //           },
  //         },
  //         {
  //           new: true,
  //         }
  //       );
  //       return res.json({ success: true, userUpdate });
  //     } catch (error) {
  //       return res.json({ success: false, message: error.message });
  //     }
  //   });

  // USER
  //Sửa thông tin người dùng
  updateInfoUser = async (req, res) => {
    const { fullname, address, email, phonenumber } = req.body;
    const id = req.userId;
    try {
      const user = await User.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            fullname: fullname,
            address: address,
            email: email,
            phonenumber: phonenumber,
          },
        },
        { new: true }
      );
      return res.status(200).json({
        success: true,
        user,
        message: "Thay đổi thông tin thành công",
        errorCode: 1,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
        errorCode: 0,
        message: "Error",
      });
    }
  };

  //module.exports = router;

  //Xóa user
  deleteUser = async (req, res) => {
    const id = req.params.id;
    //console.log(id);
    try {
      const user = await User.findByIdAndDelete(mongoose.Types.ObjectId(id));
      return res.status(200).json({
        success: true,
        user,
        message: "Successfully",
        errorCode: 1,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
        errorCode: 0,
      });
    }
  };

  //COMMON SERVICE
  //Lấy thông tin cá nhân
  getInfoUser = async (req, res) => {
    try {
      const user = await User.findById(req.userId);
      if (!user) {
        return res
          .status(200)
          .json({ success: false, message: "User not found" });
      }
      return res.json({ success: true, user });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  makeid = (length) => {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };
  resetPassword = async (req, res) => {
    let newPassword = this.makeid(6);
    //let hashedPassword = await argon2.hash(newPassword);
    let { email } = req.body;
    try {
      let user = await User.findOne(
        { email: email }
        // {
        //   $set: {
        //     password: hashedPassword,
        //   },
        // },
        // { new: true }
      );
      // console.log(user);
      if (user) {
        EmailService.sentSimpleEmail({
          email: email,
          redirectLink: `http://localhost:3000/do-reset-password/${email}/${newPassword}`,
          newPassword: newPassword,
        });

        return res.status(200).json({
          errCode: 1,
          message: "Vui lòng kiểm tra Email của bạn",
        });
      } else {
        return res.status(200).json({
          errCode: 2,
          message: "Email không chính xác",
        });
      }
    } catch (e) {
      console.log(e);
      return res.status(200).json({
        errCode: -1,
        message: "Lỗi hệ thống",
      });
    }
  };
  doChangePassword = async (req, res) => {
    let { email, newPassword } = req.body;
    let hashedPassword = await argon2.hash(newPassword);
    try {
      let user = await User.findOneAndUpdate(
        { email: email },
        {
          $set: {
            password: hashedPassword,
          },
        },
        { new: true }
      );
      if (user) {
        res.status(200).json({
          message: "OK",
        });
      }
    } catch (e) {
      console.log(e);
      return res.status(200).json({
        errCode: -1,
        message: "Lỗi hệ thống",
      });
    }
  };

  changePassword = async (req, res) => {
    try {
      if (req && req.body && req.body) {
        let { id, newPassword, oldPassword } = req.body;

        const user = await User.find({
          _id: id,
        });
        console.log(user);
        if (await argon2.verify(user[0].password, oldPassword)) {
          user[0].password = await argon2.hash(newPassword);
          user[0].save();
          return res.status(200).json({
            errCode: 0,
            message: "Thay đổi mật khẩu thành công",
          });
        } else {
          return res.status(200).json({
            errCode: 1,
            errMessage: "Mật khẩu không chính xác",
          });
        }
      }
    } catch (e) {
      console.log(e);
      return res.status(200).json({
        errCode: -1,
        errMessage: "Error from server",
      });
    }
  };
  findUserByEmail = async (req, res) => {
    let email = req.query.email;
    try {
      let user = await User.findOne({
        email: email,
      });
      if (user) {
        return res.status(200).json({
          user,
        });
      } else {
        return res.status(200).json({
          errCode: 1,
          message: "Không có user",
        });
      }
    } catch (e) {
      console.log(e);
      return res.status(200).json({
        errCode: -1,
        errMessage: "Error from server",
      });
    }
  };
}

module.exports = new UserController();
