import TaskModal from "./../models/task.js";
import express from "express";
import auth from "./../middleware/auth.js";
const router = new express.Router();

// Create Task API
router.post("/tasks", auth, async (req, res) => {
  const task = new TaskModal({
    ...req.body,
    owner: req.user._id,
  });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Get Task?completed=false
// Get Task?limit=10&skip=10
// Get Task?sortBy=createdAt:asc  / createdAt:desc
router.get("/tasks", auth, async (req, res) => {
  // const task = await TaskModal.find({
  //   owner: req.user._id,
  // });
  const match = {};
  const options = {};
  const sort = {};
  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }
  if (req.query.limit) {
    options.limit = parseInt(req.query.limit);
  }
  if (req.query.skip) {
    options.skip = parseInt(req.query.skip);
  }
  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
    options.sort = sort;
  }
  try {
    await req.user.populate({
      path: "tasks",
      match,
      options,
    });
    res.status(201).send(req.user.tasks);
  } catch (e) {
    res.status(500).send(e);
  }
});

// Get task by ID

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await TaskModal.findOne({
      _id,
      owner: req.user._id,
    });
    if (!task) {
      return res.status(404).send();
    }
    res.status(201).send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

// Update the task
router.patch("/tasks/:id", auth, async (req, res) => {
  const updatesKey = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidOperation = updatesKey.every((key) =>
    allowedUpdates.includes(key)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid Updates" });
  }

  try {
    const task = await TaskModal.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) {
      return res.status(404).send();
    }
    updatesKey.forEach((update) => (task[update] = req.body[update]));
    await task.save();
    res.status(200).send(task);
  } catch (e) {
    res.status(400).send();
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await TaskModal.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) {
      return res.status(404).send();
    }
    res.status(200).send(task);
  } catch (e) {
    res.status(500).send();
  }
});
export default router;
