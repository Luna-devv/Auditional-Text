import { ShardingManager } from 'discord.js';
import { Config } from './config';

console.clear();
console.log(`\x1b[36mStarting ${Config.shards} shards.\n\x1b[0m`);

process.env.NODE_NO_WARNINGS = '1';

try {
    const manager = new ShardingManager(`${process.cwd()}/dist/app.js`, {
        token: Config.token,
        totalShards: Config.shards
    });

    manager.on('shardCreate', (shard) => {
        console.log(`\x1b[35m\x1b[1mConnecting shard #${shard.id}.\x1b[0m`);

        shard.on('ready', () => {
            console.log(`\x1b[35m\x1b[1mShard #${shard.id} is connected.\x1b[0m`);
        });
    });

    manager.spawn();
} catch (e) {
    console.log(e);
}