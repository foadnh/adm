/**
 * Created by foad on 5/1/14.
 */

app.controller('UserRootCtrl', function($scope, $routeParams, tastypieService) {
	$scope.show = {
		submit: false
	};
	$scope.user = $routeParams.user;

	var taskServ = new tastypieService({
		apiUrl : '/api/v1/task/'
	});
	var rootServ = new tastypieService({
		apiUrl : '/api/v1/root/'
	});
	var update = function() {
		rootServ.getList().then(function(ref) {
			$scope.tasks = [];
			for(var i = 0; i < ref.data.length; i++) {
				taskServ.get(ref.data[i].taskId).then(function(ref) {
					if(ref.data.users.indexOf($scope.user) != -1) {
						$scope.tasks.push(ref.data);
					}
				});
			}
		});
	};
	update();

	$scope.taskSubmit = function() {
		$scope.task.users = $scope.user + ':0';
		taskServ.save($scope.task).then(function(ref) {
			console.log(ref.data.id);
			rootServ.save({taskId: Number(ref.data.id)}).then(function(refChild){
				$scope.show.submit = false;
				$scope.task = {
					title: '',
					detail: ''
				};
				update();
			});
		});
	};

});