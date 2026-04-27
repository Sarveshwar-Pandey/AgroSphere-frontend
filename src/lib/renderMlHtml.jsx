import React from 'react';

const ALLOWED = new Set(['BR', 'B', 'I']);

function walk(node, keyPrefix = 'n') {
  if (node.nodeType === Node.TEXT_NODE) {
    const t = node.textContent || '';
    return t;
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return null;

  const tag = node.tagName;
  const children = Array.from(node.childNodes).map((c, i) => walk(c, `${keyPrefix}-${i}`)).filter((v) => v !== null && v !== undefined);

  if (!ALLOWED.has(tag)) {
    return <React.Fragment key={keyPrefix}>{children}</React.Fragment>;
  }

  if (tag === 'BR') return <br key={keyPrefix} />;
  if (tag === 'B') return <strong key={keyPrefix} className="font-medium">{children}</strong>;
  if (tag === 'I') return <em key={keyPrefix} className="italic">{children}</em>;

  return <React.Fragment key={keyPrefix}>{children}</React.Fragment>;
}

export function renderMlHtml(html) {
  if (!html) return null;
  const safe = String(html)
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '');

  const doc = new DOMParser().parseFromString(`<div>${safe}</div>`, 'text/html');
  const root = doc.body.firstChild;
  if (!root) return safe;

  return (
    <div className="leading-[1.85] tracking-wide text-neutral-900/75">
      {Array.from(root.childNodes).map((n, i) => walk(n, `r-${i}`))}
    </div>
  );
}

