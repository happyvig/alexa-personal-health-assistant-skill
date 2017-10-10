/**
 *  ========================================
 *  Alexa skill : Personal Health Assistant
 *  ========================================
 */
 
const request = require('request-promise');
const moment  = require('moment');
const config  = require('./config');
const _  = require('lodash');
 
const APP_NAME = config['APP_NAME']; 
const APP_ID   = config['APP_ID'];
const ENV = config['ENV'];

/** 
 * Environment related chores
 */
 
if(ENV !== 'dev' || ENV !== 'development') {
  console.log = _.noop;  // disable console logging
}

const UTTERANCE_DATE_FORMAT = 'dddd, MMMM Do';

/** 
 * Utterance messages
 */
const SKILL_INTRO_MSG = `Welcome to ${APP_NAME}! You can ask me about your medical data like prescriptions, doctor appointments, etc.,`;
const HELP_TEXT       = `You can ask me about your medical data like prescriptions, doctor appointments, etc.,`;
const FAILURE_MSG     = `Something went wrong. Please try again.`;
const SKILL_END_MSG   = `Goodbye! Thank you for using ${APP_NAME}.!`
const REPROMPT_MSG    =  HELP_TEXT + `What do you want to know about ?`;

exports.handler = function (event, context) {

    try {

    	/**
         * Added skill's application ID check to prevent someone else from 
         * configuring a skill that sends requests to this function.
         */
        if (event.session.application.applicationId !== APP_ID) {
            context.fail("Invalid Application ID");
        }

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request, event.session, (sessionAttributes, speechletResponse) => { 
                context.succeed(buildResponse(sessionAttributes, speechletResponse));
            });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request, event.session, (sessionAttributes, speechletResponse) => {
                context.succeed(buildResponse(sessionAttributes, speechletResponse));
            });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    // session init logic goes here
}

/**
 * Called when the user invokes the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {

    let intent = intentRequest.intent
    let intentName = intentRequest.intent.name;

    // dispatching custom intents to handlers here
    try {
        switch(intentName){

            case "GetMyUpcomingAppointmentIntent" : handleGetMyUpcomingAppointmentIntent(intent, session, callback); break;

            case "GetTodaysPrescriptionIntent"    : handleGetTodaysPrescriptionIntent(intent, session, callback);    break;
            
            case "CreateAppointmentIntent"        : handleCreateAppointmentIntent(intentRequest, intent, session, callback);        break;

            case "AMAZON.YesIntent"               : handleYesIntent(intent, session, callback);                      break;
            
            case "AMAZON.NoIntent"                : handleNoIntent(intent, session, callback);                       break;
            
            case "AMAZON.HelpIntent"              : handleGetHelpIntent(intent, session, callback);                  break;

            case "AMAZON.StopIntent"              : handleFinishSessionRequest(intent, session, callback);           break;
            
            case "AMAZON.CancelIntent"            : handleFinishSessionRequest(intent, session, callback);           break;
            
            default                               : throw "Invalid intent";
         }
    } catch(e) {
        console.log("ERROR: " + JSON.stringify(e));
    } 
    
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {

}

/**
 * -----------------------
 * Custom Intent Handlers
 * -----------------------
 */

function getWelcomeResponse(callback) {

    let speechOutput = SKILL_INTRO_MSG;
    let reprompt = REPROMPT_MSG;
    let header = APP_NAME;
    let shouldEndSession = false;

    let sessionAttributes = {
        "speechOutput" : speechOutput,
        "repromptText" : reprompt
    };

    callback(sessionAttributes, buildSpeechletResponse(header, speechOutput, reprompt, shouldEndSession));
}

/**
 * Fullfils the intent by returning all the upcoming doctor appointments
 * 
 * @param  {Object}   intent   Current intent in process
 * @param  {Object}   session  Session object
 * @param  {Function} callback Function to callback for fulfilling the intent
 * @return void              
 */
