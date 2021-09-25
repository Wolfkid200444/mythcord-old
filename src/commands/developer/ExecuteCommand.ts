import { exec } from "child_process";
import { ICommand } from "../../structures/bot/ICommand";
import { Utils } from "../../structures/utils";
import { IEmbed } from "../../structures/entities/IEmbed";
import { Message } from "discord.js";

class ExecuteCommand extends ICommand {

    constructor() {
        super("execute", {
            category: "developer",
            description: {
                content: "Execute an command via the command line",
                usage: "[bash command]"
            },
            aliases: ["execute", "exec", "linux", "$"],
            ownerOnly: true,
            channel: "guild",
            clientPermissions: "EMBED_LINKS",
            args: [
                {
                    id: "command",
                    match: "text"
                }
            ]
        });
    }

    async exec(message: Message, { command }: { command: string }): Promise<Message | Message[]> {
        if (!command)
            return Utils.errorEmbed(message, "Specify an command to be executed!");

        try {
            exec(command, async (_error, stdout, stderr) => {
                if (stdout)
                    console.log(stdout);
                else
                    console.log(stderr);

                const embed = new IEmbed()
                if (stdout.length < 1) {
                    embed.setDescription("Completed without output");
                    return message.channel.send(embed);
                } else if (stdout.length > 1024) {
                    embed.setDescription(`**${await Utils.postToHastebin(stdout)}**`);
                    return message.channel.send(embed);
                } else {
                    return message.channel.send("```\n" +
                        `$ ${command}\n` +
                        `${stdout}` +
                        "```"
                    )
                }
            })
        } catch (e) {
            return Utils.errorEmbed(message, "An error occured! Please check the terminal")
        }
    }

}

export = ExecuteCommand;