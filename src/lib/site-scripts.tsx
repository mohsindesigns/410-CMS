import React from 'react';

export interface SiteScript {
  id: string;
  name: string;
  location: 'head' | 'body_start' | 'body_end';
  code: string;
  active: boolean;
  createdAt?: string;
}

export interface ParsedElement {
  tag: 'script' | 'noscript' | 'style' | 'link' | 'meta';
  attrs: Record<string, any>;
  content?: string;
}

/**
 * Parses HTML attributes into a key-value dictionary compatible with React props.
 */
export function parseAttributes(attrString: string): Record<string, any> {
  const attrs: Record<string, any> = {};
  if (!attrString) return attrs;

  // Match: name="val", name='val', name=val, or boolean attribute name
  const attrRegex = /([a-zA-Z0-9_-]+)(?:=(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
  let match: RegExpExecArray | null;

  while ((match = attrRegex.exec(attrString)) !== null) {
    let name = match[1];
    const val = match[2] !== undefined ? match[2] : match[3] !== undefined ? match[3] : match[4] !== undefined ? match[4] : true;

    // React prop normalization
    const lower = name.toLowerCase();
    if (lower === 'crossorigin') name = 'crossOrigin';
    else if (lower === 'class') name = 'className';
    else if (lower === 'for') name = 'htmlFor';
    else if (lower === 'charset') name = 'charSet';
    else if (lower === 'httpequiv' || lower === 'http-equiv') name = 'httpEquiv';

    attrs[name] = val;
  }
  return attrs;
}

/**
 * Parses raw code/HTML snippets into structured elements (<script>, <noscript>, <style>, <link>, <meta>).
 */
export function parseScriptSnippet(code: string): ParsedElement[] {
  if (!code || !code.trim()) return [];

  const elements: ParsedElement[] = [];

  // Match tags: <script>, <noscript>, <style>, <link>, <meta>
  const tagRegex = /<(script|noscript|style)([\s\S]*?)>(?:([\s\S]*?)<\/\1>)?|<(link|meta)([\s\S]*?)\/?>/gi;

  let match: RegExpExecArray | null;
  let hasTags = false;

  while ((match = tagRegex.exec(code)) !== null) {
    hasTags = true;
    if (match[1]) {
      const tagName = match[1].toLowerCase() as 'script' | 'noscript' | 'style';
      const rawAttrs = match[2] || '';
      const content = match[3] || '';
      const attrs = parseAttributes(rawAttrs);
      elements.push({ tag: tagName, attrs, content: content.trim() });
    } else if (match[4]) {
      const tagName = match[4].toLowerCase() as 'link' | 'meta';
      const rawAttrs = match[5] || '';
      const attrs = parseAttributes(rawAttrs);
      elements.push({ tag: tagName, attrs });
    }
  }

  // If no HTML tags were detected, check if it's a bare JavaScript snippet
  if (!hasTags) {
    const stripped = code.replace(/<!--[\s\S]*?-->/g, '').trim();
    if (stripped) {
      elements.push({ tag: 'script', attrs: {}, content: stripped });
    }
  }

  return elements;
}

/**
 * Renders CMS-managed tracking and integration scripts.
 */
export function SiteScriptsRenderer({
  scripts,
  location,
}: {
  scripts: SiteScript[];
  location: 'head' | 'body_start' | 'body_end';
}) {
  if (!scripts || scripts.length === 0) return null;

  return (
    <>
      {scripts.map((script) => {
        const elements = parseScriptSnippet(script.code);

        // Fallback for non-standard HTML or plain markup in body locations
        if (elements.length === 0) {
          const trimmed = script.code.trim();
          if (!trimmed) return null;
          if (location === 'head') {
            return (
              <script
                key={script.id}
                suppressHydrationWarning
                dangerouslySetInnerHTML={{ __html: trimmed }}
              />
            );
          }
          return (
            <div
              key={script.id}
              suppressHydrationWarning
              style={{ display: 'contents' }}
              dangerouslySetInnerHTML={{ __html: trimmed }}
            />
          );
        }

        return elements.map((el, index) => {
          const elementKey = `${script.id}-${index}`;

          if (el.tag === 'script') {
            return (
              <script
                key={elementKey}
                suppressHydrationWarning
                {...el.attrs}
                {...(el.content ? { dangerouslySetInnerHTML: { __html: el.content } } : {})}
              />
            );
          }

          if (el.tag === 'noscript') {
            return (
              <noscript
                key={elementKey}
                suppressHydrationWarning
                dangerouslySetInnerHTML={{ __html: el.content || '' }}
              />
            );
          }

          if (el.tag === 'style') {
            return (
              <style
                key={elementKey}
                suppressHydrationWarning
                dangerouslySetInnerHTML={{ __html: el.content || '' }}
              />
            );
          }

          if (el.tag === 'link') {
            return <link key={elementKey} {...el.attrs} />;
          }

          if (el.tag === 'meta') {
            return <meta key={elementKey} {...el.attrs} />;
          }

          return null;
        });
      })}
    </>
  );
}
