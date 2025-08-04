const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    order_id: { type: Number, required: true, unique: true },
    user_id: { type: String, required: true },
    status: { type: String },
    gender: { type: String },
    createdAt: { type: Date, default: Date.now },
    returnedAt: { type: Date },
    shippedAt: { type: Date },
    deliveredAt: { type: Date },
    numberOfItems: { type: Number }
});

module.exports = mongoose.model('Order', orderSchema);

