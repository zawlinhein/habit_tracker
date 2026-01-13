import { execSync } from 'child_process';
import { db } from '../../src/db/connection.ts';
import {
  users,
  habits,
  habitTags,
  entries,
  tags,
} from '../../src/db/schema.ts';
import { sql } from 'drizzle-orm';

export default async function setup() {
  console.log('Setting up testing Database!');
  try {
    await db.execute(sql`DROP TABLE IF EXISTS ${entries} CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS ${habits} CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS ${users} CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS ${tags} CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS ${habitTags} CASCADE`);

    console.log('Pushing schema to test database!');
    execSync(
      `npx drizzle-kit push --url="${process.env.DATABASE_URL}" --schema="./src/db/schema.ts" --dialect="postgresql"`,
      {
        stdio: 'inherit',
        cwd: process.cwd(),
      }
    );
    console.log('✅ Test database setup complete');
  } catch (e) {
    console.log('❌Fail to setup test database!', e);
    throw e;
  }

  return async () => {
    console.log('🧹 Tearing down test database...');

    try {
      // Final cleanup - drop all test data
      await db.execute(sql`DROP TABLE IF EXISTS ${entries} CASCADE`);
      await db.execute(sql`DROP TABLE IF EXISTS ${habits} CASCADE`);
      await db.execute(sql`DROP TABLE IF EXISTS ${users} CASCADE`);

      console.log('✅ Test database teardown complete');
      process.exit(0);
    } catch (error) {
      console.error('❌ Failed to teardown test database:', error);
    }
  };
}
