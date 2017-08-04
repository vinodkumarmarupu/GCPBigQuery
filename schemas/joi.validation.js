const Joi = require('joi');

schema = Joi.object().keys({
	machine_Name: Joi.string(),
	app_Version: Joi.string(),
	app_Name: Joi.string(),
	vendor: Joi.string(),
	app_Installed_Date: Joi.date()
	
})
arrayJoi = Joi.array().items(schema)

module.exports = arrayJoi;