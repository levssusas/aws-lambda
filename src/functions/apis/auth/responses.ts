import { HttpResponse } from '../../../libs/Contracts/HttpResponse';

export class Responses {
    static STATUS_200: HttpResponse = {
        code: 200,
        message: 'Login successful',
    };
}

export class AuthAccessDenied {
    public code = 401;
    public message = 'Invalid username and password';
}

export class AuthMaxTries {
    public code = 423;
    public message = 'Account have reach max tries, Try again in 10 minutes.';
}
