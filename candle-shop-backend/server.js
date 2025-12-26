const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://main.d3ot71att658vo.amplifyapp.com', // Replace with YOUR Amplify URL
  ],
  credentials: true
}));
app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/discounts', require('./routes/discounts'));

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});