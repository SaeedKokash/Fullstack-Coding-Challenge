"use strict";

const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
  brandId: Number,
  brandName: String,
});

const countrySchema = new mongoose.Schema({
  isoName: String,
  name: String,
  flagUrl: String,
});

const redeemInstructionSchema = new mongoose.Schema({
  concise: String,
  verbose: String,
});

const ProductSchema = new mongoose.Schema({
  productId: Number,
  productName: String,
  global: Boolean,
  senderFee: Number,
  senderFeePercentage: Number,
  discountPercentage: Number,
  denominationType: String,
  recipientCurrencyCode: String,
  minRecipientDenomination: Number,
  maxRecipientDenomination: Number,
  senderCurrencyCode: String,
  minSenderDenomination: Number,
  maxSenderDenomination: Number,
  fixedRecipientDenominations: [Number],
  fixedSenderDenominations: [Number],
  fixedRecipientToSenderDenominationsMap: mongoose.Schema.Types.Mixed,
  logoUrls: [String],
  brand: brandSchema,
  country: countrySchema,
  redeemInstruction: redeemInstructionSchema,
});

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
