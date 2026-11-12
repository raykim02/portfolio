// Site-wide settings and helpers. Edit SITE to change name/intro/contact.
export const SITE = {
  name: 'Raymond Kim',
  title: 'Raymond Kim — Portfolio',
  description: 'TODO: one-sentence description used in search results and link previews.',
  email: 'hkapray@gmail.com',
  linkedin: 'https://www.linkedin.com/in/raykim02',
  github: 'https://github.com/raykim02',
};

export const NAV = [
  { href: '/about', label: 'About' },
  { href: '/experience', label: 'Experience' },
  { href: '/projects', label: 'Projects' },
  { href: '/other', label: 'Other' },
];

/** Prefix an internal path with the configured base (e.g. /portfolio). */
export function url(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

/** "Mar 2026" */
export function monthYear(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
}
