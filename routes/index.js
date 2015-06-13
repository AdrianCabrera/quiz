var express = require('express');
var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res,next) {
	if(req.session.lastTimeStamp!==undefined){
		if(Math.abs( new Date(req.session.lastTimeStamp).getTime() - new Date().getTime())>120000){
			delete req.session.user;
			delete req.session.lastTimeStamp;
			res.redirect('/login');
			return;
		}
		req.session.lastTimeStamp = new Date().toString();
	}
	res.render('index', { title: 'Quiz' ,errors: []});
});

// Autolaod de comandos con :quizId
router.param( 'quizId', quizController.load); // autoload :quizId
router.param( 'commentId', commentController.load); // autoload :commentId

// Definición de rutas de sesión
router.get('/login', sessionController.autoLogout,sessionController.new);
router.post('/login', sessionController.autoLogout,sessionController.create);
router.get('/logout', sessionController.destroy);

/* QUIZES. */
router.get('/quizes',						sessionController.autoLogout,quizController.index);
router.get('/quizes/:quizId(\\d+)',			sessionController.autoLogout,quizController.show);
router.get('/quizes/:quizId(\\d+)/answer',	sessionController.autoLogout,quizController.answer);
router.get('/quizes/new',					sessionController.autoLogout,sessionController.loginRequired,quizController.new);
router.post('/quizes/create',				sessionController.autoLogout,sessionController.loginRequired,quizController.create);
router.get('/quizes/:quizId(\\d+)/edit',	sessionController.autoLogout,sessionController.loginRequired,quizController.edit);
router.put('/quizes/:quizId(\\d+)',			sessionController.autoLogout,sessionController.loginRequired,quizController.update);
router.delete('/quizes/:quizId(\\d+)',		sessionController.autoLogout,sessionController.loginRequired,quizController.destroy);


router.get('/quizes/:quizId(\\d+)/comments/new', sessionController.autoLogout,commentController.new);
router.post('/quizes/:quizId(\\d+)/comments', sessionController.autoLogout,commentController.create);
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish', sessionController.autoLogout,sessionController.loginRequired,commentController.publish);

/* AUTHOR. */
router.get('/author', function(req, res) {
	if(req.session.lastTimeStamp!==undefined){
		if(Math.abs( new Date(req.session.lastTimeStamp).getTime() - new Date().getTime())>120000){
			delete req.session.user;
			delete req.session.lastTimeStamp;
			res.redirect('/login');
			return;
		}
		req.session.lastTimeStamp = new Date().toString();
	}
	res.render('author',{errors: []});
});

module.exports = router;