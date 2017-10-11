const moment = require('moment');
const config = require('config');
const _ = require('lodash');

const APP_NAME = config['APP_NAME'];

const http = require('rest-apis');
const responseBuilder = require('response-builders');
const strings = require('strings')(APP_NAME);

const UTTERANCE_DATE_FORMAT = 'dddd, MMMM Do';

/**
 * Fullfils the intent by returning all the upcoming doctor appointments
 *
 * @param  {Object}   intent   Current intent in process
 * @param  {Object}   session  Session object
 * @param  {Function} callback Function to callback for fulfilling the intent
 * @return void
 */
function getAppointmentIntentHandler(intent, session, callback) {

    let shouldEndSession = true;
    let speechOutput = strings.FAILURE_MSG;
    let reprompt = strings.REPROMPT_MSG;
    const header = 'Upcoming Appointments';

    const endpoint = config["SERVER"]["ENDPOINTS"]["APPOINTMENT"];

    http.getJSON(endpoint, null, (err, appointments) => {

        if (!err) {
            speechOutput = "You have no upcoming appointments !";

            if (appointments.length > 0) {

                const apCountText = `You have ${appointments.length} upcoming appointment` + (appointments.length > 1 ? 's. ' : '. ');

                speechOutput = "";
                let totalAppointments = _.size(appointments);
                appointments.forEach((appointment, index) => {

                    const desc = appointment['description'];
                    const date = moment(appointment['from']).format(UTTERANCE_DATE_FORMAT);
                    const doc = "Dr. " + appointment['doctor']['first_name'] + " " + appointment['doctor']['last_name'];

                    const duration = moment.duration(moment(appointment['to']).diff(appointment['from'])).hours();

                    speechOutput += (index === 0 ? "First" : (index === totalAppointments - 1 ? "and last" : "Next"))
                        + ` is with ${doc} for ${desc} on ${date} for ${(duration || 1)} hour. `;
                });
                speechOutput = apCountText + speechOutput;
            }
        }
        callback(session.attributes, responseBuilder.buildSpeechletResponse(header, speechOutput, reprompt, true));
    });
}

module.exports = getAppointmentIntentHandler;