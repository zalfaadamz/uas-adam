// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {db,admin} = require('./firebase');

router.post('/signup', async (req, res) => {
  const { email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const userRef = db.collection('users').doc();
    await userRef.set({
      email,
      password: hashedPassword,
      role
    });
    res.status(201).send('User created successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const userRef = db.collection('users').where('email', '==', email);
    const snapshot = await userRef.get();

    if (snapshot.empty) {
      return res.status(400).send('Invalid email or password');
    }

    const userDoc = snapshot.docs[0];
    const user = userDoc.data();

    if (await bcrypt.compare(password, user.password)) {
      const accessToken = jwt.sign(
        { uid: userDoc.id, email: user.email, role: user.role },
        process.env.ACCESS_TOKEN_SECRET
      );
      res.status(200).json({ accessToken });
    } else {
      res.status(400).send('Invalid email or password');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
