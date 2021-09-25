import { Message } from "discord.js";
import { IListener } from "../../structures/bot/IListener";

class MessageListener extends IListener {

    constructor() {
        super("message", {
            emitter: "client",
            event: "message"
        });
    }

    async exec(message: Message): Promise<void> {
        this.client.getGuildConfig().ensure(message.guild.id, {
            prefix: "m/",
            isPremium: false,
            
            // Modules
            greetingsModule: {
                enabled: false,
                greetingsChannel: null,
                joinMessage: null,
                leaveMessage: null
            }
        });

        if (this.client.user.id === "791188742512967690")
            this.client.getGuildConfig().set(message.guild.id, "m.", "prefix");
    }

}

export = MessageListener;