import { Injectable } from "@nestjs/common";
import { Command, Ctx, On, Start, Update } from "nestjs-telegraf";
import { Context } from "telegraf";
import { UsersService } from "../users/user.service";
import { TelegramSessionService } from "./telegram-session.service";
import { UserRoles } from "../../common/guards/user-roles.guard";

function helpTextForRole(role:string):string{
    const common = `/profil - Shaxsiy ma'lumotlaringiz\n/help - Shu ro'yxat\n/exit - Tizimdan chiqish`;

    if(role === UserRoles.admin || role === UserRoles.superAdmin){
        return `👑 Admin buyruqlari:\n${common}`;
    }
    if(role === UserRoles.teacher){
        return `🎓 O'qituvchi buyruqlari:\n${common}`;
    }
    if(role === UserRoles.student){
        return `📚 O'quvchi buyruqlari:\n${common}`;
    }
    return common;
}

@Update()
@Injectable()
export class BotUpdate {
    constructor(
        private readonly usersService:UsersService,
        private readonly session:TelegramSessionService,
    ){}

    @Start()
    async start(@Ctx() ctx:Context){
        const chatId = String(ctx.chat!.id);
        const user = await this.usersService.getByTelegramChatId(chatId);

        if(user){
            await ctx.reply(
                `Salom, ${user.first_name}! Siz allaqachon tizimga ulangansiz.\n\n${helpTextForRole(user.role)}`
            );
            return;
        }

        this.session.startLogin(chatId);
        await ctx.reply("Salom! Tizimga kirish uchun loginingizni yuboring:");
    }

    @Command('help')
    async help(@Ctx() ctx:Context){
        const chatId = String(ctx.chat!.id);
        const user = await this.usersService.getByTelegramChatId(chatId);

        if(!user){
            await ctx.reply("Avval tizimga kiring: /start bosing.");
            return;
        }

        await ctx.reply(helpTextForRole(user.role));
    }

    @Command('profil')
    async profil(@Ctx() ctx:Context){
        const chatId = String(ctx.chat!.id);
        const user = await this.usersService.getByTelegramChatId(chatId);

        if(!user){
            await ctx.reply("Avval tizimga kiring: /start bosing.");
            return;
        }

        await ctx.reply(
            `Ism: ${user.first_name} ${user.last_name}\nLogin: ${user.login}\nRol: ${user.role}`
        );
    }

    @Command('exit')
    async exit(@Ctx() ctx:Context){
        const chatId = String(ctx.chat!.id);
        const user = await this.usersService.getByTelegramChatId(chatId);

        this.session.clear(chatId);

        if(!user){
            await ctx.reply("Siz allaqachon tizimga ulanmagansiz.");
            return;
        }

        await this.usersService.unlinkTelegramChat(chatId);
        await ctx.reply("Tizimdan chiqdingiz. Qayta kirish uchun /start bosing.");
    }

    @On('text')
    async onText(@Ctx() ctx:Context){
        const chatId = String(ctx.chat!.id);
        const state = this.session.getState(chatId);
        if(!state) return; // login oqimida emas - e'tiborsiz qoldiramiz

        const text = 'text' in ctx.message! ? ctx.message.text.trim() : '';

        if(state.step === 'awaiting_login'){
            this.session.setLogin(chatId, text);
            await ctx.reply("Endi parolingizni yuboring:");
            return;
        }

        if(state.step === 'awaiting_password'){
            // Xavfsizlik uchun: parol yozilgan xabarni chatdan darhol o'chiramiz.
            try {
                await ctx.deleteMessage();
            } catch {}

            const user = await this.usersService.verifyCredentials(state.login!, text);
            this.session.clear(chatId);

            if(!user){
                await ctx.reply("Login yoki parol xato. Qaytadan urinish uchun /start bosing.");
                return;
            }

            await this.usersService.linkTelegramChat(String(user._id), chatId);
            await ctx.reply(
                `Xush kelibsiz, ${user.first_name}! Tizimga muvaffaqiyatli ulandingiz.\n\n${helpTextForRole(user.role)}`
            );
        }
    }
}
