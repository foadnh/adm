/**
 * Created by foad on 5/1/14.
 */

app.controller('TasksCtrl', function($scope, $rootScope, $route, $routeParams, tastypieService) {
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
		submit: false
	};

	$scope.loggedInUser = $rootScope.loggedInUser;

	var taskServ = new tastypieService({
		apiUrl : '/api/v1/task/'
	});

	var rootServ = new tastypieService({
		apiUrl : '/api/v1/root/'
	});

	var logServ = new tastypieService({
		apiUrl : '/api/v1/log/'
	});

	var update = function() {
		rootServ.getList().then(function(ref) {
			$scope.tasks = [];
			for(var i = 0; i < ref.data.length; i++) {
				taskServ.get(ref.data[i].taskId).then(function(ref) {
					if(ref.data.deleted == deleted) {
						if($routeParams.userId == undefined) {
							$scope.tasks.push(ref.data);
						} else {
							var assigns = ref.data.assignIds.split(',');
							var loop = true;
							for (var assign in assigns) {
								assignServ.get(assigns[assign]).then(function(assignRef) {
									if(assignRef.data.userId == $routeParams.userId && loop) {
										$scope.tasks.push(ref.data);
										loop = false;
									}
								});
							}
						}
					}
				});
			}
		});
	};
	update();

	$scope.taskSubmit = function() {
		logServ.save({
			'text': 'Task created.' + '\nTitle: ' + $scope.task.title + '\nDetail: ' + $scope.task.detail,
			'userId': Number($rootScope.loggedInUser)})
			.then(function(logRef) {
				$scope.task.logs = String(logRef.data.id);
				taskServ.save($scope.task).then(function(ref) {
					rootServ.save({taskId: Number(ref.data.id)}).then(function(refChild){
						$scope.show.submit = false;
						$scope.task = {
							title: '',
							detail: ''
						};
						update();
					});
				});
			});
	};
});