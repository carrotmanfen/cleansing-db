import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Account } from './account.model';
import { Model } from 'mongoose';

@Injectable()
export class AccountService {
    private account: Account[]=[];
    constructor(
        @InjectModel('Account')
        private readonly accountModel:Model<Account>
    ){}

    async findAll():Promise<Account[]> {
        const accounts = await this.accountModel.find().exec()
        return accounts
    }

    async create(username: string, password:string){
        const project = new Array()
        const newAccount = new this.accountModel({username:username, password:password, project:project})
        const res = await newAccount.save();
        console.log(res)
        return res.id ;
    }
}
