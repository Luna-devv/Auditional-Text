import { ShardingManager } from 'discord.js';

import { Boot, Config } from './config';

// ------------------------------- start shards

console.clear();
console.log(`\x1b[36m${Boot}\x1b[0m`);
console.log(`\x1b[36mStarting ${Config.shards} shards.\n\x1b[0m`);

try {
    let count = 0;
    const manager = new ShardingManager('./app.js', {
        token: Config.token,
        totalShards: Config.shards,
    });

    manager.on('shardCreate', (shard) => {
        console.log(`\x1b[35m\x1b[1mConnecting shard #${shard.id}.\x1b[0m`); count++;

        shard.on('ready', () => {
            console.log(`\x1b[35m\x1b[1mShard #${shard.id} is connected.\x1b[0m`);

            if (count === Config.shards) {
                console.log('\n\x1b[36mAll shards are connected.\x1b[0m');
            }
        });
    });

    manager.spawn();
} catch (e) {
    console.log(e);
}