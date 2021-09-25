import { Message } from "discord.js";
import { inspect } from "util";
import { ICommand } from "../../structures/bot/ICommand";
import { IEmbed } from "../../structures/entities/IEmbed";
import { Utils } from "../../structures/utils";

class EvaluateCommand extends ICommand {

    constructor() {
        super("evaluate", {
            category: "developer",
            description: {
                content: "Evaluate the given JavaScript code",
                usage: "[code]"
            },
            aliases: ["evaluate", "eval"],
            ownerOnly: true,
            channel: "guild",
            clientPermissions: "EMBED_LINKS",
            args: [
                {
                    id: "code",
                    match: "text"
                }
            ]
        });
    }

    async exec(message: Message, { code }: { code: string }): Promise<Message | Message[]> {
        if (!code)
            return Utils.errorEmbed(message, "Specify something to evaluate!")

        const embed = new IEmbed()
        try {
            let evaled = eval(code);
            let rawEvaled = evaled;
            if (typeof evaled !== "string")
                evaled = inspect(evaled, { depth: 0 });

            if (evaled.length > 1024) {
                embed.setDescription(`${await Utils.postToHastebin(this.cleanCode(evaled))}`)
            } else {
                embed.addField("➜ Input", "```js\n" + code + "\n```")
                embed.addField("➜ Output", "```js\n" + this.cleanCode(evaled) + "\n```")
                embed.addField("➜ Type Of", "```js\n" + typeof rawEvaled + "\n```")
                embed.setTimestamp();
            }
            return message.channel.send(embed);
        } catch (e) {
            console.log(e)
            embed.isErrorEmbed(true)
            embed.addField("➜ Error", "```js\n" + this.cleanCode(e) + "\n```")
            embed.setTimestamp()
            return message.channel.send(embed);
        }
    }

    cleanCode(text: string): string {
        if (typeof(text) === "string") {
            return text
                .replace(/`/g, "`" + String.fromCharCode(8203))
                .replace(/@/g, "@" + String.fromCharCode(8203))
                .replace(this.client.token, "<STRENG GEHEIM>")
                .replace(process.env.DISCORD_TOKEN, "<STENG GEHEIM>");
        } else {
            return text;
        }
    }

}

export = EvaluateCommand;