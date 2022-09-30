import { Collection } from "discord.js";
import { ConfigType } from "./typings";

export const Config: ConfigType = {
    token: '',
    mongo: '',
    dlist: '',
    api: '',
    ad: '',
    data: {
        commands: new Collection(),
        events: new Collection(),
        interactions: {
            commands: new Collection()
        }
    },
    listings: [
        {
            active: true,
            url: 'https://top.gg/api/bots/985213199248924722/stats',
            authorization: '',
            method: 'POST',
            structure: { guilds: 'server_count', shards: 'shard_count' }
        }
    ]
}

export const Interactions = [
    {
        name: 'mp3',
        description: 'Want to convert a Text to a nice MP3?',
        options: [
            {
                name: 'text',
                description: 'What text should get transformed?',
                type: 3,
                max_value: 300,
                required: true
            },
            {
                name: 'speaker',
                description: 'What voice should be used?',
                type: 3,
                choices: [
                    {
                        name: 'EN-us Female',
                        value: 'en_us_002'
                    },
                    {
                        name: 'EN-us Male',
                        value: 'en_us_006'
                    },
                    {
                        name: 'EN-au Female',
                        value: 'en_au_001'
                    },
                    {
                        name: 'EN-au Male',
                        value: 'en_au_002'
                    },
                    {
                        name: 'EN-uk Male',
                        value: 'en_uk_001'
                    },
                    {
                        name: 'FR-fr Male',
                        value: 'fr_001'
                    },
                    {
                        name: 'FR-fr Male 2',
                        value: 'fr_002'
                    },
                    {
                        name: 'DE-de Female',
                        value: 'de_001'
                    },
                    {
                        name: 'DE-de Male',
                        value: 'de_002'
                    },
                    {
                        name: 'JP-jp Female',
                        value: 'jp_001'
                    },
                    {
                        name: 'JP-jp Female 2',
                        value: 'jp_003'
                    },
                    {
                        name: 'ES-es Male',
                        value: 'es_002'
                    },
                    {
                        name: 'EN-us Ghostface',
                        value: 'en_us_ghostface'
                    },
                    {
                        name: 'EN-us Chewbacca',
                        value: 'en_us_chewbacca'
                    },
                    {
                        name: 'EN-us c3po',
                        value: 'en_us_c3po'
                    },
                    {
                        name: 'EN-us Stitch',
                        value: 'en_us_stitch'
                    },
                    {
                        name: 'EN-us Stormtropper',
                        value: 'en_us_stormtrooper'
                    },
                    {
                        name: 'EN-us Rocket',
                        value: 'en_us_rocket'
                    }
                ]
            }
        ]
    },
    {
        name: 'voice',
        description: 'Want to speak as me in a voicechannel?',
        options: [
            {
                name: 'text',
                description: 'What text should get transformed?',
                type: 3,
                max_value: 300,
                required: true
            },
            {
                name: 'speaker',
                description: 'What voice should be used?',
                type: 3,
                choices: [
                    {
                        name: 'EN-us Female',
                        value: 'en_us_002'
                    },
                    {
                        name: 'EN-us Male',
                        value: 'en_us_006'
                    },
                    {
                        name: 'EN-au Female',
                        value: 'en_au_001'
                    },
                    {
                        name: 'EN-au Male',
                        value: 'en_au_002'
                    },
                    {
                        name: 'EN-uk Male',
                        value: 'en_uk_001'
                    },
                    {
                        name: 'FR-fr Male',
                        value: 'fr_001'
                    },
                    {
                        name: 'FR-fr Male 2',
                        value: 'fr_002'
                    },
                    {
                        name: 'DE-de Female',
                        value: 'de_001'
                    },
                    {
                        name: 'DE-de Male',
                        value: 'de_002'
                    },
                    {
                        name: 'JP-jp Female',
                        value: 'jp_001'
                    },
                    {
                        name: 'JP-jp Female 2',
                        value: 'jp_003'
                    },
                    {
                        name: 'ES-es Male',
                        value: 'es_002'
                    },
                    {
                        name: 'EN-us Ghostface',
                        value: 'en_us_ghostface'
                    },
                    {
                        name: 'EN-us Chewbacca',
                        value: 'en_us_chewbacca'
                    },
                    {
                        name: 'EN-us c3po',
                        value: 'en_us_c3po'
                    },
                    {
                        name: 'EN-us Stitch',
                        value: 'en_us_stitch'
                    },
                    {
                        name: 'EN-us Stormtropper',
                        value: 'en_us_stormtrooper'
                    },
                    {
                        name: 'EN-us Rocket',
                        value: 'en_us_rocket'
                    }
                ]
            }
        ]
    },
    {
        name: 'help',
        description: 'Need some help?',
    }
]