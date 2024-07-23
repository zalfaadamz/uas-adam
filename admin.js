// middleware/admin.js
module.exports = (req, res, next) => {
  if (req.user && req.user.role === 'user') {
    next();
  } else {
    res.status(403).send('Access denied');
  }
};
