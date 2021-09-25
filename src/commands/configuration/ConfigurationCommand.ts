import { Message } from "discord.js";
import { ICommand } from "../../structures/bot/ICommand";
import { IEmbed } from "../../structures/entities/IEmbed";
import { Utils } from "../../structures/utils";

class ConfigurationCommand extends ICommand {

    constructor() {
        super("configuration", {
            category: "configuration",
            description: {
                content: "View the current server configuration"
            },
            aliases: ["configuration", "config", "conf"],
            cooldown: Utils.toMilliseconds(7),
            channel: "guild",
            clientPermissions: "EMBED_LINKS",
        });
    }

    async exec(message: Message): Promise<Message | Message[]> {
        const embed = new IEmbed()
            .setTitle(`— ${message.guild.name} Configuration`)
            .addField("➜ General",
                `Prefix: **${this.client.getGuildConfig().get(message.guild.id, "prefix")}**\n` +
                `Greetings Module: **\`Coming Soon\`**`
            )
            .addField("➜ Chat Bot", 
                `Status: **\`Coming Soon\`**\n` +
                `Enabled Channels: **\`Coming Soon\`**`
            );
        return message.channel.send(embed);
    }

}

export = ConfigurationCommand;