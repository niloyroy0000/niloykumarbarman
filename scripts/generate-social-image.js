import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Since we can't use Canvas in Node.js easily without additional dependencies,
// let's create an HTML template that can be used to generate social media images

const generateSocialImageTemplate = () => {
  const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Social Media Preview Generator</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #1c1c22 0%, #27272c 50%, #00bfff 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
        }
        
        .social-card {
            width: 1200px;
            height: 630px;
            background: linear-gradient(135deg, #1c1c22 0%, #27272c 70%, #00bfff 100%);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 60px;
            box-sizing: border-box;
            position: relative;
            overflow: hidden;
        }
        
        /* Floating dots pattern from homepage */
        .social-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="%2300bfff" fill-opacity="0.05"><circle cx="30" cy="30" r="2"/></g></g></svg>') repeat;
            pointer-events: none;
        }
        
        /* Floating dots - matching homepage design */
        .floating-dot {
            position: absolute;
            border-radius: 50%;
            pointer-events: none;
        }
        
        .dot-1 {
            width: 8px;
            height: 8px;
            background: #00bfff;
            top: 80px;
            right: 40px;
            animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
            opacity: 0.6;
        }
        
        .dot-2 {
            width: 6px;
            height: 6px;
            background: #00bfff;
            bottom: 120px;
            right: 200px;
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            opacity: 0.4;
        }
        
        .dot-3 {
            width: 8px;
            height: 8px;
            background: #00bfff;
            top: 200px;
            left: 40px;
            animation: bounce 1s infinite;
            opacity: 0.5;
        }
        
        /* Blur effects from homepage */
        .blur-circle-1 {
            position: absolute;
            width: 256px;
            height: 256px;
            background: rgba(0, 191, 255, 0.05);
            border-radius: 50%;
            filter: blur(48px);
            top: 80px;
            left: 25%;
            pointer-events: none;
        }
        
        .blur-circle-2 {
            position: absolute;
            width: 256px;
            height: 256px;
            background: rgba(0, 191, 255, 0.05);
            border-radius: 50%;
            filter: blur(48px);
            bottom: 80px;
            right: 25%;
            pointer-events: none;
        }
        
        .content {
            flex: 1;
            z-index: 2;
            max-width: 700px;
        }
        
        .profile-section {
            flex-shrink: 0;
            z-index: 2;
            margin-left: 40px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        
        /* Badge styling matching homepage */
        .role-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(0, 191, 255, 0.1);
            border: 1px solid rgba(0, 191, 255, 0.3);
            color: #00bfff;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 24px;
        }
        
        .name {
            font-size: 52px;
            font-weight: 800;
            color: white;
            margin: 0 0 16px 0;
            line-height: 1.1;
        }
        
        /* Gradient text effect from homepage */
        .gradient-text {
            background: linear-gradient(to right, #00bfff, #0099cc, #00bfff);
            background-size: 200% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: gradient 3s ease infinite;
        }
        
        @keyframes gradient {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }
        
        .title {
            font-size: 32px;
            font-weight: 600;
            color: #00bfff;
            margin: 0 0 24px 0;
            line-height: 1.2;
        }
        
        .description {
            font-size: 20px;
            color: rgba(255, 255, 255, 0.8);
            margin: 0 0 32px 0;
            line-height: 1.4;
        }
        
        .highlight {
            color: #00bfff;
            font-weight: 600;
        }
        
        .ai-highlight {
            color: #10b981;
            font-weight: 600;
        }
        
        .skills {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            margin-bottom: 24px;
        }
        
        .skill {
            background: rgba(0, 191, 255, 0.1);
            border: 1px solid rgba(0, 191, 255, 0.3);
            color: #00bfff;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 500;
        }
        
        .skill.react {
            background: rgba(59, 130, 246, 0.1);
            border-color: rgba(59, 130, 246, 0.3);
            color: #3b82f6;
        }
        
        .skill.devops {
            background: rgba(147, 51, 234, 0.1);
            border-color: rgba(147, 51, 234, 0.3);
            color: #9333ea;
        }
        
        .skill.ai {
            background: rgba(16, 185, 129, 0.1);
            border-color: rgba(16, 185, 129, 0.3);
            color: #10b981;
        }
        
        .website {
            color: rgba(255, 255, 255, 0.6);
            font-size: 18px;
            font-weight: 500;
        }
        
        .profile-image {
            width: 180px;
            height: 180px;
            border-radius: 50%;
            background: linear-gradient(135deg, #00bfff, #0099cc);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 64px;
            font-weight: 800;
            color: #1c1c22;
            box-shadow: 0 20px 40px rgba(0, 191, 255, 0.3);
            margin-bottom: 20px;
        }
        
        .profile-text {
            text-align: center;
            color: white;
        }
        
        .experience {
            font-size: 16px;
            color: #00bfff;
            font-weight: 600;
            margin-bottom: 8px;
        }
        
        .certification {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.7);
        }
        
        /* Alternative layout - Text-focused */
        .text-focused {
            justify-content: center;
            text-align: center;
            padding: 80px 60px;
        }
        
        .text-focused .content {
            max-width: 1000px;
            text-align: center;
        }
        
        .text-focused .profile-section {
            display: none;
        }
        
        .text-focused .name {
            font-size: 64px;
            margin-bottom: 24px;
        }
        
        .text-focused .title {
            font-size: 36px;
            margin-bottom: 32px;
        }
        
        .text-focused .description {
            font-size: 24px;
            margin-bottom: 40px;
        }
        
        .text-focused .skills {
            justify-content: center;
            margin-bottom: 32px;
        }
        
        .text-focused .skill {
            font-size: 16px;
            padding: 10px 20px;
        }
        
        /* Animations */
        @keyframes ping {
            75%, 100% {
                transform: scale(2);
                opacity: 0;
            }
        }
        
        @keyframes pulse {
            50% {
                opacity: .5;
            }
        }
        
        @keyframes bounce {
            0%, 100% {
                transform: translateY(-25%);
                animation-timing-function: cubic-bezier(0.8,0,1,1);
            }
            50% {
                transform: none;
                animation-timing-function: cubic-bezier(0,0,0.2,1);
            }
        }
    </style>
</head>
<body>
    <!-- Version 1: With Profile Image -->
    <div class="social-card" id="version1">
        <div class="floating-dot dot-1"></div>
        <div class="floating-dot dot-2"></div>
        <div class="floating-dot dot-3"></div>
        <div class="blur-circle-1"></div>
        <div class="blur-circle-2"></div>
        
        <div class="content">
            <div class="role-badge">
                ⚡ AI-Powered Full-Stack & .NET Developer
            </div>
            <h1 class="name">Hi, I'm <span class="gradient-text">Niloy Kumar Barman Panday</span></h1>
            <h2 class="title">Full-Stack .NET Developer</h2>
            <p class="description">Crafting <span class="highlight">high-performance</span>, <span class="highlight">scalable applications</span> with .NET, React & DevOps while integrating <span class="ai-highlight">AI solutions</span> and optimizing cloud solutions on Azure & AWS.</p>
            
            <div class="skills">
                <span class="skill">.NET</span>
                <span class="skill react">React</span>
                <span class="skill devops">DevOps</span>
                <span class="skill ai">AI Integration</span>
                <span class="skill">Azure</span>
                <span class="skill">AWS</span>
            </div>
            
            <div class="website">biswajitpanday.github.io</div>
        </div>
        
        <div class="profile-section">
            <div class="profile-image">BP</div>
            <div class="profile-text">
                <div class="experience">10+ Years Experience</div>
                <div class="certification">Microsoft Certified</div>
            </div>
        </div>
    </div>
    
    <!-- Version 2: Text-Focused -->
    <div class="social-card text-focused" id="version2" style="display: none;">
        <div class="floating-dot dot-1"></div>
        <div class="floating-dot dot-2"></div>
        <div class="floating-dot dot-3"></div>
        <div class="blur-circle-1"></div>
        <div class="blur-circle-2"></div>
        
        <div class="content">
            <div class="role-badge">
                ⚡ AI-Powered Full-Stack & .NET Developer
            </div>
            <h1 class="name">Hi, I'm <span class="gradient-text">Niloy Kumar Barman Panday</span></h1>
            <h2 class="title">Full-Stack .NET Developer & Cloud Expert</h2>
            <p class="description">Crafting <span class="highlight">high-performance</span>, <span class="highlight">scalable applications</span> with 10+ years experience in .NET, React & DevOps while integrating <span class="ai-highlight">AI solutions</span></p>
            
            <div class="skills">
                <span class="skill">.NET</span>
                <span class="skill react">React</span>
                <span class="skill">TypeScript</span>
                <span class="skill devops">DevOps</span>
                <span class="skill ai">AI Integration</span>
                <span class="skill">Azure</span>
                <span class="skill">AWS</span>
                <span class="skill">Microsoft Certified</span>
            </div>
            
            <div class="website">biswajitpanday.github.io</div>
        </div>
    </div>
    
    <div style="position: fixed; top: 20px; right: 20px; z-index: 1000;">
        <button onclick="showVersion(1)" style="margin: 5px; padding: 10px; background: #00bfff; color: #1c1c22; border: none; border-radius: 4px; cursor: pointer; font-weight: 600;">Version 1</button>
        <button onclick="showVersion(2)" style="margin: 5px; padding: 10px; background: #00bfff; color: #1c1c22; border: none; border-radius: 4px; cursor: pointer; font-weight: 600;">Version 2</button>
    </div>
    
    <script>
        function showVersion(version) {
            document.getElementById('version1').style.display = version === 1 ? 'flex' : 'none';
            document.getElementById('version2').style.display = version === 2 ? 'flex' : 'none';
        }
        
        console.log('🎨 Social media preview templates loaded with your site theme!');
        console.log('🎯 Theme colors: #00bfff (secondary), #1c1c22 (primary)');
        console.log('✨ Features: Floating dots, gradient text, blur effects');
        console.log('📏 Card dimensions: 1200x630px');
        console.log('🔥 Version 1: With profile avatar + homepage styling');
        console.log('🚀 Version 2: Text-focused + homepage styling (recommended)');
        console.log('📸 Use browser screenshot tools to capture at exactly 1200x630px');
    </script>
</body>
</html>`;

  const outputPath = path.join(__dirname, '../public/social-preview-template.html');
  fs.writeFileSync(outputPath, htmlTemplate);
  
  console.log('🎨 ✅ Social media preview template updated with your site theme!');
  console.log('🎯 Theme Integration:');
  console.log('   • Primary color: #1c1c22 (dark background)');
  console.log('   • Secondary color: #00bfff (accent/highlights)');
  console.log('   • Floating dots animation (from homepage)');
  console.log('   • Gradient text effect (matching your name)');
  console.log('   • Blur circle effects (background ambiance)');
  console.log('   • Badge styling (matching your role badge)');
  console.log('   • Color-coded skill badges (matching your tech stack)');
  console.log('📝 Two versions available:');
  console.log('   Version 1: With profile avatar + full homepage styling');
  console.log('   Version 2: Text-focused + homepage styling (recommended)');
  console.log('🚀 Ready to generate your branded social media preview!');
};

generateSocialImageTemplate(); 