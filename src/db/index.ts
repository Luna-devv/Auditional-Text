import { Generated, Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { Config } from '../config';

export const db = new Kysely<Database>({
    dialect: new PostgresDialect({
        pool: new Pool(Config.postgres)
    })
});

export interface DatabaseGuild {
    id: string;
    timeout: Generated<number>;
}

export interface DatabaseUser {
    id: string;
    default_voice: Generated<string | null>;

    command_uses: Generated<number>;
    verification_valid_until: Generated<number | null>;
}

interface Database {
    guilds: DatabaseGuild;
    users: DatabaseUser
}