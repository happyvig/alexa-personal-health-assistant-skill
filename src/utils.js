
let _ = require('lodash');

let utils = {

	objectToQueryString: function(obj) {
	    let qs = _.reduce(obj, function(result, value, key) {
	        return (!_.isNull(value) && !_.isUndefined(value)) ? (result += key + '=' + value + '&') : result;
	    }, '').slice(0, -1);
	    return qs;
	},
	
	capitalizeFirst: function(s) {
	    return s.charAt(0).toUpperCase() + s.slice(1);
	}
};

module.exports = utils;