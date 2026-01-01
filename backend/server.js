const express = require('express');
const cors = require('cors');

const signInRoute = require('./routes/signIn');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const pharmaciesRoute = require('./routes/pharmacies');
const ordersRoute = require('./routes/orders');
const chatRoute = require('./routes/chat');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors({
  origin: [process.env.FRONTEND_URL, 'https://new-phamarcy.vercel.app', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// Body parser (built-in)
app.use(express.json());

// Routes
app.use('/api/signin', signInRoute);
app.use('/api', authRoute);
app.use('/api/user', userRoute);
app.use('/api/pharmacies', pharmaciesRoute);
app.use('/api/orders', ordersRoute);
app.use('/api/chat', chatRoute);

// Health check
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
