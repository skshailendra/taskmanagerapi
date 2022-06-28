import express from "express";
import "./db/mongooseValidation.js";
import UserRouter from "./routes/users.js";
import TaskRouter from "./routes/tasks.js";
const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(UserRouter);
app.use(TaskRouter);
app.listen(port, () => {
  console.log("Server started! on port : ", port);
});
