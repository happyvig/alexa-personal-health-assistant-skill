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
| Term  |  Description   |
| :---: | --- |
| **Intents** | An intent represents an action that fulfills a user’s spoken request. Intents can optionally have arguments called   slots. |
| **Sample utterances** | A set of likely spoken phrases mapped to the intents. This should include as many representative phrases as possible. |
| **Custom slot types** | A representative list of possible values for a slot. Custom slot types are used for lists of items that are not covered by one of Amazon’s built-in slot types |

## Folder Structure

| File                                          | Description                                                                |
| --- | --- |
| /speechAssets                                 |  *speech input related artifacts*                                          |
| /speechAssets/intentSchema.json               |  *intents vs slots vs sample utterance mapper*                             |
| /speechAssets/sampleUtterances.txt            |  *input utterance sample texts for each intent*                            |
| /src                                          |  *main source JS files*                                                    |
| /src/intentHandlers                           |  *intent handler modules*                                                  |
| /src/intentHandlers/create-appointment.js     |  *helps creating new doctor appointment*                                   |
| /src/intentHandlers/get-appointment.js        |  *helps getting saved appointments*                                        |
| /src/intentHandlers/get-prescription.js       |  *helps retrieving daily prescriptions*                                    |
| /src/intentHandlers/get-vitals.js             |  *helps getting vital parameter data*                                      |
| /src/config.js                                |  *project configuration like application id, server endpoints, etc.,*      |
| /src/index.js                                 |  *main starter file that contains all intent handlers*                     |
| /src/package-lock.json                        |  *auto-generated dependency tree specification*                            |
| /src/package.json                             | *project description and dependencies*                                     |
| /src/response-builders.js                     |  *Alexa response builder helpers*                                          |
| /src/rest-api.js                              |  *http helpers*                                                            |
| /src/strings.js                               |  *Alexa output message strings*                                            |
| /src/utils.js                                 | *common helpers*                                                           |
| /.gitignore                                   |  *files to be ignored by Git ex: node_modules*                             |
| /README.md                                    |  *project documentation*                                                   |

 ## Intents & Slots 
Supported intents : 
- **CreateAppointmentIntent**: Helps creating an appointment with your doctor. 
    
    Sample utterance: *Schedule an appointment with doctor Charlie Harris on next Sunday at 5PM for diabetes regular checkup.*
    
    Alexa output: *Creating appointment now. Your appointment has been successfully created with Dr. Charlie Harris for diabetes regular checkup on Sunday, Oct 28 for 1 hour !*

- **GetAppointmentIntent**: Helps getting to know your booked appointments with your doctor.

    Sample utterance: *When is my next appointment ?*
    
    Alexa output: *You have 2 upcoming appointment. First is with Dr. Charlie Harris for diabetes regular checkup on Sunday, Oct 28 for 1 hour. Last is with Dr. Walter Bishop for precognotion checkup on Sunday, Feb 4 for 1 hour.*

- **GetPrescriptionIntent** : Helps to know about your day's prescription.

    Sample utterances: 
    - *What medicines should I be taking now ?*
    - *What medicines should I be taking today ?*

    Alexa output: *You have 2 medicines prescribed today. First is Precose to be taken after breakfast, after dinner. Last is Glyset to be taken after lunch. *

- **GetVitalsIntent** : Helps to know  how your vitals are doing.

    Sample utterances : *How are my vitals looking ?*

    Alexa output: *Your sugar level is high at around 140/95. Your pressure looks normal. Your temperature is normal. Your pulse looks normal.*

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