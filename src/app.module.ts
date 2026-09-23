import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'
import { getMongoUrl } from './common/configs/db.config';
import { UsersModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './common/guards/auth.guard';
import { GroupModule } from './modules/groups/group.module';
import { LessonModule } from './modules/lessons/lesson.module';
import { ClassRoomModule } from './modules/class_rooms/classroom.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { CoursModule } from './modules/course/course.module';
import { HomeworkModule } from './modules/homework/homework.module';
import { GradeModule } from './modules/grades/grade.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { CoinModule } from './modules/coins/coin.module';
import { GiftModule } from './modules/gifts/gift.module';
import { StaffModule } from './modules/staff/staff.module';
import { TopicModule } from './modules/topics/topic.module';
import { HomeworkAssignmentModule } from './modules/homework-assignments/homework-assignment.module';
import { FreezeModule } from './modules/freeze/freeze.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    JwtModule.register({
      global: true
    }),
    MongooseModule.forRoot(getMongoUrl()),
    UsersModule,
    AuthModule,
    GroupModule,
    LessonModule,
    ClassRoomModule,
    CoursModule,
    HomeworkAssignmentModule,
    HomeworkModule,
    UploadsModule,
    GradeModule,
    AttendanceModule,
    CoinModule,
    GiftModule,
    StaffModule,
    TopicModule,
    FreezeModule,
  ],
  providers: [{
    provide:APP_GUARD,
    useClass:AuthGuard
  }],
})
export class AppModule { }
