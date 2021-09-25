import { Argument } from "discord-akairo";
import { GuildMember, Message } from "discord.js";
import { ICommand } from "../../structures/bot/ICommand";
import { Utils } from "../../structures/utils";

class BeanCommand extends ICommand {

    constructor() {
        super("bean", {
            category: "entertainment",
            description: {
                content: "Beans the specified user",
                usage: "[username | id | mention]"
            },
            aliases: ["bean"],
            cooldown: Utils.toMilliseconds(5),
            channel: "guild",
            clientPermissions: "EMBED_LINKS",
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
                },
                {
                    id: "reason",
                    match: "rest",
                    default: ""
                }
            ]
        });
    }

    async exec(message: Message, { member, reason }: { member: GuildMember, reason: string }): Promise<Message | Message[]> {
        const { user } = member;
        if (!member)
            return Utils.errorEmbed(message, "There is no user specified!");

        if (!member.kickable)
            return Utils.errorEmbed(message, "I cannot **bean** the user due to the role hierarchy");

        message.channel.send(`<@!${user.id}>, You have been **beaned** from ${message.guild.name}`).then((m: { delete: () => any; }) => m.delete());
        if (!reason || reason === "" || reason.includes(`<@${user.id}`) || reason.includes(`<@!${user.id}`))
            return Utils.successEmbed(message, `${user.tag} has been **beaned** for **\`No reason given\`**`);
        else
            return Utils.successEmbed(message, `${user.tag} has been **beaned** for **\`${reason}\`**`);
    }

}

export = BeanCommand;
