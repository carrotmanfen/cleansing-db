import { Body, Controller, Get, Post, HttpCode } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { AccountService } from './accounts.service';
import { Account } from './account.model';

@Controller('accounts')
@ApiTags('accounts') 
export class AccountController {
  constructor(private readonly accountService:AccountService){}

  @Get('/all')
  @ApiResponse({ status: 200, description: 'Returns the greeting message' })
  async getAllAccount(){
    const accounts = await this.accountService.findAll();
    return ({
        status: 200,
        message:"there is all account success",
        results:accounts.map(account=>({
        _id:account._id,
        username:account.username,
        password:account.password,
        project:account.project
    }))})
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Returns the greeting message' })
  async getAccount(
    @Body('username') username:string
  ){
    const accounts = this.accountService.findByUsername(username);
    if(accounts)
        return ({
            status:200,
            message:"this is that account",
            results:accounts
        });
    else
        return "don't have account"
  }

  @Post('/register')
  async createAccount(
    @Body('username') username: string,
    @Body('password') password: string,
  ): Promise<any>{
    const account = await this.accountService.create(username,password)
    return ({
        status: 200,
        message:"register success",
        results:{
            _id:account._id,
            username:account.username,
            password:account.password,
            project:account.project
        }
    })
  }

  @Post('/login')
  @HttpCode(200)
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
  ): Promise<any>{
    const account = await this.accountService.checkUsernamePassword(username,password)
    return ({
        status: 200,
        message:"login success",
        results:{
            _id:account._id,
            username:account.username,
            password:account.password,
            project:account.project
        }
    })
  }
}
