/**
 * Per-vendor product photos — shared between category detail page and vendor slug page.
 * Keys match vendor IDs in vendors.ts.
 */
export const VENDOR_IMAGES: Record<string, string> = {
  // ── Humanoid ────────────────────────────────────────────────────────────
  'unitree':            '/media/Unitree%20Robotics-G1.png',
  'agility':            '/media/Agility%20Robotics.jpeg',
  'tesla':              '/media/tesla-optimus-auAwknG6.png',
  'figure':             '/media/Figure%2002.jpg',
  'boston-dynamics':    '/media/atlas2-Pre-Launch-Thumbnail.webp',
  'apptronik':          '/media/Apptronik.jpg',
  'sanctuary':          '/media/Sanctuary%20AI.webp',
  'ubtech':             '/media/UBTECH%20Robotics.webp',
  'fourier':            '/media/Fourier%20Intelligence.webp',
  'neura':              '/media/4NE-1%20Neura%20Robotics.webp',
  'kepler':             '/media/Kepler%20Robotics.jpg',
  'agibot':             '/media/AgiBot1.png',
  'pal-robotics':       '/media/PAL%20Robotics-TIAGo-Robot.webp',
  '1x':                 '/media/1X%20Technologies.avif',
  // ── Delivery ────────────────────────────────────────────────────────────
  'serve':              '/media/Serve-Gen-2-left-and-Gen-3-robots.jpg',
  'kiwibot':            '/media/Kiwibot.jpg',
  'segway':             '/media/Segway%20Robotics.jpeg',
  // starship has no product image — their robots are not sold standalone
  'rivr':               '/media/del-bot-quad.webp',
  // ── Industrial / Warehouse ──────────────────────────────────────────────
  'seegrid':            '/media/Seegrid-Palion-AMR-Fleet-2024_Palion-Tow-Palion-Lift-RS1-Palion-Lift-CR1.webp',
  'mir':                '/media/MiR-AMR-lineup-1500x1000-1-1024x683.webp',
  'locus':              '/media/Locus-3.png',
  'greyorange':         '/media/greyorange-warehouse-robots.jpg',
  'geekplus':           '/media/IMG-Geekplus-robotics-solution-3-670x510-1.png',
  'otto-motors':        '/media/OTTO%20Motors.png',
  'omron':              '/media/Omron%20Mobile%20Robotics-fleet-bg.jpg',
  'hai-robotics':       '/media/Hai-Robotics-ASRS-bots-670x510-1.png',
  'clearpath':          '/media/clearpath-ros.jpg',
  '6rs':                '/media/6-river-systems-shopify.png',
  'invia':              '/media/inVia-robot-product-shot-image-1.png',
  // ── Quadruped ───────────────────────────────────────────────────────────
  'unitree-quadruped':  '/media/Unitree%20(Quadruped)%20.webp',
  'anybotics':          '/media/ANYbotics-ANYmal.webp',
  'deep-robotics':      '/media/DEEP%20Robotics.jpg',
  // ── Security ────────────────────────────────────────────────────────────
  'knightscope':        '/media/Knightscope.webp',
  'cobalt-robotics':    '/media/Cobalt%20Robotics.jpg',
  // ── Cleaning ────────────────────────────────────────────────────────────
  'avidbots':           '/media/Avidbots.png',
  'tennant':            '/media/Tennant%20.jpeg',
  'ice-cobotics':       '/media/ICE%20Cobotics.png',
  // ── Surgical ────────────────────────────────────────────────────────────
  'intuitive-surgical': '/media/Intuitive%20Surgical.jpeg',
  'medtronic-hugo':     '/media/Hugo%20RAS.jpg',
  'stryker-mako':       '/media/Mako%204%20Family%204%204K%20with%20shadow4.png',
  'cmr-surgical':       '/media/CMR%20Surgical.webp',
  // ── Agricultural ────────────────────────────────────────────────────────
  'monarch-tractor':    '/media/Monarch%20Tractor.webp',
  'carbon-robotics':    '/media/Carbon%20Robotics-LaserWeeder-G2-600.webp',
  'dji-agras':          '/media/DJI%20Agras-Dronak_nekazaritzan_(cropped).jpg',
  'burro':              '/media/Burro%20Autonomous%20Field%20Vehicle.png',
  // ── Service & Hospitality ────────────────────────────────────────────────
  'aethon':             '/media/Aethon_Website_Robot_T3.png',
  'bear-robotics':      '/media/Bear%20Robotics.jpg',
  'pudu-robotics':      '/media/PUDU%20Robotics-Bellabot-1-2.webp',
  'xenex':              '/media/Xenex-XenL.jpg',
  'lg-cloi':            '/media/LG%20CLOi.jpg',
  // ── Defense ─────────────────────────────────────────────────────────────
  'ghost-robotics':     '/media/Ghost-Robotics-featured.jpg',
  'aerovironment':      '/media/AeroVironment.webp',
  'teledyne-flir-defense': '/media/Teledyne%20FLIR%20Defense.jpg',
  'milrem-robotics':    '/media/Milrem%20Robotics.webp',
  // ── Exoskeleton ──────────────────────────────────────────────────────────
  'ekso-bionics':       '/media/EksoNR-by-Ekso-Bionics-Exoskeleton-Catalog-600.jpg',
  'sarcos':             '/media/Guardian%20XO.avif',
  'german-bionic':      '/media/Cray-X-5th-Gen-German-Bionics-Exoskeleton-Catalog-2022.jpg',
  // ── Inspection ──────────────────────────────────────────────────────────
  'flyability':         '/media/Elios%203%20(collision-tolerant%20indoor%20drone).jpg',
  'gecko-robotics':     '/media/Gecko%20Robotics.webp',
  'airobotics':         '/media/Airobotics%20Optimus%20(drone-in-a-box%2C%20BVLOS).jpeg',
  // ── Underwater ──────────────────────────────────────────────────────────
  'blue-robotics':      '/media/BlueROV2-remotely-operated-vehicle.png',
  'deep-trekker':       '/media/Deep%20Trekker.png',
  'videoray':           '/media/VideoRay.webp',
  // ── Drone ───────────────────────────────────────────────────────────────
  'dji-enterprise':     '/media/DJI%20Enterprise.jpg',
  'skydio':             '/media/Skydio.avif',
  'zipline':            '/media/zipline.jpg',
  'wing':               '/media/Wing%20(Alphabet).webp',
  'autel':              '/media/Autel%20Robotics.jpg',
  'parrot':             '/media/Parrot%20ANAFI%20USA%20.png',
  'percepto':           '/media/Percepto-1.jpg',
  'american-robotics':  '/media/American%20robot%20scout-system.webp',
  'freefly':            '/media/Freefly%20Systems-alta-x-signoff2.jpg',
  'matternet':          '/media/Matternet_System_018.webp',
  // ── Cobots & Robot Arms ──────────────────────────────────────────────────
  'elephant-robotics':  '/media/Elephant%20Robotics.webp',
  'universal-robots':   '/media/Universal%20Robots.png',
  'fanuc':              '/media/FANUC.jpeg',
  'kuka':               '/media/KUKA.avif',
  'franka':             '/media/Franka%20Robotics-franka-research-3.png',
  'igus':               '/media/igus.jpg',
  'doosan-robotics':    '/media/Doosan%20Robotics-A-Series-1.png',
  // ── Components & Sensors ────────────────────────────────────────────────
  'onrobot':            '/media/OnRobot-Products_2021.jpg',
  'robotiq':            '/media/Robotiq%202F-85%20Adaptive%20Gripper%20.jpg',
  'ouster':             '/media/OS1-32%20LiDAR%20.png',
  'stereolabs':         '/media/ZED%202i%20.webp',
  'robotis':            '/media/ROBOTIS%20%3A%20Dynamixel.jpg',
};
