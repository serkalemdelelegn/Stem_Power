const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();

// Middleware - CORS configuration
// Allow multiple origins: production frontend and localhost for development
const allowedOrigins = [
  process.env.FRONTEND_URL, // https://ethiopia.stempower.org
  process.env.ADMIN_URL, // https://ethiopia.stempower.org/admin (if needed)
  "http://localhost:3000", // Local development
  "https://ethiopia.stempower.org", // Production frontend
].filter(Boolean); // Remove any undefined values

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      // Check if origin is in allowed list
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        // For development, be more permissive
        if (process.env.NODE_ENV !== "production") {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      }
    },
    credentials: true,
  })
);
// Increase body size limits to allow image uploads (e.g., base64 payloads)
const bodySizeLimit = process.env.BODY_SIZE_LIMIT || "20mb";
app.use(express.json({ limit: bodySizeLimit }));
app.use(express.urlencoded({ extended: true, limit: bodySizeLimit }));
app.use(cookieParser()); // Parse cookies from request

// Root route
app.get("/", (req, res) => {
  res.send("API is running ...");
});

// Import routes
// Home routes
const heroRouter = require("./routes/home/heroRoute");
const galleryRouter = require("./routes/home/gallaryRoute");
const partnerRouter = require("./routes/home/partnerRoute");
const impactRouter = require("./routes/home/impactRoute");

// About routes
const memberRouter = require("./routes/about/memberRoute");
const staffHeroRouter = require("./routes/about/staffHeroRoute");
const vmvRouter = require("./routes/about/vmvRoute");
const aboutStemCenterRouter = require("./routes/about/aboutStemCenterRoute");
const testimonialRouter = require("./routes/about/testimonialRoute");

// Latest routes
const newsRouter = require("./routes/latest/newsRoute");
const eventRouter = require("./routes/latest/eventRoute");
const announcementRouter = require("./routes/latest/announcementRoute");
const commentRouter = require("./routes/latest/commentRoute");
const likeRouter = require("./routes/latest/likeRoute");

// Contact Us routes
const contactOfficeRouter = require("./routes/contact_us/contactOfficeRoute");
const newsletterSubscriberRouter = require("./routes/contact_us/newsletterSubscriberRoute");
const socialLinkRouter = require("./routes/contact_us/socialLinkRoute");

// Footer routes
const quickLinksRouter = require("./routes/footer/quickLinksRoute");
const footerRouter = require("./routes/footer/footerRoute");
const footerSocialLinkRouter = require("./routes/footer/footerSocialLinkRoute");
const footerSectionRouter = require("./routes/footer/footerSectionRoute");

// Programs - Entrepreneurship routes
const businessDevelopmentRouter = require("./routes/programs/Entrepreneurship/businessDevelopmentRoute");
const digitalSkillTrainingRouter = require("./routes/programs/Entrepreneurship/digitalSkillTrainingRoute");
const incubationProgramRouter = require("./routes/programs/Entrepreneurship/incubationProgramRoute");
const softSkillsTrainingRouter = require("./routes/programs/Entrepreneurship/softSkillsTrainingRoute");

// Programs - Fablab routes
const fablabProductsRouter = require("./routes/programs/Fablab/fablabProductsRoute");
const fablabServicesRouter = require("./routes/programs/Fablab/fablabServicesRoute");
const makerSpaceRouter = require("./routes/programs/Fablab/makerSpaceRoute");
const trainingConsultancyRouter = require("./routes/programs/Fablab/trainingConsultancyRoute");

// Programs - StemCenter routes
const scienceFairsRouter = require("./routes/programs/StemCenter/scienceFairsRoute");
const stemCentersRouter = require("./routes/programs/StemCenter/stemCentersRoute");
const universityOutreachRouter = require("./routes/programs/StemCenter/universityOutreachRoute");
const stemTvRouter = require("./routes/programs/StemCenter/stemTvRoute");

// User routes
const userRouter = require("./routes/userRoute");

// Chatbot routes
const chatbotRouter = require("./routes/chatbot/chatbotRoute");

// Dynamic pages & navigation
const dynamicPageRouter = require("./routes/dynamicPageRoute");
const headerRouter = require("./routes/headerRoute");

// Use routes
// Home routes
app.use("/api/heroes", heroRouter);
app.use("/api/gallery", galleryRouter);
app.use("/api/partners", partnerRouter);
app.use("/api/impact", impactRouter);

// About routes
app.use("/api/members", memberRouter);
app.use("/api/staff-hero", staffHeroRouter);
app.use("/api/vmv", vmvRouter);
app.use("/api/about/stem-centers", aboutStemCenterRouter);
app.use("/api/about/testimonials", testimonialRouter);

// Latest routes
app.use("/api/news", newsRouter);
app.use("/api/events", eventRouter);
app.use("/api/announcements", announcementRouter);
app.use("/api/comments", commentRouter);
app.use("/api/likes", likeRouter);

// Contact Us routes
app.use("/api/contact-office", contactOfficeRouter);
app.use("/api/newsletter-subscribers", newsletterSubscriberRouter);
app.use("/api/social-links", socialLinkRouter);

// Footer routes
app.use("/api/quick-links", quickLinksRouter);
app.use("/api/footer", footerRouter);
app.use("/api/footer/social-links", footerSocialLinkRouter);
app.use("/api/footer/sections", footerSectionRouter);

// Programs - Entrepreneurship routes
app.use("/api/business-development", businessDevelopmentRouter);
app.use("/api/digital-skill-training", digitalSkillTrainingRouter);
app.use("/api/incubation-program", incubationProgramRouter);
app.use("/api/soft-skills-training", softSkillsTrainingRouter);

// Programs - Fablab routes
app.use("/api/fablab-products", fablabProductsRouter);
app.use("/api/fablab-services", fablabServicesRouter);
app.use("/api/maker-space", makerSpaceRouter);
app.use("/api/training-consultancy", trainingConsultancyRouter);

// Programs - StemCenter routes
app.use("/api/science-fairs", scienceFairsRouter);
app.use("/api/stem-centers", stemCentersRouter);
app.use("/api/university-outreach", universityOutreachRouter);
app.use("/api/stem-tv", stemTvRouter);

// User routes
app.use("/api/users", userRouter);

// Chatbot routes
app.use("/api/chatbot", chatbotRouter);

// Dynamic pages & navigation
app.use("/api/pages", dynamicPageRouter);
app.use("/api/header", headerRouter);

// Error handling middleware (must be last)
const errorHandler = require("./middlewares/errorHandler");
app.use(errorHandler);

module.exports = app;
