import { Message } from "discord.js";
import { ICommand } from "../../structures/bot/ICommand";
import { Utils } from "../../structures/utils";

class PruneCommand extends ICommand {

    constructor() {
        super("prune", {
            category: "moderation",
            description: {
                content: "Bulk deletes the specified amount of messages",
                usage: "[amount]"
            },
            aliases: ["prune", "purge", "clean"],
            channel: "guild",
            cooldown: Utils.toMilliseconds(5),
            clientPermissions: ["EMBED_LINKS", "MANAGE_MESSAGES"],
            userPermissions: "MANAGE_MESSAGES",
            args: [
                {
                    id: "amount",
                    type: "number",
                    default: 0
                }
            ]
        });
    }

    async exec(message: Message, { amount }: { amount: number }): Promise<Message | Message[]> {
        if (isNaN(amount)) 
            return Utils.errorEmbed(message, "Specified amount is not a number!");

        if (amount > 499 || amount < 1) 
            return Utils.errorEmbed(message, "Enter an amount ranging from `1` to `499`");

        amount = amount + 1;
        message.channel.messages.fetch({ limit: amount++ })
            .then(function (list) {
                // @ts-ignore
                message.channel.bulkDelete(list)
            });

        return Utils.successEmbed(message, `Deleted ${amount - 2} messages!`)
            .then((m => m.delete({ timeout: 2500 })));
    }

}

export = PruneCommand;