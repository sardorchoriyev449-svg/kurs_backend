import { Injectable } from "@nestjs/common";
import { Command, Ctx, On, Start, Update } from "nestjs-telegraf";
import { Context } from "telegraf";
import { UsersService } from "../users/user.service";
import { TelegramSessionService } from "./telegram-session.service";
import { BotCommandsService } from "./bot-commands.service";
import { UserRoles } from "../../common/guards/user-roles.guard";

const COMMON = `/profil - Shaxsiy ma'lumotlaringiz\n/help - Shu ro'yxat\n/exit - Tizimdan chiqish`;

function helpTextForRole(role:string):string{
    if(role === UserRoles.admin || role === UserRoles.superAdmin){
        return `👑 Admin buyruqlari:\n${COMMON}\n/statistika - Tizim statistikasi`;
    }
    if(role === UserRoles.teacher){
        return `🎓 O'qituvchi buyruqlari:\n${COMMON}\n/topshirmaganlar - So'nggi vazifani topshirmaganlar`;
    }
    if(role === UserRoles.student){
        return `📚 O'quvchi buyruqlari:\n${COMMON}\n/baholarim - Oxirgi baholaringiz\n/koinlarim - Koin balansingiz`;
    }
    return COMMON;
}

@Update()
@Injectable()
export class BotUpdate {
    constructor(
        private readonly usersService:UsersService,
        private readonly session:TelegramSessionService,
        private readonly commands:BotCommandsService,
    ){}

    private async currentUser(ctx:Context){
        const chatId = String(ctx.chat!.id);
        return await this.usersService.getByTelegramChatId(chatId);
    }

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
    async help(@Ctx() ctx:Context):Promise<void>{
        const user = await this.currentUser(ctx);
        if(!user){ await ctx.reply("Avval tizimga kiring: /start bosing."); return; }

        await ctx.reply(helpTextForRole(user.role));
    }

    @Command('profil')
    async profil(@Ctx() ctx:Context):Promise<void>{
        const user = await this.currentUser(ctx);
        if(!user){ await ctx.reply("Avval tizimga kiring: /start bosing."); return; }

        await ctx.reply(
            `Ism: ${user.first_name} ${user.last_name}\nLogin: ${user.login}\nRol: ${user.role}`
        );
    }

    @Command('baholarim')
    async baholarim(@Ctx() ctx:Context):Promise<void>{
        const user = await this.currentUser(ctx);
        if(!user){ await ctx.reply("Avval tizimga kiring: /start bosing."); return; }
        if(user.role !== UserRoles.student){ await ctx.reply("Bu buyruq faqat o'quvchilar uchun."); return; }

        await ctx.reply(await this.commands.studentGrades(String(user._id)));
    }

    @Command('koinlarim')
    async koinlarim(@Ctx() ctx:Context):Promise<void>{
        const user = await this.currentUser(ctx);
        if(!user){ await ctx.reply("Avval tizimga kiring: /start bosing."); return; }
        if(user.role !== UserRoles.student){ await ctx.reply("Bu buyruq faqat o'quvchilar uchun."); return; }

        await ctx.reply(await this.commands.studentCoins(String(user._id)));
    }

    @Command('topshirmaganlar')
    async topshirmaganlar(@Ctx() ctx:Context):Promise<void>{
        const user = await this.currentUser(ctx);
        if(!user){ await ctx.reply("Avval tizimga kiring: /start bosing."); return; }
        if(user.role !== UserRoles.teacher){ await ctx.reply("Bu buyruq faqat o'qituvchilar uchun."); return; }

        await ctx.reply(await this.commands.teacherNotSubmitted(String(user._id)));
    }

    @Command('statistika')
    async statistika(@Ctx() ctx:Context):Promise<void>{
        const user = await this.currentUser(ctx);
        if(!user){ await ctx.reply("Avval tizimga kiring: /start bosing."); return; }
        if(user.role !== UserRoles.admin && user.role !== UserRoles.superAdmin){
            await ctx.reply("Bu buyruq faqat adminlar uchun.");
            return;
        }

        await ctx.reply(await this.commands.adminStats());
    }

    @Command('exit')
    async exit(@Ctx() ctx:Context){
        const chatId = String(ctx.chat!.id);
        const user = await this.currentUser(ctx);

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
