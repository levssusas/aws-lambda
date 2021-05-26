import { Connection } from 'typeorm';
import { UserRepository } from '../../../repositories/UserRepository';
import { AuthAccessDenied } from './responses';
import * as bcrypt from 'bcrypt';
import { UserModel } from '../../../models/UserModel';
import { JWT } from '../../../libs/JWT';

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

        if (!bcrypt.compareSync(password, user.password)){
            throw new AuthAccessDenied();
        }

        const token = await JWT.generateToken<UserData>({ uuid: user.uuid });

        return { user, token };
    }
}
