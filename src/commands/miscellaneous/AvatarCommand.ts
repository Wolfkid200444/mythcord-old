import { GuildMember, Message } from "discord.js";
import { ICommand } from "../../structures/bot/ICommand";
import { IEmbed } from "../../structures/entities/IEmbed";
import { Utils } from "../../structures/utils";

class AvatarCommand extends ICommand {

    constructor() {
        super("avatar", {
            category: "miscellaneous",
            description: {
                content: "Returns someones or your Discord avatar",
                usage: "(username | id | mention)"
            },
            aliases: ["avatar", "pfp"],
            cooldown: Utils.toMilliseconds(5),
            channel: "guild",
            clientPermissions: "EMBED_LINKS",
            args: [
                {
                    id: "member",
                    match: "content",
                    type: "member",
                    default: (message: Message): GuildMember => message.member!
                }
            ]
        });
    }

    async exec(message: Message, { member }: { member: GuildMember }): Promise<Message | Message[]> {
        const { user } = member;
        const embed = new IEmbed()
            .setTitle(`— ${user.username}'s Avatar`)
            .setImage(user.displayAvatarURL({ dynamic: true, size: 1024 }))
            .setURL(user.displayAvatarURL({ dynamic: true, size: 1024 }));
        return message.channel.send(embed);
    }

}

export = AvatarCommand;