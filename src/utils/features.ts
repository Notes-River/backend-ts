import { createTransport, Transporter, SendMailOptions, SentMessageInfo } from 'nodemailer';
import { createClient, } from 'redis';
import { DecodedToken, RedisGet, RedisSet } from './type';
import { sign, verify } from 'jsonwebtoken';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import { config } from 'dotenv';

config({ path: __dirname + '../../.env' });

export const log = console.log;
export const accessKey = process.env.JWT_SECRET as string;
const secretKey = process.env.JWT_SECRET as string;

const mailGateWays: Transporter = createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    }
});

export const sendMail = async (data: SendMailOptions) => {
    data.from = process.env.EMAIL;
    try {
        let sended: SentMessageInfo = await mailGateWays.sendMail(data);
        log(sended);
    } catch (error) {
        log('error found : ', error);
    }
}

export const setData: Function = async (key: string, data: any, expire: number) => {
    let client = createClient();
    try {
        await client.connect();
        await client.set(key, data, { EX: expire });
        return true;
    } catch (error) {
        throw error;
    } finally {
        console.log('closing connection to redis server');
        client.quit();
    }
}

export const getData: Function = async (key: string) => {
    let client = createClient();
    try {
        await client.connect();
        let d: any = await client.get(key);
        return d;
    } catch (error) {
        throw error;
    } finally {
        client.quit();
    }
}

export const deleteRedisData = async (key: string) => {
    let client = createClient();
    try {
        await client.connect();
        let d: any = await client.del(key);
        console.log('data deleted from redis server with key' + key);
    } catch (error) {
        throw error;
    } finally {
        client.quit();
    }
}

export const generatetoken: Function = (id: string) => {

    if (secretKey && accessKey)
        return sign({ _id: id, accessKey }, secretKey, { expiresIn: 60 * 60 * 24 * 7 }).toString();
    else return null;
}

export const decodeToken: Function = (token: string) => {
    let decode: any = null;
    try {
        decode = verify(token, secretKey);
        let id = decode._id;
        let data: DecodedToken = { _id: decode._id, token: token, access: accessKey };
        return data;
    } catch (error) {
        throw error;
    }
};

export const encryptPassword = (password: string) => {
    try {
        let salt = genSaltSync(10);
        let hash = hashSync(password, salt);
        return hash;
    } catch (error) {
        throw error;
    }
}


export const compareEncryptedPassword = (originalPassword: string, encryptedPassword: string) => {
    return compareSync(originalPassword, encryptedPassword);
}

export const validateToken = (token: string) => {
    if (!token.includes('Bearer ')) return 'NOT';

    let t: string = token.split(' ')[1];

    return t;

}

export const checkUserNotVerified = () => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (req.user.status == false) next();
        else res.status(400).send({
            message: 'Account Already Verified login pleas',
        });
    }
}

export const checkUserVerified = () => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (req.user.status === true) next();
        else return res.status(400).send({
            message: 'Your account is not verified please verify it first',
        })
    }
}

export const generateotp = () => {
    let number = Math.floor(Math.random() * 1000000)
    if (number < 100000) number += 100000
    return number
}
