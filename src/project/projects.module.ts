import { Module } from '@nestjs/common';
import { ProjectController } from './projects.controller';
import { ProjectService } from './projects.service';
import { MongooseModule } from '@nestjs/mongoose';
import {ProjectSchema} from './project.model'
import { AccountService } from 'src/account/accounts.service';
import { AccountModule } from 'src/account/accounts.module';

@Module({
  imports: [MongooseModule.forFeature([{name:'Project', schema:ProjectSchema}]), AccountModule],
  providers:[ProjectService],
  controllers: [ProjectController]
})
export class ProjectModule {}
