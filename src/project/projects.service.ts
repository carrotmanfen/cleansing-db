import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Project } from './project.model';
import { Model } from 'mongoose';


@Injectable()
export class ProjectService {
    constructor(
        @InjectModel('Project')
        private readonly projectModel:Model<Project>
    ){}

    async findAll():Promise<Project[]> {
        const projects = await this.projectModel.find().exec()
        return projects
    }

    async findById(project_id: string) {
        console.log(project_id)
        const project = await this.projectModel.findOne({ _id: { $eq: project_id } }).exec();
        if(project)
            return {project_id:project._id, project_name:project.project_name, file_name:project.file_name, data_set:project.data_set,  start_date:project.start_date, latest_edit:project.latest_edit, clean:project.clean};
        else
            throw new NotFoundException('Could not find project')
    }

    async create(start_date: string, data_set:object, project_name: string, file_name: string){
        const latest_edit = start_date;
        const clean = new Array()
        const newProject = new this.projectModel({start_date:start_date, data_set:data_set, latest_edit:latest_edit, clean: clean, project_name: project_name, file_name: file_name})
        const res = await newProject.save();
        console.log(res)
        if(res){
            return res ;
        }else{
            throw new BadRequestException('Something bad happened', { cause: new Error(), description: 'Does not have this account' })
        }
    }

    async deleteProject(project_id : string){
        console.log(project_id)
        const result = await this.projectModel.deleteOne({_id:project_id}).exec()
        console.log(result)
        if(result.deletedCount===0) {
            throw new NotFoundException('Could not find project to delete or delete failed')
        }else{
            return "deleted project : "+project_id
        }
    }
}
