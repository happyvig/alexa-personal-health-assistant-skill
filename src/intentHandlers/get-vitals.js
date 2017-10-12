const moment = require('moment');
const config = require('config');
const _ = require('lodash');

const APP_NAME = config['APP_NAME'];

const http = require('rest-apis');
const responseBuilder = require('response-builders');
const strings = require('strings')(APP_NAME);

/**
 * Fulfills the intent by returning the vitals information like pressure, temperature, sugar level, pulse
 *
 * @param  {Object}   intent   Current intent in process
 * @param  {Object}   session  Session object
 * @param  {Function} callback Function to callback for fulfilling the intent
 * @return void
 */
function getVitalSummaryIntentHandler(intent, session, callback) {

    const shouldEndSession = true;
    let speechOutput = strings.FAILURE_MSG;
    let reprompt = strings.REPROMPT_MSG;
    const header = 'Your vital summary';

    const endpoint = config["SERVER"]["ENDPOINTS"]["VITAL_SUMMARY"];

    http.getJSON(endpoint, null, (err, vitals) => {

        if (!err) {
            speechOutput = `There is no data on your vitals as of now. Please try after some time.!`;

            if (vitals.length > 0) {
                vitals = vitals[0];
                let data = vitals['user_vital_log'];

                speechOutput = 'Your ';

                let attributes = ['sugar', 'pressure', 'temperature', 'pulse'];

                _.each(attributes, (attr) => {

                    let isAbnormal = vitals[attr+'_status'].toLowerCase() !== 'normal';

                    speechOutput += `${attr} level ${_.sample(['looks', 'is'])} ${vitals[attr+'_status']}`
                                        + (isAbnormal ? ` at around ${parseFloat(data[attr]).toFixed(2)}` : ``) + `, `;
                });
                speechOutput += '!!'
            }
        }
        callback(session.attributes, responseBuilder.buildSpeechletResponse(header, speechOutput, reprompt, true));
    });
}

module.exports = getVitalSummaryIntentHandler;