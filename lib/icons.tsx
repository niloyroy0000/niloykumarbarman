/**
 * Central Icon Library
 *
 * This file provides all icons used across the portfolio as Iconify components.
 * Previously used react-icons (~32 MB), now uses @iconify/react (~50 KB + ~1 KB per icon).
 *
 * Usage:
 * Instead of: import { FaGithub } from "react-icons/fa"
 * Use: import { FaGithub } from "@/lib/icons"
 */

import { Icon } from "@iconify/react";
import React from "react";

// Type for icon props (matches react-icons)
export interface IconProps {
  className?: string;
  size?: number | string;
  color?: string;
  style?: React.CSSProperties;
  attr?: React.SVGAttributes<SVGElement>;
  title?: string;
}

// Helper to create icon component
const createIcon = (iconifyName: string) => {
  const IconComponent = React.forwardRef<SVGSVGElement, IconProps>(
    ({ className, size, color, style, title, ...props }, ref) => {
      // Auto-fix Font Awesome icons: convert fa: to fa-solid: for better compatibility
      // This handles icons that need the solid variant (most FA icons)
      let finalIconName = iconifyName;

      if (iconifyName.startsWith("fa:") && !iconifyName.startsWith("fa-")) {
        finalIconName = iconifyName.replace("fa:", "fa-solid:");
      }

      return (
        <Icon
          ref={ref}
          icon={finalIconName}
          className={className}
          width={size}
          height={size}
          color={color}
          style={style}
          title={title}
          {...props}
        />
      );
    }
  );
  IconComponent.displayName = `Icon(${iconifyName})`;
  return IconComponent;
};

// ========================================
// FONT AWESOME ICONS (Fa)
// ========================================

// Navigation & UI
export const FaHome = createIcon("fa:home");
export const FaBars = createIcon("fa:bars");
export const FaTimes = createIcon("fa:times");
export const FaMinus = createIcon("fa:minus");
export const FaCheck = createIcon("fa:check");
export const FaCheckCircle = createIcon("fa:check-circle");
export const FaArrowRight = createIcon("fa:arrow-right");
export const FaArrowLeft = createIcon("fa:arrow-left");
export const FaArrowUp = createIcon("fa:arrow-up");
export const FaArrowDown = createIcon("fa:arrow-down");
export const FaChevronDown = createIcon("fa:chevron-down");
export const FaChevronUp = createIcon("fa:chevron-up");
export const FaChevronLeft = createIcon("fa:chevron-left");
export const FaChevronRight = createIcon("fa:chevron-right");
export const FaExternalLinkAlt = createIcon("fa:external-link-alt");
export const FaTh = createIcon("fa:th");
export const FaPlay = createIcon("fa:play");
export const FaHistory = createIcon("fa:history");
export const FaBook = createIcon("fa:book");

// Search & Filter
export const FaSearch = createIcon("fa:search");
export const FaSearchPlus = createIcon("fa:search-plus");
export const FaSearchMinus = createIcon("fa:search-minus");
export const FaFilter = createIcon("fa:filter");
export const FaSync = createIcon("fa:sync");
export const FaUndo = createIcon("fa:undo");

// Time & Calendar
export const FaClock = createIcon("fa-solid:clock");
export const FaCalendar = createIcon("fa-solid:calendar");
export const FaCalendarAlt = createIcon("fa-solid:calendar-alt");

// Business & Work
export const FaBriefcase = createIcon("fa:briefcase");
export const FaBuilding = createIcon("fa:building");
export const FaRegBuilding = createIcon("fa-regular:building");
export const FaClipboardList = createIcon("fa:clipboard-list");
export const FaTasks = createIcon("fa:tasks");

// People & Social
export const FaUser = createIcon("fa:user");
export const FaUsers = createIcon("fa:users");
export const FaGithub = createIcon("fa-brands:github");
export const FaLinkedin = createIcon("fa-brands:linkedin");
export const FaLinkedinIn = createIcon("fa-brands:linkedin-in");
export const FaStackOverflow = createIcon("fa-brands:stack-overflow");
export const FaMedium = createIcon("fa-brands:medium");


