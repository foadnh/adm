/**
 * Created by foad on 5/1/14.
 */

app.controller('TaskCtrl', function($scope, $rootScope, $routeParams, $modal, tastypieService) {
	$scope.show = {
		detail: true,
		submit: false,
		addProperty: false,
		addAssign: false,
		assignAlert: false
	};

	var taskServ = new tastypieService({
		apiUrl : '/api/v1/task/'
	});

	var propertyServ = new tastypieService({
		apiUrl : '/api/v1/property/'
	});

	var assignServ = new tastypieService({
		apiUrl : '/api/v1/assign/'
	});

	var userServ = new tastypieService({
		apiUrl : '/api/v1/user/'
	});

	var logServ = new tastypieService({
		apiUrl : '/api/v1/log/'
	});

	var update = function() {
		taskServ.get($routeParams.taskId).then(function(result) {
			$scope.task = result.data;
			if (result.data.subs != null) {
				subsId = result.data.subs.split(',');
				$scope.subtasks = [];
				for(var i= 0; i<subsId.length; i++) {
					taskServ.get(subsId[i]).then(function(ref) {
						$scope.subtasks.push(ref.data);
					});
				}
			}

			$scope.properties = [];
			if($scope.task.properties != '') {
				var properties = $scope.task.properties.split(',');
				for(var i = 0; i < properties.length; i++) {
					propertyServ.get(properties[i]).then(function(ref) {
						$scope.properties.push(ref.data);
					});
				}
			}

			$scope.assigns = [];
			if($scope.task.users != '') {
				var assigns = $scope.task.users.split(',');
				for(var i = 0; i < assigns.length; i++) {
					assignServ.get(assigns[i]).then(function(ref) {
						$scope.assigns.push(ref.data);
					});
				}
			}

			userServ.getList().then(function(ref) {
				$scope.users = ref.data;
			});
		});
	};

	update();

	$scope.subtaskSubmit = function(){
		log('Subtask added.' + '\nTitle: ' + $scope.subtask.title + '\nDetail: ' + $scope.subtask.detail);
		logServ.save({
			'text': 'Task created.' + '\nTitle: ' + $scope.subtask.title + '\nDetail: ' + $scope.subtask.detail,
			'userId': Number($rootScope.loggedInUser)
		}).then(function(logRef) {
		$scope.task.logs = String(logRef.data.id);
			$scope.subtask.parent = Number($routeParams.taskId);
			$scope.subtask.logs = String(logRef.data.id);
			taskServ.save($scope.subtask).then(function(ref) {
				if ($scope.task.subs == null) {
					$scope.task.subs = ref.data.id;
				} else {
					$scope.task.subs += ',' + ref.data.id;
				}
				taskServ.save($scope.task);
				$scope.show.submit = false;
				$scope.subtask = {
					title: '',
					detail: ''
				};
				update();
			});
		});
	};

	var log = function(text) {
		logServ.save({
			'userId': $rootScope.loggedInUser,
			'text': text
		}).then(function(ref) {
			$scope.task.logs = ',' + String(ref.data.id);
			taskServ.update($scope.task)
		});
	};

	$scope.taskUpdate = function() {
		log(
			'Task updated.' + '\nTitle: ' + $scope.task.title +
				'\nDetail: ' + $scope.task.detail + '\nDone: ' + $scope.task.done
		);
		taskServ.update($scope.task).then(function(ref) {
			$scope.show.detail = true;
		});
	};

	$scope.propertiesUpdate = function() {
		$scope.task.properties = '';
		for (property in $scope.properties) {
			if(property == 0) {
				$scope.task.properties = $scope.properties[property].name;
			} else {
				$scope.task.properties += ',' + $scope.properties[property].name;
			}
		}
		taskServ.update($scope.task);
	};

	$scope.propertySubmit = function() {
		log('Property submited: ' + $scope.property.name);
		propertyServ.save($scope.property).then(function(ref) {
			$scope.properties.push(ref.data);
			$scope.show.addProperty = false;
			$scope.property.name = '';
			if($scope.task.properties == '') {
				$scope.task.properties = ref.data.id;
			} else {
				$scope.task.properties += ',' + ref.data.id;
			}
			taskServ.update($scope.task);
		});
	};

	$scope.propertyToggleDone = function(index) {
		if($scope.properties[index].done) {
			log('Property "' + $scope.properties[index].name + '" changed to undone.');
			$scope.properties[index].done = false;
		} else {
			log('Property "' + $scope.properties[index].name + '" changed to done.');
			$scope.properties[index].done = true;
		}
		propertyServ.update($scope.properties[index]);
	};

	$scope.propertyDelete = function(index) {
		log('Property deleted: ' + $scope.properties[index].name);
		propertyServ.delete($scope.properties[index].id);
		$scope.properties.splice(index, 1);
		$scope.propertiesUpdate();
	};

	$scope.assignUpdate = function() {
		$scope.task.users = '';
		for (assign in $scope.assigns) {
			if(assign == 0) {
				$scope.task.users = $scope.assigns[assign].id;
			} else {
				$scope.task.users += ',' + $scope.assigns[assign].id;
			}
		}
		taskServ.update($scope.task);
	};

	$scope.assignSubmit = function() {
		log('User assigned: ' + $scope.assign.user.username);
		$scope.assign.done = 0;
		$scope.assign.userId = $scope.assign.user.id;
		assignServ.save($scope.assign).then(function(ref) {
			$scope.assigns.push(ref.data);
			$scope.show.addAssign = false;
			delete $scope.assign;
			if($scope.task.users == '') {
				$scope.task.users = ref.data.id;
			} else {
				$scope.task.users += ',' + ref.data.id;
			}
			taskServ.update($scope.task);
		}, function(err) {
			$scope.show.assignAlert = true;
		});
	};

	$scope.assignDelete = function(index) {
		log('Assigned user deleted: ' + $scope.assigns[index].user.username);
		assignServ.delete($scope.assigns[index].id);
		$scope.assigns.splice(index, 1);
		$scope.assignUpdate();
	};

	$scope.assignDoneUpdate = function(index) {
		log(
			'Assigned user "' + $scope.assigns[index].user.username +
				'" changed to ' + $scope.assigns[index].done + '% done.');
		assignServ.update($scope.assigns[index]);
	};

	$scope.logOpen = function() {
		var logs = [];
		var logIds = $scope.task.logs.split(',');
		angular.forEach(logIds, function(logId) {
			logServ.get(logId).then(function(ref) {
				logs.push(ref.data);
			});
		});
		console.log(logs);
		var modalInstance = $modal.open({
			templateUrl: 'logTemplate.html',
			controller: 'LogCtrl',
			resolve: {
				items: function () {
					return logs;
				}
			}
		});
	};

	$scope.debug = function() {
		console.log('subtasks:');
		console.log($scope.subtasks);
		console.log('task:');
		console.log($scope.task);
		console.log('assigns:');
		console.log($scope.assigns);
		console.log('parent:');
		console.log($scope.task.parent);
		console.log('properties:');
		console.log($scope.properties);
		console.log('users:');
		console.log($scope.users);
	};
});