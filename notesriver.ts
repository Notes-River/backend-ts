import { createServer, Server } from 'node:http';
import express, { Application, Request, Response, NextFunction } from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import { databaseConnection } from './src/database/connection';
import { log } from './src/utils/features';
import upload from 'express-fileupload';
import { appendFile } from 'node:fs/promises';
import { userApi } from './src/controller/user_controller';
import { UserInterface } from './src/utils/type';
import { readlistApi } from './src/controller/readlist_controller';


declare global {
    namespace Express {
        interface Request {
            user: UserInterface,
            file: any,
            token: string,
        }
    }
}

const app: Application = express();
const server: Server = createServer(app);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(upload());
app.use('/data', express.static("data"));

config({ path: './.env' });

const db_url: string = process.env.DB_URL as string;
const port = process.env.PORT || 3000;

databaseConnection(db_url);


app.use((req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    req.on("end", async () => {
        const endTime = Date.now();
        const vals = {
            method: req.method,
            path: req.path,
            time: endTime - startTime,
        };
        await appendFile('./server.log', JSON.stringify(vals) + '\n');
        console.log(vals);
    });

    next();
});

app.use('/auth', userApi);
app.use('/readlist',readlistApi);

server.listen(port, () => {
    log(`server is up and running on port: ${port}`);
})

// sendMail({ to: 'gaurav4149singh@gmail.com', subject: 'Testing one', text: 'Hello Bro' });

// console.log(decodeToken(generatetoken('hey')))
// let password: string = encryptPassword('G@123aurav');
// console.log(password);
// console.log(compareEncryptedPassword('G@123aurav', password));
