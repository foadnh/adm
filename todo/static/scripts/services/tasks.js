/**
 * Created by foad on 5/1/14.
 */

app.factory('Tasks', ['$resource', function($resource) {
	return $resource('/api/v1/task/:taskId?format=json');
}]);