function handleGetMyUpcomingAppointmentIntent(intent, session, callback) {

    let shouldEndSession = true;
    let speechOutput = FAILURE_MSG;
    let reprompt = '';
    const header = 'Upcoming Appointments';

    const endpoint = config["SERVER"]["ENDPOINTS"]["APPOINTMENT"];

    getJSON(endpoint, null, (err, appointments) => {

        if(!err) {
            speechOutput = "You have no upcoming appointments !";

            if(appointments.length > 0) {

                const apCountText = `You have ${appointments.length} upcoming appointment` + (appointments.length > 1 ? 's. ' : '. ');

                speechOutput = "";
                let totalAppointments = _.size(appointments);
                appointments.forEach((appointment, index) => {

                    const desc = appointment['description'];
                    const date = moment(appointment['from']).format(UTTERANCE_DATE_FORMAT);
                    const doc = "Dr. " + appointment['doctor']['first_name'] + " " + appointment['doctor']['last_name']

                    const duration = moment.duration(moment(appointment['to']).diff(appointment['from'])).hours();

                    speechOutput +=  (index === 0 ? "First" : ( index === totalAppointments-1 ? "and last" : "Next")) 
                                        + ` is with ${doc} for ${desc} on ${date} for ${(duration || 1)} hour. `;
                });
                speechOutput = apCountText + speechOutput;
            } 
        } 
        callback(session.attributes, buildSpeechletResponse(header, speechOutput, reprompt, true));
    });
}

/**
 * Fullfills the intent by returning all the prescriptions for the day
 * 
 * @param  {Object}   intent   Current intent in process
 * @param  {Object}   session  Session object
 * @param  {Function} callback Function to callback for fulfilling the intent
 * @return void
 */
function handleGetTodaysPrescriptionIntent(intent, session, callback) {

    const time = intent.slots.Time.value.toLowerCase();
    const shouldEndSession = true;
    let speechOutput = FAILURE_MSG;
    let reprompt = '';
    const header = 'Prescriptions';

    const endpoint = config["SERVER"]["ENDPOINTS"]["PRESCRIPTION"];

    getJSON(endpoint, {time: time}, (err, prescriptions) => {

        if(!err) {
            speechOutput = `You have no medicines prescribed for ${time} !`;

            if(prescriptions.length > 0) {

                const presCountText = `You have ${prescriptions.length} medicine` + (prescriptions.length > 1 ? 's ' : ' ') + ` prescribed ${time}. `;

                let takingTimes = [ "before_breakfast", "after_breakfast", 
                                      "before_lunch", "after_lunch", 
                                      "before_dinner", "after_dinner" ];

                speechOutput = "";
                let totalPrescriptions = _.size(prescriptions);
                _.each(prescriptions, (prescriptionData, index) => {

                    let medText = prescriptionData['medicine']['name'] + " " + prescriptionData['medicine']['medicine_type'];

                    let takingTimeValues = _.pick(prescriptionData, takingTimes);
                    takingTimeValues = _.pickBy(takingTimeValues, (val) => { return val; });
                    let takingTimesText = _.keys(takingTimeValues).join('$').split('_').join(' ').split('$').join(', ');
                    let i = takingTimesText.lastIndexOf(', '); // inject 'and' in place of last ','
                    takingTimesText = takingTimesText.substring(0, i) + ' and' + takingTimesText.substring(i+1)

                    speechOutput +=  (index === 0 ? "First" : ( index === totalPrescriptions-1 ? "and last" : "Next")) 
                                        + ` is ${medText} to be taken ${takingTimesText}. `;
                });
                speechOutput = presCountText + speechOutput;
            } 
        } 
        callback(session.attributes, buildSpeechletResponse(header, speechOutput, reprompt, true));
    });
}

/**
 * Fullfills the intent by creating an appointment with the specified doctor at the specified time
 * 
 * @param  {Object}   intent   Current intent in process
 * @param  {Object}   session  Session object
 * @param  {Function} callback Function to callback for fulfilling the intent
 * @return void
 */
