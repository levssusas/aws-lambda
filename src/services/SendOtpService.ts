import axios, { AxiosInstance } from 'axios';
import { Logger } from '../../src/Libs/Logger';

export class SendOtpService {
    private client: AxiosInstance;
    private secret: string;
    private key: string;

    constructor(secret: any, key: any) {
        this.secret = secret;
        this.key = key;

        this.client = axios.create({
            baseURL: process.env.WALLET_URL,
            timeout: 30000,
        });
    }

    async sendEmail(email: string): Promise<boolean> {
        const params = {
            key: this.key,
            secret: this.secret,
        };

        try {
            const result = await this.client.post('/auth', params);
            Logger.info('OTP.Token.SUCCESS', {
                status: result.status,
                response: result.data,
            });

            const token = result.data.access_token;
            const apiClientOtp = axios.create({
                baseURL: process.env.OTP_URL,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                timeout: 30000,
            });
            const otpResult = await apiClientOtp.post('/email', { 'email' : email });
            Logger.info('OTP.Token.SUCCESS', {
                status: otpResult.status,
                response: otpResult.data,
            });

            return true;
        } catch (error) {
            Logger.info('OTP.FAILED', {
                error,
            });

            return false;
        }

        return true;
    }

    async sendSMS(mobile: string): Promise<boolean> {
        const params = {
            key: this.key,
            secret: this.secret,
        };

        try {
            const result = await this.client.post('/auth', params);
            Logger.info('OTP.Token.SUCCESS', {
                status: result.status,
                response: result.data,
            });

            const token = result.data.access_token;
            const apiClientOtp = axios.create({
                baseURL: process.env.OTP_URL,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                timeout: 30000,
            });
            const otpResult = await apiClientOtp.post('/sms', { 'mobile' : mobile });
            Logger.info('OTP.Token.SUCCESS', {
                status: otpResult.status,
                response: otpResult.data,
            });

            return true;
        } catch (error) {
            Logger.info('OTP.FAILED', {
                error,
            });

            return false;
        }

        return true;
    }

    async verifyEmail(email: string, otp: number): Promise<boolean> {
        const params = {
            key: this.key,
            secret: this.secret,
        };

        try {
            const result = await this.client.post('/auth', params);
            Logger.info('OTP.Token.SUCCESS', {
                status: result.status,
                response: result.data,
            });

            const token = result.data.access_token;
            const apiClientOtp = axios.create({
                baseURL: process.env.OTP_URL,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                timeout: 30000,
            });
            const otpResult = await apiClientOtp.post('/email/verify', { 'email' : email });
            Logger.info('OTP.Token.SUCCESS', {
                status: otpResult.status,
                response: otpResult.data,
            });

            return true;
        } catch (error) {
            Logger.info('OTP.FAILED', {
                error,
            });

            return false;
        }

        return true;
    }
}
