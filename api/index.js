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

app.listen(4000, () => {
    console.log("Server running on port 4000");
})