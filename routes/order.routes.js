const express = require("express");
const router = express.Router();
const orderController = require('../controllers/order.controller');

router.get('/customers/:id/orders', orderController.getOrdersForCustomer);
router.get('/:id', orderController.getOrderById);
router.get('/', async (req, res) => {
    try {
        const orders = await require('../models/order.model').find();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error });
    }
});

module.exports = router;

