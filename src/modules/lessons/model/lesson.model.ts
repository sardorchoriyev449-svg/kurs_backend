import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Users } from '../../users/model/user.model';
import { Group } from '../../groups/model/group.model';
import { Topic } from '../../topics/model/topic.model';

export type LessonDocument = Lesson & Document;

@Schema({ timestamps: true })
export class Lesson {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Types.ObjectId, ref: Users.name, required: true })
  author: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Group.name, required: true })
  group_id: Types.ObjectId;

  // O'quv reja bo'yicha tanlangan bo'lsa - shu mavzuga bog'lanadi (ixtiyoriy,
  // "Boshqa" tanlansa topic_id bo'sh qoladi, faqat "name"da qo'lda yozilgan nom turadi)
  @Prop({ type: Types.ObjectId, ref: Topic.name, required: false })
  topic_id: Types.ObjectId;

  // Aynan qaysi kun darsi (kalendar/jadval uchun)
  @Prop({ required: true })
  date: Date;

  @Prop({ required: false })
  video_uri: string;

  @Prop({ required: false })
  file_uri: string;
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);
