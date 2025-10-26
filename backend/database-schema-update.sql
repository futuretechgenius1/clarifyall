-- Add new columns to tools table for Individual Tool Pages and Advanced Filters

-- For Individual Tool Pages
ALTER TABLE tools ADD COLUMN screenshots TEXT; -- JSON array of screenshot URLs
ALTER TABLE tools ADD COLUMN video_url VARCHAR(500); -- YouTube/Vimeo URL
ALTER TABLE tools ADD COLUMN social_links TEXT; -- JSON object with social media links
ALTER TABLE tools ADD COLUMN features TEXT; -- JSON array of feature descriptions
ALTER TABLE tools ADD COLUMN pricing_details TEXT; -- JSON object with pricing information

-- For Advanced Filters
ALTER TABLE tools ADD COLUMN platforms TEXT; -- JSON array: ['Web', 'Desktop', 'Mobile', 'Browser Extension']
ALTER TABLE tools ADD COLUMN feature_tags TEXT; -- JSON array: ['API', 'Mobile App', 'Chrome Extension', etc.]
ALTER TABLE tools ADD COLUMN rating DECIMAL(3,2) DEFAULT 0.00; -- Average rating (0-5)
ALTER TABLE tools ADD COLUMN review_count INT DEFAULT 0; -- Number of reviews

-- Add indexes for better query performance
CREATE INDEX idx_tools_rating ON tools(rating);
CREATE INDEX idx_tools_created_at ON tools(created_at);
CREATE INDEX idx_tools_view_count ON tools(view_count);

-- Sample data structure comments:
-- screenshots: ["url1.jpg", "url2.jpg", "url3.jpg"]
-- video_url: "https://www.youtube.com/watch?v=xxxxx" or "https://vimeo.com/xxxxx"
-- social_links: {"twitter": "handle", "discord": "invite_link", "github": "repo", "linkedin": "company", "youtube": "channel"}
-- features: ["Feature 1", "Feature 2", "Feature 3"]
-- pricing_details: {"free": "Description", "starter": {"price": "$9/mo", "features": []}, "pro": {"price": "$29/mo", "features": []}}
-- platforms: ["Web", "Desktop", "Mobile", "Browser Extension"]
-- feature_tags: ["API Available", "Mobile App", "Chrome Extension", "Free Trial", "No Credit Card", "Open Source"]
