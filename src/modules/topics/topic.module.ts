import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Topic, TopicSchema } from "./model/topic.model";
import { TopicService } from "./topic.service";
import { TopicController } from "./topic.controller";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Topic.name, schema: TopicSchema }])
    ],
    controllers: [TopicController],
    providers: [TopicService],
    exports: [TopicService],
})
export class TopicModule {}
