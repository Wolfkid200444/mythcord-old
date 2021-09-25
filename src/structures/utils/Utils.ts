import fetch from "node-fetch";
import { encode } from "node-base64-image";
import { Message } from "discord.js";
import { IEmbed } from "../entities/IEmbed";

export class Utils {

    // BOT FUNCTIONS

    public static async postToHastebin(input: string) {
        if (!input)
            return console.error("No input specified");

        const res = await fetch("https://hastebin.com/documents", {
            method: "POST",
            body: input,
            headers: {
                "Content-Type": "application/json"
            }
        });

        const json = await res.json();
        return `https://hastebin.com/${json.key}`;
    }

    public static async imageToBase64(image: string) {
        return await encode(image, {
            string: true
        });
    }

    // FORMATTING

    public static formatInteger(int: number) {
        return int.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    public static formatMsToTime(millisec: number) {
        let seconds = millisec / 1000;
        let days = parseInt(String(seconds / 86400));
        seconds = seconds % 86400;
        let hours = parseInt(String(seconds / 3600));
        seconds = seconds % 3600;
        let minutes = parseInt(String(seconds / 60));
        seconds = parseInt(String(seconds % 60));

        if (days) {
            return `${days}d, ${hours}h, ${minutes}m, ${seconds}s`;
        }
        else if (hours) {
            return `${hours}h, ${minutes}m, ${seconds}s`;
        }
        else if (minutes) {
            return `${minutes}m, ${seconds}s`;
        }
        return `${seconds}s`;
    }

    public static toMegaBytes(bytes: number) {
        // Convert first to KB
        let kb = bytes / 1024;
        // Convert to MB
        let mb = kb / 1024;

        mb = Math.floor(mb);
        return mb % 1024;
    }

    public static toHexadecimal(hexCode: string) {
        return hexCode.replace("#", "0x");
    }

    public static toSeconds(milliseconds: number){
        return milliseconds / 1000;
    }

    public static toMilliseconds(seconds: number) {
        return seconds * 1000;
    }

    // EMBEDS

    public static errorEmbed(messageVar: Message, message: string) {
        const channel = messageVar.channel;
        const emoji = messageVar.client.emojis.cache.get("808273663865520198");
    
        const embed = new IEmbed()
            .isErrorEmbed(true)
            .setDescription(`${emoji} **|** ${message}`);

        return channel.send(embed);
    }

    public static successEmbed(messageVar: Message, message: string) {
        const channel = messageVar.channel;
        const emoji = messageVar.client.emojis.cache.get("808273700838965279");

        const embed = new IEmbed()
            .setDescription(`${emoji} **|** ${message}`);
            //.addField("➜ Message:", `>>> ${message}`)

        return channel.send(embed);
    }

}