const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'src', 'data', 'products.json');
const rawData = fs.readFileSync(dbPath, 'utf8');
const db = JSON.parse(rawData);

// Image mapping logic based on existing real images
function getImagesForProduct(item) {
  const brand = item.brand.toLowerCase();
  const type = item.type.toLowerCase();
  
  let mainImg = '/images/hero-cam.jpg'; // ultimate fallback

  if (type.includes('solar')) mainImg = '/images/solar-camera.jpg';
  else if (type.includes('4g') || type.includes('sim')) mainImg = '/images/sim-camera.jpg';
  else if (type.includes('ptz')) {
    if (brand.includes('cp plus')) mainImg = '/images/cp-unp-d2521l10-daq.jpg';
    else if (brand.includes('ezviz')) mainImg = '/images/ezviz-c8c.jpg';
    else mainImg = '/images/cp-unp-d2521l10-daq.jpg';
  }
  else if (type.includes('bullet') || type.includes('colorvu') || type.includes('tioc')) {
    if (brand.includes('hikvision')) mainImg = '/images/hikvision-colorvu.jpg';
    else if (brand.includes('dahua')) mainImg = '/images/dahua-tioc.jpg';
    else if (brand.includes('ezviz')) mainImg = '/images/ezviz-c3w-pro.jpg';
    else if (brand.includes('cp plus')) mainImg = '/images/cp-unc-ta41l3-d.jpg';
    else mainImg = '/images/hikvision-colorvu.jpg';
  }
  else if (type.includes('dome') || type.includes('turret')) {
    if (brand.includes('cp plus')) mainImg = '/images/cp-usc-da24l2.jpg';
    else if (brand.includes('dahua')) mainImg = '/images/dahua-wizsense.jpg';
    else if (brand.includes('hikvision')) mainImg = '/images/hikvision-colorvu.jpg';
    else mainImg = '/images/cp-usc-da24l2.jpg';
  }
  else if (type.includes('wi-fi') || type.includes('cube')) {
    if (brand.includes('cp plus')) mainImg = '/images/cp-e35a.jpg';
    else mainImg = '/images/ezviz-c3w-pro.jpg';
  }
  else if (type.includes('dvr') || type.includes('xvr')) {
    if (brand.includes('cp plus')) mainImg = '/images/cp-cosmic-dvr.jpg';
    else mainImg = '/images/dvr-recorder.jpg';
  }
  else if (type.includes('nvr')) {
    mainImg = '/images/nvr-recorder.jpg';
  }
  else if (type.includes('power')) mainImg = '/images/smps-power.jpg';
  else if (type.includes('cable')) mainImg = '/images/cat6-cable.jpg';
  else if (type.includes('switch')) mainImg = '/images/poe-switch.jpg';
  else if (type.includes('drive')) mainImg = '/images/hdd-drive.jpg';
  else if (type.includes('connector')) mainImg = '/images/bnc-connector.jpg';
  else if (type.includes('service')) mainImg = '/images/service-install.jpg';

  // We assign 4 images for the gallery. Since we only have 1 real one per category, 
  // we just array it 4 times so the carousel works perfectly and doesn't break.
  return [mainImg, mainImg, mainImg, mainImg];
}

Object.keys(db).forEach(cat => {
  db[cat].forEach(item => {
    item.images = getImagesForProduct(item);
  });
});

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log('Successfully mapped all products to real local images!');
