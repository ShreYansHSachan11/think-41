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

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,            
    useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected successfully');
}).catch((error) => {
  console.error('MongoDB connection failed:', error.message);
  process.exit(1);
});

function loadCustomers(){
    const customers = [];
    fs.createReadStream('data/users.csv')
        .pipe(csv())
        .on('data', (row) => {
            const age = parseInt(row.age);
            if (!isNaN(age)) { // Only add customers with valid age
                const customer = {
                    id: row.id,
                    firstName: row.firstName,
                    lastName: row.lastName,
                    email: row.email,
                    age: age
                };
                customers.push(customer);
            }
        }).on('end', async () => {
            await Customer.insertMany(customers)
                .then(() => console.log('Customers loaded successfully'))
                .catch((error) => console.error('Error loading customers:', error));
        });
}

 function loadOrders() {
    const orders = [];
    fs.createReadStream('data/orders.csv')
        .pipe(csv())
        .on('data', (row) => {
            const order = {
                order_id: row.order_id,
                user_id: row.user_id,
                status: row.status,
                gender: row.gender,
                created_at: row.created_at ? new Date(row.created_at) : undefined,
                returned_at: row.returned_at ? new Date(row.returned_at) : undefined,
                shipped_at: row.shipped_at ? new Date(row.shipped_at) : undefined,
                delivered_at: row.delivered_at ? new Date(row.delivered_at) : undefined,
                num_of_item: parseInt(row.num_of_item)
            };
            orders.push(order); // <-- FIXED
        }).on('end', async () => {
            await Order.insertMany(orders)
                .then(() => console.log('Orders loaded successfully'))
                .catch((error) => console.error('Error loading orders:', error));
                await verifyCounts();
                mongoose.disconnect();
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
