import { Command } from "discord-akairo";
import { GuildMember, Message, Snowflake, User } from "discord.js";
import { IClient } from "./IClient";
import { ICommandOptions } from "../../../typings";
import { Utils } from "../utils";
import { EmojiResolvable } from "discord.js";
import { TextChannel } from "discord.js";

export class ICommand extends Command {

    client: IClient

    constructor(id: string, options?: ICommandOptions) {
        super(id, options);
    }

    exec(message: Message, args: any): any {
        // This will return an error embed if cmd is ownerOnly and author ID is not the dev ID
        this.isDev(message);

        return super.exec(message, args);
    }

    getMentionedMember(message: Message, toFind: string|GuildMember|User = "") {
        if (typeof toFind === "string") {
            toFind = toFind.toLowerCase();
        }

        let target = message.guild.members.cache.get(<Snowflake> toFind);
        if (!target && message.mentions.members)
            target = message.mentions.members.first();

        if (!target && toFind) {
            target = message.guild.members.cache.find(member => {
                return member.displayName.toLowerCase().includes(<string> toFind) ||
                    member.user.tag.toLowerCase().includes(<string> toFind)
            });
        }

        if (!target)
            target = message.member;

        return target;
    }

    isDev(message: Message) {
        if (this.ownerOnly === true || message.author.id !== this.client.ownerID) {
            return Utils.errorEmbed(message, "This command is currently on development");
        }
    }

    async promptMessage (message: Message, author: User, time: number, validReactions: EmojiResolvable[]) {
        time *= 1000;

        for (const reaction of validReactions) await message.react(reaction);

        const filter = (reaction: { emoji: { name: EmojiResolvable; }; }, user: { id: string; }) => validReactions.includes(reaction.emoji.name) && user.id === author.id;

        return message
            .awaitReactions(filter, {
                max: 1,
                time: time
            })
            .then(collected => 
                collected.first() && collected.first().emoji.name
            );
    }

}