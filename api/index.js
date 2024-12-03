const express = require('express');
const app = express()

const cors = require('cors')
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
}))

app.use(express.json())

// routes
const usersRouter = require("./routes/Users");
app.use("/auth", usersRouter);
const postsRouter = require("./routes/Posts");
app.use("/post", postsRouter);
const bookingsRouter = require("./routes/Bookings");
app.use("/booking", bookingsRouter);
const adminRouter = require("./routes/Admin");
app.use("/admin-api", adminRouter);

app.listen(4000, () => {
    console.log("Server running on port 4000");
})