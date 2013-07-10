(function(global, $) {

	'use strict';

	var gp = global.gp = global.gp || {};

	global.signin = function(data) {
		// google plus API callback
		app.signin(data);
	};

	var GPApp = soma.Application.extend({
		constructor: function(element) {
			this.element = element;
			soma.Application.call(this);
		},
		init: function() {
			// mapping rules
			this.injector.mapClass('user', gp.UserModel, true);
			this.injector.mapClass('oauth', gp.OAuthModel, true);
			this.injector.mapValue('ajax', $.ajax);
			// mediators
			this.mediators.map('signout', gp.SignOutMediator);
			this.mediators.map('signin', gp.SignInMediator);
			this.mediators.observe(this.element);
			// commands
			this.commands.add('oauth', gp.OAuthCommand);
			this.commands.add('signin', gp.OAuthCommand);
			this.commands.add('signout', gp.OAuthCommand);
		},
		start: function() {
			this.dispatcher.dispatch('oauth');
		},
		signin: function(data) {
			this.dispatcher.dispatch('signin', data);
		}
	});

	var app = new GPApp(document.querySelector('.app'));

})(this, $);