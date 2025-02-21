import mongoose from 'mongoose';
import { User, Dog, Adoption } from './utils/database-utils.js';

mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

async function init() {
  try {
    await User.deleteMany({});
    await Dog.deleteMany({});
    await Adoption.deleteMany({});

    const user = new User({
      email: 'a@a.com',
      password: 'pass'
    });
    await user.save();

    const dog1 = new Dog({
      name: 'Max',
      breed: 'Bulldog',
      age: 3,
      size: 'medium'
    });

    const dog2 = new Dog({
      name: 'Bella',
      breed: 'Labrador',
      age: 2,
      size: 'large'
    });

    await dog1.save();
    await dog2.save();

    console.log('Database initialized successfully!');
  } catch (err) {
    console.error('Error initializing database:', err);
  } finally {
    mongoose.connection.close();
  }
}

init();
