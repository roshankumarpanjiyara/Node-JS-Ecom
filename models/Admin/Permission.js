const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    role:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
  },
  { timestamps: true }
);

// ---------------- Mongoose Model ----------------
const PermissionModel = mongoose.model("Permission", permissionSchema);

class Permission {
  constructor(name, id) {
    this.name = name;
    if (id) {
      this.id = id
    }
  }
}

module.exports = Permission;