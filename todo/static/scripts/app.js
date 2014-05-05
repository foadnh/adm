/* global app:true */
'use strict';

var app = angular.module('TodoApp', [
	'ngRoute',
	'ngResource',
	'tyaslab.tastypie',
	'ui.bootstrap'
]);

app.run(function($rootScope) {
	$rootScope.$broadcast('event:initial-auth');
});

app.config(function ($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: '/static/views/tasks.html',
			controller: 'TasksCtrl',
			deleted: false
		})
		.when('/task/:taskId', {
			templateUrl: '/static/views/task.html',
			controller: 'TaskCtrl',
			deleted: false
		})
		.when('/user/:userId', {
			templateUrl: '/static/views/tasks.html',
			controller: 'TasksCtrl',
			deleted: false
		})
		.when('/user/:userId/:taskId', {
			templateUrl: '/static/views/task.html',
			controller: 'TaskCtrl',
			deleted: false
		})
		.when('/deleted/', {
			templateUrl: '/static/views/tasks.html',
			controller: 'TasksCtrl',
			deleted: true
		})
		.when('/deleted/task/:taskId', {
			templateUrl: '/static/views/task.html',
			controller: 'TaskCtrl',
			deleted: true
		})
		.when('/deleted/user/:userId', {
			templateUrl: '/static/views/tasks.html',
			controller: 'TasksCtrl',
			deleted: true
		})
		.when('/deleted/user/:userId/:taskId', {
			templateUrl: '/static/views/task.html',
			controller: 'TaskCtrl',
			deleted: true
		})
		.otherwise({
			redirectTo: '/'
		});
});