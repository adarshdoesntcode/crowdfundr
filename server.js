const mongoose = require("mongoose");

const dotenv = require("dotenv");
const app = require("./app");

dotenv.config({ path: "./config.env" });
//dotenv loads the environment variables from a .env file to process.env
const DB = process.env.DATABASE_LOCAL;

console.log(DB);
mongoose.connect(DB).then(() => console.log("Database connected successfully")).catch((err)=>{console.log(err.message);});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`App is running in port ${port}...`);
});
