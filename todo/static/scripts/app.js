/* global app:true */
'use strict';

var app = angular.module('TodoApp', [
	'ngRoute',
	'ngResource',
	'tyaslab.tastypie'
]);

app.config(function ($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: '/static/views/tasks.html',
			controller: 'TasksCtrl'
		})
		.when('/task/:taskId', {
			templateUrl: '/static/views/task.html',
			controller: 'TaskCtrl'
		})
		.when('/user/:user', {
			templateUrl: '/static/views/user-root.html',
			controller: 'UserRootCtrl'
		})
		.when('/user/:user/:taskId', {
			templateUrl: '/static/views/user-sub.html',
			controller: 'UserSubCtrl'
		})
		.otherwise({
			redirectTo: '/'
		});
});