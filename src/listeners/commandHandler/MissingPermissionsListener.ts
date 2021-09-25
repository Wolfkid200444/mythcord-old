import { Message } from "discord.js";
import { ICommand } from "../../structures/bot/ICommand";
import { IListener } from "../../structures/bot/IListener";
import { Utils } from "../../structures/utils";

class MissingPermissionsListener extends IListener {

    constructor() {
        super("missingPermissions", {
            emitter: "commandHandler",
            event: "missingPermissions"
        });
    }

    async exec(message: Message, _command: ICommand, type: string, missing: any): Promise<void> {
        switch (type) {
            case "client":
                Utils.errorEmbed(message, `I don't have the \`${missing}\` permission(s)!`);
                break;
            case "user":
                Utils.errorEmbed(message, `You don't have the \`${missing}\` permission(s) to execute this command!`);
                break;
        }
    }

}

export = MissingPermissionsListener;