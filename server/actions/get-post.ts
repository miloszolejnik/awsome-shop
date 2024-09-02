'use server';

import { db } from '@/server';
export default async function getPost() {
  const posts = await db.query.posts.findMany();
  if (!posts) {
    return { error: 'No posts found' };
  } else {
    return { success: posts };
  }
}
