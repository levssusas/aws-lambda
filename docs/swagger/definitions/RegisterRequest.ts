import { TYPES } from '../default';

module.exports.default = {
    RegisterRequest: {
        first_name: {
            type: TYPES.string,
            description: "User's first name",
        },
        last_name: {
            type: TYPES.string,
            description: "User's last name",
        },
        email: {
            type: TYPES.string,
            description: "User's email",
        },
        mobile: {
            type: TYPES.string,
            description: "User's mobile",
        },
        password: {
            type: TYPES.string,
            description: "User's account password",
        },
    },
};
