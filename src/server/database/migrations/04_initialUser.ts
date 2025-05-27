import { cryptPassword } from '../../schema/resolvers/mutations/createAccount';
import { DatabaseContext } from '../instance';

export default {
    identifier: '04_initialUser',

    async up({ regular: { db } }: DatabaseContext): Promise<void> {
        const password = await cryptPassword('password');

        await db.collection('users').insertOne({
            displayName: 'admin',
            username: 'admin',
            password,
            email: 'admin@admin.com',
            role: 'admin',
        });
    },
};
