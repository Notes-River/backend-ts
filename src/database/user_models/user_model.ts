import { Schema, Model, model } from 'mongoose';
import { UserInterface } from '../../utils/type';
import { sign } from 'jsonwebtoken';



const schema: Schema<UserInterface> = new Schema({
    name: {
        type: String
    },
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,

    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }],
    status: {
        type: Boolean,
        default: false,
    },
    readList: [{
        type: Schema.Types.ObjectId,
        ref: "ReadListModel",
    }],
    joined: [{
        type: Schema.Types.ObjectId,
        ref: "ReadListModel"
    }],
    favNotes: [{
        type: Schema.Types.ObjectId,
        ref: "NotesModel"
    }]
}, {
    timestamps: true
});

schema.methods.toJSON = function () {
    let User = this;
    let obj = User.toObject();
    obj.tokens = undefined;
    obj.password = undefined;
    return obj;
}


export const User: Model<UserInterface> = model('user', schema);
