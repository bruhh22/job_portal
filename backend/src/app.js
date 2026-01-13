const express = require('express');
const cors = require('cors');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const favouriteRoutes = require('./routes/favouriteRoutes');

const app = express();

const allowedOrigins = [
    'http://localhost:5173', // Vite
    'http://localhost:3000', // CRA
    process.env.FRONTEND_URL,
];

// Middleware
// app.use(
//     cors({
//         origin: allowedOrigins,
//         credentials: true,
//     })
// );

// Middleware
app.use(
    cors({
        origin: function (origin, callback) {
            // Allow non-browser clients (Postman, curl)
            if (!origin) return callback(null, true);

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            } else {
                return callback(new Error('CORS not allowed'));
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

// IMPORTANT: handle preflight requests
//app.options('*', cors());


app.use(express.json()); // Parse JSON bodies

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/favourites', favouriteRoutes);

// Root Route
app.get('/', (req, res) => {
    res.send('Job Portal API is running');
});

// Global Error Handler (Optional but good practice)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

module.exports = app;