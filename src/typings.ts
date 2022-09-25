import { Collection } from "discord.js"

export type Command = {
    name?: string
    aliases?: string[]
    developers?: boolean
    run?: any
}

export type ConfigType = {
    token: string
    dlist: string
    api: string
    ad: string;
    data: {
        commands: Collection<string, Command>
        events: Collection<string, any>
        interactions: {
            commands: Collection<string, Command>
        }
    }
    listings: {
        active: boolean
        url: string,
        authorization: string,
        method: 'PATCH' | 'POST' | 'PUT',
        structure: {
            guilds: string
            shards?: string
        }
        query?: boolean
    }[]
}