// Development & Code
export const FaCode = createIcon("fa-solid:code");
export const FaCodeBranch = createIcon("fa-solid:code-branch");
export const FaTerminal = createIcon("fa:terminal");
export const FaFolder = createIcon("fa:folder");
export const FaJs = createIcon("fa-brands:js");
export const FaGitAlt = createIcon("fa-brands:git-alt");

// Technology
export const FaDocker = createIcon("fa-brands:docker");
export const FaReact = createIcon("fa-brands:react");
export const FaAngular = createIcon("fa-brands:angular");
export const FaBootstrap = createIcon("fa-brands:bootstrap");
export const FaNodeJs = createIcon("fa-brands:node-js");
export const FaJava = createIcon("fa-brands:java");
export const FaPython = createIcon("fa-brands:python");
export const FaVuejs = createIcon("fa-brands:vuejs");
export const FaLinux = createIcon("fa-brands:linux");
export const FaAws = createIcon("fa-brands:aws");

// Cloud & Infrastructure
export const FaCloud = createIcon("fa-solid:cloud");
export const FaServer = createIcon("fa:server");
export const FaDatabase = createIcon("fa:database");
export const FaGlobe = createIcon("fa:globe");
export const FaSitemap = createIcon("fa:sitemap");
export const FaMicrochip = createIcon("fa:microchip");
export const FaProjectDiagram = createIcon("fa:project-diagram");
export const FaExchangeAlt = createIcon("fa:exchange-alt");

// Communication & UI
export const FaComment = createIcon("fa:comment");
export const FaCommentDots = createIcon("fa:comment-dots");
export const FaPaperPlane = createIcon("fa:paper-plane");
export const FaEnvelope = createIcon("fa:envelope");
export const FaPhone = createIcon("fa:phone");
export const FaPhoneAlt = createIcon("fa-solid:phone-alt");
export const FaAt = createIcon("fa:at");
export const FaLock = createIcon("fa:lock");

// Data & Analytics
export const FaChartLine = createIcon("fa:chart-line");
export const FaChartBar = createIcon("fa:chart-bar");
export const FaTachometerAlt = createIcon("fa-solid:tachometer-alt");
export const FaEye = createIcon("fa:eye");

// Actions & States
export const FaRocket = createIcon("fa:rocket");
export const FaStar = createIcon("fa:star");
export const FaRobot = createIcon("fa:robot");
export const FaBrain = createIcon("fa-solid:brain");
export const FaFireAlt = createIcon("fa:fire-alt");
export const FaThumbsUp = createIcon("fa:thumbs-up");
export const FaThumbsDown = createIcon("fa:thumbs-down");
export const FaCopy = createIcon("fa:copy");
export const FaExclamationCircle = createIcon("fa:exclamation-circle");
export const FaExclamationTriangle = createIcon("fa:exclamation-triangle");
export const FaInfoCircle = createIcon("fa:info-circle");
export const FaTheaterMasks = createIcon("fa-solid:theater-masks");

// Tools & Utilities
export const FaCogs = createIcon("fa:cogs");
export const FaTools = createIcon("fa:tools");
export const FaMagic = createIcon("fa-solid:magic");
export const FaLightbulb = createIcon("fa:lightbulb");
export const FaVial = createIcon("fa:vial");
export const FaDownload = createIcon("fa:download");
export const FaFunnelDollar = createIcon("fa:funnel-dollar");
export const FaRestroom = createIcon("fa:restroom");

// Achievements & Education
export const FaTrophy = createIcon("fa:trophy");
export const FaAward = createIcon("fa-solid:award");
export const FaGraduationCap = createIcon("fa:graduation-cap");
export const FaCertificate = createIcon("fa-solid:certificate");
export const FaHandshake = createIcon("fa-solid:handshake");

// Location & Map
export const FaMapMarkedAlt = createIcon("fa-solid:map-marked-alt");
export const FaGlobeAmericas = createIcon("fa:globe-americas");

// Finance
export const FaDollarSign = createIcon("fa:dollar-sign");

// Text & Content
export const FaQuoteLeft = createIcon("fa:quote-left");

// ========================================
// FONT AWESOME 6 ICONS (Fa6)
// ========================================

export const FaArrowsSpin = createIcon("fa6-solid:arrows-spin");

// ========================================
// FEATHER ICONS (Fi)
// ========================================

