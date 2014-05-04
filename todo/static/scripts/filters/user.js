/**
 * Created by foad on 5/3/14.
 */

'use strict';

app.filter('user', function() {
	return function(input, id) {
		if (input == undefined) {
			return;
		}
		var result;
		angular.forEach(input, function(item) {
			if(item.id == id) {
				result = item.username;
			}
		});
		return result;
	};
});