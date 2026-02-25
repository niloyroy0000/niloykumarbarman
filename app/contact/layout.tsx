import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Me",
  description: "Get in touch with Niloy Kumar Barman Panday for professional inquiries, collaboration opportunities, or to discuss your project needs. Contact via email, phone, or form.",
  keywords: [
    "Contact",
    "Get in touch",
    "Hire developer",
    "Project inquiry", 
    "Software development consultation",
    "Freelance developer",
    "Full-stack developer contact",
    "Dhaka Bangladesh"
  ],
  openGraph: {
    title: "Contact Niloy Kumar Barman Panday - Full-Stack Developer",
    description: "Get in touch for project inquiries, consultations, or collaboration opportunities",
    url: "https://biswajitpanday.github.io/contact",
  },
  twitter: {
    title: "Contact Niloy Kumar Barman Panday - Full-Stack Developer",
    description: "Get in touch for project inquiries, consultations, or collaboration opportunities",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 