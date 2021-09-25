import { Message } from "discord.js";
import { ICommand } from "../../structures/bot/ICommand";
import { IEmbed } from "../../structures/entities/IEmbed";
import { Utils } from "../../structures/utils";

class HelpCommand extends ICommand {

    constructor() {
        super("help", {
            category: "core",
            description: {
                content: "Shows an specific command information",
                usage: "(command name | command alias)"
            },
            aliases: ["help", "botinfo", "bi"],
            cooldown: Utils.toMilliseconds(5),
            channel: "guild",
            clientPermissions: "EMBED_LINKS",
            args: [
                {
                    id: "command",
                    type: "commandAlias"
                }
            ]
        });
    }

    async exec(message, { command }: { command: ICommand }): Promise<Message | Message[]> {
        if (!command) {
            const url = `https://discord.com/oauth2/authorize?client_id=${this.client.user.id}&permissions=70577254&redirect_uri=https://discord.gg/9MHrwpf72U&scope=bot`
            const embed = new IEmbed()
                .setThumbnail(this.client.user.avatarURL())
                .setTitle("— Mythcord")

                .setDescription("Mythcord is yet another multipurpose bot for Discord. Here is more info about it:" +
                    "\n—" +
                    // @ts-ignore
                    "\n➜ View the command list using `" + this.client.getGuildConfig().get(message.guild.id, "prefix") + "commands`" +
                    "\n➜ Created by [TheRealKizu#3267](https://twitter.com/KizuWasTaken)" +
                    "\n—"
                )
                .addField("— Links", 
                    `[Support Server](https://discord.gg/9MHrwpf72U)\n` +
                    `[Invite Link](${url})\n` +
                    `[Dashboard](https://home.mythcord.cf)`
                );

            return message.channel.send(embed);
        } else {
            this.getCommandInfo(message, command);
        }
    }

    async getCommandInfo(message: Message, command: ICommand): Promise<Message | Message[]> {
        const aliases = command.aliases;
        const prefix = this.client.getGuildConfig().get(message.guild.id, "prefix");

        const embed = new IEmbed()
            .setTitle("— Command Information")
            .setDescription("```\n" +
                `${command.description.content}\n` +
                "```"
            )
            .addField("➜ Usage", `\`${prefix}${command.id}${command.description.usage ?' ' + command.description.usage : ''}\``, true)
            .setFooter("Syntax: [] = required | () = optional")

        if (command.aliases.length > 1)
            embed.addField("➜ Aliases", aliases.map(alias => `\`${alias}\``).join(", "))

            embed.addField("➜ Cooldown", `${Utils.toSeconds(command.cooldown)} seconds`, true);

        return message.channel.send(embed);
    }

}

export = HelpCommand;