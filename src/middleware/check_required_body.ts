import { Request, Response, NextFunction } from 'express';
export const checkRequiredBody = (keys: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        let bodyKeys: string[] = Object.keys(req.body);
        let errorKeys: string[] = [];
        keys.forEach((e) => {
            if (!bodyKeys.includes(e)) errorKeys.push(e);
        });

        if (errorKeys.length > 0) return res.status(500).send(`keys are required in body: ${errorKeys.join(',')}`);
        else next();
    }
}

export const checkNotRequiredBody = (keys: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const errorFields: string[] = [];
        const requiredFields = Object.keys(req.body);

        keys.forEach((e) => {
            if (requiredFields.includes(e)) {
                errorFields.push(e);
            }
        });

        if (errorFields.length > 0) return res.status(400).send(errorFields.join(', ') + 'you can\'t add these fields in body');
        else next();
    }
}