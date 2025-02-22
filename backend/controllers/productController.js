"use strict";

const ProductModel = require("../models/ProductSchema");
const axios = require("axios");
require ("dotenv").config();

const getAllProducts = async (req, res, next) => {
  try {
    const products = await ProductModel.find({});
    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await ProductModel.find({ productId: req.params.id });
    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
};

const createProduct = async (req, res, next) => {
  try {
    ProductModel.create(req.body)
      .then((product) => {
        res.status(201).json(product);
      })
      .catch((err) => {
        res.status(400).json(err.message);
      });
  } catch (err) {
    next(err);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    await ProductModel.updateOne(product, req.body);
    const output = await ProductModel.findById(req.params.id);
    // console.log(output);
    res.status(202).json(output);
  } catch (err) {
    next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    const deletedProduct = await ProductModel.deleteOne(product);
    res.status(204).json("Product deleted");
  } catch (err) {
    next(err);
  }
};

const saveAllProducts = async (req, res, next) => {
  try {
    const response = await axios.post("https://auth.reloadly.com/oauth/token", {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: "client_credentials",
      audience: "https://giftcards-sandbox.reloadly.com",
    });
    const token = response.data.access_token;
    // console.log(token);

    const productResponse = await axios.get("https://giftcards-sandbox.reloadly.com/countries/ae/products", {
      headers: {
        Accept: "application/com.reloadly.giftcards-v1+json",
        Authorization: `Bearer ${token}`,
      },
    });

    const productData = productResponse.data;
    // console.log(productData);

    for (let i = 0; i < productData.length; i++) {
      const product = productData[i];
      await ProductModel.create(product);
    }


    const products = await ProductModel.find({});


    res.status(201).send(products);
  } catch (error) {
    console.error("Error retrieving or saving product details:", error);
    next(error);
  }
};

const dropAllProducts = async (req, res, next) => {
  try {
    if (req.params.password !== "ipay@123") {
        next("Password incorrect");
    }
    try {
      await ProductModel.deleteMany({});
      res.status(200).json({ message: "All products deleted" });
    } catch (err) {
        console.error("Error deleting all products:", error);
        next(err);
    }
  } catch (error) {
    console.error("Error deleting all products:", error);
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  saveAllProducts,
  dropAllProducts,
};
