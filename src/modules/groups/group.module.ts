import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { Group, GroupSchema } from './model/group.model';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Group.name, schema: GroupSchema }
        ]),
    ],
    controllers: [
        GroupController
    ],
    providers: [
        GroupService
    ],
    exports: [
        GroupService
    ]
})
export class GroupModule { }