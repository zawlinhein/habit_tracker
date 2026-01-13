import { cleanupDB, createTestUser } from './dbHelper.ts';

describe('Test Setup', () => {
  test('Should connect to the test db', async () => {
    const { user } = await createTestUser();

    expect(user).toBeDefined();
    await cleanupDB();
  });
});
