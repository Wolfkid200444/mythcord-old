import { Message } from "discord.js";
import { ICommand } from "../../structures/bot/ICommand";
import { IListener } from "../../structures/bot/IListener";

class CommandFinishedListener extends IListener {

    constructor() {
        super("commandFinished", {
            emitter: "commandHandler",
            event: "commandFinished"
        });
    }

    async exec(message: Message, command: ICommand): Promise<void> {
        console.log(`${message.author.tag} ran ${command.id} command on ${message.guild.name}`);
    }

}

export = CommandFinishedListener;