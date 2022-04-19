const Product = require("../models/Product");

class ProductController {
  createProduct = async (req, res) => {
    // console.log(req.body);
    const newProduct = new Product(req.body);
    try {
      const savedProduct = await newProduct.save();
      res.status(200).json({
        product: savedProduct,
        errCode: 1,
        message: `Thêm ${savedProduct.title} thành công`,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  };

  updatedProduct = async (req, res) => {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json({ errCode: 1, message: "Cập nhập thành công" });
    } catch (err) {
      res.status(500).json(err);
    }
  };

  deleteProduct = async (req, res) => {
    try {
      await Product.findByIdAndDelete(req.params.id);
      res.status(200).json({ errCode: 1, message: "Xóa thành công" });
    } catch (err) {
      res.status(500).json(err);
    }
  };

  findProduct = async (req, res) => {
    let keyword = "";
    if (req && req.query && req.query.keyword) {
      keyword = req.query.keyword;
    }
    try {
      const product = await Product.find({
        $or: [
          { color: { $regex: keyword, $options: "i" } },
          { categories: { $regex: keyword, $options: "i" } },
          { title: { $regex: keyword, $options: "i" } },
        ],
      }).lean();
      if (product && product.length >= 1) {
        product.map((item, index) => {
          let base64Img = item.img.toString("binary");
          item.base64Img = base64Img;
          delete item.img;
          return item;
        });

        res.status(200).json({
          errCode: 1,
          product,
          message: `Có ${product.length} kết quả`,
        });
      } else {
        res.status(200).json({
          errCode: 1,
          product,
          message: "Không có sản phẩm nào",
        });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  };

  getAllProduct = async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try {
      let products;

      if (qNew) {
        products = await Product.find().sort({ createdAt: -1 }).limit(1).lean();
      } else if (qCategory) {
        products = await Product.find({
          categories: {
            $in: [qCategory],
          },
        }).lean();
      } else {
        products = await Product.find().lean();
      }
      if (products && products.length > 0) {
        products.map((item, index) => {
          let base64Img = item.img.toString("binary");
          item.base64Img = base64Img;
          delete item.img;
          return item;
        });
      }
      res.status(200).json({ errCode: 1, products: products });
    } catch (err) {
      res.status(500).json(err);
    }
  };

  getTopProduct = async (req, res) => {
    try {
      let products = await Product.find().limit(20).lean();
      if (products && products.length > 0) {
        products.map((item, index) => {
          let base64Img = item.img.toString("binary");
          item.base64Img = base64Img;
          delete item.img;
          return item;
        });
      }
      res.status(200).json({ errCode: 1, products: products });
    } catch (e) {
      console.log(e);
      res.status(200).json({
        errCode: -1,
        errMessage: "Error from server",
      });
    }
  };

  getProductRecom = async (req, res, next) => {
    let listProduct = await Product.aggregate([
      {
        $lookup: {
          from: "Order",
          localField: "_id",
          foreignField: "productId",
          as: "Order",
        },
      },
      {
        $group: "_id",
      },
      {
        total: { $sum: "quantity" },
      },
      {
        $sort: { total: 1 },
      },
      {
        $limit: 8,
      },
    ]);
    if (listProduct == null) {
      return res.json({
        success: false,
        message: "loi",
      });
    } else {
      return res.json({
        success: true,
        message: "thanh cong",
        listProduct: listProduct,
      });
    }
  };

  getProductByFilter = async (req, res) => {
    try {
      let { category, filterCondition } = req.query;
      //console.log(category, filterCondition);
      let products = await Product.find({
        $and: [{ categories: category }, { price: { $gte: filterCondition } }],
      }).lean();
      if (products && products.length > 0) {
        products.map((item, index) => {
          let base64Img = item.img.toString("binary");
          item.base64Img = base64Img;
          delete item.img;
          return item;
        });
      }
      res.status(200).json({ errCode: 1, products: products });
    } catch (e) {
      console.log(e);
      res.status(200).json({
        errCode: -1,
        errMessage: "Error from server",
      });
    }
  };
}
module.exports = new ProductController();
