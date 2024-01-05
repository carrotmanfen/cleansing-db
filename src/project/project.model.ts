import * as mongoose from 'mongoose';

export const ProjectSchema = new mongoose.Schema({
    data_set: {type: Object, required: true},
    clean: {type:Array, required: false},
});

export interface Project{
    _id: string;
    clean: Array<any>;
    data_set: object;
}