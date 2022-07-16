import { Request, Response, NextFunction } from 'express';
import { User } from '../database/user_models/user_model';
import { NotesInterface, UserInterface } from '../utils/type';
import { accessKey, compareEncryptedPassword, deleteRedisData, encryptPassword, generateotp, generatetoken, getData, sendMail, setData } from '../utils/features';
import { Document, Model, Schema } from 'mongoose';
import { Notes } from '../database/notes_model/notes_model';

export const registerUser = async (req: Request, res: Response) => {
    try {

        req.body.password = encryptPassword(req.body.password);
        let user = await User.create(req.body);
        res.status(201).send({ user, message: 'user created', status: true });

    } catch (error) {

        res.status(400).send({ message: error.message });
    }
}

export const loginUser = async (req: Request, res: Response) => {
    try {
        let { username, password } = req.body;

        let user = await User.findOne({ $or: [{ email: username }, { username: username }] });
        if (!user) return res.status(404).send({ message: 'wrong username' });
        if (!compareEncryptedPassword(password, user.password)) return res.status(400).send({ message: 'You are using wrong password' });

        const token = generatetoken(user.id);
        user.tokens = user.tokens.concat({ access: accessKey, token });
        await user.save();

        return res.status(200).send({ user, token, message: 'Logged In' });

    } catch (error) {
        res.status(400).send({ message: error.message });
    }
}

export const userProfile = async (req: Request, res: Response) => {
    try {
        let user: any = req.user;

        let notes: NotesInterface[] = [];

        if (req.query.notes === 'yes') {
            notes = await Notes.find({ readList: { $in: req.user.readList } });
        }
        
        return res.status(200).send({ user, token: req.token, message: 'User Found', status: true, notes });

    } catch (error) {
        return res.status(400).send({ message: error.message });
    }
}

export const requestAccountVerification = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let otp = generateotp();

        await setData(req.user.username, otp, 10 * 60 * 5);
        await sendMail({
            to: [req.user.email],
            date: Date.now().toString(),
            subject: 'Account Verification',
            text: `Your one time password for account verification is ${otp}`,
        });

        res.status(200).send({ message: 'OTP sended' });
    } catch (error) {
        res.status(500).send({ message: error.message });

    }
}

export const verifyUserAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { code } = req.params;
        let redisToken = await getData(req.user.username);

        if (redisToken && code && redisToken == code) {
            req.user.status = true;
            await User.findByIdAndUpdate(req.user._id, req.user);
            await sendMail({
                to: req.user.email,
                subject: 'Account Verified',
                text: 'Dear User your account verification was completed',
            });

            await deleteRedisData(req.user.username);

            return res.status(200).send({ message: 'Account Verified' });
        }
        res.status(400).send({ message: 'your one time password for account verification is worng' });
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
}

export const logoutUser = async (req: Request, res: Response) => {
    try {
        let lis = req.user.tokens;
        req.user.tokens = [];
        let list: Object[] = [];

        lis.forEach((e: any) => {
            if (e.token !== req.token) list.push(e);
        })

        req.user.tokens = list;

        await req.user.save();

        return res.status(200).send({ message: 'logged out' });
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
}

export const checkUsername = async (req: Request, res: Response) => {
    try {
        let { username } = req.params;
        let user = await User.findOne({ $or: [{ email: username }, { username: username }] });
        if (!user) return res.status(404).send({ message: "This username is not registerd.", status: false });
        else return res.status(200).send({ message: "This username is already regiseterd.", status: true })
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}

export const changePassword = async (req: Request, res: Response) => {
    try {
        let { oldPassword, newPassword } = req.body;
        if(!compareEncryptedPassword(oldPassword, req.user.password)) return res.status(404).send({ message: "Your Old Password id invalid", status: false });
        req.user.password = encryptPassword(newPassword);

        await req.user.save()
        res.status(200).send({ message: "Password was updated.", status: true })
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}