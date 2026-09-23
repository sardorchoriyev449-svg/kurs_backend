import { Injectable } from "@nestjs/common";

// Login oqimi bosqichi: chat login/parol so'rash jarayonining qaysi
// qadamida turibdi. Bu vaqtinchalik holat, xotirada saqlanadi -
// muvaffaqiyatli login qilingandan keyingi bog'lanish esa (telegram_chat_id)
// bazada saqlanadi.
type LoginStep = 'awaiting_login' | 'awaiting_password';

interface LoginState {
    step:LoginStep;
    login?:string;
}

@Injectable()
export class TelegramSessionService {
    private sessions = new Map<string, LoginState>();

    startLogin(chatId:string){
        this.sessions.set(chatId, {step:'awaiting_login'});
    }

    setLogin(chatId:string, login:string){
        this.sessions.set(chatId, {step:'awaiting_password', login});
    }

    getState(chatId:string):LoginState | undefined {
        return this.sessions.get(chatId);
    }

    clear(chatId:string){
        this.sessions.delete(chatId);
    }
}
