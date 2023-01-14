import { Config } from '../config';
import fs from 'node:fs';

export async function getData(text: string, voice: string): Promise<string | null> {
    const name = `${process.cwd()}/../audio/${new Date().getTime()}.mp3`;

    const res = await fetch(Config.apis.tts + '/api/generation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'text': text,
            'voice': voice
        })
    })
        .then(async (_res) => await _res.json())
        .catch(console.error);

    fs.writeFileSync(name, Buffer.from(res?.data?.replace?.('data:audio/mp3; codecs=opus;base64,', ''), 'base64'));
    return res?.data ? name : null;
}