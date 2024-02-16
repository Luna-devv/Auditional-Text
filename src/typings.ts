import { APIApplicationCommandOption, Collection, CommandInteraction, MessageContextMenuCommandInteraction } from 'discord.js';

export type Command = {
    name: string;
    description: string;
    options?: APIApplicationCommandOption[];
    dm_permission?: boolean;

    run: (interaction: CommandInteraction) => void;
};

export type ContextCommand = {
    name: string;
    run: (interaction: MessageContextMenuCommandInteraction) => void;
}

export type Event = {
    name: string;
    once?: boolean;

    run: (...arg0: unknown[]) => void;
}

export type ConfigType = {
    token: string;
    mongo: string;
    dlist?: string;

    ad: string;
    guildLogging?: string;

    apis: {
        tts: string;
        votes?: string;
        votes_authorization?: string;
    }

    // verify user's as real users by voting lmao
    verification: { enabled: false; } | {
        enabled: true;
        url: string;
        freeUse: number;
    }

    shards: number | 'auto';

    data: {
        events: Collection<string, Event>;
        interactions: {
            commands: Collection<string, Command>;
            context: Collection<string, Command>;
        }
    }

    listings: {
        active: boolean;
        url: string;
        authorization: string;
        method: 'PATCH' | 'POST' | 'PUT';
        structure: {
            guilds: string;
            shards?: string;
        }
        query?: boolean;
    }[]
}