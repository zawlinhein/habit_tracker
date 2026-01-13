import type { Response, Request } from 'express';
import type { AuthRequest } from '../middlewares/auth.ts';
import db from '../db/connection.ts';
import { eq, and } from 'drizzle-orm';
import { habits, habitTags } from '../db/schema.ts';

export const postHabit = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, frequency, targetCount, tagsId } = req.body;
    const result = await db.transaction(async (tx) => {
      const [habit] = await tx
        .insert(habits)
        .values({
          userId: req.user.id,
          name,
          description,
          frequency,
          targetCount,
        })
        .returning();
      const habitTagValues = tagsId.map((tagId) => ({
        tagId,
        habitId: habit.id,
      }));
      await tx.insert(habitTags).values(habitTagValues);
      return habit;
    });
    return res.status(201).json({
      message: 'Habit created successfully',
      id: result.id,
      name: result.name,
    });
  } catch (e) {
    console.error('Habit controller Error:', e);
    return res.status(500).json({ message: "Can't create new habit." });
  }
};

export const getUserHabits = async (req: AuthRequest, res: Response) => {
  try {
    const userHabits = await db.query.habits.findMany({
      where: eq(habits.userId, req.user.id),
      with: { habitTags: { with: { tag: true } } },
    });
    return res.status(200).json({ user: req.user, data: userHabits });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Can't retrive data" });
  }
};

export const getHabitById = async (req: AuthRequest, res: Response) => {
  try {
    const userHabit = await db.query.habits.findFirst({
      where: and(eq(habits.id, req.params.id), eq(habits.userId, req.user.id)),
      with: { habitTags: { with: { tag: true } } },
    });
    if (!userHabit)
      return res.status(404).json({ message: 'Habit not found!' });
    const result = {
      ...userHabit,
      tags: userHabit.habitTags.map((ht) => ht.tag),
      habitTags: undefined,
    };
    return res.status(200).json({ user: req.user, data: result });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Can't retrive data" });
  }
};

export const deleteHabit = async (req: AuthRequest, res: Response) => {
  try {
    const [result] = await db
      .delete(habits)
      .where(and(eq(habits.id, req.params.id), eq(habits.userId, req.user.id)))
      .returning();
    if (!result) return res.status(404).json({ message: 'Habit not found!' });
    return res
      .status(200)
      .json({ message: 'Habit deleted successfully', id: result.id });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Can't delete habit" });
  }
};

export const updateHabit = async (req: AuthRequest, res: Response) => {
  try {
    const { tagIds, ...habit } = req.body;
    const result = await db.transaction(async (tx) => {
      const [updatedHabit] = await tx
        .update(habits)
        .set({ ...habit, updatedAt: new Date() })
        .where(
          and(eq(habits.userId, req.user.id), eq(habits.id, req.params.id))
        )
        .returning();
      if (!updatedHabit)
        return res.status(404).json({ messgae: 'Habit no found!' });
      if (tagIds != undefined) {
        await tx.delete(habitTags).where(eq(habitTags.habitId, req.params.id));

        if (tagIds.length > 0) {
          const habitTagValues = tagIds.map((id) => ({
            tagId: id,
            habitId: req.params.id,
          }));
          await tx.insert(habitTags).values(habitTagValues);
        }
      }
      return updatedHabit;
    });

    return res
      .status(200)
      .json({ message: 'Habit updated successfully', data: result });
  } catch (e) {
    console.error(e);
    return res.status(500).json("Can't update habit.");
  }
};
