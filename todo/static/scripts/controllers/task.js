/**
 * Created by foad on 5/1/14.
 */

app.controller('TaskCtrl', function($scope, $routeParams, tastypieService) {
	$scope.show = {
		detail: true,
		submit: false,
		addAssign: false
	};

	var taskServ = new tastypieService({
		apiUrl : '/api/v1/task/'
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
			$scope.assigns = [];
			if ($scope.task.users != '') {
				var assigns = $scope.task.users.split(',');
				for (var i = 0; i < assigns.length; i++) {
					$scope.assigns.push({user: assigns[i].split(':')[0], done: assigns[i].split(':')[1]});
				}
			}
		});
	};
	update();

	$scope.subtaskSubmit = function() {
		$scope.subtask.parent = Number($routeParams.taskId);
		taskServ.save($scope.subtask).then(function(ref) {
			if ($scope.task.subs == null) {
				$scope.task.subs = ref.data.id;
				console.log(ref.data.id);
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
	};

	$scope.taskUpdate = function() {
		taskServ.update($scope.task).then(function(ref) {
			$scope.show.detail = true;
		});
	};

	$scope.assignsUpdate = function() {
		for (assign in $scope.assigns) {
			if(assign == 0) {
				$scope.task.users = $scope.assigns[assign].user + ':' + $scope.assigns[assign].done;
			} else {
				$scope.task.users += ',' + $scope.assigns[assign].user + ':' + $scope.assigns[assign].done;
			}
		}
		taskServ.update($scope.task);
	};

	$scope.assignSubmit = function() {
		$scope.assigns.push({user: $scope.assign.user, done: 0});
		$scope.assignsUpdate();
		$scope.show.addAssign = false;
		$scope.assign.user = '';
	};

	$scope.log = function() {
		console.log('subtasks: ' + $scope.subtasks)
		console.log('task: ' + $scope.task);
		console.log('assigns: ' + $scope.assigns);
		console.log('parent: ' + $scope.task.parent);

	};
});