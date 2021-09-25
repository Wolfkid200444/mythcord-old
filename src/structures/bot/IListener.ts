import { Listener } from "discord-akairo";
import { IClient } from "./IClient";
import { IListenerOptions } from "../../../typings";

export class IListener extends Listener {

    client: IClient

    constructor(id: string, options?: IListenerOptions) {
        super(id, options);
    }

}