// Navigation & UI
export const FiX = createIcon("feather:x");
export const FiCheck = createIcon("feather:check");
export const FiCheckCircle = createIcon("feather:check-circle");
export const FiChevronDown = createIcon("feather:chevron-down");
export const FiChevronUp = createIcon("feather:chevron-up");
export const FiArrowRight = createIcon("feather:arrow-right");
export const FiArrowLeft = createIcon("feather:arrow-left");
export const FiArrowDown = createIcon("feather:arrow-down");
export const FiExternalLink = createIcon("feather:external-link");

// Search & Filter
export const FiSearch = createIcon("feather:search");
export const FiFilter = createIcon("feather:filter");

// Time & Calendar
export const FiClock = createIcon("feather:clock");
export const FiCalendar = createIcon("feather:calendar");

// Work & Business
export const FiBriefcase = createIcon("feather:briefcase");
export const FiBook = createIcon("feather:book");
export const FiAward = createIcon("feather:award");

// Development & Code
export const FiCode = createIcon("feather:code");
export const FiKey = createIcon("feather:key");
export const FiHash = createIcon("feather:hash");

// Actions & States
export const FiActivity = createIcon("feather:activity");
export const FiEye = createIcon("feather:eye");
export const FiDownload = createIcon("feather:download");
export const FiTrash2 = createIcon("feather:trash-2");
export const FiMousePointer = createIcon("feather:mouse-pointer");

// Technology & Infrastructure
export const FiCloud = createIcon("feather:cloud");
export const FiZap = createIcon("feather:zap");
export const FiGlobe = createIcon("feather:globe");
export const FiLayers = createIcon("feather:layers");

// People & Communication
export const FiUsers = createIcon("feather:users");
export const FiMail = createIcon("feather:mail");
export const FiSlack = createIcon("feather:slack");

// Analytics
export const FiTrendingUp = createIcon("feather:trending-up");
export const FiTarget = createIcon("feather:target");

// ========================================
// SIMPLE ICONS (Si)
// ========================================

// Frontend Frameworks & Libraries
export const SiReact = createIcon("simple-icons:react");
export const SiAngular = createIcon("simple-icons:angular");
export const SiVuejs = createIcon("simple-icons:vuedotjs");
export const SiNextdotjs = createIcon("simple-icons:nextdotjs");
export const SiRedux = createIcon("simple-icons:redux");
export const SiReactquery = createIcon("simple-icons:reactquery");
export const SiFramer = createIcon("simple-icons:framer");

// Backend & Framework
export const SiDotnet = createIcon("simple-icons:dotnet");
export const SiBlazor = createIcon("simple-icons:blazor");
export const SiFramework = createIcon("simple-icons:framework");
export const SiExpress = createIcon("simple-icons:express");
export const SiTrpc = createIcon("simple-icons:trpc");
export const SiNodedotjs = createIcon("simple-icons:nodedotjs");

// Languages
export const SiPython = createIcon("simple-icons:python");
export const SiTypescript = createIcon("simple-icons:typescript");
export const SiJavascript = createIcon("simple-icons:javascript");
export const SiCsharp = createIcon("simple-icons:csharp");
export const SiGo = createIcon("simple-icons:go");

// Styling
export const SiHtml5 = createIcon("simple-icons:html5");
export const SiCss3 = createIcon("simple-icons:css3");
export const SiTailwindcss = createIcon("simple-icons:tailwindcss");

// Databases
export const SiMongodb = createIcon("simple-icons:mongodb");
export const SiMysql = createIcon("simple-icons:mysql");
export const SiPostgresql = createIcon("simple-icons:postgresql");
export const SiRedis = createIcon("simple-icons:redis");
export const SiSqlite = createIcon("simple-icons:sqlite");
export const SiAmazondynamodb = createIcon("simple-icons:amazondynamodb");
export const SiElasticsearch = createIcon("simple-icons:elasticsearch");

// AWS Services
export const SiAmazonec2 = createIcon("simple-icons:amazonec2");
export const SiAwslambda = createIcon("simple-icons:awslambda");
export const SiAmazons3 = createIcon("simple-icons:amazons3");
export const SiAmazonsqs = createIcon("simple-icons:amazonsqs");
export const SiAmazonsimpleemailservice = createIcon("simple-icons:amazonsimpleemailservice");
export const SiAmazonaws = createIcon("simple-icons:amazonaws");

