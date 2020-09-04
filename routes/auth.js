const { Router } = require("express");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const passport = require("passport");

const router = Router();

router.post(
  "/register",
  [
    check("email", "Неверный email!").isEmail(),
    check("password", "Минимальная длина пароля - 6 символов").isLength({
      min: 6
    })
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
      }
      const { email, name, password } = req.body;
      const candidate = await User.findOne({ email });
      if (candidate)
        return res
          .status(400)
          .json({ error: "Такой пользователь уже существует!" });
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({ email, name, password: hashedPassword });
      await newUser.save();
      res.status(201).json({ message: "Пользователь создан!" });
    } catch (e) {
      res
        .status(500)
        .json({ error: `Произошла ошибка при работе с базой данных: ${e}` });
    }
  }
);

router.post("/login", passport.authenticate("local"), (req, res) => {
  res.status(201).json({ message: "Logged in!" });
});

module.exports = router;
