import { desc } from "drizzle-orm";
import { db } from "../database/db";
import { activities } from "../database/schema";

export const activityService = {
    async logActivity(icon: string, text: string) {
        try {
            const time = new Date().toISOString();
            await db.insert(activities).values({
                icon,
                text,
                time,
            });
        } catch (error) {
            console.error("Error logging activity:", error);
        }
    },

    async getRecentActivities(limit: number = 5) {
        try {
            return await db.select().from(activities).orderBy(desc(activities.createdAt)).limit(limit).all();
        } catch (error) {
            console.error("Error fetching activities:", error);
            return [];
        }
    }
};

