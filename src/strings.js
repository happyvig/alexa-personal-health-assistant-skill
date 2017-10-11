/**
 * Utterance messages
 */
function messageStrings(APP_NAME) {

    return {

        SKILL_INTRO_MSG: `Welcome to ${APP_NAME}! You can ask me about your medical data like prescriptions, doctor appointments, etc.,`,

        HELP_TEXT: `You can ask me about your medical data like prescriptions, doctor appointments, etc.,`,

        FAILURE_MSG: `Something went wrong. Please try again.`,

        SKILL_END_MSG: `Goodbye! Thank you for using ${APP_NAME}.!`,

        REPROMPT_MSG: messageStrings.HELP_TEXT + `What do you want to know about ?`
    }
}

module.exports = messageStrings;