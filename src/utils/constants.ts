export const name = 'Fareed Hassan';

export const shortName = 'Fareed';

export const color = '#111827';

export const links = {
  home: { name: 'Home', href: '/' },
  about: { name: 'About', href: '/about' },
  toolandplatform: { name: 'Tools and Platforms', href: '/tool-and-platform' },
  educationandexperience: {
    name: 'Education and Experience',
    href: '/education-and-experience',
  },
  project: { name: 'Projects', href: '/project' },
};
type Links = typeof links;
type LinkKey = keyof Links;

export const navLinks: LinkKey[] = [
  'about',
  'toolandplatform',
  'educationandexperience',
  'project',
];
