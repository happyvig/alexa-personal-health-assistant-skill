# alexa-personal-health-assistant-skill

This Alexa Skill helps you keep track of your health by letting you know about your medical data like body vitals, appointments with your doctor, your prescriptions, etc., backed by a personal health assistant server.


## Background 

The necessary data for this Alexa Skill is provided by the [personal-healthcare-server](https://github.com/rajagopal28/healthcare-server).

This project (Alexa skill + backend server + web app + mobile app) was created as part of [submission](https://devpost.com/software/jackie-fkw3rn) for the [2017 HITLAB World Cup of Voice-Activated Technology in Diabetes presented by Novo Nordisk, an online hackathon on DevPost](https://2017hitlabworldcup.devpost.com)

*The 2017 HITLAB World Cup of Voice-Activated Technology in Diabetes presented by Novo Nordisk (the “Challenge”) is a competition to identify emerging technologies that use voice recognition and voice activation to support diabetes care and management. ... The HITLAB World Cup is an international challenge of unparalleled diversity where innovators present original solutions to pressing global healthcare challenges ...*


## About

This custom skill helps you keep track of your health by letting you know about your body vitals viz., glucose levels, pressure, pulse & temperature collected from your personal IOT medical devices (like smartwatches, smart glucometer, smart thermometers, etc.,), perform tasks like book appointments with your doctor, view or remind you about your booked appointments, keep track of your daily medicine prescriptions, etc.,

As of now, this skill is just built on top of the raw event, triggered from the AWS Lambda function by the speech input (to be re-written using AWS-SDK library later).


## Key Terminologies
- **Intents**: An intent represents an action that fulfills a user’s spoken request. Intents can optionally have arguments called   slots.
- **Sample utterances**: A set of likely spoken phrases mapped to the intents. This should include as many representative phrases as possible.
- **Custom slot types**: A representative list of possible values for a slot. Custom slot types are used for lists of items that are not covered by one of Amazon’s built-in slot types


## Folder Structure
- speechAssets                           (*speech input related artifacts*)
    - intentSchema.json                  (*intents vs slots vs sample utterence mapper*)
    - sampleUtterences.txt               (*input utterence sample texts for each intent*)
- src                                    (*main source JS files*)
    - intentHandlers                     (*intent handler modules*)
      - create-appointment.js              (*helps creating new doctor appointment*)
      - get-appointment.js                 (*helps getting saved appointments*)
      - get-prescription.js                (*helps retrieving daily prescriptions*)
      - get-vitals.js                      (*helps getting vital parameter data*) 
    - config.js                          (*project configuration like application id, server endpoints, etc.,*)
    - index.js                           (*main starter file that contains all intent handlers*)
    - package-lock.json                  (*auto-generated dependency tree specification for node package install optimizations*)
    - package.json                       (*project description and dependencies*)
    - response-builders.js               (*Alexa response builder helpers*)
    - rest-api.js                        (*http helpers*)
    - strings.js                         (*Alexa output message strings*)
    - utils.js                           (*common helpers*)
- .gitignore                             (*files to be ignored by Git ex: node_modules*)
- README.md                              (*project documentation*)

 ## Intents & Slots 
(doc in progress)

 ## Tests
(doc in progress)

 ## Future Enhancements
- More dialog mode conversations
- Port existing functionalities using the standard aws-sdk library
- Support for multiple languages
- Support for more intents
- Handle all possible negative cases gracefully

## References
- [https://github.com/alexa/skill-sample-nodejs-howto](https://github.com/alexa/skill-sample-nodejs-howto)
- [https://developer.amazon.com/docs/ask-overviews/build-skills-with-the-alexa-skills-kit.html](https://developer.amazon.com/docs/ask-overviews/build-skills-with-the-alexa-skills-kit.html)

 ## License
This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/happyvig/alexa-personal-health-assistant-skill/blob/master/LICENSE) file for details       