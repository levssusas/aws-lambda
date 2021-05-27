import { Connection } from 'typeorm';
import { UserRepository } from '../../../repositories/UserRepository';
import { AuthAccessDenied, AuthMaxTries } from './responses';
import * as bcrypt from 'bcrypt';
import { UserModel } from '../../../models/UserModel';
import { JWT } from '../../../libs/JWT';
import { Carbon } from '../../../libs/Carbon';
import { Logger } from '../../../libs/Logger';

interface LoginResult {
    user: UserModel;
    token: string;
}

interface UserData {
    uuid: string;
}

export class AuthAction {
    private connection: Connection;
    private repository: UserRepository;

    constructor(connection: Connection) {
        this.connection = connection;
        this.repository = connection.getCustomRepository(UserRepository);
    }

    async execute(username: string, password: string): Promise<LoginResult> {
        const user = await this.repository.getUserByUserName(username);
        if (!user) throw new AuthAccessDenied();
        let user_log_attempts = user.log_attempts;

        if(user.locked_until != null){
            if (Carbon.parse(user.locked_until, 'YYYY-MM-DD HH:mm:ss') > Carbon.now()){
                throw new AuthMaxTries();
            }else{
                user_log_attempts = 0;
                await this.repository.update(user.id, {
                    log_attempts: user_log_attempts,
                    locked_until: null
                });
            }
        }


        if (!bcrypt.compareSync(password, user.password)){
            const log_attempts = user_log_attempts + 1;
            await this.repository.update(user.id, { log_attempts: log_attempts });
            if(log_attempts >= 3){
                await this.repository.update(user.id, { locked_until: Carbon.now().add(10, 'minutes').format('YYYY-MM-DD HH:mm:ss') });
                throw new AuthMaxTries();
            }
            throw new AuthAccessDenied();
        }

        const token = await JWT.generateToken<UserData>({ uuid: user.uuid });

        return { user, token };
    }

    async createLockedUser(first_name: string, last_name: string, email: string, mobile: string, password: string, log_attempts: number, locked_until: string | null): Promise<UserModel> {
        const salt = bcrypt.genSaltSync(5);
        const hash = await bcrypt.hash(password, salt);

        return await UserModel.create({
            name: first_name + ' ' + last_name,
            email,
            mobile,
            password: hash,
            log_attempts: log_attempts,
            locked_until: locked_until,
        }).save();
    }


}
