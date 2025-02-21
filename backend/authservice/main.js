import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";
import { User } from "../utils/database-utils.js";
const app = express();
const port = 80;

app.use(express.json());

const user = new User({ email: 'admin', password: 'admin' });
user.save().then(() => console.log('Added admin user'));

const connectDB = async () => {
    try {
        if (!process.env.DATABASE_URL) {
            throw new Error("DATABASE_URL is not defined in environment variables");
        }
        await mongoose.connect(process.env.DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};
connectDB();

app.get('/auth', (req, res) => {
    res.send('authservice');
});

app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (password !== user.password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, { expiresIn: '1h' });

        res.json({ message: 'Login successful', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.listen(port, () => {
    console.log(`Auth service running on port ${port}`);
});
