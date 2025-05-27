import { DatabaseContext } from '../instance';
import initialMigrationsIndexes from './01_initialMigrationsIndexes';
import initialUsersIndexes from './02_initialUsersIndexes';
import addDefaultLocaleSetting from './03_addDefaultLocaleSetting';
import initialUser from './04_initialUser';

export interface Migration {
    identifier: string;
    up: (context: DatabaseContext) => Promise<void>;
    squash?: (Migration | string)[];
}

const migrations: Migration[] = [initialMigrationsIndexes, initialUsersIndexes, addDefaultLocaleSetting, initialUser];

export default migrations;
