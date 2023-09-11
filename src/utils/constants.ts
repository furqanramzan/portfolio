import process from 'node:process';

export const siteUrl = process.env.SITE_URL;

export const name = 'Muhammad Furqan';

export const shortName = 'Furqan';

export const color = '#111827';

export const twitterUsername = 'furqanramzan96';

export const links = {
  home: { name: 'Home', href: '/' },
  about: { name: 'About', href: '/about' },
  skill: { name: 'Skills', href: '/skills' },
  project: { name: 'Projects', href: '/projects' },
  repository: { name: 'Repositories', href: '/repositories' },
  resume: {
    name: 'Resume',
    href: '/resume',
  },
};
type Links = typeof links;
export type LinkKey = keyof Links;

export const navLinks: LinkKey[] = [
  'about',
  'skill',
  'project',
  'repository',
  'resume',
];
