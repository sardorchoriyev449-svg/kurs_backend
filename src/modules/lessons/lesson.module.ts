import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LessonController } from './lesson.controller';
import { LessonService } from './lesson.service';
import { Lesson, LessonSchema } from './model/lesson.model';
import { UsersModule } from '../users/user.module';
import { FreezeModule } from '../freeze/freeze.module';
import { TopicModule } from '../topics/topic.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Lesson.name, schema: LessonSchema },
    ]),
    FreezeModule,
    TopicModule,
  ],
  controllers: [LessonController],
  providers: [LessonService],
  exports: [LessonService],
})
export class LessonModule {}