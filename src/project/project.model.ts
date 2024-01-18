import * as mongoose from 'mongoose';

export const ProjectSchema = new mongoose.Schema({
    data_set: {type: Object, required: true},
    clean: {type:Object, required: false},
});

export interface Project{
    _id: string;
    clean: object;
    data_set: object;
}