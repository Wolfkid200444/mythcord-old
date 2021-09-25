import { Message } from "discord.js";
import fetch from "node-fetch";
import { ICommand } from "../../structures/bot/ICommand";
import { IEmbed } from "../../structures/entities/IEmbed";
import { Utils } from "../../structures/utils";

class HistoryFactCommand extends ICommand {

    constructor() {
        super("historyfact", {
            category: "entertainment",
            description: {
                content: "Retrieves you an random history fact"
            },
            aliases: ["history", "historyfact", "randomhistory"],
            cooldown: Utils.toMilliseconds(5),
            channel: "guild",
            clientPermissions: "EMBED_LINKS",
            credit: [
                {
                    id: "NumbersAPI",
                    url: "http://numbersapi.com",
                    reason: "API"
                }
            ]
        });
    }

    async exec(message: Message): Promise<Message | Message[]> {
        let res = await (await fetch("http://numbersapi.com/random/date?json", {
            headers: { "Content-Type": "application/json" }
        })).json();

        const embed = new IEmbed()
            .setTitle(`— Random History Fact`)
            .setDescription(res.text)
            // @ts-ignore
            .setFooter(`Year: ${res.year}`)
        return message.channel.send(embed);
    }

}

export = HistoryFactCommand;