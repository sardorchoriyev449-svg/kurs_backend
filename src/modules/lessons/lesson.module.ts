import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LessonController } from './lesson.controller';
import { LessonService } from './lesson.service';
import { Lesson, LessonSchema } from './model/lesson.model';
import { UsersModule } from '../users/user.module';
import { Group, GroupSchema } from '../groups/model/group.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Lesson.name, schema: LessonSchema },
      { name: Group.name, schema: GroupSchema },
    ]),
  ],
  controllers: [LessonController],
  providers: [LessonService],
  exports: [LessonService],
})
export class LessonModule {}