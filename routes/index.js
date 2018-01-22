const router = require('express').Router();

router.get('/', (req, res) => {
  res.json({
    statusCode: 200,
    message: 'This is the root page for api\'s'
  })
});

module.exports = router;