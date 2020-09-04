const { Router } = require("express");
const User = require("../models/User");

const router = Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Произошла ошибка при получении данных." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Произошла ошибка при получении данных." });
  }
});

module.exports = router;
