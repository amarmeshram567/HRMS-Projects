// require("dotenv").config();
// const express = require("express");
// const cors = require('cors');
// const authRouter = require("./routes/auth");
// const empRouter = require("./routes/employees");
// const teamRouter = require("./routes/teams");
// const logRouter = require("./routes/logs");
// const sequelize = require("./db");
// const { errorHandler } = require("./middlewares/errorHandler");


// // console.log("Password", process.env.DB_PASSWORD);


// const PORT = process.env.PORT || 5000;
// const app = express();

// app.use(cors());
// app.use(express.json());

// app.get("/", (req, res) => {
//     res.send("Server is running");
// })

// app.use("/api/auth", authRouter);
// app.use("/api/employees", empRouter);
// app.use("/api/teams", teamRouter);
// app.use("/api/logs", logRouter);


// app.use(errorHandler);



// const start = async () => {
//     try {
//         await sequelize.authenticate();
//         console.log("Database Connected");

//         await sequelize.sync();

//         app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

//     } catch (error) {
//         console.log(error);
//         process.exit(1);
//     }
// }

// start()


require("dotenv").config();
const express = require("express");
const cors = require('cors');
const authRouter = require("./routes/auth");
const empRouter = require("./routes/employees");
const teamRouter = require("./routes/teams");
const logRouter = require("./routes/logs");
const sequelize = require("./db");
const { errorHandler } = require("./middlewares/errorHandler");

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());

// Routes setup
app.get("/", (req, res) => {
    res.send("Server is running");
});

app.use("/api/auth", authRouter);
app.use("/api/employees", empRouter);
app.use("/api/teams", teamRouter);
app.use("/api/logs", logRouter);

app.use(errorHandler);


(async () => {
    try {
        await sequelize.authenticate();
        console.log("Database Connected");
        await sequelize.sync();
    } catch (error) {
        console.error("Database connection error:", error);
    }
})();


module.exports = app;
