import { Body, Controller, Get, Post, HttpCode, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBody, ApiProperty, ApiQuery, ApiParam } from '@nestjs/swagger';
import { AccountService } from './accounts.service';
import { Account } from './account.model';

class LoginDto {
    @ApiProperty()
    username: string;
  
    @ApiProperty()
    password: string;
  }

class DeleteProjectInAccount {
    @ApiProperty()
    username: string

    @ApiProperty()
    project_id: string
}

class UpdateProjectDto {
    @ApiProperty()
    username: string

    @ApiProperty()
    project_id: string

    @ApiProperty()
    project_name: string

    @ApiProperty()
    file_name:string
}

class UpdateNameDto {
    @ApiProperty()
    username: string

    @ApiProperty()
    project_id: string

    @ApiProperty()
    project_name: string

}

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

  @Get(':username')
  @ApiParam({ name: 'username', description: 'The username parameter' })
  @ApiResponse({ status: 200, description: 'Returns the greeting message' })
  async getAccount(
    @Param('username') username:string
  ){
    const accounts = await this.accountService.findByUsername(username);
    console.log(accounts)
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
  @ApiBody({type:LoginDto})
  @ApiResponse({ status: 201, description: 'Register' })
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
  @ApiBody({type:LoginDto}) 
  @ApiResponse({ status: 200, description: 'login' })
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
            _id:account.account._id,
            username:account.account.username,
            password:account.account.password,
            project:account.account.project
        }
    })
  }

  @Patch('addProject')
  @ApiBody({type:UpdateProjectDto})
  @ApiResponse({ status: 200, description: 'login' })
  @HttpCode(200)
  async addProject (
    @Body('username') username: string,
    @Body('project_id') project_id: string,
    @Body('project_name') project_name: string,
    @Body('file_name') file_name: string,
  ){
    const account = await this.accountService.updateProjectOfAccount(username, project_id, project_name, file_name)
    return ({
        status: 200,
        message:"add project success",
        results:{
            _id:account._id,
            username:account.username,
            password:account.password,
            project:account.project
        }
    })
  }

  @Delete('/deleteProjectInAccount')
    @ApiBody({type:DeleteProjectInAccount})
    @HttpCode(200)
    @ApiResponse({ status: 200, description: 'delete project in account' })
    async deleteProject(
      @Body('username') username: string,
      @Body('project_id') project_id: string,
    ){
        const account = await this.accountService.deleteProjectInAccount(username, project_id)
        return ({
            status: 200,
            message:"delete success",
            results:{
              _id:account._id,
              username:account.username,
              password:account.password,
              project:account.project
            }
        })
    }

    @Patch('updateProjectName')
    @ApiBody({ type: UpdateNameDto })
    @ApiResponse({ status: 200, description: 'login' })
    @HttpCode(200)
    async updateProjectName(
        @Body('username') username: string,
        @Body('project_id') project_id: string,
        @Body('project_name') project_name: string,
    ) {
        const account = await this.accountService.updateProjectNameOfAccount(username,  project_id, project_name)
        return ({
            status: 200,
            message: "update project_name in account success",
            results: {
                _id:account._id,
              username:account.username,
              password:account.password,
              project:account.project
            }
        })
    }

}
