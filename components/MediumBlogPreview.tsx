"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaMedium, FaExternalLinkAlt, FaClock, FaCalendar } from "@/lib/icons";

interface MediumPost {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  author: string;
  categories: string[];
  excerpt: string;
  thumbnail?: string;
  readTime: number;
}

interface MediumBlogPreviewProps {
  maxPosts?: number;
}

const MEDIUM_PROFILE_URL = "https://medium.com/@niloykumarbarman";
const DEFAULT_AUTHOR_NAME = "Niloy Kumar Barman";

// GitHub Pages detect
function isGitHubPages(): boolean {
  if (typeof window === "undefined") return false;
  return window.location.hostname.endsWith("github.io");
}

// Works for both local & GitHub Pages (handles basePath)
function withBasePath(path: string): string {
  if (!path.startsWith("/")) path = `/${path}`;

  // If you set <base href="/my-portfolio/"> in future, this also works
  if (typeof window !== "undefined") {
    const base = document.querySelector("base")?.getAttribute("href") || "/";
    const cleanBase = base.endsWith("/") ? base.slice(0, -1) : base;

    // "/" => no basePath
    if (cleanBase && cleanBase !== "/") return `${cleanBase}${path}`.replace(/\/{2,}/g, "/");
  }

  // Next.js basePath (optional if you use next.config basePath)
  const envBase = process.env.NEXT_PUBLIC_BASE_PATH || "";
  if (envBase) return `${envBase}${path}`.replace(/\/{2,}/g, "/");

  return path;
}

