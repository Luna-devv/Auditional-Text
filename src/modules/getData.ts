import path from 'node:path';
import fs from 'node:fs';

import { Config } from '../config';

export async function getData(text: string, voice: string): Promise<string | null> {
    const fileName = randomCode(10);
    const name = path.join(__dirname, '..', 'audio', fileName + '.mp3');

    if (!fs.existsSync(path.join(__dirname, '..', 'audio'))) fs.mkdirSync(path.join(__dirname, '..', 'audio'));
    if (Config.apis.tts.endsWith('/')) Config.apis.tts = Config.apis.tts.slice(0, -1);

    const data = await fetch(Config.apis.tts + '/api/generation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'text': text,
            'voice': voice
        })
    }).then((r) => {
        if (!r.ok) throw new Error(`Error fetching. Status: ${r.status}, Res: ${r.statusText}.`);
        return r;
    }).then(async (res) => await res.json()).catch((err) => {
        console.error(`Error fetching. Text: ${text}, Voice: ${voice}.\n`, err);
        return null;
    });

    if (!data?.data) return null;

    try {
        fs.writeFileSync(name, Buffer.from(data?.data?.replace?.('data:audio/mp3; codecs=opus;base64,', ''), 'base64'));
        return name;
    } catch (e) {
        console.error(e);
        return null;
    }
}

function randomCode(length: number): string {
    let result = '';

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}