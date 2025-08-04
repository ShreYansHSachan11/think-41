const express = require("express");
const dotenv = require('dotenv');
const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');

const Customer = require('./models/user.model');
const Order = require('./models/order.model');
const userRoutes = require('./routes/user.routes');

dotenv.config(); // <-- Only call this once

const app = express();
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/orders', require('./routes/order.routes'));


mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,            
    useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected successfully');
}).catch((error) => {
  console.error('MongoDB connection failed:', error.message);
  process.exit(1);
});

function loadCustomers() {
    return new Promise((resolve, reject) => {
        const customers = [];
        fs.createReadStream('data/users.csv')
            .pipe(csv())
            .on('data', (row) => {
                const age = parseInt(row.age);
                if (!isNaN(age)) {
                    const customer = {
                        id: row.id,
                        firstName: row.firstName,
                        lastName: row.lastName,
                        email: row.email,
                        age: age
                    };
                    customers.push(customer);
                }
            })
            .on('end', async () => {
                try {
                    await Customer.insertMany(customers);
                    console.log('Customers loaded successfully');
                    resolve();
                } catch (error) {
                    console.error('Error loading customers:', error);
                    reject(error);
                }
            });
    });
}

function loadOrders() {
    return new Promise((resolve, reject) => {
        const orders = [];
        fs.createReadStream('data/orders.csv')
            .pipe(csv())
            .on('data', async (row) => {
                // Find the customer whose 'id' matches row.user_id
                const customer = await Customer.findOne({ id: row.user_id });
                if (customer) {
                    const order = {
                        order_id: row.order_id,
                        user_id: customer._id.toString(), // Use the actual _id
                        status: row.status,
                        gender: row.gender,
                        created_at: row.created_at ? new Date(row.created_at) : undefined,
                        returned_at: row.returned_at ? new Date(row.returned_at) : undefined,
                        shipped_at: row.shipped_at ? new Date(row.shipped_at) : undefined,
                        delivered_at: row.delivered_at ? new Date(row.delivered_at) : undefined,
                        numberOfItems: parseInt(row.num_of_item)
                    };
                    orders.push(order);
                }
            })
            .on('end', async () => {
                try {
                    await Order.deleteMany({});
                    await Order.insertMany(orders);
                    console.log('Orders loaded successfully');
                    resolve();
                } catch (error) {
                    console.error('Error loading orders:', error);
                    reject(error);
                }
            });
    });
}

const seedDatabase = async () => {
    await loadCustomers();
    await loadOrders();
    
};


async function verifyCounts() {
    const customerCount = await Customer.countDocuments();
    const orderCount = await Order.countDocuments();

    // console.log(`Total Customers: ${customerCount}`);
    // console.log(`Total Orders: ${orderCount}`);

    
}

// Call the seed function
seedDatabase();


app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
}   );
