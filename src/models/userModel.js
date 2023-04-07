const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    avatar: { type: String, required: true },
    todos: [
      {
        id: { type: String },
        title: { type: String, required: true },
        date: { type: Number, required: true },
        priority: { type: String, required: true },
      },
    ],
  },
  {
    methods: {
      generateAuthToken() {
        const user = this;
        const token = jwt.sign(
          { _id: user._id.toString() },
          process.env.JWT_SECRET_KEY
        );
        return token;
      },
    },
    statics: {
      async findByCredentials(email) {
        const user = await User.findOne({ email });

        if (user) {
          return user;
        }
      },
    },
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
