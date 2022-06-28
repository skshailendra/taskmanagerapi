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

// const myFunction = async () => {
//   const password = "Paswrd12345";
//   const hasPwrd = await bcrypt.hash(password, 8);
//   const isEqual = await bcrypt.compare("Paswrd12345+", hasPwrd);
//   // console.log(password);
//   // console.log(hasPwrd);
//   // console.log(isEqual);
// };
// myFunction();

// const myFunc = async () => {
//   const token = jwt.sign(
//     {
//       _id: "abc123",
//     },
//     "thisismynewkey",
//     {
//       expiresIn: "0 seconds",
//     }
//   );
//   console.log("token ", token);

//   const verify = jwt.verify(token, "thisismynewkey");
//   console.log(verify);
// };
// myFunc();

// const pet = {
//   name: "Shailendra",
// };

// pet.toJSON = function () {
//   return {};
// };
// console.log(JSON.stringify(pet));

// import TaskModal from "./models/task.js";
// import UserModel from "./models/user.js";

// const main = async () => {
//   // const task = await TaskModal.findById("62b3e546206dfac3aeb5f3ce");
//   // await task.populate("owner");
//   // console.log(task.owner);

//   const user = await UserModel.findById("62b3e540206dfac3aeb5f3c9");
//   await user.populate("tasks");
//   console.log(user.tasks);
// };
// main();

// import multer from "multer";

// const upload = multer({
//   dest: "images",
// });
// app.post("/upload", upload.single("upload"), (req, res) => {
//   res.send();
// });

// Middeware
// app.use((req, res, next) => {
//   console.log("middleware");
//   console.log(req.method, req.path);
//   if (req.method === "GET") {
//     res.send("Get request are disabled");
//   } else {
//     next();
//   }
// });

// app.use((req, res, next) => {
//   res.status(503).send("Site is currently down. Check back soon!!!");
// });
