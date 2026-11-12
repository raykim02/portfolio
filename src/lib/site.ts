// Site-wide settings and helpers. Edit SITE to change name/intro/contact.
export const SITE = {
  name: 'Your Name', // TODO: real name
  title: 'Your Name — Portfolio', // TODO
  description: 'TODO: one-sentence description used in search results and link previews.',
  email: 'you@example.com', // TODO
  linkedin: 'https://www.linkedin.com/in/your-handle', // TODO
  github: 'https://github.com/your-handle', // TODO
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
