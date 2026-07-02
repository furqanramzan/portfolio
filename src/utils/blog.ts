import type { CollectionEntry } from 'astro:content';
import { getCollection, getEntries } from 'astro:content';
import { sortByOrder } from './sort';

export async function getArticleSkills() {
  const articles = await getCollection('article');
  const allSkillEntries = articles.map((atricle) => atricle.data.skills).flat();
  const allSkills = await getEntries(allSkillEntries);

  const skillsMap = new Map<string, CollectionEntry<'skill'>>();
  allSkills.forEach((x) => skillsMap.set(x.id, x));
  const allSkillsArray = [...skillsMap.values()];

  return sortByOrder(allSkillsArray);
}
