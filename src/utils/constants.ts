export const name = 'Muhammad Furqan';

export const shortName = 'Furqan';

export const color = '#111827';

export const links = {
  home: { name: 'Home', href: '/' },
  about: { name: 'About', href: '/about' },
  skill: { name: 'Skills', href: '/skill' },
  project: { name: 'Projects', href: '/project' },
  repository: { name: 'Repositories', href: '/repository' },
  educationandexperience: {
    name: 'Education and Experience',
    href: '/education-and-experience',
  },
};
type Links = typeof links;
type LinkKey = keyof Links;

export const navLinks: LinkKey[] = [
  'about',
  'skill',
  'project',
  'repository',
  'educationandexperience',
];