function handleCreateAppointmentIntent(intentRequest, intent, session, callback) {

    const shouldEndSession = true;
    let speechOutput = FAILURE_MSG;
    const reprompt = '';
    const header = 'New Appointment';

    const doctorsListEndpoint = config["SERVER"]["ENDPOINTS"]["DOCTORS_LIST"];
    
    const data = {
        doctor: {
            fname: intent.slots.DoctorFName.value,
            lname: intent.slots.DoctorLName.value,
            full: intent.slots.DoctorFName.value + " " + intent.slots.DoctorLName.value
        },
        date: intent.slots.ApDate.value,
        time: intent.slots.ApTime.value,
        desc: intent.slots.ApDescription.value
    };

    getJSON(doctorsListEndpoint, { firstName: data.doctor.fname, lastName: data.doctor.lname }, (err, doctorsList) => {

        if(!err) {
            speechOutput = `No matching doctors found in the name of ${data.doctor.fname} ${data.doctor.lname}. Please try again.!`;

            if(_.size(doctorsList) > 0) {

                let progressText = "Creating your appointment now...";
                speechOutput = "";

                let appointmentStartTime = data.date + " " + data.time;
                let appointmentEndTime = moment(appointmentStartTime).add(1, 'hours').format('YYYY-MM-DD HH:mm');

                // Proceed with appointment creation
                
                const createAppointmentEndPoint = config["SERVER"]["ENDPOINTS"]["APPOINTMENT"];
                let appointmentParam = {
                    "doctor_appointment": {
                        "description": data.desc,
                        "user_id": 1,
                        "doctor_id": doctorsList[0].id,
                        "from": appointmentStartTime,
                        "to": appointmentEndTime
                    }
                };

                postJSON(createAppointmentEndPoint, appointmentParam, function(err, newAppointment) {

                    speechOutput = "Your appointment was not created. Please try again. !";

                    if(!err) {
                        if(_.size(newAppointment) > 0) {
                            let duration = moment.duration(moment(newAppointment['to']).diff(newAppointment['from'])).hours();
                            speechOutput = `Your appointment has been successfully created 
                                                with Dr. ${data.doctor.full} 
                                                for ${newAppointment['description']} 
                                                on ${moment(newAppointment['from']).format(UTTERANCE_DATE_FORMAT)} 
                                                for ${duration} hour !`;
                        } 
                    }
                    speechOutput = progressText + speechOutput;
                    callback(session.attributes, buildSpeechletResponse(header, speechOutput, reprompt, true));
                });
            } else {
                callback(session.attributes, buildSpeechletResponse(header, speechOutput, reprompt, true));
            }
        } 
    });
}

function handleYesIntent(intent, session, callback) {
    // handler for yes intent goes here
}

function handleNoIntent(intent, session, callback) {
    handleFinishSessionRequest(intent, session, callback);
}

function handleGetHelpIntent(intent, session, callback) {
    
    if(!session.attributes) {
        session.attributes = {};
    }

    const shouldEndSession = false;
    const speechOutput = HELP_TEXT;
    const reprompt = speechOutput;

    callback(session.attributes, buildSpeechletResponseWithoutCard(speechOutput, reprompt, shouldEndSession));
}

function handleFinishSessionRequest(intent, session, callback) {
    callback(session.attributes, buildSpeechletResponseWithoutCard(SKILL_END_MSG, "", true));
}

/**
 * --------------------
 * API Request Helpers
 * --------------------
 */

function postJSON(endpoint, bodyParam, cb) {
  const options = {
        method: 'POST',
        uri: getUrl(endpoint),
        body: bodyParam
    };
    makeRequest(options, cb);
} 

function getJSON(endpoint, queryParamsObj, cb) {
    const options = {
        method: 'GET',
        uri: getUrl(endpoint, queryParamsObj)
    };
    makeRequest(options, cb);
} 

function makeRequest(options, cb) {
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

function objectToQueryString(obj) {
    const qs = _.reduce(obj, function(result, value, key) {
        return (!_.isNull(value) && !_.isUndefined(value)) ? (result += key + '=' + value + '&') : result;
    }, '').slice(0, -1);
    return qs;
};

function getUrl(endpoint, queryParamsObj) {
    return config['SERVER']['URL'] + endpoint + "?" + objectToQueryString(_.extend({}, { userId: 1 }, queryParamsObj));
}

function capitalizeFirst(s) {
    return s.charAt(0).toUpperCase() + s.slice(1)
}

/**
 * ------------------------
 * Alexa Response Builders
 * ------------------------
 */

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: title,
            content: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildSpeechletResponseWithoutCard(output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}