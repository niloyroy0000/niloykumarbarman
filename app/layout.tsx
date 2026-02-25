import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { PersonSchema, WebSiteSchema, OrganizationSchema } from "@/components/StructuredData";
import RootLayoutClient from "@/components/RootLayoutClient";
import { fetchProjects, fetchCertifications, fetchSkillHierarchy } from "@/lib/api-client";
import type { Project, Certification } from "@/types/api";

interface SkillHierarchyNode {
  name: string;
  metadata?: {
    icon?: string;
    level?: string;
    yearsOfExperience?: number;
    lastUsed?: string;
  };
  children?: SkillHierarchyNode[];
}

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Niloy Kumar Barman - Senior .NET Developer & AI Solutions Engineer",
    template: "%s |Niloy Kumar Barman"
  },
  description: "10+ years of experience supporting 20+ enterprise clients. Specialized in architecting scalable solutions and practical AI tools that deliver continuous ROI and measurable business impact. Expert in full-stack development and automation.",
  keywords: [
    "Niloy Kumar Barman",
    ".NET Architect",
    "Senior .NET Developer",
    "AI Solutions Engineer",
    "Enterprise Architecture",
    "Cloud Migration Expert",
    "Microservices Architecture",
    "Azure Architect",
    "AWS Solutions Architect",
    "DevOps Engineer",
    "Microsoft Certified",
    "Legacy System Modernization",
    "AI Integration",
    "Fortune 500 Experience",
    "C# Expert",
    "React Developer",
    "TypeScript",
    "Full-Stack Developer",
    "Software Architecture",
    "Dhaka Bangladesh",
    "ASP.NET Core",
    "Cloud Solutions",
    "System Modernization",
    "Next.js Developer",
    "API Development",
    "Docker",
    "CI/CD",
  ],
  authors: [{ name: "Niloy Kumar Barman" }],
  creator: "Niloy Kumar Barman",
  publisher: "Niloy Kumar Barman",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://biswajitpanday.github.io"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Niloy Kumar Barman - Senior .NET Developer & AI Solutions Engineer",
    description: "10+ years of experience supporting 20+ enterprise clients. Specialized in architecting scalable solutions and practical AI tools that deliver continuous ROI and measurable business impact. Expert in full-stack development and automation.",
    url: "https://biswajitpanday.github.io",
    siteName: "Niloy Kumar Barman Portfolio",
    images: [
      {
        url: "https://biswajitpanday.github.io/assets/social-preview.png",
        width: 1200,
        height: 630,
        alt: "Niloy Kumar Barman- Senior .NET Developer & AI Solutions Engineer | 10+ years supporting 20+ enterprise clients",
        type: "image/png",
      },
    ],
    locale: "en_US",
    type: "website",
    countryName: "Bangladesh",
  },
  twitter: {
    card: "summary_large_image",
    site: "@biswajitpanday",
    creator: "@biswajitpanday",
    title: "Niloy Kumar Barman - Senior .NET Developer & AI Solutions Engineer",
    description: "10+ years supporting 20+ enterprise clients. Architecting scalable solutions and practical AI tools with measurable ROI. Expert in full-stack development and automation.",
    images: {
      url: "https://biswajitpanday.github.io/assets/social-preview.png",
      alt: "Niloy Kumar Barman - Senior .NET Developer & AI Solutions Engineer",
      width: 1200,
      height: 630,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "6KDQC-2OeS6NjVA21G1MJ-svIYpHNBhnsWBS0LG85a4",
  },
  category: "technology",
  classification: "Business",
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'application-name': 'Niloy Kumar Barman Panday Portfolio',
    'apple-mobile-web-app-title': 'Niloy Kumar Barman Panday',
    'og:image:secure_url': 'https://biswajitpanday.github.io/assets/social-preview.png',
    'article:author': 'Niloy Kumar Barman Panday',
    'profile:first_name': 'Niloy Kumar Barman',
    'profile:last_name': 'Panday',
    'profile:gender': 'male',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch data for GlobalSearch at build time
  let projects: Project[] = [];
  let certifications: Certification[] = [];
  let skillsHierarchy: SkillHierarchyNode[] = [];

  try {
    [projects, certifications, skillsHierarchy] = await Promise.all([
      fetchProjects(),
      fetchCertifications(),
      fetchSkillHierarchy(),
    ]);
  } catch (error) {
    console.error('Failed to fetch layout data:', error);
    // Fallback to empty arrays
    projects = [];
    certifications = [];
    skillsHierarchy = [];
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <PersonSchema />
        <WebSiteSchema />
        <OrganizationSchema />
        <link rel="sitemap" href="/sitemap.xml" />

        {/* Only prefetch critical external resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

        <meta name="theme-color" content="#00ff99" />
        <meta name="msapplication-TileColor" content="#00ff99" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={jetBrainsMono.variable}>
        <RootLayoutClient
          projects={projects}
          certifications={certifications}
          skillsHierarchy={skillsHierarchy}
        >
          {children}
        </RootLayoutClient>
      </body>
    </html>
  );
}
