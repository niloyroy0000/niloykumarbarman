
"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  FaGithub,
  FaLinkedin,
  FaBars,
  FaTimes,
  FaSearch,
  FaMedium,
  FaChevronDown
} from "@/lib/icons";
import { AnimatePresence } from "framer-motion";
import MobileNav from "./MobileNav";
import GlobalSearch from "./GlobalSearch";
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

/**
 * Header - Accessible site header with navigation
 * WCAG 2.1 AA compliant with keyboard navigation, ARIA labels, and focus management
 */

// Header navigation links
const NAVIGATION_ITEMS: Array<{ name: string; href: string; dropdown?: Array<{ name: string; href: string }> }> = [
  { name: "Home", href: "/" },
  { name: "Career", href: "/career" },
  { name: "Projects", href: "/projects" },
  { name: "Certifications", href: "/certifications" },
  { name: "Skills", href: "/skills" },
  { name: "Contact", href: "/contact" },
];

// Social media links
const SOCIAL_LINKS = [
  { name: "GitHub", href: "https://github.com/niloyroy0000", icon: FaGithub },
  { name: "Medium", href: "https://medium.com/@niloybarman", icon: FaMedium },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/niloy-barman-552634339", icon: FaLinkedin },
];

interface HeaderProps {
  projects: Project[];
  certifications: Certification[];
  skillsHierarchy: SkillHierarchyNode[];
}

