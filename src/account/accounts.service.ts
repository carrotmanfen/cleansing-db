import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Account } from './account.model';
import { Model } from 'mongoose';

@Injectable()
export class AccountService {
    // private account: Account[]=[];
    constructor(
        @InjectModel('Account')
        private readonly accountModel:Model<Account>
    ){}

    async findAll():Promise<Account[]> {
        const accounts = await this.accountModel.find().exec()
        return accounts
    }

    async findByUsername(username: string) {
        const account = await this.accountModel.findOne({ username: { $eq: username } }).exec();
        if(account)
            return {_id:account._id, username:account.username, password:account.password, project:account.project};
        else
            throw new NotFoundException('Could not find account')
    }

    async create(username: string, password:string){
        const account = await this.accountModel.findOne({ username: { $eq: username } }).exec();
        if(account){
            throw new BadRequestException('Something bad happened', { cause: new Error(), description: 'Username already used in another account' })
        }    
        else{
            const project = new Array()
            const newAccount = new this.accountModel({username:username, password:password, project:project})
            const res = await newAccount.save();
            console.log(res)
            return res ;
        }
    }

    async checkUsernamePassword(username: string, password:string){
        const account = await this.findByUsername(username)
        if(account){
            if(account.password==password){
                return account
            }
            throw new BadRequestException('Something bad happened', { cause: new Error(), description: 'Password not correct    ' })
        }    
        else{
            throw new BadRequestException('Something bad happened', { cause: new Error(), description: 'Username is not valid' })
        }
    }

    async updateAccount (username: string, project_id:string, project_name:string, file_name:string){
        console.log(username)
        console.log(project_id)
        const account = await this.accountModel.findOne({username:{$eq:username}}).exec();
        if(account){
            const newProject = {
                _id:project_id,
                project_name:project_name,
                file_name:file_name
            }
            account.project = [...account.project, newProject]
            account.save()
            return(account) 
        }    
        else{
            throw new BadRequestException('Something bad happened', { cause: new Error(), description: 'Username is not valid' })
        }

    }
}
