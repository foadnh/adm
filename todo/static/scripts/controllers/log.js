/**
 * Created by foad on 5/4/14.
 */
'use strict';

app.controller('LogCtrl', function($scope, $rootScope, $modalInstance, items, task, tastypieService) {
	$scope.show = {
		newLog: false
	};

	$scope.items = items;

	var userServ = new tastypieService({
		apiUrl : '/api/v1/user/'
	});

	var logServ = new tastypieService({
		apiUrl : '/api/v1/log/'
	});

	var taskServ = new tastypieService({
		apiUrl : '/api/v1/task/'
	});

	userServ.getList().then(function(ref) {
		$scope.users = ref.data;
	});

	$scope.close = function() {
		$modalInstance.dismiss('close');
	};

	$scope.logAdd = function(text) {
		logServ.save({
			'userId': $rootScope.loggedInUser,
			'text': text
		}).then(function(ref) {
			task.logs += ',' + String(ref.data.id);
			taskServ.update(task)
		});
		$modalInstance.dismiss('saved');
	};
});