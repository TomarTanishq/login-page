import { log } from "console"
import express from "express"
import path from "path"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

mongoose.connect("mongodb://localhost:27017", {
    dbName: "backend",
}).then(() => console.log("DB connected"))
    .catch(() => console.log("Error connecting"))

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

const User = mongoose.model("User", userSchema)


const app = express()

const users = []

app.use(express.static(path.join(path.resolve(), "public")))

//Using middlewares
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser())

// Setting up view engine
app.set("view engine", "ejs")


const isAuthenticated = async (req, res, next) => {
    const { token } = req.cookies;
    if (token) {
        const decoded = jwt.verify(token, "asduasduads")
        console.log(decoded);
        req.user = await User.findById(decoded._id)
        next()
    } else {
        res.render("login")
    }
}


app.get("/", isAuthenticated, (req, res) => {
    // console.log(req.user);
    res.render("logout", { email: req.user.email })
})

app.get("/register", (req, res) => {
    // console.log(req.user);
    res.render("register")
})

app.get("/login", (req, res) => {
    res.render("login")
})


app.post("/register", async (req, res) => {
    const { email, password } = req.body


    let user = await User.findOne({ email })

    if (user) {
        return res.redirect("/login")
    }

    const hashPassword= await bcrypt.hash(password,10)

    user = await User.create({
        email,
        password: hashPassword
    })


    const token = jwt.sign({ _id: user._id }, "asduasduads")

    res.cookie("token", token, {
        httpOnly: true,
    })
    res.redirect("/")
})

app.post("/login", async (req, res) => {
    const {email,password}=req.body

    let user = await User.findOne({ email })

    if(!user){
        res.redirect("/register")
    }

    const isMatch=await bcrypt.compare(password,user.password)
    if(!isMatch){
        return res.render("login",{message: "Incorrect password"})
    }

    const token = jwt.sign({ _id: user._id }, "asduasduads")

    res.cookie("token", token, {
        httpOnly: true,
    })
    res.redirect("/")
})


app.get("/logout", (req, res) => {
    res.cookie("token", null, {
        httpOnly: true,
        expires: new Date(Date.now()),
    })
    res.redirect("/")
})

app.listen(5000, () => {
    console.log("Working server");
})