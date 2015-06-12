var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizID
exports.load = function (req,res,next, quizId){
	models.Quiz.find(quizId).then(
		function (quiz){
			if(quiz){
				req.quiz = quiz;
				next();
			}else{
				next(new Error ('No existe quizID=' + quizId));
			}
		}
		).catch(function(error){next(error);});
}

// GET /quizes
exports.index = function(req,res){
	var search=req.query.search;

	if (search!== undefined) {

		search=search.replace(' ','%');
		search='%'+search+'%';

		models.Quiz.findAll({where: ["pregunta like ?", search]}).then(
			function(quizes){
				res.render('quizes/index.ejs',{quizes: quizes});
			})
	}else{

		models.Quiz.findAll().then(
			function(quizes){
				res.render('quizes/index.ejs',{quizes: quizes});
			})
	}
};

// GET /quizes/:id
exports.show = function(req,res){
	models.Quiz.findAll().then(function(quiz){
		res.render('quizes/show',{quiz: req.quiz});
	})
};

// GET /quizes/:id/answer
exports.answer = function(req,res){
	var resultado= 'Incorrecto';
	if(req.query.respuesta === req.quiz.respuesta){
		resultado= 'Correcto';
	}
	res.render('quizes/answer',{quiz: req.quiz, respuesta: resultado});
};