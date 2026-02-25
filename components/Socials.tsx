"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaGithub, FaLinkedinIn, FaMedium, FaStackOverflow } from "@/lib/icons";
import { fetchPortfolioMetadata } from "@/lib/api-client";

interface SocialsProps {
    containerStyles: string;
    iconStyles: string;
}

// Fallback default values
const DEFAULT_SOCIAL_LINKS = {
    github: 'https://github.com/niloyroy0000',
    linkedin: 'https://www.linkedin.com/in/niloy-barman-552634339/',
    medium: 'https://medium.com/@biswajitpanday',
    stackoverflow: 'https://stackoverflow.com/users/2923956/biswajit-panday'
};

const Socials = ({ containerStyles, iconStyles }: SocialsProps) => {
    const [portfolioMetadata, setPortfolioMetadata] = useState<any>(null);

    // Fetch portfolio metadata for social links
    useEffect(() => {
        const loadMetadata = async () => {
            try {
                const data = await fetchPortfolioMetadata();
                setPortfolioMetadata(data);
            } catch (error) {
                console.error('Failed to load portfolio metadata:', error);
                // Fallback to hardcoded values if API fails
            }
        };
        loadMetadata();
    }, []);

    // Dynamic social links (with fallback to defaults if API fails)
    const socials = [
        {
            icon: <FaGithub />,
            path: portfolioMetadata?.socialLinks?.github || DEFAULT_SOCIAL_LINKS.github,
            label: 'Visit GitHub profile'
        },
        {
            icon: <FaLinkedinIn />,
            path: portfolioMetadata?.socialLinks?.linkedin || DEFAULT_SOCIAL_LINKS.linkedin,
            label: 'Visit LinkedIn profile'
        },
        {
            icon: <FaMedium />,
            path: portfolioMetadata?.socialLinks?.medium || DEFAULT_SOCIAL_LINKS.medium,
            label: 'Read Medium articles'
        },
        {
            icon: <FaStackOverflow />,
            path: portfolioMetadata?.socialLinks?.stackoverflow || DEFAULT_SOCIAL_LINKS.stackoverflow,
            label: 'View Stack Overflow profile'
        }
    ];

    return (
        <div className={containerStyles}>
            {socials.map((item, index) => {
                return (
                    <Link
                        key={index}
                        href={item.path}
                        className={iconStyles}
                        target='_blank'
                        aria-label={item.label}
                        rel="noopener noreferrer"
                    >
                        {item.icon}
                    </Link>
                )
            })}
        </div>
    )
}

export default Socials;
