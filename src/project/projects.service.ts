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
            return {project_id:project._id, data_set:project.data_set, clean:project.clean};
        else
            throw new NotFoundException('Could not find project')
    }

    async create(data_set:object, clean:object){
        const newProject = new this.projectModel({ data_set:data_set, clean: clean})
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
