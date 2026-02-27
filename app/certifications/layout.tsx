import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Professional Certifications",
  description: "View my professional certifications, course completions, and training credentials. Browse industry certifications including Microsoft Azure and more.",
  keywords: [
    "Certifications", 
    "Microsoft Azure Certified", 
    "Azure Fundamentals", 
    "Professional Development",
    "Continuous Learning",
    "Technical Credentials",
    "LinkedIn Learning Certifications"
  ],
  openGraph: {
    title: "Professional Certifications | Niloy Kumar Barman Panday",
    description: "Explore my professional certifications, demonstrating expertise and commitment to continuous learning in software development and cloud technologies.",
    type: "website",
    url: "https://biswajitpanday.github.io/certifications",
    images: [
      {
        url: "https://biswajitpanday.github.io/assets/certificates/microsoft-certified-fundamentals-badge.svg",
        width: 400,
        height: 400,
        alt: "Microsoft Azure Fundamentals Certification",
      }
    ],
  },
  twitter: {
    title: "Professional Certifications | Niloy Kumar Barman Panday",
    description: "Explore my professional certifications and credentials in software development and cloud technologies.",
  },
};

export default function CertificationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 