export default function Header({ projects, certifications, skillsHierarchy }: HeaderProps) {
  const pathname = usePathname();
  const [isSticky, setIsSticky] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const isSearchEnabled = process.env.NEXT_PUBLIC_ENABLE_SEARCH !== 'false';

  // Helper to check if a path is active (exact match or starts with path + '/')
  const isPathActive = (path: string) => {
    // Special case for legacy portfolio URLs redirecting to projects
    if (path === '/projects' && pathname.startsWith('/portfolio')) {
      return true;
    }
    return pathname === path || (path !== '/' && pathname.startsWith(path + '/'));
  };

  // Sticky header on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when path changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Global keyboard shortcut for search (Ctrl/Cmd + K)
  useEffect(() => {
    if (!isSearchEnabled) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isSearchEnabled]);

  return (
    <>
      {/* Skip Navigation Link - WCAG 2.1 Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-6 focus:py-3 focus:bg-secondary-default focus:text-primary focus:rounded-lg focus:outline-none focus:ring-4 focus:ring-secondary-default/50 focus:shadow-lg focus:font-semibold focus:transition-all focus:duration-200"
        data-testid="skip-to-content"
      >
        Skip to main content
      </a>

      <header
        data-testid="main-header"
        role="banner"
        className="fixed top-0 left-0 w-full transition-all duration-300 backdrop-blur-md z-[var(--z-header)]"
        style={{ zIndex: 'var(--z-header)' }}
      >
        <div className={`w-full relative ${isSticky ? 'bg-bg-default/80 shadow-sm' : 'bg-transparent'}`}>
          {/* Gradient bottom border when sticky */}
          {isSticky && (
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00BFFF] to-transparent" aria-hidden="true" />
          )}
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex items-center justify-between h-16 md:h-20">
              {/* Logo */}
              <Link
                href="/"
                data-testid="header-logo"
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                aria-label="Home"
              >
                <div className="text-2xl font-semibold">
                  Panday<span className="text-secondary-default">.</span>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav
                data-testid="desktop-navigation"
                className="hidden lg:flex items-center space-x-1"
                role="navigation"
                aria-label="Main navigation"
              >
                {NAVIGATION_ITEMS.map((item) => {
                  // Check if dropdown item has any active child
                  const hasActiveChild = item.dropdown?.some((child: any) => isPathActive(child.href));
                  const isActive = isPathActive(item.href) || hasActiveChild;

                  // Render dropdown menu
                  if (item.dropdown) {
                    return (
                      <div
                        key={item.name}
                        className="relative"
                        onMouseEnter={() => setOpenDropdown(item.name)}
                        onMouseLeave={() => setOpenDropdown(null)}
                      >
                        <button
                          data-testid={`nav-link-${item.name.toLowerCase()}`}
                          className={`px-3 py-2 text-base font-medium rounded-md transition-colors relative group flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1f] ${
                            isActive
                              ? "text-secondary-default"
                              : "text-text-primary hover:text-secondary-default"
                          }`}
                          aria-expanded={openDropdown === item.name}
                          aria-haspopup="menu"
                        >
                          {item.name}
                          <FaChevronDown className={`text-xs transition-transform duration-200 ${openDropdown === item.name ? 'rotate-180' : ''}`} aria-hidden="true" />
                          <span
                            className={`absolute bottom-0 left-0 w-full h-0.5 bg-secondary-default transform transition-transform duration-300 ${
                              isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                            }`}
                            style={{ transformOrigin: 'left' }}
                            aria-hidden="true"
                          ></span>
                        </button>

                        {/* Dropdown Menu */}
                        {openDropdown === item.name && (
                          <div
                            className="absolute top-full left-0 pt-2 -mt-2 bg-bg-default/95 backdrop-blur-md border border-secondary-default/20 rounded-md shadow-lg py-2 min-w-[160px] z-50"
                            role="menu"
                            aria-label={`${item.name} submenu`}
                          >
                            {item.dropdown.map((dropdownItem: any) => {
                              const isDropdownActive = isPathActive(dropdownItem.href);
                              return (
                                <Link
                                  key={dropdownItem.name}
                                  href={dropdownItem.href}
                                  role="menuitem"
                                  className={`block px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-400 ${
                                    isDropdownActive
                                      ? "text-secondary-default bg-secondary-default/10"
                                      : "text-text-primary hover:text-secondary-default hover:bg-white/5"
                                  }`}
                                  aria-current={isDropdownActive ? "page" : undefined}
                                >
                                  {dropdownItem.name}
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }

                  // Render regular link
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      data-testid={`nav-link-${item.name.toLowerCase()}`}
                      className={`px-3 py-2 text-base font-medium rounded-md transition-all relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1f] ${
                        isActive
                          ? "bg-gradient-to-r from-[#00BFFF] to-blue-400 bg-clip-text text-transparent"
                          : "text-text-primary hover:bg-gradient-to-r hover:from-[#00BFFF] hover:to-blue-400 hover:bg-clip-text hover:text-transparent"
                      }`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {item.name}
                      <span
                        className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#00BFFF] to-blue-500 transform transition-transform duration-300 ${
                          isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                        }`}
                        style={{ transformOrigin: 'left' }}
                        aria-hidden="true"
                      ></span>
                    </Link>
                  );
                })}
              </nav>

              {/* Right side actions (social, search, etc.) */}
              <div 
                data-testid="header-actions"
                className="flex items-center space-x-2"
              >
                {/* Search Button - Conditionally Rendered */}
                {isSearchEnabled && (
                  <button
                    data-testid="search-button"
                    onClick={() => setIsSearchOpen(true)}
                    className="flex items-center gap-2 bg-primary-light/20 hover:bg-primary-light/30 border border-border-light hover:border-secondary-default/30 text-text-primary hover:text-secondary-default px-3 py-1.5 rounded-md transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1f]"
                    title="Search (Ctrl+K)"
                    aria-label="Open search dialog"
                  >
                    <FaSearch className="text-sm" aria-hidden="true" />
                    <span className="text-sm hidden sm:inline-block">Search</span>
                    <kbd className="hidden sm:inline-block bg-primary-light/30 text-xs px-2 py-0.5 rounded" aria-hidden="true">
                      ⌘K
                    </kbd>
                  </button>
                )}

                {/* Social Links */}
                <div
                  data-testid="social-links"
                  className="hidden md:flex items-center space-x-1"
                  role="group"
                  aria-label="Social media links"
                >
                  {SOCIAL_LINKS.map((social) => (
                    <Button
                      key={social.name}
                      variant="ghost"
                      size="icon"
                      asChild
                      className="hover:text-secondary-default focus-visible:ring-2 focus-visible:ring-cyan-400"
                    >
                      <Link
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Visit ${social.name} profile (opens in new tab)`}
                        data-testid={`social-link-${social.name.toLowerCase()}`}
                      >
                        <social.icon className="w-4 h-4" aria-hidden="true" />
                      </Link>
                    </Button>
                  ))}
                </div>

                {/* Mobile Menu Button */}
                <div className="flex lg:hidden items-center">
                  <Button
                    data-testid="mobile-menu-button"
                    variant="ghost"
                    size="icon"
                    className="hover:bg-transparent hover:text-secondary-default focus:bg-transparent focus-visible:ring-2 focus-visible:ring-cyan-400"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-expanded={isMenuOpen}
                    aria-controls="mobile-navigation"
                    aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                  >
                    {isMenuOpen ? <FaTimes className="w-5 h-5" aria-hidden="true" /> : <FaBars className="w-5 h-5" aria-hidden="true" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <MobileNav
              navigationItems={NAVIGATION_ITEMS}
              socialLinks={SOCIAL_LINKS}
              currentPath={pathname}
              isPathActive={isPathActive}
              onClose={() => setIsMenuOpen(false)}
              onSearchOpen={() => setIsSearchOpen(true)}
              isSearchEnabled={isSearchEnabled}
            />
          )}
        </AnimatePresence>
      </header>

      {/* Global Search Modal - Conditionally Rendered */}
      {isSearchEnabled && (
        <GlobalSearch
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          projects={projects}
          certifications={certifications}
          skillsHierarchy={skillsHierarchy}
        />
      )}
      
      {/* Spacer to push content below fixed header */}
      <div className="h-16 md:h-20"></div>
    </>
  );
}
