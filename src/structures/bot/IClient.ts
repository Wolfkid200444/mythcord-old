import { AkairoClient, CommandHandler, ListenerHandler } from "discord-akairo";
import { ClientOptions } from "discord.js";
import { join } from "path";
import { existsSync } from "fs";
import Enmap from "enmap";
import { IClientOptions } from "../../../typings";

export class IClient extends AkairoClient {

    protected commandHandler: CommandHandler = new CommandHandler(this, {
        directory: join(__dirname, "../../", "commands"),

        allowMention: true,
        prefix: async (message) => {
            return this.getGuildConfig().get(message.guild.id, "prefix");
        }
    });

    protected listenerHandler: ListenerHandler = new ListenerHandler(this, {
       directory: join(__dirname, "../../", "listeners")
    });

    protected guildConfig: Enmap = new Enmap({
        name: "guildConfiguration",
        cloneLevel: "deep",
        autoFetch: true
    });

    constructor(options: IClientOptions, clientOptions?: ClientOptions) {
        super(options, clientOptions);
    }

    buildClient(): any {
        if (existsSync(this.commandHandler.directory)) {
            this.commandHandler.useListenerHandler(this.listenerHandler);
            this.commandHandler.loadAll();
        }

        if (existsSync(this.listenerHandler.directory)) {
            this.listenerHandler.setEmitters({
                commandHandler: this.commandHandler,
                listenerHandler: this.listenerHandler
            });
            this.listenerHandler.loadAll();
        }

        return super.login(this.token);
    }

    getCommandHandler(): CommandHandler {
        return this.commandHandler;
    }

    getGuildConfig(): Enmap {
        return this.guildConfig;
    }

}