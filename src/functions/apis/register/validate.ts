import { Validation } from '../../../libs/Validation';
import { joi } from '../../../libs/Joi';
import { RegisterRequest } from './requests';

export default (request: RegisterRequest): RegisterRequest => {
    const schema = joi
        .object({
            first_name: joi.string().required(),
            last_name: joi.string().required(),
            email: joi.string().required(),
            mobile: joi.string().required(),
            password: joi.string().required(),
        })
        .required();

    const validate = new Validation<RegisterRequest>(schema);
    return validate.validate(request);
};
