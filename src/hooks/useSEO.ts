import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalPath?: string;
  ogImage?: string;
  ogType?: string;
  schema?: object | object[];
}

const BASE_URL = 'https://himalayanvalleyhomestead.in';
const DEFAULT_IMAGE = `${BASE_URL}/hhs-hero-6.jpg`;
const SITE_NAME = 'Himalayan Valley Homestead';

function setMetaByName(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.name = name;
    document.head.appendChild(el);
  }
  el.content = content;
}

function setMetaByProperty(property: string, content: string) {
  let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.content = content;
}

export function useSEO({
  title,
  description,
  keywords,
  canonicalPath = '',
  ogImage = DEFAULT_IMAGE,
  ogType = 'website',
  schema,
}: SEOProps) {
  useEffect(() => {
    const previousTitle = document.title;

    document.title = `${title} | ${SITE_NAME}`;

    setMetaByName('description', description);
    if (keywords) setMetaByName('keywords', keywords);

    setMetaByProperty('og:title', `${title} | ${SITE_NAME}`);
    setMetaByProperty('og:description', description);
    setMetaByProperty('og:url', `${BASE_URL}${canonicalPath}`);
    setMetaByProperty('og:image', ogImage);
    setMetaByProperty('og:type', ogType);

    setMetaByName('twitter:title', `${title} | ${SITE_NAME}`);
    setMetaByName('twitter:description', description);
    setMetaByName('twitter:image', ogImage);

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `${BASE_URL}${canonicalPath}`;

    let schemaEl = document.getElementById('page-schema') as HTMLScriptElement | null;
    if (schema) {
      if (!schemaEl) {
        schemaEl = document.createElement('script');
        schemaEl.id = 'page-schema';
        schemaEl.type = 'application/ld+json';
        document.head.appendChild(schemaEl);
      }
      schemaEl.textContent = JSON.stringify(schema);
    } else if (schemaEl) {
      schemaEl.remove();
    }

    return () => {
      document.title = previousTitle;
      const el = document.getElementById('page-schema');
      if (el) el.remove();
    };
  }, [title, description, keywords, canonicalPath, ogImage, ogType, schema]);
}
