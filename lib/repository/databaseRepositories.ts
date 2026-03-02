import { eq } from "drizzle-orm";
import { db } from "../database/db";
import { activities, reports, sheeps, users } from "../database/schema";

export class Repository<T extends { id: number }> {
    constructor(protected table: any) { }

    async findAll() {
        return await db.select().from(this.table);
    }

    async findById(id: number) {
        const results = await db.select().from(this.table).where(eq(this.table.id, id));
        return results[0] || null;
    }

    async create(data: any) {
        return await db.insert(this.table).values(data).returning();
    }

    async update(id: number, data: any) {
        return await db.update(this.table).set(data).where(eq(this.table.id, id)).returning();
    }

    async delete(id: number) {
        return await db.delete(this.table).where(eq(this.table.id, id)).returning();
    }
}

export const userRepository = new Repository(users);
export const sheepRepository = new Repository(sheeps);
export const reportRepository = new Repository(reports);
export const activityRepository = new Repository(activities);
