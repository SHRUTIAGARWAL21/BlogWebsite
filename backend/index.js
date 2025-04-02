const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

dotenv.config({ path: "config.env" });
const DB = process.env.DATABASE;

mongoose
  .connect(DB)
  .then(() => console.log("DB connection successfull"))
  .catch((err) => console.log("DB connection error :", err));

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log("listening");
});
