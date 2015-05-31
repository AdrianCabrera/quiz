var express = require('express');
var quizController = require('../controllers/quiz_controller');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

/* GET home page. */
router.get('/quizes/question',quizController.question);
router.get('/quizes/answer',quizController.answer);
router.get('/author', function(req, res) {
  res.render('author');
});
module.exports = router;