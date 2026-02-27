import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Career Journey",
  description: "Explore Niloy Kumar Barman Panday's professional journey as a software developer, from early career to senior roles. Highlights of key projects and career milestones.",
  keywords: [
    "Career Journey", 
    "Professional Growth", 
    "Software Development Career", 
    "Career Timeline",
    "Professional Achievements",
    "Career Progression",
    "Software Engineer Career",
    "Career Development"
  ],
  openGraph: {
    title: "Career Journey | Niloy Kumar Barman Panday",
    description: "Explore my professional journey as a software developer, from early career to senior roles",
    url: "https://biswajitpanday.github.io/career",
  },
  twitter: {
    title: "Career Journey | Niloy Kumar Barman Panday",
    description: "Explore my professional journey as a software developer, from early career to senior roles",
  },
};

export default function CareerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 