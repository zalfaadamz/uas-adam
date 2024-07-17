// routes/podcasts.js
const express = require('express');
const router = express.Router();
// const authenticateToken = require('./admin');
// const adminOnly = require('./admin');
const {db,admin} = require('./firebase');

// POST a new podcast (admin only)
router.post('/podcast', async (req, res) => {
  const { title, desc, category, author } = req.body;

  try {
    const podcastRef = db.collection('podcasts').doc();
    await podcastRef.set({
      title,
      desc,
      category,
      author,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(201).send('Podcast created successfully');
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error.message);
  }
});

router.post('/addpod', async (req, res) => {
    const podcasts = req.body;
  
    if (!Array.isArray(podcasts)) {
      return res.status(400).send('Request body must be an array of podcasts');
    }
  
    const batch = db.batch();
  
    try {
      podcasts.forEach((podcast) => {
        const { title, desc, category, author } = podcast;
        const podcastRef = db.collection('podcasts').doc();
  
        batch.set(podcastRef, {
          title,
          desc,
          category,
          author,
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
      });
  
      await batch.commit();
      res.status(201).send('Podcasts created successfully');
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
  

// GET all podcasts
router.get('/podcasts', async (req, res) => {
  try {
    const podcastsRef = db.collection('podcasts');
    const snapshot = await podcastsRef.get();

    if (snapshot.empty) {
      return res.status(404).send('No podcasts found');
    }

    const podcasts = [];
    snapshot.forEach(doc => {
      podcasts.push(doc.data());
    });

    res.status(200).json(podcasts);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
