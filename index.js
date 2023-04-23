const express = require("express");
const mongoose = require("mongoose")
const dotenv = require("dotenv");
const authRouter = require("./routes/auth.js")
const userRouter = require("./routes/users.js");
const movieRouter = require("./routes/movies.js");
const listRouter = require("./routes/lists.js")
const cors = require("cors");

dotenv.config();
const app = express();

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());
app.use(cors());

app.use("/api/auth",authRouter);
app.use("/api/users",userRouter);
app.use("/api/movies",movieRouter);
app.use("/api/lists",listRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running in port ${PORT}`);
});
