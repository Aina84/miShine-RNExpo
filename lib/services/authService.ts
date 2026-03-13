import AsyncStorage from '@react-native-async-storage/async-storage';
import { and, eq } from 'drizzle-orm';
import { db } from '../database/db';
import { users } from '../database/schema';

const AUTH_KEY = 'echurch_user_session';

export type User = {
    id: number;
    name: string;
    email: string;
}

export const authService = {
    async login(email: string, password: string): Promise<User | null> {
        try {
            const result = await db.select()
                .from(users)
                .where(and(eq(users.email, email), eq(users.password, password)))
                .limit(1)
                .all();

            if (result.length > 0) {
                const user = {
                    id: result[0].id,
                    name: result[0].name,
                    email: result[0].email,
                };
                await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(user));
                return user;
            }
            return null;
        } catch (error) {
            console.error("Login error:", error);
            return null;
        }
    },

    async register(name: string, email: string, password: string): Promise<User | null> {
        try {
            // Check if user already exists
            const existing = await db.select()
                .from(users)
                .where(eq(users.email, email))
                .limit(1)
                .all();

            if (existing.length > 0) {
                throw new Error("Cet email est déjà utilisé");
            }

            const result = await db.insert(users).values({
                name,
                email,
                password,
            }).returning();

            if (result.length > 0) {
                const user = {
                    id: result[0].id,
                    name: result[0].name,
                    email: result[0].email,
                };
                await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(user));
                return user;
            }
            return null;
        } catch (error) {
            console.error("Registration error:", error);
            throw error;
        }
    },


    async logout() {
        try {
            await AsyncStorage.removeItem(AUTH_KEY);
        } catch (error) {
            console.error("Logout error:", error);
        }
    },

    async getCurrentUser(): Promise<User | null> {
        try {
            const session = await AsyncStorage.getItem(AUTH_KEY);
            return session ? JSON.parse(session) : null;
        } catch (error) {
            console.error("Get current user error:", error);
            return null;
        }
    }
};
