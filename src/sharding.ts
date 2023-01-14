import { ShardingManager } from 'discord.js';
import { Config } from './config';

// ------------------------------- start shards

try {
    const manager = new ShardingManager('./app.js', {
        token: Config.token,
        totalShards: 2,
    });

    manager.on('shardCreate', (shard) => {
        console.log(`\x1b[35mConnecting shard #${shard.id}\x1b[0m`);
    });

    manager.spawn();
} catch (e) {
    console.log(e);
}