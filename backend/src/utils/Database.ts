import knex from 'knex';
import path from 'path';

export const db = knex({
  client: 'sqlite3',
  connection: {
    filename: path.join(__dirname, '../../database.sqlite')
  },
  useNullAsDefault: true
});

export const initDb = async () => {
    // According to ErDiagram.md
    if (!await db.schema.hasTable('USERS')) {
        await db.schema.createTable('USERS', table => {
            table.increments('user_id').primary();
            table.string('name');
            table.string('email').unique();
            table.string('password');
            table.string('role');
            table.datetime('created_at').defaultTo(db.fn.now());
        });
    }

    if (!await db.schema.hasTable('TRANSACTIONS')) {
        await db.schema.createTable('TRANSACTIONS', table => {
            table.string('transaction_id').primary(); 
            table.string('account_id');
            table.float('amount');
            table.string('currency');
            table.string('merchant');
            table.string('status');
            table.float('risk_score');
            table.datetime('created_at').defaultTo(db.fn.now());
        });
    }

    if (!await db.schema.hasTable('ALERTS')) {
        await db.schema.createTable('ALERTS', table => {
            table.string('alert_id').primary();
            table.string('transaction_id').references('transaction_id').inTable('TRANSACTIONS');
            table.integer('assigned_to').references('user_id').inTable('USERS');
            table.string('status');
            table.datetime('created_at').defaultTo(db.fn.now());
        });
    }

    if (!await db.schema.hasTable('AUDIT_LOGS')) {
        await db.schema.createTable('AUDIT_LOGS', table => {
            table.increments('log_id').primary();
            table.integer('user_id').references('user_id').inTable('USERS');
            table.string('action');
            table.datetime('timestamp').defaultTo(db.fn.now());
        });
    }
};
