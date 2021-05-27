import { EntityRepository, Repository } from 'typeorm';
import { UserModel } from '../models/UserModel';

@EntityRepository(UserModel)
export class UserRepository extends Repository<UserModel> {
    async getUserByUserName(username: string): Promise<UserModel | undefined> {
        return this.createQueryBuilder('users')
            .where('users.email = :username', { username })
            .orWhere('users.mobile = :username', { username })
            .getOne();
    }

    async getRandomUser(): Promise<UserModel | undefined> {
        return this.createQueryBuilder('users')
            .orderBy('rand()')
            .getOne();
    }

    async checkUserEmail(email: string): Promise<boolean> {
        const emailExist = await this.find({
            where: {
                email,
            },
        });
        return emailExist.length > 0;
    }

    async checkUserMobile(mobile: string): Promise<boolean> {
        const mobileExist = await this.find({
            where: {
                mobile,
            },
        });
        return mobileExist.length > 0;
    }
}
