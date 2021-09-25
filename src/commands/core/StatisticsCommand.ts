import { Message } from "discord.js";
import os from "os";
import { IClient } from "../../structures/bot/IClient";
import { ICommand } from "../../structures/bot/ICommand";
import { IEmbed } from "../../structures/entities/IEmbed";
import { Utils } from "../../structures/utils";

class StatisticsCommand extends ICommand {

    constructor() {
        super("statistics", {
            category: "core",
            description: {
                content: "View Mythcord's process stats",
            },
            aliases: ["statistics", "stats"],
            cooldown: Utils.toMilliseconds(7),
            channel: "guild",
            clientPermissions: "EMBED_LINKS"
        });
    }

    async exec(message: Message): Promise<Message | Message[]> {
        const processRAM = Math.round(process.memoryUsage().rss / 10485.76) / 100;

        const embed = new IEmbed()
            .setTitle("— Mythcord Stats")
            .setThumbnail(this.client.user.avatarURL())
            .addField("➜ Bot", "```\n" +
                `Users: ${Utils.formatInteger(this.client.users.cache.size)}\n` +
                `Guilds: ${Utils.formatInteger(this.client.guilds.cache.size)}\n` +
                `Discord.js: v${require("discord.js").version}\n` +
                `Akairo: v${require("discord-akairo").version}\n` +
                `Process: v${require("../../../package.json").version + this.isCanary(this.client)}` +
                "```"
            )
            .addField("➜ Uptime", "```\n" +
                `Process Uptime: ${Utils.formatMsToTime(this.client.uptime)}\n` +
                `System Uptime: ${Utils.formatMsToTime(Utils.toMilliseconds(os.uptime()))}\n` +
                "```"
            )
            .addField("➜ Memory", "```\n" +
                `Used: ${processRAM} MB\n` +
                `Free: ${Utils.toMegaBytes(os.freemem())} MB\n` +
                "```", true
            )
            .addField("➜ Hardware", "```\n" +
                `Cores: ${os.cpus().length}\n` +
                `OS: Debian 10\n` +
                "```", true
            );
        return message.channel.send(embed);
    }

    isCanary(client: IClient) {
        if (client.user.id === "791188742512967690")
            return "-CANARY";
        else 
            return "-STABLE";
    }

}

export = StatisticsCommand;