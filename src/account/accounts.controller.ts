import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { AccountService } from './accounts.service';
import { Account } from './account.model';

@Controller('accounts')
@ApiTags('accounts') 
export class AccountController {
  constructor(private readonly accountService:AccountService){}

  @Get()
  @ApiResponse({ status: 200, description: 'Returns the greeting message' })
  async getAllBooks(){
    const accounts = this.accountService.findAll();
    return accounts;
  }

  @Post()
  async createAccount(
    @Body('username') username: string,
    @Body('password') password: string,
  ): Promise<any>{
    const generatedId = await this.accountService.create(username,password)
    return {id:generatedId}
  }
}
