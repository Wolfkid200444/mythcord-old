import { AkairoOptions, CommandOptions, ListenerOptions } from "discord-akairo";

export interface ICommandOptions extends CommandOptions {
    description?: {
        content?: string
        usage?: string|undefined
    },
    voterOnly?: boolean|undefined,
    credit?: [
        {
            id?: string
            url?: string
            reason?: string
            reasonURL?: string
        }
    ]
}

export interface IListenerOptions extends ListenerOptions {
    emitter: string|"client",
    event: string
}

export interface IClientOptions extends AkairoOptions {
    ownerID?: string|string[],
    token: string
}