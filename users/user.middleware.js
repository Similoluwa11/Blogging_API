const joi = require('joi')

const ValidateUserCreation = async (req, res, next) => {
    try {
        const schema = joi.object({
            username: joi.string().required().messages({"string.base": '"username" must be in "text"',"string.required": '"username" is required' }),
            password: joi.string().min(10).required().messages({"string.base": '"password" must be in "text"',"string.required": '"password" is required', "string.min": '"password" should have a minimum length of 10'}),
            email: joi.string().email().required().messages({"string.base": '"email" must be in "text"',"string.required": '"email" is required', "string.email": '"email" must be valid' }),
            firstname: joi.string().required().messages({"string.base": '"firstname" must be in "text"',"string.required": '"firstname" is required' }),
            lastname: joi.string().required().messages({"string.base": '"lastname" must be in "text"',"string.required": '"lastname" is required' }),
        })

        await schema.validateAsync(req.body, { abortEarly: true })
    
        next()
    } catch (error) {
        return res.status(422).json({
            message: error.message,
            success: false
        })
    }
}

const LoginValidation = async (req, res, next) => {
    try {
        const schema = joi.object({
            password: joi.string().required(),
            username: joi.string().required(),
        })

        await schema.validateAsync(req.body, { abortEarly: true })
    
        next()
    } catch (error) {
        return res.status(422).json({
            message: error.message,
            success: false
        })
    }
}


module.exports = {
    ValidateUserCreation,
    LoginValidation
}