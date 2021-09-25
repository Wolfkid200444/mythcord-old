import { Message } from "discord.js";
import { ICommand } from "../../structures/bot/ICommand";
import { IEmbed } from "../../structures/entities/IEmbed";
import { Utils } from "../../structures/utils";

class InviteCommand extends ICommand {

    constructor() {
        super("invite", {
            category: "core",
            description: {
                content: "Invite Mythcord to your own Discord server"
            },
            aliases: ["invite", "inv"],
            cooldown: Utils.toMilliseconds(5),
            channel: "guild",
            clientPermissions: "EMBED_LINKS",
        });
    }

    async exec(message: Message): Promise<Message | Message[]> {
        const embed = new IEmbed()
            .setDescription(">>> [Mythcord](https://discord.com/oauth2/authorize?client_id=777430209866891295&permissions=70577254&redirect_uri=https://discord.gg/9MHrwpf72U&scope=bot)\n[Mythcord Canary](https://discord.com/oauth2/authorize?client_id=791188742512967690&permissions=70577254&redirect_uri=https://discord.gg/9MHrwpf72U&scope=bot)");
        return message.channel.send(embed);
    }

}

export = InviteCommand;