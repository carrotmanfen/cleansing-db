import { Body, Controller, Get, Post, HttpCode } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBody, ApiProperty } from '@nestjs/swagger';
import { ProjectService } from './projects.service';
import { Project } from './project.model';

class CreateProjectDto {
    @ApiProperty()
    start_date: string;
  
    @ApiProperty()
    data_set: object;

  }


@Controller('projects')
@ApiTags('projects') 
export class ProjectController {
    constructor(private readonly projectService:ProjectService){}

    @Get('/all')
    @ApiResponse({ status: 200, description: 'Returns the greeting message' })
    async getAllAccount(){
        const projects = await this.projectService.findAll();
        return ({
            status: 200,
            message:"there is all project success",
            results:projects.map(project=>({
                _id:project._id,
                start_date:project.start_date,
                data_set:project.data_set,
                clean:project.clean,
                latest_edit:project.latest_edit
                })
            )
        })
    }

    @Post('/register')
    @ApiBody({type:CreateProjectDto})
    @ApiResponse({ status: 201, description: 'Register' })
    async createAccount(
        @Body('username') username: string,
        @Body('start_date') start_date: string,
        @Body('data_set') data_set: object,
    ): Promise<any>{
        const project = await this.projectService.create(start_date, data_set)
        return ({
            status: 200,
            message:"register success",
            results:{
                _id:project._id,
                start_date:project.start_date,
                data_set:project.data_set,
                latest_edit:project.latest_edit,
                clean:project.clean
            }
        })
    }
}
