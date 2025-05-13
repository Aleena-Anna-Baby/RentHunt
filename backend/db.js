const mongoose = require("mongoose");

const connectDB = () => {
    mongoose.connect("mongodb://127.0.0.1:27017/Renthunt")
        .then(() => console.log("MongoDB Connected Successfully "))
        .catch((err) => {
            console.error("MongoDB Connection Failed ", err);
            process.exit(1);
        });
};

module.exports = connectDB;
