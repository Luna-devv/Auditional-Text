import { Client, Collection, CommandInteraction } from 'discord.js';

export type Command = {
    name: string
    dm?: boolean
    run: (client: Client, interaction: CommandInteraction) => void
} | undefined;

export type Event = {
    name: string;
    once?: boolean;
    run: (...unknown) => void
};

export type ConfigType = {
    token: string
    mongo: string
    dlist: string
    ad: string

    apis: {
        tts: string;
        votes?: string
        votes_authorization?: string
    }

    // verify user's as real users by voting lmao
    verification: {
        enabled: false;
    } | {
        enabled: true;
        url: string;
        freeUse: number;
    }

    data: {
        commands: Collection<string, Command>
        events: Collection<string, Event>
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