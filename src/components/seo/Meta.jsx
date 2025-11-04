import { useEffect } from 'react';

export default function Meta({ title, description, canonical }) {
  useEffect(() => {
    if (title) document.title = title;

    const set = (selector, make) => {
      let el = document.head.querySelector(selector);
      if (!el) {
        el = make();
        document.head.appendChild(el);
      }
      return el;
    };

    if (description) {
      const el = set('meta[name="description"]', () => {
        const m = document.createElement('meta');
        m.setAttribute('name', 'description');
        return m;
      });
      el.setAttribute('content', description);
    }

    if (canonical) {
      const el = set('link[rel="canonical"]', () => {
        const l = document.createElement('link');
        l.setAttribute('rel', 'canonical');
        return l;
      });
      el.setAttribute('href', canonical);
    }
  }, [title, description, canonical]);

  return null;
}
