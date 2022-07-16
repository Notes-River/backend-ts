import mongoose from 'mongoose';
import { log } from '../utils/features';


export const databaseConnection = async (db_url: string) => {
    mongoose.Promise = Promise;


    if (db_url) {
        try {
            await mongoose.connect(db_url);
            log('database connected: ' + db_url);
        } catch (error) {
            log('databse connection error: ', error);
        }
    }
    else log('db_url not found in process env');

}