// Cloud Providers
export const SiMicrosoftazure = createIcon("simple-icons:microsoftazure");
export const SiGooglecloud = createIcon("simple-icons:googlecloud");

// DevOps & Tools
export const SiDocker = createIcon("simple-icons:docker");
export const SiKubernetes = createIcon("simple-icons:kubernetes");
export const SiGit = createIcon("simple-icons:git");
export const SiJenkins = createIcon("simple-icons:jenkins");
export const SiNginx = createIcon("simple-icons:nginx");
export const SiServerless = createIcon("simple-icons:serverless");

// Testing & Quality
export const SiJest = createIcon("simple-icons:jest");
export const SiCypress = createIcon("simple-icons:cypress");
export const SiTestinglibrary = createIcon("simple-icons:testinglibrary");
export const SiPostman = createIcon("simple-icons:postman");

// Build Tools
export const SiWebpack = createIcon("simple-icons:webpack");
export const SiVite = createIcon("simple-icons:vite");

// Project Management & Collaboration
export const SiJira = createIcon("simple-icons:jira");
export const SiConfluence = createIcon("simple-icons:confluence");

// Design & Prototyping
export const SiFigma = createIcon("simple-icons:figma");
export const SiStorybook = createIcon("simple-icons:storybook");

// Hosting & Deployment
export const SiVercel = createIcon("simple-icons:vercel");
export const SiNetlify = createIcon("simple-icons:netlify");

// AI & Machine Learning
export const SiOpenai = createIcon("simple-icons:openai");

// Message Queues
export const SiRabbitmq = createIcon("simple-icons:rabbitmq");

// APIs
export const SiGraphql = createIcon("simple-icons:graphql");

// Other
export const SiModal = createIcon("simple-icons:modal");
export const SiFrontendmentor = createIcon("simple-icons:frontendmentor");

// ========================================
// DEVICON ICONS (Di)
// ========================================

export const DiMsqlServer = createIcon("devicon:microsoftsqlserver");
export const DiDotnet = createIcon("devicon:dot-net");
export const DiScrum = createIcon("devicon:scrum");
export const DiRedis = createIcon("devicon:redis");

// ========================================
// TABLER ICONS (Tb)
// ========================================

export const TbPlane = createIcon("tabler:plane");
export const TbBrandCSharp = createIcon("tabler:brand-c-sharp");
export const TbBrandLinqpad = createIcon("tabler:brand-linqpad");
export const TbBrandTailwind = createIcon("tabler:brand-tailwind");

// ========================================
// MATERIAL DESIGN ICONS (Md)
// ========================================

export const MdNotifications = createIcon("mdi:bell");
export const MdSecurity = createIcon("mdi:security");

// ========================================
// GROMMET ICONS (Gr)
// ========================================

export const GrTest = createIcon("grommet-icons:test");
export const GrVirtualMachine = createIcon("grommet-icons:virtual-machine");

// ========================================
// REMIX ICONS (Ri)
// ========================================

export const RiRobot3Fill = createIcon("ri:robot-3-fill");

// ========================================
// GAME ICONS (Gi)
// ========================================

export const GiCogsplosion = createIcon("game-icons:cog");

// ========================================
// OCTICONS (Go)
// ========================================

export const GoCopilot = createIcon("octicon:copilot-16");

// ========================================
// PHOSPHOR ICONS (Pi)
// ========================================

export const PiKanban = createIcon("ph:kanban");

// ========================================
// VS CODE ICONS (Vsc)
// ========================================

export const VscAzure = createIcon("vscode-icons:folder-type-azure");
export const VscAzureDevops = createIcon("vscode-icons:folder-type-azuredevops");

// ========================================
// HERO ICONS V2 (Hi2)
// ========================================

export const HiOutlineBuildingOffice2 = createIcon("heroicons:building-office-2");

// ========================================
// BOOTSTRAP ICONS (Bs)
// ========================================

export const BsMicrosoftTeams = createIcon("bi:microsoft-teams");

// ========================================
// ICON TYPE (for TypeScript)
// ========================================

export type { IconType } from "react-icons";
