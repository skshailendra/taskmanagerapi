import UserModel from "./../models/user.js";
import express from "express";
import auth from "./../middleware/auth.js";
import multer from "multer";
import sharp from "sharp";
import { sendMailService, removeUserMailService } from "../emails/account.js";
const router = new express.Router();

// Create User API
router.post("/users", async (req, res) => {
  const user = new UserModel(req.body);
  try {
    const result = await user.save();
    sendMailService(user.email, user.name);
    const token = await user.generateAuthToken();
    res.status(201).send({ result, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

// Read Users

// router.get("/users", auth, async (req, res) => {
//   try {
//     const usersList = await UserModel.find({});
//     res.status(200).send(usersList);
//   } catch (e) {
//     res.status(500).send(e);
//   }
// });

// Our route
router.get("/users/me", auth, async (req, res) => {
  try {
    res.status(200).send(req.user);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.status(200).send("Logged out user");
  } catch (e) {
    res.status(500).send(e.message);
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(200).send("Logged out All user");
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Read Users by id
// router.get("/users/:id", async (req, res) => {
//   const _id = req.params.id;
//   try {
//     const user = await UserModel.findById(_id);
//     console.log("user", user);
//     if (!user) {
//       return res.status(404).send("User not found!!!");
//     }
//     res.status(200).send(user);
//   } catch (e) {
//     res.status(500).send(e);
//   }
// });

router.post("/users/login", async (req, res) => {
  try {
    const user = await UserModel.findByCredentials(
      req.body.email,
      req.body.password
    );

    const token = await user.generateAuthToken();
    // res.status(200).send({
    //   user: user.getPublicProfile(),
    //   token,
    // });
    res.status(200).send({
      user,
      token,
    });
  } catch (e) {
    console.log(e.message);
    res.status(400).send(e.message);
  }
});

// Updating the resouce
router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdatd = ["name", "age", "email", "password"];
  let invalidKey = "";
  const isAllowedUpdate = updates.every((item) => {
    let result = allowedUpdatd.includes(item);
    if (!result) {
      invalidKey = item;
    }
    return result;
  });
  if (!isAllowedUpdate) {
    return res.status(400).send({
      Error: `Invalid Property : ${invalidKey}`,
    });
  }
  try {
    updates.forEach((update) => {
      req.user[update] = req.body[update];
    });
    await req.user.save();
    res.status(200).send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Delete User by ID

router.delete("/users/me", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    // const user = await UserModel.findByIdAndDelete(req.user._id);
    // if (!user) {
    //   return res.status(404).send({
    //     Error: "User does not exists",
    //   });
    // }
    removeUserMailService(req.user.email, req.user.name);
    await req.user.remove();
    res.send(req.user);
  } catch (e) {
    res.status(400).send({
      "Bad Request": "Id not found",
    });
  }
});
// const upload = multer({
//   dest: "avatars",
//   limits: {
//     fileSize: 1000000,
//   },
//   fileFilter(req, file, cb) {
//     if (!file.originalname.match(/\.(doc|docx)$/)) {
//       return cb(new Error("Please upload a word document"));
//     }
//     cb(undefined, true);
//     // cb(new Error("File must be PDF"));
//     // cb(undefined, true);
//     // cb(undefined, false);
//   },
// });

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload a image"));
    }
    cb(undefined, true);
  },
});

// const errorMiddleware = (req, res, next) => {
//   throw new Error("From my middleware!");
// };
// Only Image can be uploaded
router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const roundedCorners = Buffer.from(
      '<svg><rect x="0" y="0" width="200" height="200" rx="50" ry="50"/></svg>'
    );
    const buffer = await sharp(req.file.buffer)
      .resize({
        width: 250,
        height: 250,
      })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({
      Error: error.message,
    });
  }
);

// Delete a Avatar
router.delete("/users/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});

router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await UserModel.findById({
      _id: req.params.id,
    });
    if (!user || !user.avatar) {
      throw new Error("");
    }
    res.set("Content-Type", "image/png");
    res.status(200);
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send();
  }
});
// Only Pdf are uploaded

// // Updating the resouce
// router.patch("/users/:id", async (req, res) => {
//   const _id = req.params.id;
//   const updates = Object.keys(req.body);
//   const allowedUpdatd = ["name", "age", "email", "password"];
//   let invalidKey = "";
//   const isAllowedUpdate = updates.every((item) => {
//     let result = allowedUpdatd.includes(item);
//     if (!result) {
//       invalidKey = item;
//     }
//     return result;
//   });
//   if (!isAllowedUpdate) {
//     return res.status(400).send({
//       Error: `Invalid Property : ${invalidKey}`,
//     });
//   }
//   try {
//     // const result = await UserModel.findByIdAndUpdate(_id, req.body, {
//     //   new: true,
//     //   runValidators: true,
//     // });

//     const user = await UserModel.findById(_id);
//     updates.forEach((update) => {
//       user[update] = req.body[update];
//     });
//     await user.save();
//     if (!user) {
//       res.status(404).send();
//     }
//     res.status(200).send(user);
//   } catch (e) {
//     res.status(400).send(e);
//   }
// });

export default router;
