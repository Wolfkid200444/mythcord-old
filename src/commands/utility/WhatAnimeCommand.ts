import { Message } from "discord.js";
import fetch from "node-fetch";

import { ICommand } from "../../structures/bot/ICommand";
import { IEmbed } from "../../structures/entities/IEmbed";
import { Utils } from "../../structures/utils";

class WhatAnimeCommand extends ICommand {

    constructor() {
        super("whatanime", {
            category: "utility",
            description: {
                content: "Searches the Internet to find the anime sauce",
                usage: "[url | attachment]"
            },
            aliases: ["whatanime", "wait", "findsauce"],
            cooldown: Utils.toMilliseconds(10),
            channel: "guild",
            clientPermissions: "EMBED_LINKS",
            args: [
                {
                    id: "url",
                    match: "content"
                }
            ],
            credit: [
                {
                    id: "trace.moe",
                    url: "https://trace.moe",
                    reason: "API"
                }
            ]
        })
    }

    async exec(message: Message, { url }: { url: string }): Promise<Message | Message[]> {
        let res: any;

        if (message.channel.type !== "text")
            return Utils.errorEmbed(message, "An error occured!");

        if (message.attachments.first()) {
            res = await this.fetchAnime(message.attachments.first().url);
        } else {
            if (!url)
                return Utils.errorEmbed(message, "There is no image file specified!");

            console.log(url);
            res = await this.fetchAnime(url);
        }

        // URL VARS
        let title: string,
            anilistID = encodeURIComponent(res.docs[0].anilist_id),
            filename = encodeURIComponent(res.docs[0].filename),
            at = encodeURIComponent(res.docs[0].at),
            tokenthumb = encodeURIComponent(res.docs[0].tokenthumb)
        
        
        if (res.docs[0].is_adult === true && message.channel.nsfw === false) 
            return Utils.errorEmbed(message, "This anime is flagged as NSFW! Please execute the command on an NSFW channel");

        if (res.docs[0].title_english !== null || undefined)
            title = res.docs[0].title_english
        else 
            title = `**${res.docs[0].title_romaji}**`

        const embed = new IEmbed()
            .setTitle("— What Anime Is This?")
            .setImage(`https://trace.moe/thumbnail.php?anilist_id=${anilistID}&file=${filename}&t=${at}&token=${tokenthumb}`)
            .addField("➜ General Info",
                `Title: ${title}\n` +
                `MAL ID: **${res.docs[0].mal_id !== null || undefined ? res.docs[0].mal_id : "Not Given"}** | AniList ID: **${res.docs[0].anilist_id !== null || undefined ? res.docs[0].anilist_id : "Not Given"}**\n` +
                `Is NSFW: **${res.docs[0].is_adult === true ? "Yes" : "No"}**`
            )       
            .addField("➜ Image Info",
                `Episode: **${res.docs[0].episode ? res.docs[0].episode : "Not Given"}**\n` +
                `Similarity: **${res.docs[0].similarity.toString().replace("0.", "").substring(0, 2)}%** / **100%**\n` +
                `Timestamp: **${Utils.formatMsToTime(Utils.toMilliseconds(res.docs[0].at))}**`
            , true);

        const random = Math.floor(Math.random() * 101);
        if (random >= 25)
            embed.setFooter("NOTE: Results sometimes may be inaccurate.");

        return message.channel.send(embed);
    }

    async fetchAnime(url: string): Promise<Object> {
        return await fetch("https://trace.moe/api/search", {
            method: "POST",
            body: JSON.stringify({
                image: await Utils.imageToBase64(url)
            }),
            headers: { "Content-Type": "application/json" }
        })
            .then((res) => res.json())
    }

}

export = WhatAnimeCommand;