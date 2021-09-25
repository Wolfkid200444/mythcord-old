import { Message } from "discord.js";
import { ICommand } from "../../structures/bot/ICommand";
import { IEmbed } from "../../structures/entities/IEmbed";
import { Utils } from "../../structures/utils";
const cleverbot = require("cleverbot-free");

class ChatBotCommand extends ICommand {

    constructor() {
        super("chatbot", {
            category: "entertainment",
            description: {
                content: "Chat with Mythcord",
                usage: "[message]"
            },
            aliases: ["chatbot", "cleverbot", "cb"],
            cooldown: Utils.toMilliseconds(10),
            channel: "guild",
            clientPermissions: "EMBED_LINKS", 
            args: [
                {
                    id: "msg",
                    match: "content"
                }
            ]
        });
    }

    async exec(message: Message, { msg }: { msg: string }): Promise<Message | Message[] | any> {
        const res = await this.getAPIResponse(msg);
        const embed = new IEmbed()
            .setDescription(`**${res}**`)
            .setTimestamp();

        message.channel.startTyping()

        setTimeout(() => {
            message.channel.stopTyping(true);
            return message.channel.send(embed);
        }, 4000);
    }

    async getAPIResponse(message: string): Promise<any> {
        return cleverbot(message);
    }

}

export = ChatBotCommand;