const MediumBlogPreview: React.FC<MediumBlogPreviewProps> = ({ maxPosts = 3 }) => {
  const [posts, setPosts] = useState<MediumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadFromStatic() {
      const res = await fetch(withBasePath("/data/medium-posts.json"), { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load /data/medium-posts.json");
      const data: MediumPost[] = await res.json();
      return (data || []).slice(0, maxPosts);
    }

    async function fetchPosts() {
      try {
        setLoading(true);
        setError(null);

        // GitHub Pages -> only static file (avoid CORS)
        if (isGitHubPages()) {
          const staticPosts = await loadFromStatic();
          if (!cancelled) setPosts(staticPosts);
          return;
        }

        // Normal hosting/local -> try API then fallback to static
        const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://portfolio-admin-blue.vercel.app";
        let response = await fetch(`${API_URL}/api/public/blog?source=medium&limit=${maxPosts}`);

        if (!response.ok) {
          console.warn("API fetch failed, falling back to static file");
          const staticPosts = await loadFromStatic();
          if (!cancelled) setPosts(staticPosts);
          return;
        }

        const apiData = await response.json();

        if (apiData?.success && Array.isArray(apiData?.data)) {
          const transformedPosts: MediumPost[] = apiData.data.map((post: any) => ({
            id: post.externalId || post._id || post.id || crypto.randomUUID?.() || String(Math.random()),
            title: post.title || "Untitled",
            link: post.externalUrl || post.link || "",
            pubDate: post.publishedDate || post.pubDate || new Date().toISOString(),
            author: post.author?.name || DEFAULT_AUTHOR_NAME,
            categories: Array.isArray(post.tags) ? post.tags : [],
            excerpt: post.excerpt || "",
            thumbnail: post.coverImage,
            readTime: typeof post.readTime === "number" ? post.readTime : 5,
          }));

          if (!cancelled) setPosts(transformedPosts.slice(0, maxPosts));
        } else {
          // Invalid API response -> fallback static
          console.warn("Invalid API response, falling back to static file");
          const staticPosts = await loadFromStatic();
          if (!cancelled) setPosts(staticPosts);
        }
      } catch (err) {
        console.error("Error loading Medium posts:", err);
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load posts");
          setPosts([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchPosts();

    return () => {
      cancelled = true;
    };
  }, [maxPosts]);

  const formatDate = (dateString: string) => {
    try {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(dateString));
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <section className="mt-16 pb-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white/90 mb-2">Latest Articles</h2>
            <p className="text-sm text-white/60">Loading recent posts from Medium...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-gray-900/50 border border-secondary-default/20 rounded-xl p-6 animate-pulse"
            >
              <div className="h-4 bg-white/10 rounded w-1/3 mb-4" />
              <div className="h-6 bg-white/10 rounded w-full mb-3" />
              <div className="h-4 bg-white/10 rounded w-full mb-2" />
              <div className="h-4 bg-white/10 rounded w-2/3" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mt-16 pb-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white/90 mb-2">Latest Articles</h2>
            <p className="text-sm text-white/60">
              Thoughts on full-stack development, AI, and cloud architecture
            </p>
          </div>
        </div>
        <div className="bg-gray-900/50 border border-yellow-500/30 rounded-xl p-8 text-center">
          <p className="text-yellow-400/80 mb-4">Unable to load recent articles</p>
          <Link
            href={MEDIUM_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-secondary-default hover:text-secondary-default/80 transition-colors"
          >
            <FaMedium className="text-lg" />
            <span>Visit my Medium profile</span>
            <FaExternalLinkAlt className="text-xs" />
          </Link>
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return (
      <section className="mt-16 pb-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white/90 mb-2">Latest Articles</h2>
            <p className="text-sm text-white/60">
              Thoughts on full-stack development, AI, and cloud architecture
            </p>
          </div>
        </div>
        <div className="bg-gray-900/50 border border-secondary-default/20 rounded-xl p-8 text-center">
          <p className="text-white/60 mb-4">No articles published yet. Stay tuned!</p>
          <Link
            href={MEDIUM_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-secondary-default hover:text-secondary-default/80 transition-colors"
          >
            <FaMedium className="text-lg" />
            <span>Follow on Medium</span>
            <FaExternalLinkAlt className="text-xs" />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-16 pb-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#00BFFF] to-[#0080FF] bg-clip-text text-transparent mb-2">
            Latest Articles
          </h2>
          <p className="text-sm text-white/60">
            Thoughts on full-stack development, AI, and cloud architecture
          </p>
        </div>
        <Link
          href={MEDIUM_PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-secondary-default/10 to-purple-500/10 hover:from-secondary-default/20 hover:to-purple-500/20 border border-secondary-default/30 hover:border-secondary-default/50 rounded-lg transition-all duration-300 text-sm text-secondary-default font-medium group"
        >
          <FaMedium className="text-base group-hover:scale-110 transition-transform" />
          <span>View All on Medium</span>
          <FaExternalLinkAlt className="text-xs" />
        </Link>
      </div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, index) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Link href={post.link} target="_blank" rel="noopener noreferrer" className="group block h-full">
              <div className="relative bg-gray-900/50 border border-secondary-default/20 rounded-xl overflow-hidden hover:border-secondary-default/40 transition-all duration-300 p-6 h-full flex flex-col">
                {/* External Link Badge */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded">
                    Medium
                  </span>
                  <span className="text-xs text-white/40 flex items-center gap-1">
                    <FaExternalLinkAlt className="text-[10px]" />
                    External
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-3 group-hover:bg-gradient-to-r group-hover:from-[#00BFFF] group-hover:to-[#0080FF] group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 line-clamp-2">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-sm text-white/60 leading-relaxed mb-4 line-clamp-3 flex-grow">
                  {post.excerpt}
                </p>

                {/* Tags */}
                {post.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.categories.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-xs bg-white/5 border border-white/10 rounded text-white/50"
                      >
                        {tag}
                      </span>
                    ))}
                    {post.categories.length > 3 && (
                      <span className="px-2 py-0.5 text-xs text-white/40">
                        +{post.categories.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center gap-4 pt-4 border-t border-white/10 text-xs text-white/50">
                  <span className="flex items-center gap-1.5">
                    <FaCalendar className="text-[10px]" />
                    {formatDate(post.pubDate)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FaClock className="text-[10px]" />
                    {post.readTime} min read
                  </span>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-secondary-default/0 to-blue-500/0 group-hover:from-secondary-default/5 group-hover:to-blue-500/5 transition-all duration-300 pointer-events-none rounded-xl" />
              </div>
            </Link>
          </motion.article>
        ))}
      </div>
    </section>
  );
};

export default MediumBlogPreview;