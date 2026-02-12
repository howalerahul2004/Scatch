const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');
const path = require('path');
const ownersRouter = require('./routes/ownersRouter');
const userRouter = require('./routes/userRouter');
const productsRouter = require('./routes/productsRouter');
const indexRouter = require('./routes/index');
const flash = require('connect-flash');
const expressSession = require('express-session');


require('dotenv').config();

const db = require('./config/mongoose-connection');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.use(expressSession({
    resave: false,
    saveUninitialized: true,
    secret: process.env.EXPRESS_SESSION_SECRET
}));
app.use(flash());


app.use("/", indexRouter);
app.use("/owners", ownersRouter);
app.use("/users", userRouter);
app.use("/products", productsRouter);


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});




