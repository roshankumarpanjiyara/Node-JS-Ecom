const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// const ObjectId = mongodb.ObjectId;

// const db = require('../database/database');

// ---------------- User Schema ----------------
const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        phone: { type: String, required: true, unique: true, trim: true },
        password: { type: String, required: true },
        role: { type: String, default: "user" },
    },
    { timestamps: true }
);

// ---------------- Mongoose Model ----------------
const UserModel = mongoose.model("User", userSchema);

class User {
    constructor(name, email, phone, password, id) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.password = password;
        if (id) {
            this.id = id;
        }
    }

    async findByEmail() {
        if (!this.email) {
            return;
        }
        return await UserModel.findOne({ email: this.email });
    }

    async findById() {
        if (!this.id) {
            return;
        }
        return await UserModel.findOne({ id: this.id });
    }

    async findByPhone() {
        if (!this.phone) {
            return;
        }
        return await UserModel.findOne({ phone: this.phone });
    }

    async signUp() {
        const hashedPassword = await bcrypt.hash(this.password, 12);

        const user = new UserModel({
            name: this.name,
            email: this.email,
            phone: this.phone,
            password: hashedPassword,
            role: "user",
        });

        const savedUser = await user.save();
        return savedUser.toObject(); // return plain object instead of mongoose doc
    }
}

module.exports = User;