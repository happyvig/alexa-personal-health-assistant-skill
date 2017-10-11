/**
 *  ========================================
 *  Alexa skill : Personal Health Assistant
 *  ========================================
 */

const moment = require('moment');
const config = require('config');
const _ = require('lodash');

const APP_NAME = config['APP_NAME'];
const APP_ID = config['APP_ID'];
const ENV = config['ENV'];

const responseBuilder = require('response-builders');
const strings = require('strings')(APP_NAME);

const getAppointmentIntentHandler = require('intentHandlers/get-appointment');
const getPrescriptionIntentHandler = require('intentHandlers/get-prescription');
const createAppointmentHandler = require('intentHandlers/create-appointment');

/**
 * Environment related chores
 */

if (ENV !== 'dev' || ENV !== 'development') {
    console.log = _.noop;  // disable console logging
}

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
                context.succeed(responseBuilder.buildResponse(sessionAttributes, speechletResponse));
            });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request, event.session, (sessionAttributes, speechletResponse) => {
                context.succeed(responseBuilder.buildResponse(sessionAttributes, speechletResponse));
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

    let intent = intentRequest.intent;
    let intentName = intentRequest.intent.name;

    // dispatching custom intents to handlers here
    switch (intentName) {

        case "GetMyUpcomingAppointmentIntent":
            getAppointmentIntentHandler(intent, session, callback);
            break;

        case "GetTodaysPrescriptionIntent":
            getPrescriptionIntentHandler(intent, session, callback);
            break;

        case "CreateAppointmentIntent":
            createAppointmentHandler(intent, session, callback);
            break;

        case "AMAZON.YesIntent":
            handleYesIntent(intent, session, callback);
            break;

        case "AMAZON.NoIntent":
            handleNoIntent(intent, session, callback);
            break;

        case "AMAZON.HelpIntent":
            handleGetHelpIntent(intent, session, callback);
            break;

        case "AMAZON.StopIntent":
            handleFinishSessionRequest(intent, session, callback);
            break;

        case "AMAZON.CancelIntent":
            handleFinishSessionRequest(intent, session, callback);
            break;

        default:
            throw "Invalid intent";
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    // session cleanup logic goes here
}

/**
 * -----------------------
 * Default Intent Handlers
 * -----------------------
 */

function getWelcomeResponse(callback) {

    let speechOutput = strings.SKILL_INTRO_MSG;
    let reprompt = strings.REPROMPT_MSG;
    let header = APP_NAME;
    let shouldEndSession = false;

    let sessionAttributes = {
        "speechOutput": speechOutput,
        "repromptText": reprompt
    };

    callback(sessionAttributes, responseBuilder.buildSpeechletResponse(header, speechOutput, reprompt, shouldEndSession));
}

function handleYesIntent(intent, session, callback) {
    // handler for yes intent goes here
}

function handleNoIntent(intent, session, callback) {
    handleFinishSessionRequest(intent, session, callback);
}

function handleGetHelpIntent(intent, session, callback) {

    if (!session.attributes) {
        session.attributes = {};
    }

    const shouldEndSession = false;
    const speechOutput = strings.HELP_TEXT;
    const reprompt = speechOutput;

    callback(session.attributes, responseBuilder.buildSpeechletResponseWithoutCard(speechOutput, reprompt, shouldEndSession));
}

function handleFinishSessionRequest(intent, session, callback) {
    callback(session.attributes, responseBuilder.buildSpeechletResponseWithoutCard(strings.SKILL_END_MSG, "", true));
}