import { getQueryFunction } from "@/lib/serverFunctions/_utils/getQueryFunction"

export const clearDb = async () => {
  await getQueryFunction()`delete from comment_reactions`
  await getQueryFunction()`delete from flags`
  await getQueryFunction()`delete from comment_snapshots`
  await getQueryFunction()`delete from comments`
  await getQueryFunction()`delete from goals`
  await getQueryFunction()`delete from threads`
  await getQueryFunction()`delete from topics`
  await getQueryFunction()`delete from categories`
  await getQueryFunction()`delete from user_awards`
  await getQueryFunction()`delete from projects`
  await getQueryFunction()`delete from user_sprints`
  await getQueryFunction()`delete from users`
}
