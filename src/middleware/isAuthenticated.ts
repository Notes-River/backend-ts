import { Request, Response, NextFunction } from 'express';
import { User } from '../database/user_models/user_model';
import { decodeToken, validateToken } from '../utils/features';
import { DecodedToken } from '../utils/type';

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token: string = req.header('x-user') || req.query.token as string;

        token = validateToken(token);
        if (token === 'NOT') return res.status(404).send({ message: 'wrong token found please try again ' });
        let data: DecodedToken = await decodeToken(token);
        
        let user = await User.findOne({
            _id: data._id,
            'tokens.token': data.token,
            'tokens.access': data.access,
        }).populate('readList').populate('joined');

    
        if (!user) return res.status(404).send({ message: 'Token Expire please login' });

        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        res.status(404).send({ message: error.message });
    }
}