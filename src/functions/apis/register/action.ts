import { Connection } from 'typeorm';
import { UserRepository } from '../../../repositories/UserRepository';
import { UserModel } from '../../../models/UserModel';
import { EmailExistError, MobileExistError, Error } from './responses';
import * as bcrypt from 'bcrypt';
import { SendOtpService } from '../../../services/SendOtpService';
// import axios, { AxiosInstance } from 'axios';

export class RegisterAction {
    private connection: Connection;
    private repository: UserRepository;
    // private services: SendOtpService;

    constructor(connection: Connection) {
        this.connection = connection;
        this.repository = connection.getCustomRepository(UserRepository);
    }

    async execute(first_name: string, last_name: string, email: string, mobile: string, password: string): Promise<UserModel> {
        const emailExist = await this.repository.checkUserEmail(email);
        if (emailExist) throw new EmailExistError();

        const mobileExist = await this.repository.checkUserMobile(mobile);
        if (mobileExist) throw new MobileExistError();

        // PUBLIC OTP
        const otp = new SendOtpService(process.env.CAAS_SECRET, process.env.CAAS_KEY);
        const resultEmail = await otp.sendEmail(email);
        if (!resultEmail) throw new Error();

        const salt = bcrypt.genSaltSync(5);
        const hash = await bcrypt.hash(password, salt);

        return await UserModel.create({
            name: first_name + ' ' + last_name,
            email,
            mobile,
            password: hash,
        }).save();

    }

    async getRandom(): Promise<UserModel> {
        const user = await this.repository.getRandomUser();
        if (!user) throw new Error();
        return user;
    }
}
