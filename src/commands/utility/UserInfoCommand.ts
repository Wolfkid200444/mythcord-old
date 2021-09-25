import { Message, GuildMember } from "discord.js";
import { utc } from "moment";
import { ICommand } from "../../structures/bot/ICommand";
import { IEmbed } from "../../structures/entities/IEmbed";
import { Utils } from "../../structures/utils";

class UserInfoCommand extends ICommand {

    constructor() {
        super("userinfo", {
            category: "utility",
            description: {
                content: "Shows information about the specified user",
                usage: "(username | id | mention)"
            },
            aliases: ["userinfo", "user", "whois", "ui"],
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

    async exec(message: Message, { member }: { member: GuildMember }): Promise<Message> {
        const { user } = member;
        const nick = message.guild.member(user.id).nickname;

        let presence = user.presence.activities.find(x => x.type === "PLAYING") ? user.presence.activities.find(x => x.type === "PLAYING").name : "Not playing a game";
        let presenceName: string;
        let presenceType: string;

        if (presence === "Not playing a game") {
            presence = "Not playing a game";
        } else {
            if (user.presence.activities.find(x => x.type === "PLAYING")) {
                presenceType = "Playing"
            } else if (user.presence.activities.find(x => x.type === "LISTENING")) {
                presenceType = "Listening to"
            } else if (user.presence.activities.find(x => x.type === "WATCHING")) {
                presenceType = "Watching"
            }
            presenceName = user.presence.activities.find(x => x.type === presenceType.toString().toUpperCase()).name;
            presence = presenceType + " " + presenceName
        }

        const embed = new IEmbed()
            .setTitle(`— ${user.username}'s Information`)
            .setThumbnail(user.avatarURL())
            .addField("➜ Account Info", 
                `User Tag: **${user.tag}**\n` +
                `User ID: **${user.id}**\n` +
                `Nickname: **${nick ? nick : user.username}**\n` +
                `Bot Account: **${user.bot === true ? "Yes" : "No"}**\n`
            )
            .addField(`➜ Roles (${member.roles.cache.size - 1} roles)`, 
                member.roles.cache
                    .filter(r => r.id !== message.guild.id)
                    .map(r => r).join(", ") || 'None'
            )
            .addField("➜ Miscellaneous",
                `Status: **${presence}**\n` +
                `Account Created: **${utc(user.createdAt).format("MMMM Do, YYYY")}**\n` +
                `Joined Server: **${utc(member.joinedAt).format("MMMM Do, YYYY")}**`
            )
        return message.channel.send(embed);
    }

}

export = UserInfoCommand;