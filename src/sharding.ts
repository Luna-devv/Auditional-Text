import { join } from 'path';
import { ClusterManager } from 'status-sharding';
import { Config } from './config';

if (!('bun' in process.versions)) throw new Error('Please use bun.');

const ext = __filename.split('.').pop();
if (ext === 'ts') throw new Error('Please use `bun run build` && `bun run start`!');

const manager = new ClusterManager(join(__dirname, 'app.' + ext), {
    mode: 'process',
    token: Config.token,
    shardsPerClusters: Config.dev ? 1 : 4,
    respawn: true,
    heartbeat: {
        enabled: true,
        maxMissedHeartbeats: 2,
        interval: 1_000 * 10,
        timeout: 1_000 * 12
    },
    spawnOptions: {
        delay: 6_000
    }
});

process.on('uncaughtException', console.log);
process.on('unhandledRejection', console.log);

manager.on('clusterCreate', (cluster) => {
    cluster.on('death', (shard) => {
        console.log('ctr', `Cluster #${shard.id} died`, 'red');
    });
});

void manager.spawn();