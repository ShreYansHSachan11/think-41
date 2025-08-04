const Order = require('../models/order.model');
const Customer = require('../models/user.model'); // <-- Use uppercase

const getOrdersForCustomer = async (req, res) => {
    try {
        const customerId = req.params.id;
        const customerDoc = await Customer.findById(customerId);
        if (!customerDoc) {
            return res.status(404).json({ message: "Customer not found" });
        }

        // If user_id in orders is stored as a string, use customerId as string
        const orders = await Order.find({ user_id: customerId });

        res.status(200).json({
            customerId,
            orderCount: orders.length,
            orders
        });
    } catch (error) {
        console.error(error); // <-- See the real error in your terminal
        res.status(500).json({ message: "Error fetching orders", error });
    }
}


const getOrderById = async (req, res) => {
    try {
        const orderId = req.params.id;
        console.log("Searching for order with _id:", orderId); // <-- Place here
        const orderDetails = await Order.findById(orderId);

        if (!orderDetails) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json(orderDetails);
    } catch (error) {
        res.status(500).json({ message: "Error fetching order", error });
    }
}

module.exports = {
    getOrdersForCustomer,   
    getOrderById
};
