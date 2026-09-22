import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Gift, GiftSchema } from "./model/gift.model";
import { GiftService } from "./gift.service";
import { GiftController } from "./gift.controller";
import { CoinModule } from "../coins/coin.module";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Gift.name, schema: GiftSchema }]),
        CoinModule,
    ],
    controllers: [GiftController],
    providers: [GiftService],
    exports: [GiftService],
})
export class GiftModule {}
