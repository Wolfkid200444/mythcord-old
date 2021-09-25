import { Argument } from "discord-akairo";
import { Message, GuildMember } from "discord.js";
import { ICommand } from "../../structures/bot/ICommand";
import { IEmbed } from "../../structures/entities/IEmbed";
import { Utils } from "../../structures/utils";

class BanCommand extends ICommand {

    constructor() {
        super("ban", {
            category: "moderation",
            description: {
                content: "Banishes the specified user from the server",
                usage: "[username | id | mention] (reason)"
            },
            aliases: ["ban", "banish", "bu"],
            channel: "guild",
            cooldown: Utils.toMilliseconds(10),
            clientPermissions: ["EMBED_LINKS", "BAN_MEMBERS", "ADD_REACTIONS"],
            userPermissions: "BAN_MEMBERS",
            args: [
                {
                    id: "member",
                    type: Argument.union("member", async(_, phrase) => {
                        const m = await this.client.users.fetch(phrase)
                        if (m)
                            return {
                                id: m.id,
                                user: m
                            }

                        return null;
                    })
                }, {
                    id: "reason",
                    match: "rest",
                    default: "No reason provided"
                }
            ]
        });
    }

    async exec(message: Message, { member, reason }: { member: GuildMember, reason: string }) {
        const { user } = member;

        if (!member) 
            return Utils.errorEmbed(message, "Who do you want to ban?")
                .then(m => m.delete({ timeout: 2500 }));
        
        if (user.id === this.client.user.id)
            return Utils.errorEmbed(message, "You can't ban me mortal!")
                .then(m => m.delete({ timeout: 2500 }));

        if (!member.bannable) 
            return Utils.errorEmbed(message, "I cannot ban the user due to the role hierarchy")
                .then(m => m.delete({ timeout: 2500 }));

            const promptEmbed = new IEmbed()
            .setAuthor("This verification becomes invalid after 15 seconds!")
            .setDescription(`${this.client.emojis.cache.get("808276093056450590")} **|** Are you sure to ban \`${user.tag}\`?`);
        message.channel.send(promptEmbed).then(async msg => {
            const emoji = await this.promptMessage(msg, message.author, 15, ["✅", "❎"]);

            if (emoji === "✅") {
                await msg.delete();

                member.ban({ reason: reason })
                    .catch(err => {
                        if (err) 
                            return Utils.errorEmbed(message, "An error occured while banning the user!")
                    });
                return Utils.successEmbed(message, `Successfully banned \`<@${user.tag}>\` for the following reason: **\`${reason}\`**`)
                    .then(m => m.delete({ timeout: 3000 }));
            } else if (emoji === "❎") {
                await msg.delete();

                return Utils.successEmbed(message, `The ban operation has been cancelled.`)
                    .then(m => m.delete({ timeout: 2500 }));
            }
        });
    }
}

export = BanCommand;