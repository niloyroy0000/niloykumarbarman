import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Technical Skills & Expertise",
  description: "Comprehensive overview of Niloy Kumar Barman Panday's technical expertise including .NET, React, cloud technologies, databases, DevOps tools, and modern development frameworks.",
  keywords: [
    "technical skills",
    "programming languages",
    ".NET",
    "React",
    "TypeScript",
    "Azure",
    "AWS",
    "cloud technologies",
    "DevOps",
    "databases",
    "software development skills"
  ],
  openGraph: {
    title: "Technical Skills & Expertise - Niloy Kumar Barman Panday",
    description: "Comprehensive overview of technical expertise including .NET, React, cloud technologies, and modern development frameworks",
    url: "https://biswajitpanday.github.io/skills",
  },
  twitter: {
    title: "Technical Skills & Expertise - Niloy Kumar Barman Panday",
    description: "Comprehensive overview of technical expertise including .NET, React, cloud technologies, and modern development frameworks",
  },
};

export default function SkillsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 