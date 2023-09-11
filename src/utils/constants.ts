export const name = 'Muhammad Furqan';

export const shortName = 'Furqan';

export const color = '#111827';

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
type LinkKey = keyof Links;

export const navLinks: LinkKey[] = [
  'about',
  'skill',
  'project',
  'repository',
  'resume',
];
