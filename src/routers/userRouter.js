const express = require("express");
const User = require("../models/userModel");
const { auth } = require("../middleware/auth");
const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { name, email, avatar } = req.body;
    //   check for existing user
    const existingUser = await User.findByCredentials(email);
    if (!existingUser) {
      // create a new user
      const user = new User({ name, email, avatar });
      const token = user.generateAuthToken();
      await user.save();
      //   console.log("new", user);
      res.status(200).send({ ...user._doc, token });
    } else {
      const token = existingUser.generateAuthToken();
      //   console.log("existing", existingUser);
      res.status(200).send({ ...existingUser._doc, token });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: "Something went wrong, try again!" });
  }
});

router.post("/todo/create", auth, async (req, res) => {
  try {
    const user = req.user;
    user._doc.todos = [...req.user._doc.todos, req.body];
    await user.save();
    res.send(req.body);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ error: "Could not create todo!" });
  }
});

router.post("/todo/fetch", auth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user._doc.todos);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ error: "Could not fetch todos!" });
  }
});

router.post("/todo/delete/:id", auth, async (req, res) => {
  try {
    const user = req.user;
    user.todos = user.todos.filter((todo) => todo.id !== req.params.id);
    await user.save();
    res.send(req.params.id);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ error: "Could not fetch todos!" });
  }
});

router.post("/todo/update/:id", auth, async (req, res) => {
  try {
    const user = req.user;
    const todoIndex = user.todos.findIndex((todo) => todo.id === req.params.id);
    user.todos[todoIndex] = { ...user.todos[todoIndex], ...req.body };
    await user.save();
    res.send(req.body);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ error: "Could not fetch todos!" });
  }
});

module.exports = router;
