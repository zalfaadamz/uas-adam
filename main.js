const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require("dotenv");
const cors = require('cors');
const {db,admin} = require('./firebase');
const app = express();
const router = express.Router();
// Middleware
app.use(express.json());
app.use(cors({
  origin: '*', // Updated origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
dotenv.config();

// All routes here
const discoveryRoutes = require('./discovery');
const likesRoutes = require('./likes');
const continueRoutes = require('./continue');
const authRoutes = require('./auth');
const podcastRoutes = require('./podcastcontroller');
app.use('/api', discoveryRoutes);
app.use('/api', likesRoutes);
app.use('/api', continueRoutes);
app.use('/api', authRoutes);
app.use('/api', podcastRoutes);


const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Example route to demonstrate database connection
router.get('/test', async (req, res) => {
  try {
    const snapshot = await db.collection('testCollection').get();
    const data = snapshot.docs.map(doc => doc.data());
    res.json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.use('/api', router);