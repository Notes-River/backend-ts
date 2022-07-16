import { Request, Response, NextFunction } from 'express';
export const checkRequiredHeaders = (keys: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        let bodyKeys: string[] = Object.keys(req.headers);
        let errorKeys: string[] = [];

        keys.forEach((e) => {
            if (!bodyKeys.includes(e)) errorKeys.push(e);
        });

        if (errorKeys.length > 0) return res.status(500).send(`keys required in headers ${errorKeys.join(',')}`);
        else next();

    }
}