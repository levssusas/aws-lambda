import { TAGS_NAMES } from '../config';
import { METHODS } from '../default';
import { LANGUAGE } from '../language';

const key = 'register';
const method = METHODS.post;
const tag = TAGS_NAMES.RESOURCES;
const summary = 'User new registration';
const parameters = {
    body: {
        schema: '<Definition Name>',
        example: {
            first_name: 'John',
            last_name: 'Doe',
            email: 'john_doe@example.com',
            mobile: '09361030179',
            password: 'password',
        },
    },
};
const responses = {
    409: {
        description: 'Email/Mobile already exist',
        schema: 'Response422',
        examples: {
            EMAIL_EXIST: {
                description: 'Email exists',
                value: {
                    code: 409,
                    message: 'Email already exist',
                },
            },
            MOBILE_EXIST: {
                description: 'Mobile exists',
                value: {
                    code: 409,
                    message: 'Mobile already exist',
                },
            },
        },
    },
    422: {
        description: LANGUAGE.RESPONSES.DEFAULT['422'],
        schema: 'Response422',
        example: {
            code: 422,
            message: 'Parameter error: Please provide required parameter',
            errors: {
                name: 'name is required',
                email: 'email is required',
                mobile: 'mobile is required',
                password: 'password is required',
            },
        },
    },
    200: {
        description: '<Success message description>',
        schema: '<ResponseNameHere>',
        example: {
            code: 200,
            message: 'Registration successful',
        },
    },
};

module.exports.default = {
    key,
    method,
    tag,
    summary,
    parameters,
    responses,
};
