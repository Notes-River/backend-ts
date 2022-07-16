import { Schema, model, Model } from 'mongoose';
import { ReadlistInterface } from '../../utils/type';

const readlistSchema: Schema<ReadlistInterface> = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    title: {
        type: String,
        required: true,
    },

    logo: {
        type: String,
    },

    about: {
        type: String,
    },

    notes: [{
        type: Schema.Types.ObjectId,
        ref: 'NotesModel'
    }],
    likedBy: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    dislikedBy: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    tags: [{
        type: String,
    }],
    join: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }]
}, {
    timestamps: true,
});


export const ReadList: Model<ReadlistInterface> = model('ReadListModel', readlistSchema);