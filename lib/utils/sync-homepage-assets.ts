import fs from 'fs';
import path from 'path';
import { readPng, cropAndSavePng, PngImage } from './png';

export function syncHomepageAssets() {
  try {
    const destDir = path.join(process.cwd(), 'public', 'images');
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

    // Look for the user's uploaded reference image
    const candidatePaths = [
      'C:\\Users\\muham\\.gemini\\antigravity-ide\\brain\\b1c7e8c9-df51-488a-b1c1-7aa5ab1391f1\\.user_uploaded\\media_1792218421346.png',
      'C:\\Users\\muham\\.gemini\\antigravity-ide\\brain\\b1c7e8c9-df51-488a-b1c1-7aa5ab1391f1\\.user_uploaded\\media_1792219298685.png',
    ];

    let srcPath = '';
    for (const p of candidatePaths) {
      if (fs.existsSync(p)) {
        srcPath = p;
        break;
      }
    }

    if (!srcPath) return;

    // Check if crops already exist and are fresh
    const heroCrop = path.join(destDir, 'hero-banner-karate.png');
    const schoolsCrop = path.join(destDir, 'for-schools.png');
    const dimsFile = path.join(destDir, 'ref-dims.json');

    // Copy original full screenshot to public/images/homepage-reference.png
    const refCopy = path.join(destDir, 'homepage-reference.png');
    if (!fs.existsSync(refCopy)) {
      fs.copyFileSync(srcPath, refCopy);
    }

    let img: PngImage | null = null;
    try {
      img = readPng(srcPath);
      fs.writeFileSync(dimsFile, JSON.stringify({ width: img.width, height: img.height }));
    } catch (e: any) {
      console.warn('Could not parse PNG:', e);
      return;
    }

    if (!img) return;

    const W = img.width;
    const H = img.height;

    // Based on the full page screenshot proportion:
    // 1. Hero banner: Top is below header (~y: 50 to 395 when total height is ~2300, or proportional)
    // Let's compute accurate relative coordinates:
    // Header is approx 0 to 45px (if H is ~2000-2400)
    // Hero banner starts right after header and ends before the categories text:
    // "Discover a wide range of sports programs..."
    
    // We can crop:
    // Hero: x: 0, y: Math.round(H * 0.021), w: W, h: Math.round(H * 0.168)
    const heroY = Math.round(H * 0.022);
    const heroH = Math.round(H * 0.165);
    cropAndSavePng(img, 0, heroY, W, heroH, heroCrop);

    // Also save as default hero-martial-arts.png so any existing component points directly to this:
    cropAndSavePng(img, 0, heroY, W, heroH, path.join(destDir, 'hero-martial-arts.png'));

    // 2. For Schools football image (Right column of For Schools section):
    // In screenshot, For Schools is located around y = 0.28 to 0.45
    // The photo of kids playing football:
    const schoolX = Math.round(W * 0.525);
    const schoolY = Math.round(H * 0.301);
    const schoolW = Math.round(W * 0.435);
    const schoolH = Math.round(H * 0.128);
    cropAndSavePng(img, schoolX, schoolY, schoolW, schoolH, schoolsCrop);

    // 3. For Academy main image (Left column of For Academy section):
    // Kids sitting on balls cheering:
    const academyMainX = Math.round(W * 0.04);
    const academyMainY = Math.round(H * 0.495);
    const academyMainW = Math.round(W * 0.44);
    const academyMainH = Math.round(H * 0.125);
    cropAndSavePng(img, academyMainX, academyMainY, academyMainW, academyMainH, path.join(destDir, 'for-academy.png'));

    // 4. Academy 4 thumbnails (under the text on the right):
    // They are 4 thumbnails side-by-side: Skating, Boxing, Swimming, Football
    const acadThumbY = Math.round(H * 0.612);
    const acadThumbH = Math.round(H * 0.038);
    const acadThumbW = Math.round(W * 0.108);
    const acadGap = Math.round(W * 0.015);
    const acadStartStartX = Math.round(W * 0.50);

    cropAndSavePng(img, acadStartStartX + 0 * (acadThumbW + acadGap), acadThumbY, acadThumbW, acadThumbH, path.join(destDir, 'academy-skating.png'));
    cropAndSavePng(img, acadStartStartX + 1 * (acadThumbW + acadGap), acadThumbY, acadThumbW, acadThumbH, path.join(destDir, 'academy-boxing.png'));
    cropAndSavePng(img, acadStartStartX + 2 * (acadThumbW + acadGap), acadThumbY, acadThumbW, acadThumbH, path.join(destDir, 'academy-swimming.png'));
    cropAndSavePng(img, acadStartStartX + 3 * (acadThumbW + acadGap), acadThumbY, acadThumbW, acadThumbH, path.join(destDir, 'academy-football.png'));

    // 5. For Corporates main image (Right column):
    // Adults celebrating / high fiving:
    const corpMainX = Math.round(W * 0.552);
    const corpMainY = Math.round(H * 0.697);
    const corpMainW = Math.round(W * 0.408);
    const corpMainH = Math.round(H * 0.108);
    cropAndSavePng(img, corpMainX, corpMainY, corpMainW, corpMainH, path.join(destDir, 'for-corporate.png'));

    // 6. Corporate 4 thumbnails (Bottom row):
    // Team Building, Tournaments, Sport Day, Sports Club
    const corpThumbY = Math.round(H * 0.828);
    const corpThumbH = Math.round(H * 0.045);
    const corpThumbW = Math.round(W * 0.174);
    const corpGap = Math.round(W * 0.019);
    const corpStartX = Math.round(W * 0.13);

    cropAndSavePng(img, corpStartX + 0 * (corpThumbW + corpGap), corpThumbY, corpThumbW, corpThumbH, path.join(destDir, 'corp-team-building.png'));
    cropAndSavePng(img, corpStartX + 1 * (corpThumbW + corpGap), corpThumbY, corpThumbW, corpThumbH, path.join(destDir, 'corp-tournaments.png'));
    cropAndSavePng(img, corpStartX + 2 * (corpThumbW + corpGap), corpThumbY, corpThumbW, corpThumbH, path.join(destDir, 'corp-sport-day.png'));
    cropAndSavePng(img, corpStartX + 3 * (corpThumbW + corpGap), corpThumbY, corpThumbW, corpThumbH, path.join(destDir, 'corp-sports-club.png'));

    // 7. Footer Logo:
    const footerLogoX = Math.round(W * 0.07);
    const footerLogoY = Math.round(H * 0.908);
    const footerLogoW = Math.round(W * 0.16);
    const footerLogoH = Math.round(H * 0.022);
    cropAndSavePng(img, footerLogoX, footerLogoY, footerLogoW, footerLogoH, path.join(destDir, 'footer-logo.png'));

  } catch (err) {
    console.warn('syncHomepageAssets error:', err);
  }
}
