import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClassRoomController } from './classroom.controller';
import { ClassRoomService } from './classroom.service';
import { ClassRoom, ClassRoomSchema } from './model/classroom.model';
import { GroupModule } from '../groups/group.module';
import { Group, GroupSchema } from '../groups/model/group.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ClassRoom.name, schema: ClassRoomSchema },
      { name: Group.name, schema: GroupSchema },
    ]),
    
  ],
  controllers: [ClassRoomController],
  providers: [ClassRoomService],
  exports: [ClassRoomService],
})
export class ClassRoomModule {}