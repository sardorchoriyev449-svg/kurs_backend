import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Coin, CoinSchema } from "./model/coin.model";
import { CoinService } from "./coin.service";
import { CoinController } from "./coin.controller";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Coin.name, schema: CoinSchema }])
    ],
    controllers: [CoinController],
    providers: [CoinService],
    exports: [CoinService],
})
export class CoinModule {}
