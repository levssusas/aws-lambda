import { HttpRequest } from '../../../libs/Contracts/HttpRequest';

export class RegisterRequest implements HttpRequest {
    first_name: string;
    last_name: string;
    email: string;
    mobile: string;
    password: string;
}
