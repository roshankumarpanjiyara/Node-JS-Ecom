const mongodb = require("mongodb");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const ObjectId = mongodb.ObjectId;

const db = require('../database/database');

class User {
    constructor(name, email, phone, password, id) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.password = password;
        if(id){
            this.id = new ObjectId(id);
        }
    }

    async findByEmail(){
        if(!this.email){
            return;
        }
        const user = await db.getDb().collection('users').findOne({email: this.email});
        return user;
    }

    async findById(){
        if(!this.id){
            return;
        }
        const user = await db.getDb().collection('users').findOne({_id: this.id});
        return user;
    }

    async findByPhone(){
        if(!this.phone){
            return;
        }
        const user = await db.getDb().collection('users').findOne({phone: this.phone});
        return user;
    }

    async signUp() {
        const hashedPassword = await bcrypt.hash(this.password, 12);

        const user = {
            name: this.name,
            email: this.email,
            phone: this.phone,
            password: hashedPassword,
            role: 'user',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        await db.getDb().collection('users').insertOne(user);
        return { ...user, _id: result.insertedId };
    }
}

module.exports = User;