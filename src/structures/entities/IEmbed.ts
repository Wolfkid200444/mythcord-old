import { MessageEmbed } from "discord.js";
import { Utils } from "../utils";

export class IEmbed extends MessageEmbed {

    errorEmbed: boolean;

    constructor() {
        super();

        this.setColor(Utils.toHexadecimal("#ff8888"));
    }

    isErrorEmbed(bool: boolean) {
        if (bool === true) {
            this.errorEmbed = bool;
            this.setColor(Utils.toHexadecimal("#ff8888"));
            return this;
        }
    }

}