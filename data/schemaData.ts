/**
 * Schema.org structured data configurations for better SEO
 */

const baseUrl = 'https://biswajitpanday.github.io';

// Person schema for the portfolio owner
export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Niloy Kumar Barman Panday",
  jobTitle: "Senior .NET Architect & AI Solutions Engineer",
  description: "Senior .NET Architect with 10+ years delivering mid to enterprise grade applications. Currently at Optimizely serving global enterprise clients. Built SpireWiz achieving 80% efficiency gains, ~$180K annual value, and 600+ developer hours saved annually. Microsoft Certified.",
  url: baseUrl,
  sameAs: [
    "https://github.com/biswajitpanday",
    "https://www.linkedin.com/in/biswajitpanday/",
    "https://medium.com/@biswajitpanday"
  ],
  image: `${baseUrl}/assets/photo.webp`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dhaka",
    addressCountry: "Bangladesh"
  },
  email: "biswajitmailid@gmail.com",
  telephone: "+880 1681642502",
  knowsAbout: [
    ".NET Development",
    "Enterprise Architecture",
    "AI Integration",
    "Microservices Architecture",
    "Cloud Migration",
    "Azure Cloud",
    "AWS Cloud",
    "DevOps",
    "System Modernization"
  ]
};

// Website schema
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Niloy Kumar Barman Panday - Portfolio",
  description: "Professional portfolio showcasing Full-Stack .NET development expertise, cloud solutions, and innovative projects.",
  url: baseUrl,
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
  logo: `${baseUrl}/assets/photo.webp`,
  potentialAction: {
    "@type": "SearchAction",
    target: `${baseUrl}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string"
  }
};

// Organization schema
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Niloy Kumar Barman Panday - Full-Stack Development Services",
  description: "Professional Full-Stack .NET development services specializing in scalable web applications, cloud solutions, and modern development practices.",
  url: baseUrl,
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
  image: [`${baseUrl}/assets/photo.webp`]
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
  url: `${baseUrl}${path}`,
  isPartOf: {
    '@type': 'WebSite',
    name: 'Niloy Kumar Barman Panday - Portfolio',
    url: baseUrl
  },
  image: images.length > 0 ? images : [`${baseUrl}/assets/photo.webp`]
}); 