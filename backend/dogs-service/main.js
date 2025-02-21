const express = require('express');
const app = express();
const port = 80;
const mongoose = require('mongoose');
const { Dog } = require("../utils/database-utils");

mongoose.connect(process.env.DATABASE_URL);

app.use(express.json());

const dog1 = new Dog({
      name: 'Max',
      breed: 'Bulldog',
      age: 3,
      size: 'medium'
    });
dog1.save().then(() => console.log('Dog 1 saved.'));
    const dog2 = new Dog({
      name: 'Bella',
      breed: 'Labrador',
      age: 2,
      size: 'large'
    });
dog2.save().then(() => console.log('Dog 2 saved.'));

app.get('/dogs', (req, res) => {
    res.send('dogs-service');
});

app.get('/dogs/all', async (req, res) => {
    try {
        const dogs = await Dog.find();
        res.send(dogs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/dogs/:dogId', async (req, res) => {
    try {
        const dog = await Dog.findOne({ _id: req.params.dogId });
        res.send(dog);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.listen(port, () => {
    console.log(`Dogs service running on port ${port}`);
});
