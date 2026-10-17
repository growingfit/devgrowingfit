import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { uploadBufferToCloudinary } from '@/lib/cloudinary/server';
import { getJpegDimensions } from '@/lib/utils/school-assets';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const artifactPath = 'C:\\Users\\muham\\.gemini\\antigravity-ide\\brain\\b1c7e8c9-df51-488a-b1c1-7aa5ab1391f1\\.user_uploaded\\media_1792229970594.jpg';
    const publicDir = path.join(process.cwd(), 'public', 'images');
    if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
    const localTarget = path.join(publicDir, 'school-reference.jpg');

    let fileBuf: Buffer;
    if (fs.existsSync(artifactPath)) {
      fileBuf = fs.readFileSync(artifactPath);
      fs.writeFileSync(localTarget, fileBuf);
    } else if (fs.existsSync(localTarget)) {
      fileBuf = fs.readFileSync(localTarget);
    } else {
      return NextResponse.json({ error: 'Reference image not found' }, { status: 404 });
    }

    const { width, height } = getJpegDimensions(fileBuf);

    // Upload to Cloudinary to get a permanent base URL with transformation capabilities
    let cloudBaseUrl = '';
    try {
      const uploadResult = await uploadBufferToCloudinary(fileBuf, 'growing_fit/school', {
        public_id: 'school_page_reference',
        overwrite: true,
      });
      cloudBaseUrl = uploadResult.url;
    } catch (e: any) {
      console.warn('Could not upload reference to Cloudinary, will use local cropping coordinates:', e.message);
    }

    // Helper to generate cropped URL
    const getCropUrl = (x: number, y: number, w: number, h: number) => {
      if (cloudBaseUrl && cloudBaseUrl.includes('/image/upload/')) {
        return cloudBaseUrl.replace('/image/upload/', `/image/upload/c_crop,x_${Math.round(x)},y_${Math.round(y)},w_${Math.round(w)},h_${Math.round(h)}/`);
      }
      return '/images/school-reference.jpg';
    };

    // Calculate normalized pixel positions based on image dimensions
    // Reference screenshot layout:
    // width: W, height: H
    const W = width;
    const H = height;

    // 1. Hero banner: Y: 3.7% to 19.4%
    const heroY = H * 0.038;
    const heroH = H * 0.156;
    const heroUrl = getCropUrl(0, heroY, W, heroH);

    // 2. What's in for kids (4 cards): Y: 40.0% to 47.0%
    const whatY = H * 0.400;
    const whatH = H * 0.070;
    const cardW = W * 0.205;
    const whatGap = W * 0.015;
    const whatStartX = W * 0.078;

    const whatCards = [
      {
        id: 'what-1',
        title: 'Qualified Coaches',
        image_url: getCropUrl(whatStartX, whatY, cardW, whatH),
        description: 'Certified national trainers and physical education experts.',
        sort_order: 1,
        is_visible: true,
      },
      {
        id: 'what-2',
        title: 'Structured Programs',
        image_url: getCropUrl(whatStartX + (cardW + whatGap) * 1, whatY, cardW, whatH),
        description: 'Age-appropriate physical education curricula tailored for schools.',
        sort_order: 2,
        is_visible: true,
      },
      {
        id: 'what-3',
        title: 'Fun Learning',
        image_url: getCropUrl(whatStartX + (cardW + whatGap) * 2, whatY, cardW, whatH),
        description: 'Engaging, interactive sports sessions that foster genuine love for movement.',
        sort_order: 3,
        is_visible: true,
      },
      {
        id: 'what-4',
        title: 'Competitive Exposure',
        image_url: getCropUrl(whatStartX + (cardW + whatGap) * 3, whatY, cardW, whatH),
        description: 'Opportunities to compete in inter-school tournaments and sports meets.',
        sort_order: 4,
        is_visible: true,
      },
    ];

    // 3. Tab columns (3 cards): Y: 51.5% to 59.8%
    const tabY = H * 0.515;
    const tabH = H * 0.088;
    const tabCardW = W * 0.272;
    const tabGap = W * 0.024;
    const tabStartX = W * 0.078;

    const tabImages = [
      getCropUrl(tabStartX, tabY, tabCardW, tabH),
      getCropUrl(tabStartX + (tabCardW + tabGap) * 1, tabY, tabCardW, tabH),
      getCropUrl(tabStartX + (tabCardW + tabGap) * 2, tabY, tabCardW, tabH),
    ];

    // 4. Glimpses of Previous Year (4 cards): Y: 70.3% to 77.0%
    const glimY = H * 0.704;
    const glimH = H * 0.068;
    const glimCards = [
      getCropUrl(whatStartX, glimY, cardW, glimH),
      getCropUrl(whatStartX + (cardW + whatGap) * 1, glimY, cardW, glimH),
      getCropUrl(whatStartX + (cardW + whatGap) * 2, glimY, cardW, glimH),
      getCropUrl(whatStartX + (cardW + whatGap) * 3, glimY, cardW, glimH),
    ];

    // 5. Testimonial Avatars
    const testY = H * 0.822;
    const testH = H * 0.046;
    const testW = testH;
    const avatar1 = getCropUrl(W * 0.088, testY, testW, testH);
    const avatar2 = getCropUrl(W * 0.536, testY, testW, testH);

    // Initial School Page CMS Data object
    const schoolPageData = {
      hero: {
        heading: 'Growing Fit School Programs',
        subtitle: 'Empowering children with lifelong health, discipline, and active sports',
        slides: [
          {
            id: 'slide-1',
            title: 'Martial Arts & Youth Physical Education',
            image_url: heroUrl,
            image_alt: 'Young students practicing martial arts outdoors',
            sort_order: 1,
            is_published: true,
          },
          {
            id: 'slide-2',
            title: 'Structured On-Campus Training',
            image_url: glimCards[0],
            image_alt: 'Students training in outdoor sports track',
            sort_order: 2,
            is_published: true,
          },
          {
            id: 'slide-3',
            title: 'Multi-Sport Development & Athletic Discipline',
            image_url: glimCards[3],
            image_alt: 'Students playing football on turf',
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
        content: 'At Growing Fit, we believe in the power of sports and physical education to shape healthier, happier and more confident children. Our programs are designed to nurture each child\'s unique potential through expert training, fun learning and a supportive environment.',
        is_visible: true,
      },
      whatsInForKids: {
        heading: "WHAT'S IN FOR KIDS",
        subtitle: 'Four pillars of our institutional physical education curriculum',
        cards: whatCards,
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
                image_url: tabImages[0],
                description: 'Sports and physical activities promote mental fitness by improving focus, reducing stress and building confidence.',
                link_text: '',
                link_url: '',
              },
              {
                id: 'hf-2',
                title: 'Physical Fitness',
                image_url: tabImages[1],
                description: 'Structured training improves cardiovascular health, strength, flexibility and overall well-being.',
                link_text: 'SHOW MORE',
                link_url: '#contact',
              },
              {
                id: 'hf-3',
                title: 'Strength and Conditioning',
                image_url: tabImages[2],
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
                image_url: glimCards[0],
                description: 'Sharpening foundational footwork, reaction times, balance, and spatial awareness.',
                link_text: '',
                link_url: '',
              },
              {
                id: 'sd-2',
                title: 'Defensive Techniques',
                image_url: glimCards[2],
                description: 'Structured martial arts drills building personal safety, defensive discipline, and poise.',
                link_text: 'SHOW MORE',
                link_url: '#contact',
              },
              {
                id: 'sd-3',
                title: 'Tactical Coordination',
                image_url: glimCards[3],
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
                image_url: glimCards[0],
                description: 'Sprint mechanics, pacing, aerobic capacity and endurance development for young runners.',
                link_text: '',
                link_url: '',
              },
              {
                id: 'st-2',
                title: 'Swimming Mastery',
                image_url: glimCards[1],
                description: 'Professional stroke technique, breath control and water confidence coached with clinical care.',
                link_text: 'SHOW MORE',
                link_url: '#contact',
              },
              {
                id: 'st-3',
                title: 'Football & Team Play',
                image_url: glimCards[3],
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
            image_url: glimCards[0],
            sort_order: 1,
            is_published: true,
          },
          {
            id: 'glim-2',
            title: 'Youth Swimming Training Camp',
            image_url: glimCards[1],
            sort_order: 2,
            is_published: true,
          },
          {
            id: 'glim-3',
            title: 'Martial Arts High Kick Demonstration',
            image_url: glimCards[2],
            sort_order: 3,
            is_published: true,
          },
          {
            id: 'glim-4',
            title: 'Inter-School Football Scrimmage',
            image_url: glimCards[3],
            sort_order: 4,
            is_published: true,
          },
        ],
      },
      testimonials: {
        heading: 'TESTIMONIALS',
        items: [
          {
            id: 't-1',
            quote: 'Our child has shown amazing improvement in confidence and physical fitness after joining Growing Fit. The coaches are very supportive and professional.',
            author_name: 'Anjali Mehta',
            author_role: 'Parent',
            avatar_url: avatar1,
            sort_order: 1,
            is_visible: true,
          },
          {
            id: 't-2',
            quote: 'The training sessions are well-structured and keep the kids engaged. We are happy to see our child more active and disciplined.',
            author_name: 'Ramesh Kumar',
            author_role: 'Parent',
            avatar_url: avatar2,
            sort_order: 2,
            is_visible: true,
          },
        ],
      },
    };

    // Save to lib/data/school-page.json
    const dataDir = path.join(process.cwd(), 'lib', 'data');
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    const jsonPath = path.join(dataDir, 'school-page.json');
    fs.writeFileSync(jsonPath, JSON.stringify(schoolPageData, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      dimensions: { width: W, height: H },
      cloudBaseUrl,
      saved: true,
    });
  } catch (err: any) {
    console.error('Error initializing school page assets:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
