// const express = require('express');
// const bodyParser = require('body-parser');
// const signInRoute = require('./routes/signIn');
// const authRoute = require('./routes/auth');
// const userRoute = require('./routes/user');
// const pharmaciesRoute = require('./routes/pharmacies');
// const ordersRoute = require('./routes/orders');
// const cors = require('cors');
// const PORT = process.env.PORT || 3000;
// const app = express();

// // Enable CORS for your frontend origin
// app.use(cors({
//     origin: process.env.FRONTEND_URL || '*', // Allow all or specific frontend
//     methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
//     credentials: true, // Allow cookies if needed
// }));

// app.use(bodyParser.json());

// // Routes
// app.use('/api/signin', signInRoute);
// app.use('/api', authRoute); // This will expose /api/signup and /api/login
app.use('/api/user', userRoute); // This will expose /api/user/update-location
app.use('/api/pharmacies', pharmaciesRoute); // This will expose /api/pharmacies
app.use('/api/orders', ordersRoute); // This will expose /api/orders
app.use('/api/chat', chatRoute); // This will expose /api/chat

app.get('/', (req, res) => {
//   res.send('Backend is running!');
// });

// // Start Server
// app.listen(PORT, () => {
//   console.log(`Backend server running on http://localhost:${PORT}`);
// });




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
