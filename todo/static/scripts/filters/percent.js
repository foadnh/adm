/**
 * Created by foad on 5/1/14.
 */

app.filter('percent', function() {
	return function(percent) {
		if (percent == 100) {
			return '\u2713';
		} else if (percent == 0) {
			return '\u2718';
		} else {
			return percent + ' %';
		}
	};
});