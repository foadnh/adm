/**
 * Created by foad on 5/1/14.
 */

app.controller('TasksCtrl', function($scope, tastypieService) {
	$scope.show = {
		submit: false
	};

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
					$scope.tasks.push(ref.data);
				});
			}
		});
	};
	update();

	$scope.taskSubmit = function() {
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
	};

});