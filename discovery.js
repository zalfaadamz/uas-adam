// routes/discovery.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('./admin');
const {db,admin} = require('./firebase');

router.get('/discovery', authenticateToken, async (req, res) => {
  try {
    const podcastsRef = db.collection('podcasts');
    const snapshot = await podcastsRef.get();

    if (snapshot.empty) {
      return res.status(404).send('Tidak ada podcast yang ditemukan');
    }

    const podcasts = [];
    snapshot.forEach(doc => {
      podcasts.push(doc.data());
    });

    // Shuffle and get a random subset of podcasts
    const shuffled = podcasts.sort(() => 0.5 - Math.random());
    const suggestions = shuffled.slice(0, 5); // get 5 random suggestions

    res.status(200).json(suggestions);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
