const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true, },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, trim: true },
  },
  { timestamps: true }
);

// ---------------- Mongoose Model ----------------
const RoleModel = mongoose.model("Role", roleSchema);

class Role{
    constructor(name, slug, description, id){
        this.name = name;
        this.slug = slug;
        this.description = description;
        if(id){
            this.id = id;
        }
    }

    static async getAllRoles(){
        return await RoleModel.find().lean();
    }

    static async getRoleById(id){
        if(!id){
            return;
        }
        return await RoleModel.findById(id).lean();
    }

    static async getRoleByName(name){
        return await RoleModel.findOne({name}).lean();
    }

    static async getRoleBySlug(slug){
        return await RoleModel.findOne({slug}).lean();
    }

    async save(){
        const role = new RoleModel({
            name: this.name,
            slug: this.name.toLowerCase(this.name),
            description: this.description,
        });

        const savedRole = await role.save();
        return savedRole.toObject();
    }
}

module.exports = Role;