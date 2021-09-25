import { Message } from "discord.js";
import { ICommand } from "../../structures/bot/ICommand";
import { IListener } from "../../structures/bot/IListener";
import { Utils } from "../../structures/utils";

class CooldownListener extends IListener {

    constructor() {
        super("cooldown", {
            emitter: "commandHandler",
            event: "cooldown"
        });
    }

    async exec(message: Message, command: ICommand, remaining: number): Promise<Message | Message[]> {
        return Utils.errorEmbed(message, `Please wait ${Utils.toSeconds(remaining)} second(s) before executing the \`${command.id}\` command again`);
    }

}

export = CooldownListener;