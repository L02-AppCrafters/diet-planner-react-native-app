import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const CreateNewUser = mutation({
  args: {
    email: v.string(),
    name: v.string()
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.query('users')
      .filter(q => q.eq(q.field('email'), args.email))
      .collect();

    if (user?.length == 0) {
      const data = {
        name: args.name,
        email: args.email,
        credit: 10
      }

      const userId = await ctx.db.insert('users', {
        ...data
      });

      return await ctx.db.get(userId);
    }

    return user[0];
  }
})

export const GetUser = query({
  args: {
    email: v.string()
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.query('users')
      .filter(q => q.eq(q.field('email'), args.email))
      .collect();

    return user[0];
  }
})

export const UpdateUserPreferences = mutation({
  args: {
    uid: v.id('users'),
    weight: v.string(),
    height: v.string(),
    gender: v.string(),
    goal: v.string(),
    calories: v.optional(v.number()),
    proteins: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.patch(args.uid, {
      height: args.height,
      weight: args.weight,
      gender: args.gender,
      goal: args.goal,
      calories: args.calories,
      proteins: args.proteins
    });

    return result;
  }
})
