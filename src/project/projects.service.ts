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

    async create(start_date: string, data_set:object){
        const latest_edit = start_date;
        const clean = new Array()
        const newProject = new this.projectModel({start_date:start_date, data_set:data_set, latest_edit:latest_edit, clean: clean})
        const res = await newProject.save();
        console.log(res)
        if(res){
            return res ;
        }else{
            throw new BadRequestException('Something bad happened', { cause: new Error(), description: 'Does not have this account' })
        }
    }
}
