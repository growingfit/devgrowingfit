-- ==============================================================================
-- GROWING FIT — Directly Executable Database Seed File
-- Can be executed directly in the Supabase SQL Editor.
-- Safely rerunnable using ON CONFLICT clauses.
-- ==============================================================================

-- 1. Singleton Site Settings
INSERT INTO public.site_settings (
    id,
    site_title,
    meta_description,
    logo_url,
    phone,
    email,
    address,
    whatsapp_url,
    is_maintenance
) VALUES (
    1,
    'Growing Fit — School of Health & Physical Education',
    'Empowering children through sports, fitness, and personal development for a healthier, stronger and brighter tomorrow.',
    '/brand/logo.svg',
    '+91 702 581 0722',
    'growingfitofficial@gmail.com',
    'Kerala, India',
    'https://wa.me/917025810722',
    FALSE
)
ON CONFLICT (id) DO UPDATE SET
    site_title = EXCLUDED.site_title,
    phone = EXCLUDED.phone,
    email = EXCLUDED.email;

-- 2. Hero Section Singleton
INSERT INTO public.hero_sections (
    id,
    eyebrow,
    heading,
    highlighted_text,
    description,
    primary_cta_text,
    primary_cta_url,
    secondary_cta_text,
    secondary_cta_url,
    image_url,
    image_focal_position,
    is_visible
) VALUES (
    1,
    'SCHOOL OF HEALTH & PHYSICAL EDUCATION',
    'Stronger Kids. Brighter',
    'Futures.',
    'At Growing Fit, we help children build strength, confidence and discipline through sports and physical education.',
    'Explore Programs',
    '#programs',
    'Enquire Now',
    '#contact',
    NULL,
    'center',
    TRUE
)
ON CONFLICT (id) DO UPDATE SET
    eyebrow = EXCLUDED.eyebrow,
    heading = EXCLUDED.heading,
    highlighted_text = EXCLUDED.highlighted_text,
    description = EXCLUDED.description;

-- 3. Hero Benefits (4 items)
DELETE FROM public.hero_benefits;
INSERT INTO public.hero_benefits (title, icon, sort_order, is_visible) VALUES
('Physical Fitness', 'Activity', 1, TRUE),
('Confidence & Discipline', 'Award', 2, TRUE),
('Healthy Lifestyle', 'Heart', 3, TRUE),
('Lifelong Skills', 'Users', 4, TRUE);

-- 4. Sports Categories (Exact 3 items from reference)
INSERT INTO public.sports_categories (name, slug, icon, sort_order, is_active) VALUES
('Badminton', 'badminton', 'badminton', 1, TRUE),
('Football', 'football', 'football', 2, TRUE),
('Roller Skating', 'roller-skating', 'roller-skating', 3, TRUE)
ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    icon = EXCLUDED.icon,
    sort_order = EXCLUDED.sort_order,
    is_active = EXCLUDED.is_active;

-- 5. Sports Programs (Reference programs)
INSERT INTO public.sports_programs (name, slug, description, sort_order, is_published) VALUES
('Kung Fu', 'kung-fu', 'Traditional martial arts training enhancing focus, balance, agility, and defensive techniques.', 1, TRUE),
('Muay Thai', 'muay-thai', 'High-energy striking discipline building explosive power, endurance, and confidence.', 2, TRUE),
('Boxing', 'boxing', 'Foundational footwork, coordination, and aerobic conditioning in a supportive environment.', 3, TRUE),
('Swimming', 'swimming', 'Comprehensive aquatic training teaching safety, stroke mastery, and full-body fitness.', 4, TRUE),
('Wushu', 'wushu', 'Dynamic contemporary martial art cultivating flexibility, precision acrobatics, and discipline.', 5, TRUE)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    sort_order = EXCLUDED.sort_order;

-- 6. About Section Singleton
INSERT INTO public.about_sections (
    id,
    eyebrow,
    heading,
    highlighted_text,
    description,
    button_text,
    button_url,
    image_url,
    image_focal_position,
    is_visible,
    hero_image_url,
    philosophy_image_url,
    cta_image_url
) VALUES (
    1,
    'ABOUT GROWING FIT',
    'More Than Just',
    'Sports.',
    'Growing Fit is a dedicated sports academy focused on the holistic development of children. We offer professional training programs in Kung Fu, Muay Thai, Boxing, Swimming, and more. Our goal is to help every child stay active, healthy and confident.',
    'Know More',
    '/about',
    '/images/user-admin-about.png',
    'center',
    TRUE,
    '/images/about-hero-banner.png',
    '/images/about-philosophy-card.jpg',
    '/images/about-cta-banner.png'
)
ON CONFLICT (id) DO UPDATE SET
    eyebrow = EXCLUDED.eyebrow,
    heading = EXCLUDED.heading,
    highlighted_text = EXCLUDED.highlighted_text,
    description = EXCLUDED.description,
    button_text = EXCLUDED.button_text,
    button_url = EXCLUDED.button_url,
    image_url = EXCLUDED.image_url,
    hero_image_url = EXCLUDED.hero_image_url,
    philosophy_image_url = EXCLUDED.philosophy_image_url,
    cta_image_url = EXCLUDED.cta_image_url;

