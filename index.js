const express = require("express");
const connectDB = require("./connectDb/connect");
const AuthRouter = require("./route/authRoute");
const taskRouter = require("./route/taskRoute");
// const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", AuthRouter);
app.use("/api/tasks", taskRouter);
app.listen(port, async () => {
  await connectDB();
  console.log(`Server is running on port ${port}`);
});
