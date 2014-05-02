/**
 * Created by foad on 5/1/14.
 */

app.filter('checkmark', function() {
	return function(percent) {
		return percent == 100 ? '\u2713' : '\u2718';
	};
});