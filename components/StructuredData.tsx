"use client";

import React from 'react';
import Script from 'next/script';

interface StructuredDataProps {
  type: string;
  data: Record<string, unknown>;
}

const StructuredData: React.FC<StructuredDataProps> = ({ type, data }) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": type,
          ...data,
        }),
      }}
    />
  );
};

// Pre-configured schema components
export const PersonSchema = () => {
  const personData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Niloy Kumar Barman Panday",
    jobTitle: "Full-Stack .NET Developer",
    description: "Professional Full-Stack .NET Developer with 10+ years of experience specializing in scalable applications, cloud solutions with .NET, React, Azure & AWS.",
    url: "https://biswajitpanday.github.io",
    sameAs: [
      "https://github.com/biswajitpanday",
      "https://www.linkedin.com/in/biswajitpanday/",
      "https://medium.com/@biswajitpanday"
    ],
    image: "https://biswajitpanday.github.io/assets/photo.webp",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dhaka",
      addressCountry: "Bangladesh"
    },
    email: "biswajitmailid@gmail.com",
    telephone: "+880 1681642502",
    knowsAbout: [
      ".NET Development",
      "React Development", 
      "Azure Cloud",
      "AWS Cloud",
      "DevOps",
      "Full-Stack Development"
    ]
  };

  return (
    <Script
      id="person-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(personData),
      }}
    />
  );
};

export const WebSiteSchema = () => {
  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Niloy Kumar Barman Panday - Portfolio",
    description: "Professional portfolio showcasing Full-Stack .NET development expertise, cloud solutions, and innovative projects.",
    url: "https://biswajitpanday.github.io",
    author: {
      "@type": "Person",
      name: "Niloy Kumar Barman Panday"
    },
    inLanguage: "en-US",
    copyrightYear: new Date().getFullYear(),
    copyrightHolder: {
      "@type": "Person", 
      name: "Niloy Kumar Barman Panday"
    },
    logo: "https://biswajitpanday.github.io/assets/photo.webp",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://biswajitpanday.github.io/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <Script
      id="website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(websiteData),
      }}
    />
  );
};

export const OrganizationSchema = () => {
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Niloy Kumar Barman Panday - Full-Stack Development Services",
    description: "Professional Full-Stack .NET development services specializing in scalable web applications, cloud solutions, and modern development practices.",
    url: "https://biswajitpanday.github.io",
    founder: {
      "@type": "Person",
      name: "Niloy Kumar Barman Panday"
    },
    serviceType: "Software Development",
    areaServed: "Worldwide",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Development Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Full-Stack .NET Development"
          }
        },
        {
          "@type": "Offer", 
          itemOffered: {
            "@type": "Service",
            name: "React Frontend Development"
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service", 
            name: "Cloud Solutions (Azure/AWS)"
          }
        }
      ]
    },
    image: ['https://biswajitpanday.github.io/assets/photo.webp']
  };

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(organizationData),
      }}
    />
  );
};

// Generate WebPage schema for specific pages
export const generateWebPageSchema = (
  title: string, 
  description: string, 
  path: string, 
  images: string[] = []
) => ({
  name: title,
  description: description,
  url: `https://biswajitpanday.github.io${path}`,
  isPartOf: {
    '@type': 'WebSite',
    name: 'Niloy Kumar Barman Panday - Portfolio',
    url: 'https://biswajitpanday.github.io'
  },
  image: images.length > 0 ? images : ['https://biswajitpanday.github.io/assets/photo.webp']
});

export default StructuredData; 