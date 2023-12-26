import { Body, Controller, Get, Post, HttpCode, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBody, ApiProperty, ApiParam } from '@nestjs/swagger';
import { ProjectService } from './projects.service';
import { Project } from './project.model';

class CreateProjectDto {
    @ApiProperty()
    start_date: string;
  
    @ApiProperty()
    data_set: object;

    @ApiProperty()
    project_name: string

    @ApiProperty()
    file_name:string
  }

class FindProject {
    @ApiProperty()
    project_id: string
}

@Controller('projects')
@ApiTags('projects') 
export class ProjectController {
    constructor(private readonly projectService:ProjectService){}

    @Get('/all')
    @ApiResponse({ status: 200, description: 'Returns the greeting message' })
    async getAllProject(){
        const projects = await this.projectService.findAll();
        return ({
            status: 200,
            message:"there is all project success",
            results:projects.map(project=>({
                _id:project._id,
                project_name:project.project_name,
                file_name:project.file_name,
                start_date:project.start_date,
                data_set:project.data_set,
                clean:project.clean,
                latest_edit:project.latest_edit,
                })
            )
        })
    }

    @Get(':id')
    @ApiParam({ name: 'id', description: 'The project_id parameter' })
    @ApiResponse({ status: 200, description: 'Returns the greeting message' })
    async getProject(
        @Param('id') id:string
    ){
        const project = await this.projectService.findById(id);
        if(project)
            return ({
                status:200,
                message:"this is that project",
                results:project
            });
        else
            return "don't have project"
    }

    @Post('/createProject')
    @ApiBody({type:CreateProjectDto})
    @ApiResponse({ status: 201, description: 'Register' })
    async createProject(
        @Body('start_date') start_date: string,
        @Body('data_set') data_set: object,
        @Body('project_name') project_name: string,
        @Body('file_name') file_name: string,
    ): Promise<any>{
        const project = await this.projectService.create(start_date, data_set, project_name, file_name)
        return ({
            status: 200,
            message:"register success",
            results:{
                _id:project._id,
                project_name:project.project_name,
                file_name:project.file_name,
                start_date:project.start_date,
                data_set:project.data_set,
                latest_edit:project.latest_edit,
                clean:project.clean
            }
        })
    }

    @Delete('/deleteProject/:id')
    @ApiParam({ name: 'id', description: 'The project_id parameter' })
    @HttpCode(200)
    @ApiResponse({ status: 200, description: 'delete' })
    async deleteProject(
        @Param('id') project_id:string
    ){
        const project = await this.projectService.deleteProject(project_id)
        return ({
            status: 200,
            message:"register success",
            results:{
                message:project
            }
        })
    }
}
