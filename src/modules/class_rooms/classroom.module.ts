import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClassRoomController } from './classroom.controller';
import { ClassRoomService } from './classroom.service';
import { ClassRoom, ClassRoomSchema } from './model/classroom.model';
import { GroupModule } from '../groups/group.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ClassRoom.name, schema: ClassRoomSchema },
    ]),
    GroupModule,
  ],
  controllers: [ClassRoomController],
  providers: [ClassRoomService],
  exports: [ClassRoomService],
})
export class ClassRoomModule {}