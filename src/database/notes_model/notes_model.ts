import { Model, Schema, model } from 'mongoose'
import { NotesInterface } from 'src/utils/type'


const notesSchema: Schema<NotesInterface> = new Schema({
    readList: {
        type: Schema.Types.ObjectId,
        ref: 'ReadListModel',
    },

    desc: {
        type: String,
        required: true,
    },

    tags: [
        {
            type: String,
        }
    ],

    filePath: [
        {
            type: String,
            required: true,
        }
    ],

    likedBy: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        }
    ],

    dislikedBy: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        }
    ]
}, {
    timestamps: true,
});


export const Notes: Model<NotesInterface> = model('NotesModel', notesSchema);
