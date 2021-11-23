const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
const userRoute = require("./routers/users.js");
const authRoute = require("./routers/auth.js");
const postRoute = require("./routers/posts.js");
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const router = express.Router();
const path = require('path');
require('dotenv').config();

dotenv.config();

mongoose.connect(
    process.env.MONGO_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
        console.log('Connected to MongoDB');
    },
);

//middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(
    fileUpload({
        useTempFiles: true,
    }),
);
app.use(helmet());
app.use(morgan('common'));
app.use(cors({ origin: true, credentials: true }));

//mail sender detail

app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/posts', postRoute);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Backend server is running with Port ${PORT}`);
});