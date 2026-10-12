'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
const ContentContext = createContext<any>({});

export const ContentProvider = ({ children, initialData, initialBlogs }: { children: React.ReactNode, initialData?: any, initialBlogs?: any[] }) => {
  // Nested providers (page routes / TemplateWrapper) only override the content slice —
  // inherit the blog list from the parent (root layout) provider instead of refetching.
  const parent = useContext(ContentContext);

  // Initialize with server-provided data to eliminate "loading" states on mount
  const [content, setContent] = useState<any>(initialData || {});
  const [blogs, setBlogs] = useState<any[]>(initialBlogs ?? parent?.allBlogs ?? []);
  const [isLoading, setIsLoading] = useState(!initialData);

  // Keep server-rendered props authoritative: if the server re-renders this subtree with
  // new data (e.g. after a revalidate), reflect it instead of holding the first snapshot.
  useEffect(() => {
    if (initialData) setContent(initialData);
  }, [initialData]);

  useEffect(() => {
    if (initialBlogs !== undefined) setBlogs(initialBlogs);
    else if (Array.isArray(parent?.allBlogs)) setBlogs(parent.allBlogs);
  }, [initialBlogs, parent?.allBlogs]);

  useEffect(() => {
    // Server data was provided — NEVER refetch on the client. The old code refetched whenever
    // `initialBlogs` was omitted (every nested provider), pulled a cached/stale /api/content and
    // overwrote the fresh server-rendered content a few seconds after the page appeared.
    if (initialData) {
      setIsLoading(false);
      return;
    }

    const fetchContent = async () => {
      try {
        const [contentRes, blogRes] = await Promise.all([
          fetch('/api/content', { cache: 'no-store' }),
          initialBlogs === undefined ? fetch('/api/blog', { cache: 'no-store' }) : Promise.resolve(null)
        ]);

        if (contentRes.ok) {
          setContent(await contentRes.json());
        }

        if (blogRes && blogRes.ok) {
          setBlogs(await blogRes.json());
        }
      } catch (error) {
        console.error('Failed to fetch content from DB:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [initialData, initialBlogs]);

  return (
    <ContentContext.Provider value={{ ...content, allBlogs: blogs }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContentContext = () => useContext(ContentContext);
