// routes/continue.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('./admin');
const {db,admin} = require('./firebase');

router.post('/save', authenticateToken, async (req, res) => {
  const { episodeId, position } = req.body;

  try {
    const userRef = db.collection('users').doc(req.user.uid);
    const listenedPodcastsRef = userRef.collection('listenedPodcasts').doc(episodeId);

    await listenedPodcastsRef.set({
      episodeId,
      lastPlayed: admin.firestore.FieldValue.serverTimestamp(),
      position
    });

    res.status(200).send('Episode podcast disimpan');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get('/continue', authenticateToken, async (req, res) => {
  try {
    const userRef = db.collection('users').doc(req.user.uid);
    const snapshot = await userRef.collection('listenedPodcasts').orderBy('lastPlayed', 'desc').get();

    if (snapshot.empty) {
      return res.status(404).send('Tidak ada podcast terbaru');
    }

    const savedPodcasts = [];
    snapshot.forEach(doc => {
      savedPodcasts.push(doc.data());
    });

    res.status(200).json(savedPodcasts);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
