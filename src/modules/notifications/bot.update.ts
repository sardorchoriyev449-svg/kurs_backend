import { Injectable } from "@nestjs/common";
import { Start, Update } from "nestjs-telegraf";
import { Context } from "telegraf";

@Update()
@Injectable()
export class BotUpdate {
    @Start()
    async start(ctx: Context) {
        await ctx.reply("Salom! Bot ulandi. Endi o'quvchilar uy vazifasini topshirganda shu yerga xabar keladi.");
    }
}
