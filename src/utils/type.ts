import { ObjectId } from 'mongoose';

export type RedisSet = {
    data: any;
    key: string;
}

export type RedisGet = {
    key: string;
}

export type DecodedToken = {
    _id: ObjectId;
    token: string;
    access: string;
}

export interface UserInterface {
    populate(): unknown;
    save(): unknown;
    _id: ObjectId;
    name: string;
    username: string;
    email: string;
    password: string,
    tokens: Object[];
    status: boolean;
    readList: ObjectId[],
    joined: ObjectId[],
    favNotes: ObjectId[],
};

export interface NotesInterface {
    _id: ObjectId;
    readList: ObjectId;
    title: string;
    desc: string;
    tags: string[];
    filePath: string[];
    likedBy: ObjectId[];
    dislikedBy: ObjectId[];
}

export interface ReadlistInterface {
    _id: ObjectId;
    user: ObjectId;
    logo: string;
    title: string;
    about: string;
    notes: ObjectId[];
    likedBy: ObjectId[];
    dislikedBy: ObjectId[];
    tags: string[];
    join: ObjectId[];
}