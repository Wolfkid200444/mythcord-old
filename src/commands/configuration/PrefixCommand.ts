import { Message } from "discord.js";
import { ICommand } from "../../structures/bot/ICommand";
import { Utils } from "../../structures/utils";

class PrefixCommand extends ICommand {

    constructor() {
        super("prefix", {
            category: "configuration",
            description: {
                content: "Change the servers current prefix",
                usage: "(prefix | --reset)"
            },
            aliases: ["prefix"],
            cooldown: Utils.toMilliseconds(7),
            channel: "guild",
            clientPermissions: "EMBED_LINKS",
            args: [
                {
                    id: "prefix",
                    type: "string"
                },
                {
                    id: "reset",
                    type: "boolean",
                    match: "flag",
                    flag: ["--reset", "-R"]
                }
            ]
        });
    }

    async exec(message: Message, { prefix, reset }: { prefix: string, reset: boolean }): Promise<Message | Message[]> {
        if (!message.member.hasPermission("MANAGE_GUILD"))
            return Utils.errorEmbed(message, "You don't have the `MANAGE_GUILD` permission!");

        if (prefix) {
            if (prefix.length > 2)
                return Utils.errorEmbed(message, "Prefix length shouldn't be more than 2 characters!");

            this.client.getGuildConfig().set(message.guild.id, prefix, "prefix");
            return Utils.successEmbed(message, `Successfully changed prefix to **\`${prefix}\`**`);
        } else if (reset) {
            this.client.getGuildConfig().set(message.guild.id, "m/", "prefix");
            return Utils.successEmbed(message, `Successfully reverted prefix back to **\`m/\`**`);
        } else {
            return Utils.successEmbed(message, `Current prefix for the server is: **\`${this.client.getGuildConfig().get(message.guild.id, "prefix")}\`**`);
        }
    }

}

export = PrefixCommand;