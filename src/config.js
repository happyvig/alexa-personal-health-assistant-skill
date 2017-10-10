
module.exports = {

	"APP_NAME" : "Personal Health Assistant",

	"APP_ID"   : "<your_unique_amazon_skill_id>",

	"ENV" : "dev", 	// 'dev' | 'test' | 'prod'

	"SERVER" : {

		"URL" : "http://localhost:3100/",

		"ENDPOINTS" : {

			"APPOINTMENT" : "doctor_appointments.json",

			"PRESCRIPTION": "prescribed_medicines.json",

			"DOCTORS_LIST": "doctors.json",
		}
	}
}