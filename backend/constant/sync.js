const sequelize = require('../config/db');

const Hero = require('../models/home/heroModel');
const Gallery =require('../models/home/galleryModel');
const News = require('../models/home/newsModel');
const Comment =require('../models/home/commentModel');
const Like =require('../models/home/likeModel');
const Partner =require('../models/home/partnerModel');
const ImpactDashboard =require('../models/home/impactModel');

const VMV = require('../models/about/vmvModel');
const Member=require('../models/about/memberModel');

const StemOperation = require('../models/programs/STEM-/stemOperationModel');
const StemCenter =require('../models/programs/STEM-/stemCenterModel');

(async () => {
  try {
    await sequelize.sync({ alter: false }); // or force: true for dev
    console.log(' All tables synced successfully');
    process.exit(0);
  } catch (err) {
    console.error(' Error syncing tables:', err);
    process.exit(1);
  }
})();

// node sync.js      # dev
// npm run migrate    # prod

