/**
 * Created by foad on 5/1/14.
 */

app.controller('TaskCtrl', function($scope, $routeParams, tastypieService) {
	$scope.show = {
		submit: false,
		addAssign: false
	};

	$scope.assign = {
		done: 0,
		user: ''
	};

	var taskServ = new tastypieService({
		apiUrl : '/api/v1/task/'
	});
	var update = function() {
		taskServ.get($routeParams.taskId).then(function(result) {
			$scope.task = result.data;
			if (result.data.subs != null) {
				subsId = result.data.subs.split(',');
				console.log(subsId);
				$scope.subtasks = [];
				for(var i= 0; i<subsId.length; i++) {
					taskServ.get(subsId[i]).then(function(result) {
						$scope.subtasks.push(result.data);
					});
				}
			}
			$scope.assigns = [];
			var assigns = $scope.task.users.split(',');
			for (var i = 0; i < assigns.length; i++) {
				$scope.assigns.push({user: assigns[i].split(':')[0], done: assigns[i].split(':')[1]});
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
			update();
		});
	};

	$scope.assignSubmit = function() {
		$scope.assigns.push({user: $scope.assign.user, done: $scope.assign.done});
		for (assign in $scope.assigns) {
			if(assign == 0) {
				$scope.task.users = $scope.assigns[assign].user + ':' + $scope.assigns[assign].done;
			} else {
				$scope.task.users += ',' + $scope.assigns[assign].user + ':' + $scope.assigns[assign].done;
			}
		}
		taskServ.update($scope.task);
	};

	$scope.log = function() {
		console.log($scope.task);
		console.log($scope.assigns);
	};
});