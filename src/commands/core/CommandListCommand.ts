import { Message } from "discord.js";
import { ICommand } from "../../structures/bot/ICommand";
import { IEmbed } from "../../structures/entities/IEmbed";
import { Utils } from "../../structures/utils";

class CommandListCommand extends ICommand {

    constructor() {
        super("commands", {
            category: "core",
            description: {
                content: "Lists all available commands"
            },
            aliases: ["commands", "cmds"],
            cooldown: Utils.toMilliseconds(7),
            channel: "guild",
            clientPermissions: "EMBED_LINKS",
        });
    }

    async exec(message: Message): Promise<Message | Message[]> {
        const commands = this.handler.modules;
        const embed = new IEmbed();

        if (this.client.user.id !== "791188742512967690") {
            embed.addField("➜ **CONFIGURATION**", commands.filter(cmd => cmd.categoryID === "configuration").map(cmd => `\`${cmd.id}\``).join(", "))
        }

        embed.setTitle("— Mythcord Command List");
        embed.setThumbnail(this.client.user.avatarURL());
        embed.addField("➜ **CORE**", commands.filter(cmd => cmd.categoryID === "core").map(cmd => `\`${cmd.id}\``).join(", "));
        embed.addField("➜ **ENTERTAINMENT**", commands.filter(cmd => cmd.categoryID === "entertainment").map(cmd => `\`${cmd.id}\``).join(", "));
        embed.addField("➜ **MODERATION**", commands.filter(cmd => cmd.categoryID === "moderation").map(cmd => `\`${cmd.id}\``).join(", "));
        embed.addField("➜ **UTILITY**", commands.filter(cmd => cmd.categoryID === "utility").map(cmd => `\`${cmd.id}\``).join(", "));
        embed.addField("➜ **MISCELLANEOUS**", commands.filter(cmd => cmd.categoryID === "miscellaneous").map(cmd => `\`${cmd.id}\``).join(", "));
        embed.setFooter(`Do ${this.client.getGuildConfig().get(message.guild.id, "prefix")}help [command name] for more info! | Commands Loaded: ${(this.client.getCommandHandler().modules.size - commands.filter(cmd => cmd.categoryID === "developer").size)} commands!`);

        if (this.client.isOwner(message.author))
            embed.addField("➜ **DEVELOPER**", commands.filter(cmd => cmd.categoryID === "developer").map(cmd => `\`${cmd.id}\``).join(", "))

        return message.channel.send(embed);
    }

}

export = CommandListCommand;