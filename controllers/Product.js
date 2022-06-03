const Product = require("../models/Product");

class ProductController {
  createProduct = async (req, res) => {
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
    let currentPage = 0;
    if (req.query.page) {
      currentPage = req.query.page;
    }
    let sumOfPage = 0;
    try {
      let sumOfUser = await Product.countDocuments();
      let products;
      if (sumOfUser % process.env.LIMIT_PAGING === 0) {
        sumOfPage = sumOfUser / process.env.LIMIT_PAGING;
      } else {
        sumOfPage =
          (sumOfUser - (sumOfUser % process.env.LIMIT_PAGING)) /
            process.env.LIMIT_PAGING +
          1;
      }
      if (qNew) {
        products = await Product.find()
          .sort({ createdAt: -1 })
          .limit(process.env.LIMIT_PAGING)
          .skip(currentPage * process.env.LIMIT_PAGING);
      } else if (qCategory) {
        products = await Product.find({
          categories: {
            $in: [qCategory],
          },
        }).lean();
      } else {
        products = await Product.find()
          .limit(process.env.LIMIT_PAGING)
          .skip(currentPage * process.env.LIMIT_PAGING);
      }

      res
        .status(200)
        .json({ errCode: 1, products: products, sumOfPage: sumOfPage });
    } catch (err) {
      res.status(500).json(err);
    }
  };

  getTopProduct = async (req, res) => {
    try {
      let products = await Product.find().limit(20).lean();
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
          foreignField: "products.productId",
        },
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
  getProductById = async (req, res) => {
    try {
      let productId = req.query.productId;
      let product = await Product.findOne({
        _id: productId,
      }).lean();
      if (product) {
        return res.status(200).json({
          product,
        });
      } else {
        return res.status(200).json({
          errCode: 1,
          message: "Product not found",
        });
      }
    } catch (e) {
      console.log(e);
      return res.status(200).json({
        errcode: -1,
        message: "Error from server!",
      });
    }
  };

  getProductByFilter = async (req, res) => {
    try {
      let { category, filterPrice, filterRam, filterRom } = req.query;
      console.log(category);
      //console.log(category, filterPrice, filterRam, filterRom);
      let products = [];
      if (!filterPrice && !filterRam && !filterRom) {
        products = await Product.find({
          categories: category,
        });
      }

      if (filterPrice && !filterRam && !filterRom) {
        products = await Product.find({
          $and: [{ categories: category }, { price: { $gte: filterPrice } }],
        });
      }

      if (!filterPrice && filterRam && !filterRom) {
        products = await Product.find({
          $and: [{ categories: category }, { ram: filterRam }],
        });
      }

      if (!filterPrice && !filterRam && filterRom) {
        products = await Product.find({
          $and: [{ categories: category }, { rom: filterRom }],
        });
      }

      if (filterPrice && filterRam && !filterRom) {
        products = await Product.find({
          $and: [
            { categories: category },
            { price: { $gte: filterPrice } },
            { ram: filterRam },
          ],
        });
      }

      if (filterPrice && !filterRam && filterRom) {
        products = await Product.find({
          $and: [
            { categories: category },
            { price: { $gte: filterPrice } },
            { rom: filterRom },
          ],
        });
      }

      if (!filterPrice && filterRam && filterRom) {
        products = await Product.find({
          $and: [
            { categories: category },
            { ram: filterRam },
            { rom: filterRom },
          ],
        });
      }

      if (filterPrice && filterRam && filterRom) {
        products = await Product.find({
          $and: [
            { categories: category },
            { price: { $gte: filterPrice } },
            { ram: filterRam },
            { rom: filterRom },
          ],
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
