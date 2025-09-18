const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema(
  {
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    module: {
      type: Object,
      permissions: {
        canView: { type: Boolean, default: false },
        canCreate: { type: Boolean, default: false },
        canEdit: { type: Boolean, default: false },
        canDelete: { type: Boolean, default: false },
      },
      required: true, // e.g., "category", "subcategory"
    },
  },
  { timestamps: true }
);

// ---------------- Mongoose Model ----------------
const PermissionModel = mongoose.model("Permission", permissionSchema);

class Permission {
  constructor(role, module, id) {
    this.role = role;
    this.module = module;
    if (id) {
      this.id = id;
    }
  }

  async save() {
    if (this.id) {
      // Update existing
      return await PermissionModel.findByIdAndUpdate(
        this.id,
        {
          role: this.role,
          module: this.module,
        },
        { new: true }
      );
    } else {
      // Create new
      const perm = new PermissionModel({
        role: this.role,
        module: this.module,
      });
      return await perm.save();
    }
  }

  static async findByRole(role) {
    return await PermissionModel.findOne({ role });
  }

  static async findByManyRoles(roleIds) {
    return await PermissionModel.find({ role: { $in: roleIds } });
  }

  static async findById(id) {
    return await PermissionModel.findById(id);
  }

  static async getAllPermissions() {
    return await PermissionModel.find().populate("role");
  }

  static async delete(id) {
    await PermissionModel.findByIdAndDelete(id);
  }
}

module.exports = Permission;