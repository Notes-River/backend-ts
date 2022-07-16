import { Request, Response } from 'express';
import { unlink } from 'fs/promises';
import { Notes } from '../database/notes_model/notes_model';
import { ReadlistInterface } from 'src/utils/type';
import { ReadList } from '../database/readlist_model/readlist_model';
import { ObjectId } from 'mongoose';

export const createReadlist = async (req: Request, res: Response) => {
    try {
        req.body.user = req.user._id;
        if (req.body.tags !== undefined)
            req.body.tags = JSON.parse(JSON.stringify(req.body.tags));

        let path: string = Date.now().toString() + req.user._id + 'logo';

        if (req.files) {
            if (req.files.logo) {
                let p: any = req.files.logo;
                path = path + p.name;

                p.mv('data/logo/' + path);
                req.body.logo = 'data/logo/' + path;
            }
        }
        let readlist = await ReadList.create(req.body);

        req.user.readList.push(readlist._id);
        await req.user.save();

        res.status(201).send({ message: 'readlist created' });
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}



export const fetchReadlist = async (req: Request, res: Response) => {
    res.status(200).send({ readlist: req.user.readList });
}

export const fetchReadlistByuserId = async (req: Request, res: Response) => {
    try {
        const readlists: ReadlistInterface[] = await ReadList.find({ user: req.params.id }).populate({ path: 'user', select: 'name username _id' });
        res.status(200).send({ readlists, length: readlists.length });
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

export const deleteReadlist = async (req: Request, res: Response) => {
    try {
        if (!req.params.id) return res.status(404).send({ message: "Id Not found in params" });
        const readlist = await ReadList.findByIdAndDelete(req.params.id);
        if(!readlist) return res.status(404).send({message:'readlist not found'})

        if(readlist && readlist.logo) {
            await unlink(readlist.logo);
        }

        let ids:ObjectId[] = [];
    
        req.user.readList.forEach((e) => {
            if(e !== readlist._id){
                ids.push(e);
            }
        });
        req.user.readList = ids;
        await req.user.save();

        if(readlist && readlist.notes.length != 0){
            await Notes.deleteMany({
                _id:{
                    $in: readlist.notes
                }
            })
        }
        
        res.status(200).send(readlist);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}