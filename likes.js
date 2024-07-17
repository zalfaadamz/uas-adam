// routes/likes.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('./admin');
const {db,admin} = require('./firebase');

router.post('/like', authenticateToken, async (req, res) => {
  const { episodeId } = req.body;

  try {
    const userRef = db.collection('users').doc(req.user.uid);
    const likedPodcastsRef = userRef.collection('likedPodcasts').doc(episodeId);

    const doc = await likedPodcastsRef.get();
    if (doc.exists) {
      await likedPodcastsRef.delete();
      return res.status(200).send('Episode podcast tidak disukai lagi');
    } else {
      await likedPodcastsRef.set({ episodeId });
      return res.status(200).send('Episode podcast disukai');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get('/liked', authenticateToken, async (req, res) => {
  try {
    const userRef = db.collection('users').doc(req.user.uid);
    const snapshot = await userRef.collection('likedPodcasts').get();

    if (snapshot.empty) {
      return res.status(404).send('Tidak ada podcast yang disukai');
    }

    const likedPodcasts = [];
    snapshot.forEach(doc => {
      likedPodcasts.push(doc.data());
    });

    res.status(200).json(likedPodcasts);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
