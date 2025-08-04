const Customer = require("../models/user.model");
const Order = require("../models/order.model");
const mongoose = require("mongoose");
const { parse } = require("dotenv");

exports.getAllUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;  
  const skip = (page - 1) * limit;

  try {
    const customers = await Customer.find()
      .skip(skip).limit(limit);

    const totalCustomers = await Customer.countDocuments();

    res.json({
      page,
      limit,
      totalCustomers,
      data: customers
    });
  } catch (error) {
    console.error(error); // <-- Add this for debugging
    res.status(500).json({ message: "Error fetching users", error });
  }
}

exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await Customer.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const orderCount = await Order.countDocuments({ user_id: userId });

    res.json({
      ...user.toObject(),
      orderCount
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
}

module.exports = {
  getAllUsers: exports.getAllUsers,
  getUserById: exports.getUserById
};
