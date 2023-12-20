import * as mongoose from 'mongoose';

export const ProjectSchema = new mongoose.Schema({
    start_date: {type: String, required: true},
    data_set: {type: Object, required: true},
    clean: {type:Array, required: false},
    latest_edit: {type:String, required: false},
    project_name: {type:String, required: true},
    file_name: {type:String, required: true},
});

export interface Project{
    _id: string;
    start_date: string;
    clean: Array<any>;
    latest_edit: string;
    data_set: object;
    project_name: string;
    file_name: string;
}