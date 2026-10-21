import fs from 'fs';
import path from 'path';
import { SchoolPageData } from '@/types/database';

export function getSchoolPageData(): SchoolPageData {
  const dataDir = path.join(process.cwd(), 'lib', 'data');
  const jsonPath = path.join(dataDir, 'school-page.json');

  // Ensure public/images directory exists
  try {
    const publicDir = path.join(process.cwd(), 'public', 'images');
    if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
  } catch {}

  let data: SchoolPageData | null = null;
  if (fs.existsSync(jsonPath)) {
    try {
      const content = fs.readFileSync(jsonPath, 'utf-8');
      if (content && content.trim()) {
        data = JSON.parse(content);
      }
    } catch (err) {
      console.error('Error reading school-page.json:', err);
    }
  }

  // Fallback initial data matching reference layout exactly
  if (!data || !data.hero || !data.whyGrowingFit) {
    data = {
      hero: {
        heading: 'Growing Fit School Programs',
        subtitle: 'Empowering children with lifelong health, discipline, and active sports',
        slides: [
          {
            id: 'slide-1',
            title: 'Youth Martial Arts & Physical Education',
            image_url: '/images/hero-banner-karate.png',
            image_alt: 'Young students practicing martial arts outdoors',
            sort_order: 1,
            is_published: true,
          },
          {
            id: 'slide-2',
            title: 'Structured On-Campus Training Curriculum',
            image_url: '/images/for-schools.png',
            image_alt: 'Students training in outdoor sports track',
            sort_order: 2,
            is_published: true,
          },
          {
            id: 'slide-3',
            title: 'Multi-Sport Development & Athletic Discipline',
            image_url: '/images/for-academy.png',
            image_alt: 'Students celebrating team sports',
            sort_order: 3,
            is_published: true,
          },
        ],
      },
      whyGrowingFit: {
        heading: 'WHY GROWING FIT',
        subtitle: '5 Reasons You Should Join',
        items: [
          {
            id: 'why-1',
            sequence: '#1',
            title: 'Build Strong Foundation',
            description: 'We focus on overall physical, mental and emotional development through structured sports and fitness programs.',
            sort_order: 1,
            is_visible: true,
          },
          {
            id: 'why-2',
            sequence: '#2',
            title: 'Expert Guidance',
            description: 'Learn from certified and experienced coaches who are passionate about child development and fitness.',
            sort_order: 2,
            is_visible: true,
          },
          {
            id: 'why-3',
            sequence: '#3',
            title: 'Discipline & Confidence',
            description: 'Sports and physical activities instill discipline, teamwork and self-confidence in every child.',
            sort_order: 3,
            is_visible: true,
          },
          {
            id: 'why-4',
            sequence: '#4',
            title: 'Age-Appropriate Training',
            description: 'Scientific and progressive curricula tailored specifically to the physiological stages of growing children.',
            sort_order: 4,
            is_visible: true,
          },
          {
            id: 'why-5',
            sequence: '#5',
            title: 'Safe & Inspiring Environment',
            description: 'Zero-tolerance safety standards with top-grade equipment ensuring every student thrives securely.',
            sort_order: 5,
            is_visible: true,
          },
        ],
      },
      introduction: {
        content: 'At Growing Fit, we believe in the power of sports and physical education to shape healthier, happier and more confident children. Our programs are designed to nurture each child’s unique potential through expert training, fun learning and a supportive environment.',
        is_visible: true,
      },
      whatsInForKids: {
        heading: "WHAT'S IN FOR KIDS",
        subtitle: 'Four pillars of our institutional physical education curriculum',
        cards: [
          {
            id: 'what-1',
            title: 'Qualified Coaches',
            image_url: '/images/about-philosophy-card.jpg',
            description: 'Certified national trainers and physical education experts.',
            sort_order: 1,
            is_visible: true,
          },
          {
            id: 'what-2',
            title: 'Structured Programs',
            image_url: '/images/for-schools.png',
            description: 'Age-appropriate physical education curricula tailored for schools.',
            sort_order: 2,
            is_visible: true,
          },
          {
            id: 'what-3',
            title: 'Fun Learning',
            image_url: '/images/about-hero-girl.jpg',
            description: 'Engaging, interactive sports sessions that foster genuine love for movement.',
            sort_order: 3,
            is_visible: true,
          },
          {
            id: 'what-4',
            title: 'Competitive Exposure',
            image_url: '/images/corp-tournaments.png',
            description: 'Opportunities to compete in inter-school tournaments and sports meets.',
            sort_order: 4,
            is_visible: true,
          },
        ],
      },
      tabsSection: {
        activeTab: 'health-and-fitness',
        tabs: [
          {
            id: 'health-and-fitness',
            label: 'Health and Fitness',
            items: [
              {
                id: 'hf-1',
                title: 'Mental Fitness',
                image_url: '',
                description: 'Sports and physical activities promote mental fitness by improving focus, reducing stress and building confidence.',
                link_text: '',
                link_url: '',
              },
              {
                id: 'hf-2',
                title: 'Physical Fitness',
                image_url: '',
                description: 'Structured training improves cardiovascular health, strength, flexibility and overall well-being.',
                link_text: 'SHOW MORE',
                link_url: '#contact',
              },
              {
                id: 'hf-3',
                title: 'Strength and Conditioning',
                image_url: '',
                description: 'Tailored sessions enhance strength, endurance and performance, helping children lead an active and healthy lifestyle.',
                link_text: '',
                link_url: '',
              },
            ],
          },
          {
            id: 'skill-development',
            label: 'Skill Development',
            items: [
              {
                id: 'sd-1',
                title: 'Agility & Motor Skills',
                image_url: '',
                description: 'Sharpening foundational footwork, reaction times, balance, and spatial awareness.',
                link_text: '',
                link_url: '',
              },
              {
                id: 'sd-2',
                title: 'Defensive Techniques',
                image_url: '',
                description: 'Structured martial arts drills building personal safety, defensive discipline, and poise.',
                link_text: 'SHOW MORE',
                link_url: '#contact',
              },
              {
                id: 'sd-3',
                title: 'Tactical Coordination',
                image_url: '',
                description: 'Team sports strategies fostering situational decision making and quick physical execution.',
                link_text: '',
                link_url: '',
              },
            ],
          },
          {
            id: 'sports-training',
            label: 'Sports Training',
            items: [
              {
                id: 'st-1',
                title: 'Track & Athletics',
                image_url: '',
                description: 'Sprint mechanics, pacing, aerobic capacity and endurance development for young runners.',
                link_text: '',
                link_url: '',
              },
              {
                id: 'st-2',
                title: 'Swimming Mastery',
                image_url: '',
                description: 'Professional stroke technique, breath control and water confidence coached with clinical care.',
                link_text: 'SHOW MORE',
                link_url: '#contact',
              },
              {
                id: 'st-3',
                title: 'Football & Team Play',
                image_url: '',
                description: 'Turf ball mastery, passing accuracy, positional discipline and collaborative sportsmanship.',
                link_text: '',
                link_url: '',
              },
            ],
          },
        ],
      },
      curriculum: {
        heading: 'CURRICULUM',
        description: 'Growing Fit’s curriculum is scientifically structured into sequential developmental stages, ensuring that every student progresses through age-appropriate motor skills, agility, sport fundamentals, and character-building disciplines.',
        stages: [
          {
            stage: 'Stage 1 — Fundamental Movement (Ages 4-7)',
            detail: 'Focus on balance, coordination, rhythm, spatial awareness, and joyful playful physical games.',
          },
          {
            stage: 'Stage 2 — Skill Acquisition & Discipline (Ages 8-12)',
            detail: 'Introduction to foundational martial arts, multi-sport agility drills, rule adherence, and sportsmanship.',
          },
          {
            stage: 'Stage 3 — Performance & Athletic Specialization (Ages 13-18)',
            detail: 'Advanced cardiovascular conditioning, competitive sport tactical training, leadership, and athletic excellence.',
          },
        ],
        is_visible: true,
      },
      glimpses: {
        heading: 'GLIMPSES OF PREVIOUS YEAR',
        images: [
          {
            id: 'glim-1',
            title: 'School Sports Meet Running Drills',
            image_url: '/images/for-schools.png',
            sort_order: 1,
            is_published: true,
          },
          {
            id: 'glim-2',
            title: 'Youth Swimming Training Camp',
            image_url: '/images/academy-swimming.png',
            sort_order: 2,
            is_published: true,
          },
          {
            id: 'glim-3',
            title: 'Martial Arts High Kick Demonstration',
            image_url: '/images/about-martial-arts.png',
            sort_order: 3,
            is_published: true,
          },
          {
            id: 'glim-4',
            title: 'Inter-School Football Scrimmage',
            image_url: '/images/academy-football.png',
            sort_order: 4,
            is_published: true,
          },
        ],
      },
      testimonials: {
        heading: 'TESTIMONIALS',
        items: [
          {
            id: 'test-1',
            quote: '“Growing old is mandatory. But Growing Fit is optional.\n\nGrowing Fit has not only helped me Grow Fit but also has kept me fit in life from Saudi Arabia to India. I endorse Growing Fit Club and I\'m grateful to Master Mohammad Rafi for his tireless training for growing our health. Men of action – Satisfaction.\n\nHappy joining Growing Fit.”',
            author_name: 'Inayathulla M',
            author_role: 'Director, Growing Tots Preschool, Bengaluru',
            avatar_url: 'https://res.cloudinary.com/nvho1sss/image/upload/v1792573086/growing_fit/yu1hbsui4eenvar3zjdb.webp',
            sort_order: 1,
            is_visible: true,
          },
        ],
      },
    };

    // Save initial JSON
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf-8');
  }

  // Dynamically sync testimonials from testimonials.json
  try {
    const globalTPath = path.join(dataDir, 'testimonials.json');
    if (fs.existsSync(globalTPath)) {
      const content = fs.readFileSync(globalTPath, 'utf-8');
      if (content && content.trim()) {
        const globalList = JSON.parse(content);
        if (Array.isArray(globalList) && globalList.length > 0) {
          const published = globalList
            .filter((t: any) => t && t.is_published !== false && t.author_name !== 'Anand Kumar' && t.author_name !== 'Priya R.')
            .map((t: any, idx: number) => ({
              id: t.id || `test-${idx + 1}`,
              quote: t.quote || '',
              author_name: t.author_name || '',
              author_role: t.author_title || 'Parent',
              avatar_url: t.avatar_url || '',
              sort_order: t.sort_order || idx + 1,
              is_visible: true,
            }));

          const existingItems = (data.testimonials?.items || []).filter(
            (i: any) => i.author_name !== 'Anjali Mehta' && i.author_name !== 'Ramesh Kumar'
          );

          if (published.length > 0) {
            const combined = [...existingItems];
            published.forEach((p: any) => {
              if (!combined.some((c: any) => c.author_name === p.author_name || c.id === p.id)) {
                combined.push(p);
              }
            });
            data.testimonials = {
              heading: data.testimonials?.heading || 'TESTIMONIALS',
              subtitle: data.testimonials?.subtitle,
              items: combined.length > 0 ? combined : published,
            };
          }
        }
      }
    }
  } catch {}

  // Load header settings
  try {
    const hdrPath = path.join(dataDir, 'header-settings.json');
    if (fs.existsSync(hdrPath)) {
      const content = fs.readFileSync(hdrPath, 'utf-8');
      if (content && content.trim()) {
        data.headerSettings = JSON.parse(content);
      }
    }
  } catch {}

  return data;
}
