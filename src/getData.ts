import { Config } from "./config";
import fs from 'node:fs';
import { root } from "./app";

export async function getData(text: string, voice: string): Promise<string | null> {
    const name: string = `${root}/${new Date().getTime()}.mp3`;

    let res = await fetch(Config.api + '/api/generation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "text": text,
            "voice": voice
        })
    })
        .then(async (_res) => await _res.json())
        .catch(console.error);

    fs.writeFileSync(name, Buffer.from(res?.data?.replace?.('data:audio/mp3; codecs=opus;base64,', ''), 'base64'));
    return res?.data ? name : null;
};