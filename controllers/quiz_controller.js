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
				res.render('quizes/index.ejs',{quizes: quizes,errors: []});
			})
	}else{

		models.Quiz.findAll().then(
			function(quizes){
				res.render('quizes/index.ejs',{quizes: quizes,errors: []});
			})
	}
};

// GET /quizes/:id
exports.show = function(req,res){
	models.Quiz.findAll().then(function(quiz){
		res.render('quizes/show',{quiz: req.quiz,errors: []});
	})
};

// GET /quizes/:id/answer
exports.answer = function(req,res){
	var resultado= 'Incorrecto';
	if(req.query.respuesta === req.quiz.respuesta){
		resultado= 'Correcto';
	}
	res.render('quizes/answer',{quiz: req.quiz, respuesta: resultado,errors: []});
};

// GET /quizes/new
exports.new = function(req,res){
	var quiz = models.Quiz.build( // crea objeto quiz
		{pregunta: "pregunta", respuesta: "respuesta"}
		);
	res.render('quizes/new',{quiz: quiz,errors: []});
};

// POST /quizes/create
exports.create = function(req,res){
	var quiz = models.Quiz.build(req.body.quiz);
	var errors=quiz.validate();

	// if(errors){
	// 	var i=0; 
	// 	var errores=new Array();//se convierte en [] con la propiedad message por compatibilida con layout
	// 	for (var prop in errors){ 
	// 		errores[i++]={message: errors[prop]};
	// 	}
	// 	res.render('quizes/new', {quiz:quiz, errors:errores});
	// }else{
	// 	// guarda en DB los campos pregunta y respuesta de quizs
	// 	quiz
	// 	.save({fields:["pregunta","respuesta"]})
	// 	.then(function(){
	// 		//Redirección HTTP (URL relativo) lista de preguntas
	// 		res.redirect('/quizes');
	// 	});
	// }
	quiz
	.validate()
	.then(
		function(err){
			if (err) {
				res.render('quizes/new', {quiz: quiz, errors: err.errors});
			} else {
        quiz // save: guarda en DB campos pregunta y respuesta de quiz
        .save({fields: ["pregunta", "respuesta"]})
        .then( function(){ res.redirect('/quizes')}) 
      }      // res.redirect: Redirección HTTP a lista de preguntas
  }
  ).catch(function(error){next(error)});
};

// GET /quizes/:id/edit
exports.edit = function(req,res){
	var quiz = req.quiz; // autoload de instancia de quiz

	res.render('quizes/edit',{quiz: quiz, errors: []});
};


// PUT /quizes/:id
exports.update = function(req,res){

	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;

	req.quiz
	.validate()
	.then(
		function(err){
			if (err) {
				res.render('quizes/new', {quiz: quiz, errors: err.errors});
			} else {
	       		 req.quiz // save: guarda en DB campos pregunta y respuesta de quiz
	       		 .save({fields: ["pregunta", "respuesta"]})
	       		 .then( function(){ res.redirect('/quizes')}) 
	      		}      // res.redirect: Redirección HTTP a lista de preguntas
	      	}
	      	).catch(function(error){next(error)});

	// var errors=req.quiz.validate();

	// if(errors){
	// 	var i=0; 
	// 	var errores=new Array();//se convierte en [] con la propiedad message por compatibilida con layout
	// 	for (var prop in errors){ 
	// 		errores[i++]={message: errors[prop]};
	// 	}
	// 	res.render('quizes/new', {quiz:req.quiz, errors:errores});
	// }else{
	// 	// guarda en DB los campos pregunta y respuesta de quizs
	// 	req.quiz
	// 	.save({fields:["pregunta","respuesta"]})
	// 	.then(function(){
	// 		//Redirección HTTP (URL relativo) lista de preguntas
	// 		res.redirect('/quizes');
	// 	});
	// }
};

exports.destroy = function (req,res){
	req.quiz.destroy().then(function(){
		res.redirect('/quizes');
	}).catch(function(error){next(error)});
};