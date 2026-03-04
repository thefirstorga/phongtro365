const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();

const cors = require('cors');
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL || 'http://localhost:5173'
}));

app.use(express.json());

// routes
const usersRouter = require("./routes/Users");
app.use("/auth", usersRouter);
const postsRouter = require("./routes/Posts");
app.use("/post", postsRouter);
const bookingsRouter = require("./routes/Bookings");
app.use("/booking", bookingsRouter);
const adminRouter = require("./routes/Admin");
app.use("/admin-api", adminRouter);

// Serve client static build
const clientBuildPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientBuildPath));

// SPA catch-all: mọi route không match API sẽ trả về index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});