-- 7. About Features (4 feature cards)
DELETE FROM public.about_features;
INSERT INTO public.about_features (title, description, icon, sort_order, is_visible) VALUES
('Experienced Coaches', 'Learn from qualified and passionate trainers.', 'UserCheck', 1, TRUE),
('Safe & Supportive Environment', 'A positive space for every child.', 'ShieldCheck', 2, TRUE),
('Quality Training Programs', 'Structured programs for all age groups.', 'Target', 3, TRUE),
('Focus on Overall Well-being', 'Building stronger, happier and healthier kids.', 'HeartHandshake', 4, TRUE);

-- 8. Vision Section Singleton
INSERT INTO public.vision_sections (
    id,
    heading,
    description,
    image_url,
    image_focal_position,
    overlay_opacity,
    is_visible
) VALUES (
    1,
    'Vision',
    'Our vision at Growing Fit is to be a leading sports academy that empowers individuals of all ages and abilities to achieve their full potential, both on and off the field. We envision a future where everyone has access to high-quality sports training programs that promote physical fitness, mental well-being, and a supportive, inclusive community.',
    NULL,
    'center',
    0.85,
    TRUE
)
ON CONFLICT (id) DO UPDATE SET
    heading = EXCLUDED.heading,
    description = EXCLUDED.description,
    overlay_opacity = EXCLUDED.overlay_opacity;

-- 9. Site Statistics
DELETE FROM public.site_statistics;
INSERT INTO public.site_statistics (value, label, sort_order, is_visible) VALUES
('500+', 'Happy Students', 1, TRUE),
('10+', 'Sports Programs', 2, TRUE),
('5+', 'Training Centres', 3, TRUE),
('95%', 'Parent Satisfaction', 4, TRUE);

-- 10. Testimonials (Reference authentic reviews)
DELETE FROM public.testimonials;
INSERT INTO public.testimonials (quote, author_name, author_title, rating, sort_order, is_published) VALUES
('Growing Fit has been an amazing place for my child. The coaches are supportive and the environment is very positive. I have seen great improvement in my child''s confidence and fitness.', 'Fazilulla M', 'Parent', 5, 1, TRUE),
('The training at Growing Fit is excellent. The coaches are knowledgeable and create a motivating environment. My child looks forward to every session.', 'Azhar Ali', 'Parent', 5, 2, TRUE);

-- 11. Centres (Reference locations)
DELETE FROM public.centres;
INSERT INTO public.centres (name, address, sort_order, is_published) VALUES
('Calicut Centre', 'Calicut, Kerala', 1, TRUE),
('Kochi Centre', 'Kochi, Kerala', 2, TRUE),
('Bangalore Centre', 'Bangalore, Karnataka', 3, TRUE),
('Mumbai Centre', 'Mumbai, Maharashtra', 4, TRUE);

-- 12. Social Links
INSERT INTO public.social_links (platform, url, sort_order, is_active) VALUES
('Instagram', 'https://instagram.com/growingfit', 1, TRUE),
('Facebook', 'https://facebook.com/growingfit', 2, TRUE),
('YouTube', 'https://youtube.com/@growingfit', 3, TRUE)
ON CONFLICT (platform) DO UPDATE SET
    url = EXCLUDED.url,
    is_active = EXCLUDED.is_active;

-- 13. Contact Settings Singleton
INSERT INTO public.contact_settings (
    id,
    phone,
    email,
    whatsapp,
    headquarters,
    opening_hours
) VALUES (
    1,
    '+91 702 581 0722',
    'growingfitofficial@gmail.com',
    'https://wa.me/917025810722',
    'Calicut & Kochi, Kerala, India',
    'Monday - Saturday: 6:00 AM - 7:00 PM'
)
ON CONFLICT (id) DO UPDATE SET
    phone = EXCLUDED.phone,
    email = EXCLUDED.email;

-- 14. Footer Settings Singleton
INSERT INTO public.footer_settings (
    id,
    brand_description,
    copyright_text,
    privacy_policy_url,
    terms_conditions_url
) VALUES (
    1,
    'Empowering children through sports, fitness, and personal development for a healthier, stronger and brighter tomorrow.',
    '© 2024 Growing Fit. All rights reserved.',
    '/privacy-policy',
    '/terms-conditions'
)
ON CONFLICT (id) DO UPDATE SET
    brand_description = EXCLUDED.brand_description,
    copyright_text = EXCLUDED.copyright_text;

-- 15. Legal Pages
INSERT INTO public.legal_pages (slug, title, content) VALUES
('privacy-policy', 'Privacy Policy', 'At Growing Fit, we are committed to protecting the privacy and personal data of our students and parents. This policy outlines how information is gathered, used, and safeguarded.'),
('terms-conditions', 'Terms & Conditions', 'By enrolling in Growing Fit academy programs, participants and guardians agree to adhere to all academy rules, safety guidelines, and code of conduct.')
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content;
