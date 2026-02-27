import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: "Explore my diverse range of projects showcasing expertise in full-stack development, cloud solutions, and modern web technologies.",
  keywords: [
    "projects",
    "full-stack development",
    "web applications",
    "software projects",
    "development showcase"
  ],
  openGraph: {
    title: "Projects - Niloy Kumar Barman Panday's Work Showcase",
    description: "Explore innovative full-stack projects, .NET applications, React apps, and cloud solutions",
    url: "https://biswajitpanday.github.io/projects",
  },
  twitter: {
    title: "Projects - Niloy Kumar Barman Panday's Work Showcase",
    description: "Explore innovative full-stack projects, .NET applications, React apps, and cloud solutions",
  },
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 