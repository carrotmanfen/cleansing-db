import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Account } from './account.model';
import { Model } from 'mongoose';
import * as moment from 'moment';

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
        const result = await this.accountModel.aggregate([
            { $match: { username: username } },
            { $unwind: '$project' },
            { $sort: {'project.last_edit': -1}},
            {
                $group: {
                  _id: '$_id',
                  username: { $first: '$username' },
                  password: { $first: '$password' },
                  project: { $push: '$project' },
                },
            },
          ]).exec();
        
          if (result.length > 0) {
            const account = result[0]; // Since we expect only one document due to the username match
            return {
                account
            };
          } else {
            throw new NotFoundException('Could not find account');
          }
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
            if(account.account.password==password){
                return account
            }
            throw new BadRequestException('Something bad happened', { cause: new Error(), description: 'Password not correct' })
        }    
        else{
            throw new BadRequestException('Something bad happened', { cause: new Error(), description: 'Username is not valid' })
        }
    }

    async updateProjectOfAccount(username: string, project_id: string, project_name: string, file_name: string) {
        console.log(username);
        console.log(project_id);
      
        const account = await this.accountModel.findOne({ username: { $eq: username } }).exec();
      
        if (account) {
          const newProject = {
            _id: project_id,
            project_name: project_name,
            file_name: file_name,
            last_edit: moment().format('YYYY/MM/DD HH:mm:ss'),
          };
      
          account.project = [newProject, ...account.project];
          await account.save(); // Make sure to use await here to wait for the save operation to complete
      
          return account;
        } else {
          throw new BadRequestException('Something bad happened', {
            cause: new Error(),
            description: 'Username is not valid',
          });
        }
      }

    async deleteProjectInAccount(username: string, project_id: string) {
        
        const account = await this.accountModel.findOne({username:{$eq:username}}).exec();
        if(account){
            const objectIndex = account.project.findIndex(obj => obj._id === project_id);
            console.log(objectIndex)
            if (objectIndex !== -1) {
                // Remove the object from the project array
                account.project.splice(objectIndex, 1);

                // Save the updated account
                await account.save();
                console.log(account)
                // Return the updated account information
                return account
            }else{
                throw new NotFoundException('Could not find project in account '+username)    
            }
        }    
        else{
            throw new NotFoundException('Could not find account')
        }
      }

      async updateProjectNameOfAccount(username: string, project_id: string, project_name: string) {
        try {
          const account = await this.accountModel.findOne({ username: { $eq: username } }).exec();
      
          if (account) {
            const projectIndex = account.project.findIndex((p) => p._id === project_id);
            console.log(projectIndex)
            if (projectIndex !== -1) {
            //   account.project[projectIndex].project_name = project_name;
              const newProject = {
                _id:project_id,
                project_name:project_name,
                file_name:account.project[projectIndex].file_name,
                last_edit: moment().format('YYYY/MM/DD HH:mm:ss'),
            }
            account.project.splice(projectIndex, 1);
            account.project = [newProject, ...account.project]
              await account.save(); // Make sure to await the save operation
              console.log(account)
              return account;
            } else {
              throw new BadRequestException('Project in account is not valid');
            }

          } else {
            throw new BadRequestException('Username is not valid');
          }
        } catch (error) {
          console.error(error); // Log any errors to help diagnose the issue
          throw new BadRequestException('Failed to update project name');
        }
      }

}
