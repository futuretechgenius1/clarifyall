const { pool, initializeTables } = require('../config/database');
const Category = require('../models/Category');

// Initial categories data
const categories = [
  { name: 'Chatbots & Virtual Companions', slug: 'chatbots-virtual-companions', description: 'AI-powered conversational agents and virtual assistants' },
  { name: 'Image Generation & Editing', slug: 'image-generation-editing', description: 'AI tools for creating and editing images' },
  { name: 'Writing & Editing', slug: 'writing-editing', description: 'AI-powered writing assistants and content generators' },
  { name: 'Coding & Development', slug: 'coding-development', description: 'AI tools for software development and coding assistance' },
  { name: 'Office & Productivity', slug: 'office-productivity', description: 'AI tools to enhance workplace productivity' },
  { name: 'Video & Animation', slug: 'video-animation', description: 'AI-powered video creation and animation tools' },
  { name: 'Marketing & Advertising', slug: 'marketing-advertising', description: 'AI tools for marketing campaigns and advertising' },
  { name: 'Audio & Music', slug: 'audio-music', description: 'AI tools for audio processing and music generation' },
  { name: 'Data Analysis & Visualization', slug: 'data-analysis-visualization', description: 'AI-powered data analytics and visualization tools' },
  { name: 'Customer Support & CRM', slug: 'customer-support-crm', description: 'AI tools for customer relationship management' },
  { name: 'Education & Learning', slug: 'education-learning', description: 'AI-powered educational tools and learning platforms' },
  { name: 'Healthcare & Medical', slug: 'healthcare-medical', description: 'AI tools for healthcare and medical applications' },
  { name: 'Finance & Accounting', slug: 'finance-accounting', description: 'AI tools for financial analysis and accounting' },
  { name: 'Legal & Compliance', slug: 'legal-compliance', description: 'AI tools for legal research and compliance' },
  { name: 'Human Resources', slug: 'human-resources', description: 'AI tools for HR management and recruitment' },
  { name: 'Sales & Lead Generation', slug: 'sales-lead-generation', description: 'AI tools for sales automation and lead generation' },
  { name: 'Social Media Management', slug: 'social-media-management', description: 'AI tools for managing social media presence' },
  { name: 'SEO & Content Optimization', slug: 'seo-content-optimization', description: 'AI tools for search engine optimization' },
  { name: 'E-commerce & Retail', slug: 'ecommerce-retail', description: 'AI tools for online retail and e-commerce' },
  { name: 'Gaming & Entertainment', slug: 'gaming-entertainment', description: 'AI tools for gaming and entertainment' },
  { name: 'Research & Development', slug: 'research-development', description: 'AI tools for research and innovation' },
  { name: 'Translation & Localization', slug: 'translation-localization', description: 'AI-powered translation and localization tools' },
  { name: 'Cybersecurity', slug: 'cybersecurity', description: 'AI tools for security and threat detection' },
  { name: 'Real Estate & Property', slug: 'real-estate-property', description: 'AI tools for real estate management' },
  { name: 'Travel & Hospitality', slug: 'travel-hospitality', description: 'AI tools for travel and hospitality industry' }
];

async function initializeDatabase() {
  try {
    console.log('🔄 Initializing database...\n');

    // Initialize tables
    console.log('Creating tables...');
    await initializeTables();

    // Check if categories already exist
    const existingCategories = await Category.findAll();
    if (existingCategories.length > 0) {
      console.log(`✅ Database already initialized with ${existingCategories.length} categories`);
      process.exit(0);
    }

    // Insert categories
    console.log('Inserting categories...');
    for (const category of categories) {
      await Category.create(category);
      console.log(`  ✓ ${category.name}`);
    }

    console.log(`\n✅ Database initialized successfully with ${categories.length} categories!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
}

// Run initialization
initializeDatabase();
