
const request = require('request-promise');
const _  = require('lodash');
const config  = require('config');
const utils = require('utils');

let http = {

	getUrl: function(endpoint, queryParamsObj) {
	    return config['SERVER']['URL'] + endpoint + "?" + utils.objectToQueryString(_.extend({}, { userId: 1 }, queryParamsObj));
	},

	postJSON: function(endpoint, bodyParam, cb) {
	  const options = {
	        method: 'POST',
	        uri: http.getUrl(endpoint),
	        body: bodyParam
	    };
	    http.makeRequest(options, cb);
	}, 

	 getJSON: function(endpoint, queryParamsObj, cb) {
	    const options = {
	        method: 'GET',
	        uri: http.getUrl(endpoint, queryParamsObj)
	    };
	    http.makeRequest(options, cb);
	}, 

 	makeRequest: function(options, cb) {
	    options = _.extend({}, options, { 
	        json: true,
	        headers: {
	            'User-Agent': 'Alexa-Lambda' 
	        }
	    });
	    console.log(` >>>>> Making ${options.method} request to ${options.uri}`);
	    request(options)
	        .then((res) => { 
	            console.log(`makeRequest::Response : ${JSON.stringify(res)}`);
	            cb(null, res);
	        })
	        .catch((err) => {
	            console.log(`makeRequest::Error : ${JSON.stringify(err)}`);
	            cb(err, null);
	        });
	}
};

module.exports = http;	