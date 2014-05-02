/* global app:true */
'use strict';

var app = angular
	.module('TodoApp', [
		''
	]);

app.config(function ($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'views/tasks.html',
			controller: 'TasksCtrl'
		})
		.otherwise({
			redirectTo: '/'
		});
});