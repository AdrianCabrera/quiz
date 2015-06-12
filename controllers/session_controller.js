var models = require('../models/models.js');


// MW de autorización de accesos HTTP restringidos
exports.loginRequired = function(req,res,next){
	if(req.session.user){
		next();
	}else{
		res.redirect('/login');
	}
};

// GET /quizes/new
exports.new = function(req,res){
	var errors = req.session.errors || {};
	req.session.errors={};

	res.render('sessions/new',{errors: errors});
};

// POST /quizes/create
exports.create = function(req,res){
	var login = req.body.login;
	var password = req.body.password;

	var usercontroller = require('./user_controller');
	usercontroller.autenticar(login,password, function(error,user){
		//Si hay error retornamos mensajes de error de sesión
		if(error){
			req.session.errors= [{'message':'Se ha producido un error: '+error}];
			res.redirect('/login');
			return;
		}

		// Crear req.session.user y guardar campos id y username
		// La sesión se define por la existencia de: req.session.user
		req.session.user = {id:user.id,username:user.username};

		res.redirect(req.session.redir.toString()); // redirección a path anterior a login
	});

};

exports.destroy= function(req,res){
	delete req.session.user;
	res.redirect(req.session.redir.toString()); // redirect a path anterior a login
}