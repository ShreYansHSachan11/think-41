const mongoose = require('mongoose');
const Customer = require('./models/user.model');
const Order = require('./models/order.model');

// Connect to MongoDB first!
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('MongoDB connected');
  await updateOrderUserIds();
  mongoose.disconnect();
}).catch((error) => {
  console.error('MongoDB connection failed:', error.message);
});

async function updateOrderUserIds() {
    const orders = await Order.find();
    for (const order of orders) {
        // Find the customer whose 'id' matches order.user_id
        const customer = await Customer.findOne({ id: order.user_id });
        if (customer) {
            order.user_id = customer._id.toString(); // Set to MongoDB _id
            await order.save();
        }
    }
    console.log('Order user_id fields updated!');
}