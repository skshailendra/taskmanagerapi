import { mongoose } from "mongoose";
const connectionUrl = process.env.DB_CONNECTION_URL;
const database = process.env.DB_NAME;

// Connect to MongoDb Database
mongoose.connect(`${connectionUrl}/${database}`, {
  useNewUrlParser: true,
});
//export default mongoose;
// // Creation of Instance
// const newTask = new ValidationTaskModal({
//   description: "New Learn",
// });

// // Save it to the Mongodb
// newTask
//   .save()
//   .then((result) => console.log("Saved...", result))
//   .catch((err) => console.log("Failed to Save", err));
