import { IListener } from "../../structures/bot/IListener";
import App from "../../../src/web/app.js";

class ReadyListener extends IListener {

    constructor() {
        super("ready", {
            emitter: "client",
            event: "ready"
        });
    }

    async exec(): Promise<void> {
        if (this.client.user.id === "791188742512967690") {
            this.client.user.setPresence({
                activity: {
                    name: "m.help",
                    type: "STREAMING",
                    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                },
                status: "idle"
            }).catch(console.error);

            this.client.getCommandHandler().remove("configuration");
            this.client.getCommandHandler().remove("prefix");
        } else {
            this.client.user.setPresence({
                activity: {
                    name: "m/help",
                    type: "PLAYING"
                }
            }).catch(console.error);

            App(this.client, this.client.getCommandHandler());
        }
        console.log(`Logged in as ${this.client.user.tag}`);
    }

}

export = ReadyListener;