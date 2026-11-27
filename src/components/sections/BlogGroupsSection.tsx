import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface BlogGroupView {
  title: string;
  serviceSlug?: string;
  posts: { _id: string; title: string; slug: string }[];
}

interface BlogGroupsSectionProps {
  label?: string;
  title?: string;
  description?: string;
  serviceCta?: string;
  groups: BlogGroupView[];
}

// All blog articles listed by topic (Admin > Pages > Services > Reviews & Blog > Blog topics).
export default function BlogGroupsSection({
  label = "Blog Topics",
  title = "Browse Articles by Treatment",
  description,
  serviceCta = "Explore Service",
  groups,
}: BlogGroupsSectionProps) {
  if (!Array.isArray(groups) || groups.length === 0) return null;

  return (
    <section id="blog-topics" className="bg-[#fbfbfa] py-16 md:py-24 border-t border-border-light/40">
      <div className="site-container">
        <div className="mb-10 md:mb-12 max-w-3xl">
          {label && <p className="section-label text-gold-dark mb-3 md:mb-4">{label}</p>}
          <h2 className="display-heading text-[28px] min-[400px]:text-[32px] md:text-[44px] text-dark leading-tight">{title}</h2>
          {description && <p className="text-dark/60 text-[15px] leading-relaxed mt-4 font-light">{description}</p>}
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-5 md:gap-6">
          {groups.map((group, i) => (
            <div
              key={`${group.title}-${i}`}
              className="break-inside-avoid mb-5 md:mb-6 bg-white border border-border-light rounded-sm p-5 sm:p-6"
            >
              <h3 className="flex items-baseline justify-between gap-3 text-dark font-bold text-[17px] leading-snug mb-4 pb-3 border-b border-border-light/60">
                <span>{group.title}</span>
                <span className="text-gold-dark text-[12px] font-bold tracking-wider" aria-label={`${group.posts.length} articles`}>
                  {group.posts.length}
                </span>
              </h3>
              <ul className="space-y-2.5">
                {group.posts.map((post) => (
                  <li key={post._id}>
                    <Link
                      href={`/blogs/${post.slug}/`}
                      className="group flex items-start gap-2 text-dark/75 hover:text-gold-dark text-[14px] leading-snug transition-colors duration-200"
                    >
                      <ArrowRight size={13} className="mt-[3px] flex-shrink-0 text-gold-dark/60 group-hover:text-gold-dark" />
                      <span>{post.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              {group.serviceSlug && (
                <Link
                  href={`/${group.serviceSlug}/`}
                  className="mt-5 pt-3 border-t border-border-light/60 flex items-center gap-2 text-gold-dark text-[11.5px] font-bold tracking-wider uppercase hover:gap-3 transition-all duration-200"
                >
                  {serviceCta} <ArrowRight size={13} />
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
