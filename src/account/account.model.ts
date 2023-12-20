import * as mongoose from 'mongoose';

export const AccountSchema = new mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    project: {type:Array, required:false}
});

export interface Account extends mongoose.Document{
    _id: string;
    username: string;
    password: string;
    project: Array<any>;
}