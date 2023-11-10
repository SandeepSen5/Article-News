const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();;

const app = express();

const userRoute = require("./routes/blog")

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.use(cors({
    credentials: true,
    origin: 'http://localhost:4040',
}));

mongoose.set('debug', true);

mongoose.connect(process.env.URL).then(() => {
    console.log('Database Connected')
}).catch(err => console.log(err));

const buildPath = path.join(__dirname, '../client/build');
app.use(express.static(buildPath));


app.use('/', userRoute);

app.get("/*", function (req, res) {
    res.sendFile(
        path.join(buildPath, 'index.html'),
        function (err) {
            if (err) {
                res.status(500).send(err);
            }
        }
    );
});


app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
    return res.status(errorStatus).send(errorMessage);
})

app.listen(4040, () => {
    console.log("server is running");
})
// La4h33BfkppjHfvr






