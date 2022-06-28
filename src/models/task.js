// Creating a Modal
import { mongoose } from "mongoose";
const taskSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
      validate(value) {
        if (typeof value !== "boolean") {
          throw new Error("Completed must be a boolean number");
        }
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);
const TaskModal = mongoose.model("Task", taskSchema);

export default TaskModal;
