// models/Admin.js (super admin + vendor + departments)
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true },
        phone: { type: String, required: true, unique: true, trim: true },
        // roles as an array of strings
        // ✅ Array of role references
        roles: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Role",
                required: true,
            },
        ],
    },
    { timestamps: true }
);

// ---------------- Mongoose Model ----------------
const AdminModel = mongoose.model("Admin", adminSchema);

class Admin {
    constructor(name, email, phone, password, roles, id) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.roles = [];
        if (id) {
            this.id = id;
        }
    }

    static async getAllAdmins(){
        return await AdminModel.find().lean();
    }

    async findByEmail() {
        if (!this.email) {
            return;
        }
        return await AdminModel.findOne({ email: this.email });
    }

    async findById() {
        if (!this.id) {
            return;
        }
        return await AdminModel.findOne({ id: this.id });
    }

    async findByPhone() {
        if (!this.phone) {
            return;
        }
        return await AdminModel.findOne({ phone: this.phone });
    }

    static async populateDB(existingUser){
        return await AdminModel.populate(existingUser, { path: "roles" });
    }

    static async countDoc(role){
        return await AdminModel.countDocuments({ roles: role._id });
    }
}

module.exports = Admin;
