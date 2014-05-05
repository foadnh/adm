/**
 * Created by foad on 5/1/14.
 */

app.controller('TaskCtrl', function($scope, $rootScope, $route, $routeParams, $modal, $location, tastypieService) {
	if($routeParams.userId == undefined) {
		$scope.subtaskUrlPrefix = 'task'
	} else {
		$scope.subtaskUrlPrefix = 'user/' + $routeParams.userId
	}

	var deleted = $route.current.deleted;
	if (deleted) {
		$scope.subtaskUrlPrefix = 'deleted/' + $scope.subtaskUrlPrefix;
	}

	$scope.show = {
		detail: true,
		submit: false,
		addProperty: false,
		addAssign: false,
		assignAlert: false,
		delete: false
	};

	var taskServ = new tastypieService({
		apiUrl : '/api/v1/task/'
	});

	var propertyServ = new tastypieService({
		apiUrl : '/api/v1/property/'
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
						if(ref.data.deleted == deleted) {
							if($routeParams.userId == undefined) {
								$scope.subtasks.push(ref.data);
							} else if (ref.data.assigns.indexOf(',' + $routeParams.userId + ':') != -1) {
								$scope.subtasks.push(ref.data);
							}
						}
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
			if($scope.task.assigns != '') {
				var assignsT = $scope.task.assigns.split(',');
				angular.forEach(assignsT, function(assignT) {
					$scope.assigns.push({
						userId: assignT.split(':')[0],
						done: assignT.split(':')[1]
					})
				});
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
			$scope.subtask.parent = Number($routeParams.taskId);
			$scope.subtask.logs = String(logRef.data.id);
			taskServ.save($scope.subtask).then(function(ref) {
				if ($scope.task.subs == null) {
					$scope.task.subs = ref.data.id;
				} else {
					$scope.task.subs += ',' + ref.data.id;
				}
				taskServ.update($scope.task).then(function(taskRef) {
					$scope.show.submit = false;
					$scope.subtask = {
						title: '',
						detail: ''
					};
					update();
				});
			});
		});
	};

	var log = function(text, node) {
		if(typeof(node)==='undefined') {
			var node = $scope.task;
		}
		logServ.save({
			'userId': $rootScope.loggedInUser,
			'text': text
		}).then(function(ref) {
			$scope.task.logs += ',' + String(ref.data.id);
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

	taskDelete = function(node) {
		log('Marked as deleted.', node);
		node.deleted = true;
		taskServ.update(node);
		if(node.subs != null) {
			angular.forEach(node.subs.split(','), function(sub) {
				taskServ.get(sub).then(function(ref) {
					taskDelete(ref.data)
				});
			});
		}
	};

	$scope.taskDelete = function() {
		taskDelete($scope.task);
		$location.path('/');
	};

	$scope.propertiesUpdate = function() {
		$scope.task.properties = '';
		for (property in $scope.properties) {
			if(property == 0) {
				$scope.task.properties = $scope.properties[property].id;
			} else {
				$scope.task.properties += ',' + $scope.properties[property].id;
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
		$scope.task.assigns = '';
		for(assign in $scope.assigns) {
			if(assign == 0) {
				$scope.task.assigns = $scope.assigns[assign].userId + ':' + $scope.assigns[assign].done;
			} else {
				$scope.task.assigns += ',' + $scope.assigns[assign].userId + ':' + $scope.assigns[assign].done;
			}
		}
		taskServ.update($scope.task);
	};

	$scope.assignSubmit = function(node) {
		if(typeof(node)==='undefined') {
			var node = $scope.task;
		}
		if($scope.assign.user.id) {
			if(node.assigns.indexOf($scope.assign.user.id) == -1) {
				$scope.assign.userId = $scope.assign.user.id;
				console.log(2);
				log('User assigned: ' + $scope.assign.user.username, node);
				if(node === $scope.task) {
					$scope.assigns.push({
						userId: $scope.assign.userId,
						done: 0
					});
				}
				$scope.show.addAssign = false;
				if(node.assigns == '') {
					node.assigns = $scope.assign.user.id + ':0';
				} else {
					node.assigns += ',' + $scope.assign.user.id + ':0';
				}
				taskServ.update(node);
				if(node.parent != null) {
					console.log(4);
					taskServ.get(node.parent).then(function(parentRef) {
						console.log(5);
						$scope.assignSubmit(parentRef.data);
					});
				} else {
					delete $scope.assign;
				}
			}
		} else {
			$scope.show.assignAlert = true;
		}
	};

	$scope.assignDelete = function(userId, node) {
		if(typeof(node)==='undefined') {
			console.log('DONG!!!!');
			var node = $scope.task;
		}
		userServ.get(userId).then(function(ref) {
			log('Assigned user deleted: ' + ref.data.username);
			var start = node.assigns.indexOf(userId + ':');
			var end = node.assigns.indexOf(',', start);
			console.log(start);
			console.log(end);
			console.log(node.assigns);
			console.log(ref.data.username);
			if(start == 0) {
				if(end == -1) {
					console.log('#1');
					console.log(node);
					log.assigns = '';
				} else {
					console.log('#2');
					console.log(node);
					node.assigns = node.assigns.slice(end+1, node.assigns.length);
				}
			} else {
				if(end == -1) {
					console.log('#3');
					console.log(node);
					node.assigns = node.assigns.substring(0, start-1);
				} else {
					console.log('#4');
					console.log(node);
					node.assigns = node.assigns.substring(0, start) +  node.assigns.slice(end+1, node.assigns.length);
				}
			}
			console.log(node);
			if(node.subs != null) {
				var subs = node.subs.split(',');
				console.log(subs);
				angular.forEach(subs, function(n) {
					taskServ.get(n).then(function(ref) {
						$scope.assignDelete(userId, ref.data);
					})
				});
			}
			if (node === $scope.task) {
				for(index in $scope.assigns) {
					if($scope.assigns[index].userId == userId) {
						$scope.assigns.splice(index, 1);
						break;
					}
				}
			}
			taskServ.update(node);
		});
	};

	$scope.assignDoneUpdate = function(index) {
		userServ.get($scope.assigns[index].userId).then(function(ref) {
			log('Assigned user "' + ref.data.username + '" changed to ' + $scope.assigns[index].done + '% done.');
			$scope.assignUpdate();
		});
	};

	$scope.logOpen = function() {
		var logs = [];
		var logIds = $scope.task.logs.split(',');
		angular.forEach(logIds, function(logId) {
			logServ.get(logId).then(function(ref) {
				logs.push(ref.data);
			});
		});
		var modalInstance = $modal.open({
			templateUrl: 'logTemplate.html',
			controller: 'LogCtrl',
			resolve: {
				items: function () {
					return logs;
				},
				task: function () {
					return $scope.task;
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
		console.log('logs:');
		var logs = [];
		var logIds = $scope.task.logs.split(',');
		angular.forEach(logIds, function(logId) {
			logServ.get(logId).then(function(ref) {
				logs.push(ref.data);
			});
		});
		console.log(logs);
	};
});