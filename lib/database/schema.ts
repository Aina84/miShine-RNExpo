import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  password: text('password').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const sheeps = sqliteTable('sheeps', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  contact: text('contact').notNull(),
  adress: text('adress').notNull(),
  description: text('description').notNull(),
  role: text('role'),
  sexe: text('sexe'),
  status: text('status'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

export const rapports = sqliteTable('rapports', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title'),
  type: text('type'),
  desc: text('description'),
  date: text('date'),
  offering: text('offering'),
  dim: integer('dim').default(0),
  totalPresent: integer('present').default(0),
  totalNews: integer('news').default(0),
  author: text('auteur')
})

export const activities = sqliteTable('activities', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  icon: text('icon').notNull(),
  text: text('text').notNull(),
  time: text('time').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

export const finances = sqliteTable('finances', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  type: text('type'),
  category: text('category'),
  name: text('name'),
  amount: integer('amount'),
  date: text('date'),
  icon: text('icon'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

