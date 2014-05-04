/**
 * Created by foad on 5/3/14.
 */

'use strict';

app.filter('checkmark', function() {
	return function(input) {
		return input ? '\u2713' : '\u2718';
	};
});