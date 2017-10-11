const moment = require('moment');
const config = require('config');
const _ = require('lodash');

const APP_NAME = config['APP_NAME'];

const http = require('rest-apis');
const responseBuilder = require('response-builders');
const strings = require('strings')(APP_NAME);

const UTTERANCE_DATE_FORMAT = 'dddd, MMMM Do';

/**
 * Fullfills the intent by creating an appointment with the specified doctor at the specified time
 *
 * @param  {Object}   intent   Current intent in process
 * @param  {Object}   session  Session object
 * @param  {Function} callback Function to callback for fulfilling the intent
 * @return void
 */
function createAppointmentIntentHandler(intent, session, callback) {

    const shouldEndSession = true;
    let speechOutput = strings.FAILURE_MSG;
    const reprompt = strings.REPROMPT_MSG;
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

    http.getJSON(doctorsListEndpoint, {
        firstName: data.doctor.fname,
        lastName: data.doctor.lname
    }, (err, doctorsList) => {

        if (!err) {
            speechOutput = `No matching doctors found in the name of ${data.doctor.fname} ${data.doctor.lname}. Please try again.!`;

            if (_.size(doctorsList) > 0) {

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

                http.postJSON(createAppointmentEndPoint, appointmentParam, function (err, newAppointment) {

                    speechOutput = "Sorry, your appointment cannot be created. Please try again. !";

                    if (!err) {
                        if (_.size(newAppointment) > 0) {
                            let duration = moment.duration(moment(newAppointment['to']).diff(newAppointment['from'])).hours();
                            speechOutput = `Your appointment has been successfully created 
                                                with Dr. ${data.doctor.full} 
                                                for ${newAppointment['description']} 
                                                on ${moment(newAppointment['from']).format(UTTERANCE_DATE_FORMAT)} 
                                                for ${duration} hour !`;
                        }
                    }
                    speechOutput = progressText + speechOutput;
                    callback(session.attributes, responseBuilder.buildSpeechletResponse(header, speechOutput, reprompt, true));
                });
            } else {
                callback(session.attributes, responseBuilder.buildSpeechletResponse(header, speechOutput, reprompt, true));
            }
        }
    });
}

module.exports = createAppointmentIntentHandler;