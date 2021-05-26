import { execute } from './handler';
import { ApiGatewayEvent } from '../../../libs/Contracts/ApiGatewayEvent';
import { AuthRequest } from './requests';
import * as faker from 'faker';
import { Databases } from '../../../libs/Mysql';
import { AuthAction } from './action';
import { Logger } from '../../../libs/Logger';
import { Carbon } from '../../../libs/Carbon';

test('422: PARAMETER ERROR', async () => {
    const event: ApiGatewayEvent = {
        body: JSON.stringify(<AuthRequest>{
            username: '',
            password: '',
        }),
    };

    const result = await execute(event);
    const response = JSON.parse(result.body);

    expect(result).toHaveProperty('statusCode');
    expect(result).toHaveProperty('body');
    expect(response).toHaveProperty('code');
    expect(response).toHaveProperty('message');
    expect(response).toHaveProperty('errors');
    expect(response).toHaveProperty('errors.username');
    expect(response).toHaveProperty('errors.password');

    expect(result.statusCode).toBe(422);
    expect(response.code).toBe(422);
});

test('423: MAX TRIES', async () => {
    const connection = await Databases.getConnection();
    const action = new AuthAction(connection);
    const lockedUser = await action.createLockedUser(
       faker.name.firstName(),
       faker.name.firstName(),
       faker.internet.email(),
       `09${faker.random.number(999999999).toString().padStart(9, '0')}`,
       'password',
       2,
       null
    );
    Logger.info('test: ', { lockedUser });
    const event: ApiGatewayEvent = {
        body: JSON.stringify(<AuthRequest>{
            username: lockedUser.email,
            password: 'wronng_password',
        }),
    };

    const result = await execute(event);
    const response = JSON.parse(result.body);

    expect(result).toHaveProperty('statusCode');
    expect(result).toHaveProperty('body');
    expect(response).toHaveProperty('code');
    expect(response).toHaveProperty('message');

    expect(result.statusCode).toBe(423);
    expect(response.code).toBe(423);
});

test('401: ACCESS DENIED', async () => {
    const event: ApiGatewayEvent = {
        body: JSON.stringify(<AuthRequest>{
            username: faker.internet.email(),
            password: faker.random.alphaNumeric(10),
        }),
    };

    const result = await execute(event);
    const response = JSON.parse(result.body);

    expect(result).toHaveProperty('statusCode');
    expect(result).toHaveProperty('body');
    expect(response).toHaveProperty('code');
    expect(response).toHaveProperty('message');

    expect(result.statusCode).toBe(401);
    expect(response.code).toBe(401);
});

test('200: LOCK EXPIRES', async () => {
    const connection = await Databases.getConnection();
    const action = new AuthAction(connection);
    const lockedUser = await action.createLockedUser(
       faker.name.firstName(),
       faker.name.firstName(),
       faker.internet.email(),
       `09${faker.random.number(999999999).toString().padStart(9, '0')}`,
       'password',
       3,
       Carbon.nowFormatted(),
    );
    Logger.info('test: ', { lockedUser });
    const event: ApiGatewayEvent = {
        body: JSON.stringify(<AuthRequest>{
            username: lockedUser.email,
            password: 'password',
        }),
    };

    const result = await execute(event);
    const response = JSON.parse(result.body);

    expect(result).toHaveProperty('statusCode');
    expect(result).toHaveProperty('body');
    expect(response).toHaveProperty('code');
    expect(response).toHaveProperty('message');

    expect(result.statusCode).toBe(200);
    expect(response.code).toBe(200);
});

test('200: SUCCESS USING EMAIL', async () => {
    const event: ApiGatewayEvent = {
        body: JSON.stringify(<AuthRequest>{
            username: 'example@example.com',
            password: 'password',
        }),
    };

    const result = await execute(event);
    const response = JSON.parse(result.body);

    expect(result).toHaveProperty('statusCode');
    expect(result).toHaveProperty('body');
    expect(response).toHaveProperty('code');
    expect(response).toHaveProperty('message');
    expect(response).toHaveProperty('user');
    expect(response).toHaveProperty('user.name');
    expect(response).toHaveProperty('user.email');
    expect(response).toHaveProperty('user.mobile');

    expect(result.statusCode).toBe(200);
    expect(response.code).toBe(200);
});

test('200: SUCCESS USING MOBILE', async () => {
    const event: ApiGatewayEvent = {
        body: JSON.stringify(<AuthRequest>{
            username: '09123456789',
            password: 'password',
        }),
    };

    const result = await execute(event);
    const response = JSON.parse(result.body);

    expect(result).toHaveProperty('statusCode');
    expect(result).toHaveProperty('body');
    expect(response).toHaveProperty('code');
    expect(response).toHaveProperty('message');
    expect(response).toHaveProperty('user');
    expect(response).toHaveProperty('user.name');
    expect(response).toHaveProperty('user.email');
    expect(response).toHaveProperty('user.mobile');

    expect(result.statusCode).toBe(200);
    expect(response.code).toBe(200);
});
