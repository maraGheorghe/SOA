import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

export const User = mongoose.model('User', userSchema);

export const dogSchema = new mongoose.Schema({
    name: { type: String, required: true },
    breed: { type: String, required: true },
    age: { type: Number, required: true },
    size: { type: String, enum: ["small", "medium", "large"], required: true }
});

export const Dog = mongoose.model('Dog', dogSchema);

export const adoptionSchema = new mongoose.Schema({
    dogId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dog', required: true },
    adopterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

export const Adoption = mongoose.model('Adoption', adoptionSchema);