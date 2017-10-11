const moment = require('moment');
const config = require('config');
const _ = require('lodash');

const APP_NAME = config['APP_NAME'];

const http = require('rest-apis');
const responseBuilder = require('response-builders');
const strings = require('strings')(APP_NAME);

/**
 * Fullfills the intent by returning all the prescriptions for the day
 *
 * @param  {Object}   intent   Current intent in process
 * @param  {Object}   session  Session object
 * @param  {Function} callback Function to callback for fulfilling the intent
 * @return void
 */
function getPrescriptionIntentHandler(intent, session, callback) {

    const time = intent.slots.Time.value.toLowerCase();
    const shouldEndSession = true;
    let speechOutput = strings.FAILURE_MSG;
    let reprompt = strings.REPROMPT_MSG;
    const header = 'Your prescriptions';

    const endpoint = config["SERVER"]["ENDPOINTS"]["PRESCRIPTION"];

    http.getJSON(endpoint, {time: time}, (err, prescriptions) => {

        if (!err) {
            speechOutput = `You have no medicines prescribed for ${time} !`;

            if (prescriptions.length > 0) {

                const presCountText = `You have ${prescriptions.length} medicine` + (prescriptions.length > 1 ? 's ' : ' ') + ` prescribed ${time}. `;

                let takingTimes = ["before_breakfast", "after_breakfast",
                    "before_lunch", "after_lunch",
                    "before_dinner", "after_dinner"];

                speechOutput = "";
                let totalPrescriptions = _.size(prescriptions);
                _.each(prescriptions, (prescriptionData, index) => {

                    let medText = prescriptionData['medicine']['name'] + " " + prescriptionData['medicine']['medicine_type'];

                    let takingTimeValues = _.pick(prescriptionData, takingTimes);
                    takingTimeValues = _.pickBy(takingTimeValues, (val) => {
                        return val;
                    });
                    let takingTimesText = _.keys(takingTimeValues).join('$').split('_').join(' ').split('$').join(', ');
                    let i = takingTimesText.lastIndexOf(', '); // inject 'and' in place of last ','
                    takingTimesText = takingTimesText.substring(0, i) + ' and' + takingTimesText.substring(i + 1);

                    speechOutput += (index === 0 ? "First" : (index === totalPrescriptions - 1 ? "and last" : "Next"))
                        + ` is ${medText} to be taken ${takingTimesText}. `;
                });
                speechOutput = presCountText + speechOutput;
            }
        }
        callback(session.attributes, responseBuilder.buildSpeechletResponse(header, speechOutput, reprompt, true));
    });
}

module.exports = getPrescriptionIntentHandler;