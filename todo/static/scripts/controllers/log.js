/**
 * Created by foad on 5/4/14.
 */
'use strict';

app.controller('LogCtrl', function($scope, $modalInstance, items, tastypieService) {
	$scope.items = items;

	var userServ = new tastypieService({
		apiUrl : '/api/v1/user/'
	});

	userServ.getList().then(function(ref) {
		$scope.users = ref.data;
	});

	$scope.close = function () {
		$modalInstance.dismiss('close');
	};
});