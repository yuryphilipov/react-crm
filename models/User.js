const { Schema, model } = require("mongoose");

const schema = Schema({
  email: {
    type: String,
    required: [true, "Поле Email должно быть заполнено!"],
    unique: true
  },
  password: {
    type: String,
    required: [true, "Поле Password должно быть заполнено!"],
    minLength: [6, "Мнимальная длина пароля - 6 символов!"]
  },
  name: {
    type: String,
    required: [true, "Поле Name должно быть заполнено!"]
  }
});

module.exports = model("User", schema);
