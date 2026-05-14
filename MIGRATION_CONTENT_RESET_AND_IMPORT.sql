-- BBMh Content OS V4.0.0-PRO Content Reset & Import
-- STEP 1 & 2: BACKUP OLD CONTENT DATA
CREATE TABLE IF NOT EXISTS content_items_backup_v4 AS SELECT * FROM content_items;
CREATE TABLE IF NOT EXISTS ideas_backup_v4 AS SELECT * FROM ideas;

DELETE FROM content_items;
DELETE FROM ideas;

-- STEP 3: DESIGN THE NEW CONTENT DATA MODEL

-- A. content_sources
CREATE TABLE IF NOT EXISTS content_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    source_type TEXT NOT NULL, -- pdf | markdown | pasted_text | flow_doc
    source_label TEXT,
    raw_text TEXT,
    parsed_status TEXT DEFAULT 'parsed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- B. content_scripts
CREATE TABLE IF NOT EXISTS content_scripts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID REFERENCES content_sources(id) ON DELETE SET NULL,
    script_code TEXT, -- e.g. T-01, IN-01, W-01
    title TEXT NOT NULL,
    hook TEXT,
    script_body TEXT,
    content_type TEXT, -- deep_reel | fast_reel | carousel | frame | mirror | question | contrast | other
    pillar TEXT,
    theme TEXT,
    category TEXT,
    visual_direction TEXT,
    caption_notes TEXT,
    thumbnail_headline TEXT,
    cta TEXT,
    status TEXT DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- C. content_calendar_posts
CREATE TABLE IF NOT EXISTS content_calendar_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    script_id UUID REFERENCES content_scripts(id) ON DELETE SET NULL,
    month TEXT,
    date TEXT,
    day TEXT,
    post_number INTEGER,
    content_type TEXT,
    title_or_hook TEXT,
    theme TEXT,
    cascade_parent_script_id UUID REFERENCES content_scripts(id) ON DELETE SET NULL,
    cascade_child_script_id UUID REFERENCES content_scripts(id) ON DELETE SET NULL,
    calendar_status TEXT DEFAULT 'planned',
    production_status TEXT DEFAULT 'not_started',
    publishing_status TEXT DEFAULT 'not_published',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- D. content_publishing_flow
CREATE TABLE IF NOT EXISTS content_publishing_flow (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stage_name TEXT NOT NULL,
    stage_order INTEGER NOT NULL,
    description TEXT,
    owner TEXT,
    required_inputs TEXT,
    output TEXT,
    platform TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- E. content_assets
CREATE TABLE IF NOT EXISTS content_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    calendar_post_id UUID REFERENCES content_calendar_posts(id) ON DELETE CASCADE,
    asset_type TEXT, -- thumbnail | reel_video | carousel_slide | caption | reference | raw_footage | final_export
    asset_status TEXT DEFAULT 'pending',
    notes TEXT,
    reference_url TEXT,
    file_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- F. content_platform_push
CREATE TABLE IF NOT EXISTS content_platform_push (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    calendar_post_id UUID REFERENCES content_calendar_posts(id) ON DELETE CASCADE,
    platform TEXT, -- instagram | youtube_shorts | linkedin | other
    scheduled_date DATE,
    scheduled_time TIME,
    platform_caption TEXT,
    platform_status TEXT DEFAULT 'not_started', -- not_started | drafted | scheduled | published | repurposed
    published_url TEXT,
    performance_tracking_enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ENABLE RLS
ALTER TABLE content_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_calendar_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_publishing_flow ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_platform_push ENABLE ROW LEVEL SECURITY;

-- GRANTS
GRANT ALL ON content_sources TO anon, authenticated, service_role;
GRANT ALL ON content_scripts TO anon, authenticated, service_role;
GRANT ALL ON content_calendar_posts TO anon, authenticated, service_role;
GRANT ALL ON content_publishing_flow TO anon, authenticated, service_role;
GRANT ALL ON content_assets TO anon, authenticated, service_role;
GRANT ALL ON content_platform_push TO anon, authenticated, service_role;

-- POLICIES
CREATE POLICY "Enable all for anon users" ON content_sources FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for authenticated users" ON content_sources FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Enable all for anon users" ON content_scripts FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for authenticated users" ON content_scripts FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Enable all for anon users" ON content_calendar_posts FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for authenticated users" ON content_calendar_posts FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Enable all for anon users" ON content_publishing_flow FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for authenticated users" ON content_publishing_flow FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Enable all for anon users" ON content_assets FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for authenticated users" ON content_assets FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Enable all for anon users" ON content_platform_push FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for authenticated users" ON content_platform_push FOR ALL TO authenticated USING (true) WITH CHECK (true);
-- INSERT SCRIPT DATA
INSERT INTO content_sources (id, title, source_type, source_label, raw_text) VALUES 
('11111111-1111-1111-1111-111111111111', 'BBMh — 30 Complete Scripts', 'pasted_text', 'Core 30 Scripts', '...'),
('22222222-2222-2222-2222-222222222222', 'BBMh — Fast Reel Format System', 'pasted_text', 'Fast Reel Formats', '...');

INSERT INTO content_scripts (source_id, script_code, title, hook, script_body, content_type, theme, caption_notes, thumbnail_headline) VALUES 
('11111111-1111-1111-1111-111111111111', 'T-01', 'You''re Still in Era Zero.', 'Apple had three completely different brand identities before they became the most valuable company in history. Most businesses never get past the first one.', '**INSIGHT**
Think Different established who they were — not products, identity. The iPod silhouette said the product IS the brand. Shot on iPhone put proof directly in customers'' hands. Each era matched where the business was going. Not where it had been. None of it was accidental.

**REFRAME**
Most businesses stay in era zero forever. The logo from 2003. The website built when the internet looked different. The business moved forward. The brand stayed still. And there''s a gap — between what the company actually is today and what the brand is still communicating.

**CLOSE**
That gap costs deals every day. It just happens quietly.', 'deep_reel', 'Apple Brand Eras · Deep Reel · Talking head', 'Most businesses evolve their product, their team, their pricing — and freeze their brand in the year it was first designed. Apple went through Think Different, the iPod era, Shot on iPhone — each one a deliberate choice matching where the company was going. If your brand still looks the way it did five years ago, it isn''t representing the business you''ve built. It''s representing the business you used to be.
#bbmh #beanbagmediahouse #brandingindia #b2bbranding #brandstrategy', 'A: "You''re Still in Era Zero."
B: "Apple changed their entire brand 3 times before it worked. Where are you?"
C: "Your business grew. Your brand didn''t. That gap is costing you deals."');
INSERT INTO content_scripts (source_id, script_code, title, hook, script_body, content_type, theme, caption_notes, thumbnail_headline) VALUES 
('11111111-1111-1111-1111-111111111111', 'T-02', 'Heritage That Isn''t Visible Doesn''t Count.', 'There''s a French pharmacy brand called Officine Universelle Buly. Ornate packaging, museum-quality stores, feels like the 1800s. It was founded in 2014.', '**INSIGHT**
They didn''t fake history. They engineered the feeling of depth through design — illustrated labels, dense handwritten copy, stores that feel like time capsules. They understood something most businesses miss: depth doesn''t just come from time. It comes from deliberately communicating craft and intention.

**REFRAME**
Your family business might be 30 or 40 years old. Real founding. Real craft. Real decades of client relationships. And the brand looks like it was built in an afternoon. The depth is real. The brand just isn''t surfacing it.

**CLOSE**
Heritage that isn''t visible doesn''t count.', 'deep_reel', 'Officine Universelle Buly · Heritage Maximalism · Deep Reel', 'Depth isn''t just time. It''s the deliberate communication of craft, care, and intention across every visual touchpoint. A brand founded a decade ago can look older and more established than one with 40 years of real history — simply because it invested in surfacing that depth visually. Your history is an asset. The brand is the only mechanism that makes it visible to someone who has never met you.
#bbmh #beanbagmediahouse #familybusiness #heritagebrand #brandingindia', 'A: "Heritage That Isn''t Visible Doesn''t Count."
B: "A brand founded in 2014 looks 200 years old. Your 40-year business looks brand new. Why?"
C: "Your family business has more depth than most global brands. You''d never know it from the logo."');
INSERT INTO content_scripts (source_id, script_code, title, hook, script_body, content_type, theme, caption_notes, thumbnail_headline) VALUES 
('11111111-1111-1111-1111-111111111111', 'T-03', 'The Product Gets You In. The Brand Gets You In the Room First.', 'Athletic Brewing makes non-alcoholic beer. They packaged it to look exactly like craft beer. Not to deceive anyone.', '**INSIGHT**
Their customer didn''t want to explain why they weren''t drinking at the table. They just wanted to hold something that fit the room. Athletic Brewing solved a social problem the product alone couldn''t solve. The packaging was the real product.

**REFRAME**
Your brand does this for your business — whether you know it or not. When your visual identity fits the tier you want to operate in, you stop having to prove yourself in every meeting. You arrive already belonging.

**CLOSE**
The product gets you in. The brand gets you in the room first.', 'deep_reel', 'Athletic Brewing · Camouflage Positioning · Deep Reel', 'Athletic Brewing didn''t change what was in the can. They changed what the can communicated — and solved a social problem their customer was too polite to name. Your brand does this same work for your business whether you''ve designed it to or not. The question is whether it''s doing it well, doing it badly, or doing nothing at all.
#bbmh #beanbagmediahouse #brandpositioning #b2bmarketing #visualidentity', 'A: "They Made Non-Alcoholic Beer Look Like Craft Beer. Not to Deceive. To Belong."
B: "What does your brand communicate before you walk into the meeting?"
C: "Fit the tier you want. Not the tier you''re currently in."');
INSERT INTO content_scripts (source_id, script_code, title, hook, script_body, content_type, theme, caption_notes, thumbnail_headline) VALUES 
('11111111-1111-1111-1111-111111111111', 'T-04', 'You Have 3 of 7. That''s Why the Price Negotiation Always Starts the Same Way.', 'There are seven things that separate a luxury brand from a premium-priced one. Most B2B businesses have three. And wonder why they can''t charge more.', '**INSIGHT**
Quality and time — you probably have both. The problem: neither is visible before the relationship starts. The five visible pillars — design, desirability, experience, brand world, perceived equity — are what buyers evaluate before they''ve spoken to you once. Before the proposal. Before the meeting. Before anything.

**REFRAME**
Luxury pricing isn''t decided at the quoting stage. It''s built across every visual touchpoint before the buyer asks for a number. You can''t charge premium and present like a mid-tier operation. The price and the brand have to agree.

**CLOSE**
You have the product. Build the visible pillars.', 'deep_reel', '7 Pillars of Luxury · Framework · Deep Reel', 'Quality and time are table stakes. Every vendor claims them and neither is visible before the relationship begins. The five visible pillars — design, desirability, experience, brand world, perceived equity — are what buyers evaluate before the first conversation. Luxury pricing is built before the quote is sent, not during the negotiation.
#bbmh #beanbagmediahouse #luxurybranding #premiumpricing #b2bbranding', 'A: "You Have 3 of 7 Things. That''s Why the Price Negotiation Never Goes Your Way."
B: "What luxury brands have that most B2B businesses are missing — and it has nothing to do with the product."
C: "Premium pricing is decided before the quote is sent. Here''s where."');
INSERT INTO content_scripts (source_id, script_code, title, hook, script_body, content_type, theme, caption_notes, thumbnail_headline) VALUES 
('11111111-1111-1111-1111-111111111111', 'T-05', 'If You Can''t Finish This Sentence, Your Brand Is Invisible.', 'One sentence tells you immediately whether a brand is going to make it. Most business owners can''t finish it. Here it is: We are blank for blank.', '**INSIGHT**
"We do manufacturing." "We offer B2B solutions." These are categories. A category is a commodity. The brands getting real traction can finish it precisely — specific enough that the right buyer thinks: finally. Someone made this for me.

**REFRAME**
Most founders resist this because they''re afraid of shrinking the market. But trying to speak to everyone means you speak to no one. Your brand floats in the middle — not premium enough for quality buyers, not cheap enough for price buyers. Nowhere.

**CLOSE**
Finish the sentence. Everything else follows from there.', 'deep_reel', 'Blank for X Framework · Direct Address · Deep Reel', 'Generic positioning is the most expensive mistake a business can make. Not because it looks bad — it often looks perfectly fine. But because it speaks to no one specifically, it resonates with no one deeply. The businesses winning right now can describe exactly who they''re for, exactly what they solve, and exactly why they''re the only logical choice for that person. Can yours?
#bbmh #beanbagmediahouse #brandpositioning #b2bmarketing #branding', 'A: "If You Can''t Finish This Sentence, Your Brand Is Invisible."
B: "''We are ___ for ___.'' Most businesses leave this blank. That''s why they stay generic."
C: "The one-sentence test that tells you whether your brand will make it."');
INSERT INTO content_scripts (source_id, script_code, title, hook, script_body, content_type, theme, caption_notes, thumbnail_headline) VALUES 
('11111111-1111-1111-1111-111111111111', 'T-06', 'First Build the Brand. Then You Earn the Right to Be Simple.', 'Rimowa makes some of the most premium luggage in the world. Their website is one of the simplest builds you''ll see at their price point. It works perfectly for them.', '**INSIGHT**
Rimowa has 30 years of brand equity. When a buyer lands on their site, they already arrive with context — the aluminium case on airport carousels, carried by people they subconsciously respect. The website is just the transaction. The brand did the selling years before anyone visited the URL.

**REFRAME**
Take that same minimal website, put it behind a name the visitor has never heard. No prior context. No earned associations. Just the page. And the page says nothing. That visitor leaves. No email. No call. Just gone.

**CLOSE**
You earn the right to simplicity. First, build the brand.', 'deep_reel', 'Rimowa · Brand Equity · Deep Reel', 'Rimowa''s website is essentially a product grid. It works because the brand did all the selling long before anyone landed on the URL. That equity took three decades. If your business name means nothing to the first-time visitor, the website can''t afford to say nothing. It has to do the work the brand hasn''t earned yet. Simplicity is a reward. Not a starting point.
#bbmh #beanbagmediahouse #websitedesign #brandequity #b2bbranding', 'A: "Rimowa Has a Basic Website. That''s a Privilege 30 Years in the Making. You Haven''t Earned It Yet."
B: "The most minimal website in premium retail — and why copying it will destroy you."
C: "Brand equity lets you say less. Build it first."');
INSERT INTO content_scripts (source_id, script_code, title, hook, script_body, content_type, theme, caption_notes, thumbnail_headline) VALUES 
('11111111-1111-1111-1111-111111111111', 'T-07', 'Same Product. Ten Times the Price. One Difference.', 'Vacation sunscreen is SPF 50. So is the tube at your local pharmacy. One sells for roughly ten times the price. Same protection. Same ingredients.', '**INSIGHT**
Three things create that gap. Performance — it works, no compromise. Aesthetic — the packaging is warm, nostalgic, deliberately beautiful before you''ve opened it. Experience — using it feels intentional, not transactional. When all three are present together, the price holds without negotiation.

**REFRAME**
Most B2B businesses have the performance. The aesthetic and the experience are missing. Which is why every negotiation starts at zero. Every buyer needs convincing from scratch.

**CLOSE**
The product is the same. The brand is what creates the price gap.', 'deep_reel', 'Vacation Sunscreen · Little Luxury Recipe · Deep Reel', 'Vacation sunscreen didn''t reinvent sun protection. They reinvented what buying sunscreen feels like — before the buyer even opens it. Your B2B business has the product. The question is whether the brand, the website, the proposal, the catalog are doing the same justification work on your behalf. If not, every price negotiation starts from the same place: zero.
#bbmh #beanbagmediahouse #premiumbranding #brandstrategy #b2bmarketing', 'A: "Same SPF. Ten Times the Price. The Only Difference Is the Brand."
B: "How a sunscreen charges 10x more for the same protection — and what your B2B business can take from it."
C: "Performance alone doesn''t hold the price. These three things do."');
INSERT INTO content_scripts (source_id, script_code, title, hook, script_body, content_type, theme, caption_notes, thumbnail_headline) VALUES 
('11111111-1111-1111-1111-111111111111', 'T-08', 'The Spec Sheet Confirms. The Brand Decides.', 'Rhode Skin makes you feel their products before you''ve ordered them. Not through copy. Through images of glazed donuts, ice, soft textures. You feel the moisture before you''ve read a word.', '**INSIGHT**
Every B2B buying decision has an emotional layer. The procurement officer shortlisting vendors still has a feeling about each one before reading a single spec. That feeling forms in the first thirty seconds of finding you. Right now, most B2B brands are giving those thirty seconds nothing to work with.

**REFRAME**
Rhode doesn''t tell you the product is hydrating. They show you a glazed donut. The feeling precedes the fact — and the feeling determines the frame through which every fact is then received. Your brand can do the same work. In whatever visual language belongs to your industry.

**CLOSE**
The spec sheet confirms. The brand decides.', 'deep_reel', 'Rhode Skin · Sensory Brand Language · Deep Reel', 'Every procurement decision has an emotional layer. The feeling forms before the specs are read, before the meeting happens, before the quote is compared. Rhode understood this for skincare. The same principle applies to a manufacturer, an exporter, a service business. Your brand should be doing emotional work before the rational evaluation begins. Most B2B brands aren''t.
#bbmh #beanbagmediahouse #brandingindia #b2bbranding #visualidentity', 'A: "Rhode Makes You Feel the Product Before You Buy It. What Does Your Brand Make Buyers Feel?"
B: "The emotional layer of every B2B buying decision that nobody in your industry is thinking about."
C: "The spec sheet confirms. The brand decides."');
INSERT INTO content_scripts (source_id, script_code, title, hook, script_body, content_type, theme, caption_notes, thumbnail_headline) VALUES 
('11111111-1111-1111-1111-111111111111', 'T-09', 'Build a World. Not a Product List.', 'Gentle Monster makes sunglasses. They also run an AI art gallery, a surreal bakery, and a fashion line. And somehow all of it makes you want the sunglasses more.', '**INSIGHT**
People don''t fall in love with products. They fall in love with worlds. By the time you hold the glasses, you''ve already bought into the universe they live in. In B2B, the world is built differently — across every touchpoint. The website, the proposal format, the catalog, the factory visit. Each one either contributes to a coherent world or it doesn''t.

**REFRAME**
Most B2B businesses have touchpoints. They don''t have a world. They have a website, a brochure, and a visiting card — each made by someone different, at a different time, with no shared visual language. The buyer feels the fragmentation even if they can''t name it.

**CLOSE**
Build a world. Not a product list.', 'deep_reel', 'Gentle Monster · Brand World Building · Deep Reel', 'Gentle Monster''s galleries, bakeries, and film campaigns aren''t distractions from the sunglasses. They are the sunglasses. By the time you hold the product, you''ve already bought into the universe it exists in. Your B2B brand doesn''t need bakeries. It needs every touchpoint to feel like it belongs to the same coherent world — the same quality, the same intention, designed for the same buyer.
#bbmh #beanbagmediahouse #brandworld #b2bbranding #brandstrategy', 'A: "Gentle Monster Sells Sunglasses. They Also Run a Surreal Bakery. Your B2B Business Needs a World Too."
B: "Gentle Monster doesn''t just sell eyewear. They sell belonging to something."
C: "Your buyers don''t fall in love with products. They fall in love with worlds."');
INSERT INTO content_scripts (source_id, script_code, title, hook, script_body, content_type, theme, caption_notes, thumbnail_headline) VALUES 
('11111111-1111-1111-1111-111111111111', 'T-10', 'Don''t Modernise Into Invisibility.', 'Cracker Barrel updated their logo last year. Removed the old man on the porch — the image that had been there for decades. Within days, the stock dropped. They had to walk it back.', '**INSIGHT**
When you modernise a brand, the instinct is to simplify. Strip out the detail. Flatten the palette. Use a cleaner typeface. It looks contemporary. The problem: the things you remove when simplifying are often the things doing the most work — the specific visual cues that told buyers exactly who this company is.

**REFRAME**
For family businesses modernising, this happens constantly. The heritage disappears. The brand becomes one of twenty vendors on a shortlist instead of the obvious choice. Modernising and genericising are not the same thing. The question before any brand update: does this still look like us?

**CLOSE**
Don''t modernise into invisibility.', 'deep_reel', 'Cracker Barrel / Blanding · Visual Identity · Deep Reel', 'When you modernise a brand, you''re making one claim: this still looks like us, just better. Cracker Barrel made a different claim — this no longer looks like us. Their customers noticed immediately. Brand evolution preserves the DNA and improves the presentation. It doesn''t erase what made the brand recognisable. The roots stay. The presentation grows.
#bbmh #beanbagmediahouse #rebranding #brandidentity #brandingindia', 'A: "Cracker Barrel Modernised Their Logo. Their Stock Dropped. Don''t Modernise Into Invisibility."
B: "The rebrand that backfired — and what it tells every Indian family business about visual identity."
C: "Simplifying is not the same as genericising. Know the difference before you touch the brand."');
INSERT INTO content_scripts (source_id, script_code, title, hook, script_body, content_type, theme, caption_notes, thumbnail_headline) VALUES 
('11111111-1111-1111-1111-111111111111', 'T-11', 'Show the Ceiling. Everything Else Looks More Valuable From There.', 'Balenciaga sold a leather trash bag for $1790. They sold out. This was never about bags.', '**INSIGHT**
The trash bag pushed the price ceiling so high that a $500 jacket suddenly felt accessible by comparison. Palace did this by selling an actual Volvo. Apple does it with the Vision Pro. In B2B, the equivalent is your most extraordinary reference — the project, the client, the outcome that demonstrates the ceiling of what you can deliver. Made visible.

**REFRAME**
If the ceiling of your capability isn''t visible anywhere in your brand — website, portfolio, proposals — buyers price you from the floor. Not because your work isn''t excellent. Because they have no evidence of how excellent it can be.

**CLOSE**
Show the ceiling. Everything else looks more valuable from there.', 'deep_reel', 'Balenciaga Trash Bag · Product Mix / Price Ceiling · Deep Reel', 'The $1790 trash bag didn''t exist to sell trash bags. It existed to make a $500 jacket feel like a reasonable middle ground. Every brand needs a visible ceiling — the most extraordinary version of what it can do. In B2B, that ceiling is your best reference, your most ambitious project, your highest-quality outcome. Without it, buyers have no basis to price you above the baseline.
#bbmh #beanbagmediahouse #brandstrategy #b2bmarketing #premiumbranding', 'A: "Balenciaga Sold a Trash Bag for $1790. Your Business Needs Its Own Version."
B: "The product that wasn''t meant to sell — but made everything else sell better."
C: "If your ceiling isn''t visible, buyers price you from the floor."');
INSERT INTO content_scripts (source_id, script_code, title, hook, script_body, content_type, theme, caption_notes, thumbnail_headline) VALUES 
('11111111-1111-1111-1111-111111111111', 'T-12', 'Real and Specific Beats Polished and Generic. Every Single Time.', 'Stussy has never used professional models for their main campaigns. Real people. Actual community. And it has consistently outperformed polished fashion shoots.', '**INSIGHT**
Because you can tell these people actually live in the clothes. Real is persuasive in a way polished isn''t. The viewer''s brain registers honesty before it registers aesthetics. In B2B, the equivalent is actual work in actual context — a specific project, a specific client type, what specifically changed. Not a generic portfolio. A real story.

**REFRAME**
The brands that build the deepest trust don''t try to look like everyone''s option. They look like the obvious, specific choice for one kind of client. Specificity signals confidence. Confidence signals capability. Generic signals nothing.

**CLOSE**
Real and specific beats polished and generic. Every single time.', 'deep_reel', 'Stussy Homie Lookbook · Authenticity in Brand · Deep Reel', 'Real is persuasive in a way polished isn''t. Stussy''s community campaigns feel true because they are — those people actually live in the clothes. Your B2B brand equivalent is actual work, actual clients, actual outcomes — without the stock photo gloss. The right buyer reading a specific, honest case study recognises themselves. And recognition is more powerful than any persuasion.
#bbmh #beanbagmediahouse #brandauthenticity #b2bbranding #visualidentity', 'A: "Stussy Never Used Professional Models. It''s Their Smartest Brand Decision."
B: "Why the most authentic brands always outperform the most polished ones."
C: "Real and specific beats polished and generic. Here''s the B2B version."');
INSERT INTO content_scripts (source_id, script_code, title, hook, script_body, content_type, theme, caption_notes, thumbnail_headline) VALUES 
('11111111-1111-1111-1111-111111111111', 'T-13', 'The Gap Between Expectation and Reality Is Where Interest Lives.', 'You know what stops a B2B buyer mid-scroll? A manufacturer whose website feels like a luxury hotel. A factory whose catalog reads like a design magazine. The incongruence makes the brain stop.', '**INSIGHT**
Most B2B businesses dress for their category — they look exactly like every competitor on the shortlist. The buyer''s brain registers the familiar and moves on. A business that operates at a visual level above its category creates a pause. And that pause is the only opening you get before the decision is made.

**REFRAME**
You don''t need to be bizarre to create that effect. You just need to be better than what the buyer expected from a business like yours. The gap between expectation and reality is where interest lives. That gap is designed. Not accidental.

**CLOSE**
Stop looking like your competitors. Start looking like where you''re going.', 'deep_reel', 'Cognitive Dissonance / Manufacturer Who Looks Too Good · Deep Reel', 'Most B2B businesses dress for their category. They look exactly like the other ten vendors on the shortlist. The buyer''s brain processes the familiar and keeps scrolling. The businesses that pause buyers are the ones operating at a visual level their category didn''t expect. That pause is designed, not accidental. And it''s the only opening you get.
#bbmh #beanbagmediahouse #b2bbranding #visualidentity #brandingindia', 'A: "A Manufacturer Who Looks Too Good. That''s What Stops a B2B Buyer Mid-Scroll."
B: "What happens when a B2B business looks better than its entire category expects."
C: "The gap between what buyers expect and what they find — that''s where deals are won."');
INSERT INTO content_scripts (source_id, script_code, title, hook, script_body, content_type, theme, caption_notes, thumbnail_headline) VALUES 
('11111111-1111-1111-1111-111111111111', 'T-14', 'There Are No Boring Businesses. Only Boring Content.', 'Someone made MRE taste tests go viral. Military meal rations. Watched by millions of people who have never served in the military. If that works — what exactly is your excuse?', '**INSIGHT**
What makes content work isn''t the industry. It''s whether it''s genuinely useful, genuinely honest, or genuinely true to a feeling the audience already has. A manufacturer explaining on camera why a material choice costs more and lasts ten times longer is expert content. A second-gen founder talking about modernising a family business is emotionally resonant content. Neither needs a glamorous product.

**REFRAME**
The barrier isn''t your industry. It''s the assumption that your content needs to look like what consumer brands do. B2B content has its own language. The business that figures that out first in their category owns the conversation for years.

**CLOSE**
There are no boring businesses. Only boring content.', 'deep_reel', 'No Boring Industry Principle · Provocation · Deep Reel', 'The businesses making the most compelling B2B content right now aren''t in glamorous industries. They''re in manufacturing, logistics, industrial supply, agriculture. What they understand that most don''t: expert content from an unglamorous industry is more valuable and more watchable than generic content from any industry. The barrier is assumption, not reality.
#bbmh #beanbagmediahouse #b2bcontent #contentmarketing #brandingindia', 'A: "MRE Taste Tests. Millions of Views. What''s Your Excuse?"
B: "There are no boring businesses. Only businesses that haven''t figured out their content language yet."
C: "The most watchable B2B content right now is coming from the most unglamorous industries."');
INSERT INTO content_scripts (source_id, script_code, title, hook, script_body, content_type, theme, caption_notes, thumbnail_headline) VALUES 
('11111111-1111-1111-1111-111111111111', 'T-15', 'The Marketing Isn''t Broken. The Foundation Isn''t Built Yet.', 'Most B2B businesses that say their marketing isn''t working are right. But they''re diagnosing the wrong problem. The marketing isn''t broken. The foundation the marketing needs to run on doesn''t exist yet.', '**INSIGHT**
Brand building happens in levels. Level one: find one channel that makes money. Level two — the level almost everyone skips — is the foundation. A website that actually converts. A brand that matches the quality of the product. Most businesses jump straight to running ads on a foundation with holes in it.

**REFRAME**
More traffic doesn''t fix a website that doesn''t convert. More ad spend doesn''t fix a brand that doesn''t hold attention. The brand is the pipe the marketing runs through. If the pipe leaks, volume makes the problem worse — not better.

**CLOSE**
The marketing isn''t broken. The foundation isn''t built yet.', 'deep_reel', 'Brand Foundation / Level 2 · Diagnostic · Deep Reel', 'Most marketing failures aren''t marketing failures. They''re foundation failures — ads sending buyers to a website that doesn''t convert, campaigns building awareness of a brand that can''t hold it. The brand is the infrastructure that everything else runs on. Fix the infrastructure, and the marketing you''ve already been paying for starts working.
#bbmh #beanbagmediahouse #brandstrategy #marketingfoundation #b2bmarketing', 'A: "The Reason Your Marketing Isn''t Working Isn''t Your Marketing."
B: "You''re running ads on a brand that doesn''t hold attention. That''s the real problem."
C: "Fix the pipe. Then turn up the volume."');
INSERT INTO content_scripts (source_id, script_code, title, hook, script_body, content_type, theme, caption_notes, thumbnail_headline) VALUES 
('11111111-1111-1111-1111-111111111111', 'IN-01', 'The Drink Didn''t Change. Everything the Buyer Felt Before Tasting It Did.', 'Paper Boat sells aam panna for Rs 30. The stall outside your office sells the same drink for Rs 5. Same recipe. Same ingredients.', '**INSIGHT**
Paper Boat didn''t win on the drink. They won on the memory. The packaging is hand-drawn, soft, deliberately nostalgic — every visual choice communicates one thing: this is not a commodity, this is a feeling. Enough people agreed to make it one of India''s fastest-growing beverage brands.

**REFRAME**
Most Indian businesses have a product that''s genuinely good. But the website, the logo, the packaging — the brand — tells the buyer: ordinary. And ordinary gets negotiated down to the Rs 5 version.

**CLOSE**
The drink never changed. What changed was everything the buyer experienced before they tasted it. That''s a brand decision.', 'deep_reel', 'Paper Boat · Commodity to Premium · Deep Reel', 'Paper Boat didn''t create a new recipe. They created a new feeling around an old one — nostalgia, craft, intention, all communicated through one beautifully designed package before the buyer takes a single sip. Your business has a product that''s genuinely good. The question is: what does the brand communicate before anyone experiences it?
#bbmh #beanbagmediahouse #indianbrands #paperboat #brandingindia', 'A: "Paper Boat Charges 6x More for the Same Aam Panna. One Difference."
B: "Why does a Rs 5 drink lose to a Rs 30 one every time? This."
C: "The product didn''t change. The feeling around it did. That''s worth 6x."');
INSERT INTO content_scripts (source_id, script_code, title, hook, script_body, content_type, theme, caption_notes, thumbnail_headline) VALUES 
('11111111-1111-1111-1111-111111111111', 'IN-02', 'Same Motorcycle. Different Meaning. That''s What Saved the Company.', 'Royal Enfield was nearly bankrupt in 2000. By 2012, buyers were waiting two years for the same motorcycle.', '**INSIGHT**
They didn''t build a better engine. They built a better meaning. Riding a Bullet stopped being about mileage or technology and became about a specific kind of person, a specific kind of life. They stopped competing on what the motorcycle does and started competing on what owning one says about you.

**REFRAME**
Most B2B businesses are still selling the engine. Specs, delivery timelines, price per unit. The businesses that escape commodity competition are the ones who figure out what their product means — not just what it does.

**CLOSE**
Royal Enfield didn''t save the company by building a better bike. They saved it by building a better brand.', 'deep_reel', 'Royal Enfield · Brand Meaning Over Specs · Deep Reel', 'Royal Enfield''s revival is one of the most instructive brand stories in India. The motorcycle didn''t fundamentally change. The meaning of owning one did. Every business competing purely on specs and features is having the wrong conversation. The brands that escape commodity competition are the ones who understand what their product means — not just what it does.
#bbmh #beanbagmediahouse #royalenfield #indianbrands #brandstrategy', 'A: "Royal Enfield Was Nearly Dead in 2000. A Two-Year Waiting List by 2012. Same Bike."
B: "They stopped selling what the motorcycle does. They started selling what it says about you."
C: "Near bankruptcy to a two-year waitlist. Not a new engine. A new brand."');
INSERT INTO content_scripts (source_id, script_code, title, hook, script_body, content_type, theme, caption_notes, thumbnail_headline) VALUES 
('11111111-1111-1111-1111-111111111111', 'IN-03', 'The Right Product. The Wrong Brand. What Tanishq Taught Us About Trust.', 'Tanishq launched in 1994 and failed for the first several years. The jewellery was excellent. The brand was completely wrong.', '**INSIGHT**
Tata positioned it as modern, corporate, international. Clean lines, contemporary stores. The problem: Indian jewellery buyers don''t trust corporate. They trust the local jeweller who''s served the family for three generations. When Tanishq rebuilt the brand around craft, purity certification, and generational trust — the same product started selling.

**REFRAME**
In India, trust isn''t just earned through product quality. It''s communicated through specific brand signals. When the brand doesn''t speak those signals, the product never gets a chance to be evaluated.

**CLOSE**
Tanishq became India''s most trusted jewellery brand. Not by being the best jeweller. By finally looking like one.', 'deep_reel', 'Tanishq · Brand Trust Signals · Deep Reel', 'Tata built Tanishq with excellent product and contemporary positioning. It failed because Indian jewellery buyers don''t trust contemporary — they trust craft, purity, and generational reliability. When the brand was rebuilt around those signals, the same product started selling at scale. The product was never the problem. In India, trust has its own visual language. If your brand doesn''t speak it, the buyer doesn''t stay long enough to find out what you''re actually worth.
#bbmh #beanbagmediahouse #tanishq #indianbrands #brandingindia', 'A: "Tanishq Failed for Years. The Jewellery Was Excellent. The Brand Was the Problem."
B: "In India, trust has a visual language. If your brand doesn''t speak it, the product doesn''t get evaluated."
C: "Same jewellery. Different brand. Different India."');
INSERT INTO content_scripts (source_id, script_code, title, hook, script_body, content_type, theme, caption_notes, thumbnail_headline) VALUES 
('11111111-1111-1111-1111-111111111111', 'IN-04', 'A Manufacturer from Rajasthan Now Sells to Luxury Hotels in New York. One Thing Changed.', 'Jaipur Rugs sells to luxury hotels in New York, Milan, and Dubai. They''re a manufacturer from Rajasthan. Here''s the one thing they changed.', '**INSIGHT**
They stopped selling to wholesalers who negotiated them down every year and started selling the story directly. The weaver''s name on the rug. The village it came from. The months it took. The product didn''t change. What changed was what it meant to the buyer — and who that buyer was.

**REFRAME**
Every B2B manufacturer has this choice. Stay in the commodity conversation where price is the only variable. Or build a brand that gives the right buyer a reason to choose you that has nothing to do with price.

**CLOSE**
The rug didn''t change. The brand did. That''s what changed who was buying it — and what they were willing to pay.', 'deep_reel', 'Jaipur Rugs · B2B Export Brand Building · Deep Reel', 'Jaipur Rugs had a product that could sit in a luxury hotel in Manhattan. For years, it sat in a wholesaler''s warehouse instead, negotiated down on every order. What changed wasn''t the craft — it was the decision to sell the story directly. The weaver''s name. The village. The months of work. The product gained a meaning that made price comparison irrelevant. Every Indian manufacturer has this choice.
#bbmh #beanbagmediahouse #jaipurrugs #indianmanufacturing #exportbranding', 'A: "Jaipur to New York. Same Craft. Different Brand. Different Buyers."
B: "How a Rajasthan manufacturer escaped price negotiations by changing what they were actually selling."
C: "The product didn''t change. The story did. That changed everything."');
INSERT INTO content_scripts (source_id, script_code, title, hook, script_body, content_type, theme, caption_notes, thumbnail_headline) VALUES 
('11111111-1111-1111-1111-111111111111', 'IN-05', 'The Gap Between Rs 80 and Rs 1200 Is a Brand Decision.', 'Forest Essentials sells a face wash for Rs 1200. Himalaya sells a similar one for Rs 80. Both Ayurvedic. Both work.', '**INSIGHT**
Forest Essentials understood something: Ayurveda has 5000 years of heritage. But heritage that isn''t visible doesn''t count. The gold packaging, the Sanskrit names, the stores that feel like an ancient apothecary — every choice says this has existed for centuries. Himalaya says: here is a product. Forest Essentials says: here is a world.

**REFRAME**
Your business may have real depth — real craft, real history, real quality. If the brand doesn''t make that visible, the buyer has no way to know it exists. The product is the same. The brand is what creates the gap.

**CLOSE**
The gap between Rs 80 and Rs 1200 is a brand decision.', 'deep_reel', 'Forest Essentials vs Himalaya · Heritage Made Visible · Deep Reel', 'Himalaya says: here is a product. Forest Essentials says: here is a world — ancient, intentional, documented in gold packaging and Sanskrit labels that make you feel the depth before you open the bottle. Both companies have access to the same heritage. Only one has built a brand that surfaces it visibly. That gap is not a product gap. It is entirely a brand decision.
#bbmh #beanbagmediahouse #forestessentials #indianbrands #luxurybranding', 'A: "Forest Essentials: Rs 1200. Himalaya: Rs 80. Both Ayurvedic. One Difference."
B: "5000 years of the same heritage. Only one brand is making it visible — and charging accordingly."
C: "The gap between Rs 80 and Rs 1200 isn''t a product gap. It''s entirely a brand decision."');
INSERT INTO content_scripts (source_id, script_code, title, hook, script_body, content_type, theme, caption_notes, thumbnail_headline) VALUES 
('11111111-1111-1111-1111-111111111111', 'W-01', 'Your Website Is Working Right Now. The Question Is Which Direction.', 'Open your company website on your phone right now. Not on desktop — your phone. Time how long it loads. Then read the first sentence on the homepage out loud.', '**INSIGHT**
Now ask yourself: if I had never heard of this company and this was the first thing I found — would I call them? Most business owners who do this are surprised. Not because the site is broken. Because it says nothing. It lists services. It has a number. But it doesn''t make anyone feel anything.

**REFRAME**
Your website is the only salesperson who works 24 hours a day, 7 days a week, without you present to explain anything. Right now, while you''re watching this, someone may be on it deciding whether to call.

**CLOSE**
Your website is working. The question is which direction — building trust or leaking it.', 'deep_reel', 'Website as Trust Builder or Trust Leak · Direct Address · Deep Reel', 'Your website is the only member of your team who works 24 hours a day, 7 days a week, without you present to explain anything. Most business owners have never seen their own website the way a first-time visitor sees it — without the context of knowing what''s behind it. That view is the only one that counts. Do the phone test. Right now.
#bbmh #beanbagmediahouse #websitedesign #b2bwebsite #framerwebsite', 'A: "Your Website Is Working Right Now. The Question Is Which Direction."
B: "Open your company website on your phone. Time how long it loads. What does a stranger decide in those 8 seconds?"
C: "The only member of your team who works 24/7 without you — and most businesses have never briefed it properly."');
INSERT INTO content_scripts (source_id, script_code, title, hook, script_body, content_type, theme, caption_notes, thumbnail_headline) VALUES 
('11111111-1111-1111-1111-111111111111', 'W-02', 'Design for Where You''re Going. Not Where You Started.', 'Pull your company logo up as a WhatsApp profile picture. Then imagine it at three metres wide on a trade fair banner. Then in black and white on a formal tender document. Tell me how it holds up.', '**INSIGHT**
Most logos for small businesses were designed for one context — the visiting card, maybe the letterhead. They were never tested at scale, at tiny size, on dark backgrounds. By the time the business needs the logo in those situations, it''s already failing. And the buyer''s brain registers the failure before they''ve read a single word.

**REFRAME**
A logo is not decoration. It''s the fastest communication your business has. In under a second, it either says: serious operation — or it says: not quite ready.

**CLOSE**
Design for where you''re going. Not where you started.', 'deep_reel', 'Logo Scale and System · Visual Identity · Direct Challenge', 'A logo isn''t a fixed image. It''s a system that needs to work at 16 pixels and at 16 feet simultaneously. Most small business logos were designed once, for one context, and never tested beyond it. The moment the business grows beyond that context — trade fairs, export catalogs, corporate tenders — the logo is already failing. Scale is not an afterthought in logo design. It''s the entire brief.
#bbmh #beanbagmediahouse #logodesign #brandidentity #brandingindia', 'A: "Pull Your Logo Up as a WhatsApp DP. Then as a 3-Metre Banner. Tell Me How It Holds Up."
B: "Your logo was designed for a visiting card. It breaks everywhere else."
C: "A logo needs to work at 16 pixels and 16 feet. Most small business logos work at neither."');
INSERT INTO content_scripts (source_id, script_code, title, hook, script_body, content_type, theme, caption_notes, thumbnail_headline) VALUES 
('11111111-1111-1111-1111-111111111111', 'W-03', 'Your Website Makes Perfect Sense to You. That''s the Problem.', 'Your website probably makes perfect sense to you. That''s the problem.', '**INSIGHT**
You wrote the homepage knowing everything about your business. Your buyer arrives knowing nothing. They need to understand in 8 seconds what you do, who it''s for, and why it matters to them. Most B2B homepages explain the company. The best ones answer the buyer''s actual question: is this for someone like me, and can I trust them?

**REFRAME**
A website written for the owner lists features. A website written for the buyer answers questions. Those are completely different documents — and almost no B2B business has written the second one.

**CLOSE**
Your buyer isn''t reading your website. They''re scanning it for a reason to stay.', 'deep_reel', 'Website Written for the Owner Not the Buyer · New Script · Deep Reel', 'You wrote your website knowing everything about your business. Your buyer arrives knowing nothing. They need to understand in 8 seconds what you do, who it''s for, and why it matters to them. Most B2B homepages answer none of those questions — because they were written by someone who already knew the answers. Rewrite it for the person who doesn''t.
#bbmh #beanbagmediahouse #websitedesign #b2bwebsite #uxdesign', 'A: "Your Website Makes Perfect Sense to You. That''s Exactly the Problem."
B: "The homepage that explains everything to the owner and nothing to the buyer."
C: "A website written for the owner is a brochure. A website written for the buyer is a sales tool."');
INSERT INTO content_scripts (source_id, script_code, title, hook, script_body, content_type, theme, caption_notes, thumbnail_headline) VALUES 
('11111111-1111-1111-1111-111111111111', 'W-04', 'The Version of Your Website Most Buyers See First Was Never Designed.', 'Most B2B buyers check a new vendor on their phone before they check on desktop. Your website was probably designed on a laptop.', '**INSIGHT**
Open your site on your phone right now. Count how many times you have to zoom in to read something. Check if the contact button actually works with a thumb. This is the version most buyers encounter first — slightly misaligned, a little broken, never intentionally designed. It just happened.

**REFRAME**
Your website doesn''t have a mobile problem. It has a first impression problem. Because the first impression for most buyers isn''t the full desktop layout — it''s the version nobody designed.

**CLOSE**
The device your website was built for is not the device your buyer is using.', 'deep_reel', 'Mobile vs Desktop · The Invisible First Impression · Deep Reel', 'Most B2B websites were designed on a laptop and optimised for a laptop. Most buyers discover new vendors on their phone. The version they see first — slightly misaligned, requiring zooming, with a contact button that barely works on a thumb — is the one making the first impression. That impression was never designed. It just happened. That''s a fixable problem.
#bbmh #beanbagmediahouse #websitedesign #mobiledesign #b2bwebsite', 'A: "Your Website Looks Great on Your Laptop. It''s Breaking on the Device Your Buyer Uses First."
B: "Most B2B buyers check a new vendor on their phone. Does yours hold up in 8 seconds?"
C: "The invisible version of your website — the one that most buyers see first, that was never designed."');
INSERT INTO content_scripts (source_id, script_code, title, hook, script_body, content_type, theme, caption_notes, thumbnail_headline) VALUES 
('11111111-1111-1111-1111-111111111111', 'L-01', 'First Impressions Are Made Before You''re in the Room.', 'Your logo is communicating something right now. Before the meeting. Before the proposal. Before anything. You just don''t know what it''s saying.', '**INSIGHT**
The logo on your email header, your visiting card, your proposal cover — it''s making a statement before a single word is read. That statement is either: this company operates at a certain level. Or it quietly signals something less. Most business owners have never stopped to ask honestly: what does mine actually communicate to someone who has never heard of us?

**REFRAME**
A logo isn''t decoration. It''s the fastest piece of communication your business has. One second. Before the reader has chosen to engage. It either earns the benefit of the doubt in that second — or it creates doubt. Both outcomes happen without a word being spoken.

**CLOSE**
First impressions are made before you''re in the room.', 'deep_reel', 'What a Logo Communicates in One Second · New Script · Deep Reel', 'The logo on your email header, your visiting card, your brochure — it makes a statement before a single word is read. That statement is either: this company operates at a certain level. Or it quietly creates doubt. Most business owners have never asked the honest question: what does mine actually communicate to someone who has never heard of us before today?
#bbmh #beanbagmediahouse #logodesign #brandidentity #b2bbranding', 'A: "Your Logo Is Already Saying Something. The Question Is Whether You Designed What It Says."
B: "Before the meeting. Before the proposal. Before anything. Your logo already spoke."
C: "First impressions are made before you''re in the room. Is yours working for you or against you?"');
INSERT INTO content_scripts (source_id, script_code, title, hook, script_body, content_type, theme, caption_notes, thumbnail_headline) VALUES 
('11111111-1111-1111-1111-111111111111', 'L-02', 'You Don''t Have a Logo. You Have a Logo Image. There''s a Difference.', 'You don''t have a logo. You have a logo image. Most businesses don''t know the difference — and it shows everywhere.', '**INSIGHT**
A logo image is a file. A logo system is a set of rules — how the mark behaves at different sizes, on different backgrounds, in different colours, with and without the company name. Without the system, every vendor who ever touches your brand makes a different decision. That''s why your visiting card, website, and trade fair banner all look like they''re from slightly different companies.

**REFRAME**
The inconsistency isn''t careless. It was never designed. A logo system costs the same to build as a logo image. The difference is the thinking behind it — and the coherence it creates across every touchpoint for the next ten years.

**CLOSE**
Build the system. The image is just the beginning.', 'deep_reel', 'Logo as System Not Image · Visual Identity · Deep Reel', 'A logo image is a file. A logo system is a set of rules for how that mark behaves at every size, in every colour, on every surface. Without the system, every person who touches your brand makes a different decision. That''s why your visiting card, website, proposal, and trade fair stall all look like they belong to slightly different companies. The inconsistency wasn''t careless. It was never designed.
#bbmh #beanbagmediahouse #logodesign #brandidentity #visualsystem', 'A: "You Don''t Have a Logo. You Have a Logo Image. There''s a Significant Difference."
B: "Your visiting card, website, and banner all look slightly different. This is why."
C: "A logo image is a file. A logo system is what makes a brand look like one company everywhere it appears."');
INSERT INTO content_scripts (source_id, script_code, title, hook, script_body, content_type, theme, caption_notes, thumbnail_headline) VALUES 
('11111111-1111-1111-1111-111111111111', 'S-01', 'Your Visiting Card Is Still in Their Pocket. Your Website Visit Lasted 11 Seconds.', 'The visiting card you gave at last month''s trade fair is probably still in someone''s pocket. Your website visit from the same day lasted eleven seconds.', '**INSIGHT**
Physical collateral has staying power that digital doesn''t. A well-designed visiting card sits on a desk, goes through a wash, gets found months later. Every time it reappears, it makes the same impression. Your digital presence, by contrast, requires the buyer to actively return. If the first impression was weak, they don''t.

**REFRAME**
Most businesses invest more in their website than their physical collateral. But the physical pieces — card, brochure, packaging, proposal — are doing your selling in the quiet moments between decisions. When you''re not in the room. When the buyer is comparing. When the deal is almost made.

**CLOSE**
Design every physical piece as if it''s the last version of you the buyer sees before they decide.', 'deep_reel', 'Physical vs Digital Brand Permanence · Surprise · Deep Reel', 'Digital impressions disappear. Physical ones stay. A well-designed visiting card sits on desks, goes through trouser pockets, gets found months later — and every time it reappears, it makes the same impression. Most businesses invest more in the digital and less in the physical. But in B2B, the physical pieces are doing your selling in the quiet moments between decisions — when you''re not there to explain anything.
#bbmh #beanbagmediahouse #visitingcard #b2bbranding #branddesign', 'A: "Your Visiting Card Is Still in Their Pocket. Your Website Visit Lasted 11 Seconds."
B: "The brand touchpoints that stay with buyers the longest are the ones most businesses invest in least."
C: "Digital disappears. Physical stays. Design accordingly."');
INSERT INTO content_scripts (source_id, script_code, title, hook, script_body, content_type, theme, caption_notes, thumbnail_headline) VALUES 
('11111111-1111-1111-1111-111111111111', 'S-02', 'The Business Winning Your Deals Probably Has a Weaker Product.', 'The business winning deals you should be winning probably has a weaker product. I''m reasonably confident about this. Here''s why it still doesn''t matter.', '**INSIGHT**
In a competitive vendor evaluation, buyers can''t test product quality before committing. What they can evaluate — immediately, without any expertise — is visual credibility. The website, the proposal format, the catalog design. These become proxies for product quality. A competitor who looks more organised, more established, more serious is perceived as lower risk. And in B2B, lower perceived risk wins.

**REFRAME**
You can''t change how the buyer''s brain works. It uses what''s available. Right now your competitor''s brand is better evidence than your product quality. The evidence is fixable. The product already isn''t the problem.

**CLOSE**
The best product doesn''t always win. The most credible-looking one often does.', 'deep_reel', 'Visual Credibility Over Product Quality · Provocation · Deep Reel', 'In a competitive vendor evaluation, buyers can''t test product quality before committing. What they can evaluate immediately — without any expertise — is visual credibility. The website, the proposal, the catalog. These become proxies for quality and reliability. A competitor who looks more organised is perceived as lower risk. And in B2B, lower perceived risk wins. The product is already good enough. Fix the evidence.
#bbmh #beanbagmediahouse #b2bsales #brandcredibility #visualidentity', 'A: "The Business Beating You Probably Has a Worse Product. Here''s Why It''s Still Winning."
B: "Your product is better. Their brand looks better. That''s why they''re winning."
C: "In a competitive evaluation, the most credible-looking option wins. Not always the best one."');
INSERT INTO content_scripts (source_id, script_code, title, hook, script_body, content_type, theme, caption_notes, thumbnail_headline) VALUES 
('11111111-1111-1111-1111-111111111111', 'S-03', 'Make the Website as Impressive as the Factory Tour. That''s All It Has to Do.', 'Every visitor who comes to your factory leaves impressed. Your website sends almost none of them there.', '**INSIGHT**
We''ve heard this from client after client. The factory tour is their best sales tool — quality is visible the moment someone walks in. But the website that has to create enough confidence for that visit to happen communicates none of it. The product convinces. But the brand has to get the buyer to the product first.

**REFRAME**
Your factory visit is Level 3. Your website is Level 1. The buyer has to pass Level 1 before they get to what you''re actually proud of. If Level 1 is weak, Level 3 never happens. The most impressive thing you''ve built is invisible to every buyer who didn''t make it past the homepage.

**CLOSE**
Make the website as impressive as the factory tour. That''s all it has to do.', 'deep_reel', 'Factory Tour vs Website Mismatch · Observation · Deep Reel', 'We hear this from client after client. The factory visit closes deals — quality is visible the moment someone walks in. But the website that has to create enough confidence for that visit to happen communicates none of it. Your best asset is locked behind a first impression that isn''t working. Make the website as impressive as the tour. That''s the whole brief.
#bbmh #beanbagmediahouse #b2bbranding #websitedesign #manufacturingbrand', 'A: "Your Factory Impresses Every Visitor. Your Website Sends Almost None of Them There."
B: "The factory tour is your best sales tool. The website is what has to earn it. Is it?"
C: "Level 1 is the website. Level 3 is the factory. Most buyers never make it past Level 1."');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES 
('22222222-2222-2222-2222-222222222222', 'M-01', 'The Mirror M-01', 'Most B2B businesses have spent years getting the product right and about three days getting the brand right. The price negotiation shows it every time.
*[pause]*
The product was never the problem.', 'mirror');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES 
('22222222-2222-2222-2222-222222222222', 'M-02', 'The Mirror M-02', 'There''s a version of your business that has been live on the internet for years. You''ve never seen it the way a first-time buyer does. That view is the one that counts.', 'mirror');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES 
('22222222-2222-2222-2222-222222222222', 'M-03', 'The Mirror M-03', 'Your best salesperson has a deck, a pitch, a follow-up sequence. Your brand — the thing that runs ahead of your salesperson into every room — has none of that. It just shows up and says whatever it says.', 'mirror');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES 
('22222222-2222-2222-2222-222222222222', 'M-04', 'The Mirror M-04', 'The business that wins the deal isn''t always the best. It''s the one that looked most ready to deliver before anyone checked.
*[pause]*
That''s not unfair. That''s just how buyers manage risk.', 'mirror');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES 
('22222222-2222-2222-2222-222222222222', 'M-05', 'The Mirror M-05', 'You''d notice immediately if your factory floor looked like your competitor''s. You''ve probably never noticed that your website does.', 'mirror');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES 
('22222222-2222-2222-2222-222222222222', 'M-06', 'The Mirror M-06', 'Your oldest client doesn''t know what your website looks like. Your newest prospect made a decision based on nothing else.
*[pause]*
Those two things are connected.', 'mirror');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES 
('22222222-2222-2222-2222-222222222222', 'M-07', 'The Mirror M-07', 'Most business owners can describe in detail what they make. Almost none of them can finish this sentence cleanly: we are this, for this person, and here''s why only we do it this way.
*[pause]*
That''s not a product problem. That''s a brand problem.', 'mirror');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES 
('22222222-2222-2222-2222-222222222222', 'M-08', 'The Mirror M-08', 'You spent six months getting the product right. Your competitor spent six months getting the brand right. The buyer can''t tell the difference between the two until they''ve already chosen one of you.', 'mirror');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES 
('22222222-2222-2222-2222-222222222222', 'M-09', 'The Mirror M-09', 'A buyer who finds you through a referral already trusts you. A buyer who finds you through Google trusts nothing. Your website is the only difference between those two conversations — and most businesses have written it for the first person, not the second.', 'mirror');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES 
('22222222-2222-2222-2222-222222222222', 'M-10', 'The Mirror M-10', 'Premium pricing isn''t something you decide at the quoting stage. It''s built — or not built — long before the buyer asks for a number.', 'mirror');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES 
('22222222-2222-2222-2222-222222222222', 'M-11', 'The Mirror M-11', 'Most Indian family businesses are running on a brand that was designed for the market they were in ten years ago. The market changed. The brand didn''t get the message.', 'mirror');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES 
('22222222-2222-2222-2222-222222222222', 'M-12', 'The Mirror M-12', 'The brand inconsistency that buyers notice isn''t the big stuff. It''s the three slightly different logos. The two different fonts on the same proposal. The website colour that doesn''t match the visiting card. Small things. That together say: this company doesn''t have its house in order.', 'mirror');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES 
('22222222-2222-2222-2222-222222222222', 'Q-01', 'The Question Q-01', 'When did you last open your own website on your phone as if you''d never heard of the company?', 'question');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES 
('22222222-2222-2222-2222-222222222222', 'Q-02', 'The Question Q-02', 'If a buyer who had never heard of you Googled your company name right now — what would they find? And would it be enough?', 'question');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES 
('22222222-2222-2222-2222-222222222222', 'Q-03', 'The Question Q-03', 'Does your logo work in black and white? Have you checked?', 'question');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES 
('22222222-2222-2222-2222-222222222222', 'Q-04', 'The Question Q-04', 'Can you describe what your brand communicates in one sentence — without mentioning the product?', 'question');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES 
('22222222-2222-2222-2222-222222222222', 'Q-05', 'The Question Q-05', 'Has your brand evolved since your business did?', 'question');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES 
('22222222-2222-2222-2222-222222222222', 'Q-06', 'The Question Q-06', 'Your best client would recommend you enthusiastically. Would the brand they find when they look you up hold up to that recommendation?', 'question');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES 
('22222222-2222-2222-2222-222222222222', 'Q-07', 'The Question Q-07', 'If you sent your own visiting card to the client you most want to win — would you feel proud or slightly apologetic about it?', 'question');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES 
('22222222-2222-2222-2222-222222222222', 'Q-08', 'The Question Q-08', 'What does your email signature say about your company to someone who has never heard of you?', 'question');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES 
('22222222-2222-2222-2222-222222222222', 'Q-09', 'The Question Q-09', 'Is the first thing a buyer finds about your business better or worse than the first thing they''d find about your best competitor?', 'question');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES 
('22222222-2222-2222-2222-222222222222', 'Q-10', 'The Question Q-10', 'You know exactly what makes your product better than the competition. Does your brand communicate any of it before the conversation starts?', 'question');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES 
('22222222-2222-2222-2222-222222222222', 'Q-11', 'The Question Q-11', 'If you had to describe your ideal client and they had to describe their ideal vendor — would each description fit the other?', 'question');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES 
('22222222-2222-2222-2222-222222222222', 'Q-12', 'The Question Q-12', 'The last deal you lost on price — are you certain it was actually about price?', 'question');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES 
('22222222-2222-2222-2222-222222222222', 'C-01', 'The Visiting Card', 'Show: Two visiting cards, same industry (manufacturing, export, textile — pick your BBMh client archetype)
Version A: Generic font, crowded, clip-art logo, no visual hierarchy
Version B: Clean, weighted, considered typography, strong mark
Text line: "Both people left the same meeting. One got called back."', 'contrast');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES 
('22222222-2222-2222-2222-222222222222', 'C-02', 'The Email Signature', 'Show: Two email signature screenshots
Version A: Plain text, Gmail address, no logo, no designation clarity
Version B: Logo, company domain, clean layout, one visual accent
Text line: "This is the first thing they see before they read your email."', 'contrast');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES 
('22222222-2222-2222-2222-222222222222', 'C-03', 'The Logo at Scale', 'Show: Same logo (or two comparable logos) at three sizes — WhatsApp DP, visiting card, banner
Version A: Breaks at small size, illegible at large, inconsistent weights
Version B: Holds at all three sizes, readable, intentional
Text line: "A logo needs to work here, here, and here. Most work at only one."', 'contrast');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES 
('22222222-2222-2222-2222-222222222222', 'C-04', 'The Website on Mobile', 'Show: Screen recording — same type of business, two different mobile websites
Version A: Misaligned, requires zooming, contact button hard to reach
Version B: Clean, fast loading, clear CTA, works with a thumb
Text line: "This is how most buyers see you first."', 'contrast');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES 
('22222222-2222-2222-2222-222222222222', 'C-05', 'The Proposal Cover', 'Show: Two proposal cover pages
Version A: Word document, clip-art border, inconsistent fonts, no visual hierarchy
Version B: Designed PDF, brand colours, considered layout, company logo properly placed
Text line: "Before they read a single word."', 'contrast');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES 
('22222222-2222-2222-2222-222222222222', 'C-06', 'The Trade Fair Stall', 'Show: Two trade fair or exhibition stall setups (can be illustrated or reference images)
Version A: Mismatched banners, too much text, no clear visual identity
Version B: Unified brand across every piece, clean messaging, designed materials
Text line: "Same industry. Same product. Different shortlist."', 'contrast');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES 
('22222222-2222-2222-2222-222222222222', 'C-07', 'The Catalog Cover', 'Show: Two product catalog covers for the same industry
Version A: Text-heavy, photo quality inconsistent, no design grid
Version B: Editorial photography, considered layout, brand consistent
Text line: "The buyer doesn''t know your product yet. This is all they have."', 'contrast');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES 
('22222222-2222-2222-2222-222222222222', 'C-08', 'The Google Search Result', 'Show: Two Google search result screenshots for two similar business names
Version A: No website, no Google Business listing, nothing but a phone directory entry
Version B: Clean website snippet, Google Business listing, reviews, some presence
Text line: "This is the due diligence. 90 seconds. Already decided."', 'contrast');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES 
('22222222-2222-2222-2222-222222222222', 'C-09', 'The Three Logo Problem', 'Show: Three slightly different versions of "the same" logo — different weights, different colours, different files used across different materials
Text line: "Which one is the real you? Your buyers are asking the same question."', 'contrast');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES 
('22222222-2222-2222-2222-222222222222', 'C-10', 'The Brand Before/After', 'Show: BBMh actual client work — before the rebrand and after
No labels. No explanation. Just the transformation.
Text line: "Same business. Different conversation."
*(This one is BBMh''s portfolio in motion. Strong CTA post.)*', 'contrast');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES 
('22222222-2222-2222-2222-222222222222', 'C-11', 'The Font Problem', 'Show: Same company name written in five different fonts across five different touchpoints (card, website header, brochure, proposal, social bio)
Text line: "Consistency is a trust signal. This is what inconsistency looks like to a buyer."', 'contrast');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES 
('22222222-2222-2222-2222-222222222222', 'C-12', 'The Homepage First Impression', 'Show: Two homepages — first fold only, no scrolling
Version A: Generic hero image, vague headline like "Solutions for Your Business"
Version B: Specific headline, clear offering, visual identity immediately readable
Text line: "8 seconds. This is the entire decision."', 'contrast');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES 
('22222222-2222-2222-2222-222222222222', 'F-01', 'The Frame F-01', 'Your brand is working 24 hours a day.
The question is what it''s saying.', 'frame');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES 
('22222222-2222-2222-2222-222222222222', 'F-02', 'The Frame F-02', 'The buyer who didn''t call you back already knew what they needed to know.
They got it from your website.', 'frame');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES 
('22222222-2222-2222-2222-222222222222', 'F-03', 'The Frame F-03', 'Cheap looks expensive to make.
Premium looks cheap to fake.
One of those is you.', 'frame');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES 
('22222222-2222-2222-2222-222222222222', 'F-04', 'The Frame F-04', 'Most B2B brands were designed for the visiting card and left there.', 'frame');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES 
('22222222-2222-2222-2222-222222222222', 'F-05', 'The Frame F-05', 'Your product earned the premium.
Your brand didn''t get the message.', 'frame');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES 
('22222222-2222-2222-2222-222222222222', 'F-06', 'The Frame F-06', 'The business that looks more ready gets the meeting.
The meeting is where you prove the product.
You''re not getting the meeting.', 'frame');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES 
('22222222-2222-2222-2222-222222222222', 'F-07', 'The Frame F-07', 'There''s no such thing as too small to have a brand.
There''s only too small to ignore not having one.', 'frame');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES 
('22222222-2222-2222-2222-222222222222', 'F-08', 'The Frame F-08', 'Your referral network knows you.
Everyone else only has your website.
Fix the thing the everyone else sees.', 'frame');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES 
('22222222-2222-2222-2222-222222222222', 'F-09', 'The Frame F-09', 'A logo that works on a visiting card is not enough.
It''s a starting point that most businesses mistake for the finish line.', 'frame');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES 
('22222222-2222-2222-2222-222222222222', 'F-10', 'The Frame F-10', 'Consistency is a trust signal.
Your three different logos are a distrust signal.', 'frame');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES 
('22222222-2222-2222-2222-222222222222', 'F-11', 'The Frame F-11', 'The deal doesn''t start when you pitch.
It starts when they Google you.', 'frame');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES 
('22222222-2222-2222-2222-222222222222', 'F-12', 'The Frame F-12', 'Heritage that isn''t visible doesn''t count.
You have the heritage.
Surface it.', 'frame');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES 
('22222222-2222-2222-2222-222222222222', 'F-13', 'The Frame F-13', 'Your brand isn''t what you say you are.
It''s what a stranger finds when they look you up.', 'frame');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES 
('22222222-2222-2222-2222-222222222222', 'F-14', 'The Frame F-14', 'Modernising a brand and genericising a brand are not the same thing.
Most rebrands do the second by accident.', 'frame');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES 
('22222222-2222-2222-2222-222222222222', 'F-15', 'The Frame F-15', 'Price negotiation starts before the quote is sent.
It starts the moment the buyer forms an opinion about your business.
That opinion is formed by what they see.', 'frame');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES 
('22222222-2222-2222-2222-222222222222', 'F-16', 'The Frame F-16', 'The best version of your business exists.
It lives in your factory, your team, your work.
Your brand is the only thing that makes it visible to people who haven''t met you yet.', 'frame');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES 
('22222222-2222-2222-2222-222222222222', 'F-17', 'The Frame F-17', 'Your competitor is charging more.
For the same product.
And winning.
The product is not the variable.', 'frame');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES 
('22222222-2222-2222-2222-222222222222', 'F-18', 'The Frame F-18', 'B2B buyers are not rational evaluators.
They are humans who need a reason to feel safe.
Your brand is that reason — or it isn''t.', 'frame');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES 
('22222222-2222-2222-2222-222222222222', 'F-19', 'The Frame F-19', 'You built something real.
The brand''s job is to make sure the right people know it.', 'frame');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES 
('22222222-2222-2222-2222-222222222222', 'F-20', 'The Frame F-20', 'Every touchpoint is either building trust or leaking it.
There is no neutral.', 'frame');

-- PUBLISHING FLOW
INSERT INTO content_publishing_flow (stage_name, stage_order, status) VALUES ('idea / script source', 1, 'active');
INSERT INTO content_publishing_flow (stage_name, stage_order, status) VALUES ('script approved', 2, 'active');
INSERT INTO content_publishing_flow (stage_name, stage_order, status) VALUES ('visual direction', 3, 'active');
INSERT INTO content_publishing_flow (stage_name, stage_order, status) VALUES ('shoot / design / edit', 4, 'active');
INSERT INTO content_publishing_flow (stage_name, stage_order, status) VALUES ('thumbnail / carousel asset', 5, 'active');
INSERT INTO content_publishing_flow (stage_name, stage_order, status) VALUES ('caption', 6, 'active');
INSERT INTO content_publishing_flow (stage_name, stage_order, status) VALUES ('internal review', 7, 'active');
INSERT INTO content_publishing_flow (stage_name, stage_order, status) VALUES ('scheduled', 8, 'active');
INSERT INTO content_publishing_flow (stage_name, stage_order, status) VALUES ('published', 9, 'active');
INSERT INTO content_publishing_flow (stage_name, stage_order, status) VALUES ('performance tracking', 10, 'active');
INSERT INTO content_publishing_flow (stage_name, stage_order, status) VALUES ('repurposed', 11, 'active');
-- CALENDAR DATA
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
    VALUES ('June 2026', '2026-06-01', 'Monday', 1, 'deep_reel', 'You''re Still in Era Zero.', NULL, (SELECT id FROM content_scripts WHERE script_code = 'T-01'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id)
    VALUES ('June 2026', '2026-06-03', 'Wednesday', 2, 'carousel', 'Carousel derived from T-01', (SELECT id FROM content_scripts WHERE script_code = 'T-01'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
            VALUES ('June 2026', '2026-06-05', 'Friday', 3, 'mirror', '', NULL, (SELECT id FROM content_scripts WHERE script_code = 'M-01'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
            VALUES ('June 2026', '2026-06-08', 'Monday', 4, 'mirror', '', NULL, (SELECT id FROM content_scripts WHERE script_code = 'M-02'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
    VALUES ('June 2026', '2026-06-11', 'Thursday', 5, 'deep_reel', 'Heritage That Isn''t Visible Doesn''t Count.', NULL, (SELECT id FROM content_scripts WHERE script_code = 'T-02'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id)
    VALUES ('June 2026', '2026-06-13', 'Saturday', 6, 'carousel', 'Carousel derived from T-02', (SELECT id FROM content_scripts WHERE script_code = 'T-02'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
            VALUES ('June 2026', '2026-06-15', 'Monday', 7, 'mirror', '', NULL, (SELECT id FROM content_scripts WHERE script_code = 'M-03'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
            VALUES ('June 2026', '2026-06-18', 'Thursday', 8, 'mirror', '', NULL, (SELECT id FROM content_scripts WHERE script_code = 'M-04'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
    VALUES ('June 2026', '2026-06-21', 'Sunday', 9, 'deep_reel', 'The Product Gets You In. The Brand Gets You In the Room First.', NULL, (SELECT id FROM content_scripts WHERE script_code = 'T-03'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id)
    VALUES ('June 2026', '2026-06-23', 'Tuesday', 10, 'carousel', 'Carousel derived from T-03', (SELECT id FROM content_scripts WHERE script_code = 'T-03'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
            VALUES ('June 2026', '2026-06-25', 'Thursday', 11, 'mirror', '', NULL, (SELECT id FROM content_scripts WHERE script_code = 'M-05'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
            VALUES ('June 2026', '2026-06-28', 'Sunday', 12, 'mirror', '', NULL, (SELECT id FROM content_scripts WHERE script_code = 'M-06'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
    VALUES ('July 2026', '2026-07-01', 'Wednesday', 13, 'deep_reel', 'You Have 3 of 7. That''s Why the Price Negotiation Always Starts the Same Way.', NULL, (SELECT id FROM content_scripts WHERE script_code = 'T-04'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id)
    VALUES ('July 2026', '2026-07-03', 'Friday', 14, 'carousel', 'Carousel derived from T-04', (SELECT id FROM content_scripts WHERE script_code = 'T-04'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
            VALUES ('July 2026', '2026-07-05', 'Sunday', 15, 'mirror', '', NULL, (SELECT id FROM content_scripts WHERE script_code = 'M-07'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
            VALUES ('July 2026', '2026-07-08', 'Wednesday', 16, 'mirror', '', NULL, (SELECT id FROM content_scripts WHERE script_code = 'M-08'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
    VALUES ('July 2026', '2026-07-11', 'Saturday', 17, 'deep_reel', 'If You Can''t Finish This Sentence, Your Brand Is Invisible.', NULL, (SELECT id FROM content_scripts WHERE script_code = 'T-05'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id)
    VALUES ('July 2026', '2026-07-13', 'Monday', 18, 'carousel', 'Carousel derived from T-05', (SELECT id FROM content_scripts WHERE script_code = 'T-05'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
            VALUES ('July 2026', '2026-07-15', 'Wednesday', 19, 'mirror', '', NULL, (SELECT id FROM content_scripts WHERE script_code = 'M-09'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
            VALUES ('July 2026', '2026-07-18', 'Saturday', 20, 'mirror', '', NULL, (SELECT id FROM content_scripts WHERE script_code = 'M-10'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
    VALUES ('July 2026', '2026-07-21', 'Tuesday', 21, 'deep_reel', 'First Build the Brand. Then You Earn the Right to Be Simple.', NULL, (SELECT id FROM content_scripts WHERE script_code = 'T-06'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id)
    VALUES ('July 2026', '2026-07-23', 'Thursday', 22, 'carousel', 'Carousel derived from T-06', (SELECT id FROM content_scripts WHERE script_code = 'T-06'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
            VALUES ('July 2026', '2026-07-25', 'Saturday', 23, 'mirror', '', NULL, (SELECT id FROM content_scripts WHERE script_code = 'M-11'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
            VALUES ('July 2026', '2026-07-28', 'Tuesday', 24, 'mirror', '', NULL, (SELECT id FROM content_scripts WHERE script_code = 'M-12'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
    VALUES ('July 2026', '2026-07-31', 'Friday', 25, 'deep_reel', 'Same Product. Ten Times the Price. One Difference.', NULL, (SELECT id FROM content_scripts WHERE script_code = 'T-07'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id)
    VALUES ('August 2026', '2026-08-02', 'Sunday', 26, 'carousel', 'Carousel derived from T-07', (SELECT id FROM content_scripts WHERE script_code = 'T-07'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
            VALUES ('August 2026', '2026-08-04', 'Tuesday', 27, 'question', '', NULL, (SELECT id FROM content_scripts WHERE script_code = 'Q-01'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
            VALUES ('August 2026', '2026-08-07', 'Friday', 28, 'question', '', NULL, (SELECT id FROM content_scripts WHERE script_code = 'Q-02'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
    VALUES ('August 2026', '2026-08-10', 'Monday', 29, 'deep_reel', 'The Spec Sheet Confirms. The Brand Decides.', NULL, (SELECT id FROM content_scripts WHERE script_code = 'T-08'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id)
    VALUES ('August 2026', '2026-08-12', 'Wednesday', 30, 'carousel', 'Carousel derived from T-08', (SELECT id FROM content_scripts WHERE script_code = 'T-08'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
            VALUES ('August 2026', '2026-08-14', 'Friday', 31, 'question', '', NULL, (SELECT id FROM content_scripts WHERE script_code = 'Q-03'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
            VALUES ('August 2026', '2026-08-17', 'Monday', 32, 'question', '', NULL, (SELECT id FROM content_scripts WHERE script_code = 'Q-04'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
    VALUES ('August 2026', '2026-08-20', 'Thursday', 33, 'deep_reel', 'Build a World. Not a Product List.', NULL, (SELECT id FROM content_scripts WHERE script_code = 'T-09'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id)
    VALUES ('August 2026', '2026-08-22', 'Saturday', 34, 'carousel', 'Carousel derived from T-09', (SELECT id FROM content_scripts WHERE script_code = 'T-09'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
            VALUES ('August 2026', '2026-08-24', 'Monday', 35, 'question', '', NULL, (SELECT id FROM content_scripts WHERE script_code = 'Q-05'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
            VALUES ('August 2026', '2026-08-27', 'Thursday', 36, 'question', '', NULL, (SELECT id FROM content_scripts WHERE script_code = 'Q-06'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
    VALUES ('August 2026', '2026-08-30', 'Sunday', 37, 'deep_reel', 'Don''t Modernise Into Invisibility.', NULL, (SELECT id FROM content_scripts WHERE script_code = 'T-10'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id)
    VALUES ('September 2026', '2026-09-01', 'Tuesday', 38, 'carousel', 'Carousel derived from T-10', (SELECT id FROM content_scripts WHERE script_code = 'T-10'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
            VALUES ('September 2026', '2026-09-03', 'Thursday', 39, 'question', '', NULL, (SELECT id FROM content_scripts WHERE script_code = 'Q-07'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
            VALUES ('September 2026', '2026-09-06', 'Sunday', 40, 'question', '', NULL, (SELECT id FROM content_scripts WHERE script_code = 'Q-08'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
    VALUES ('September 2026', '2026-09-09', 'Wednesday', 41, 'deep_reel', 'Show the Ceiling. Everything Else Looks More Valuable From There.', NULL, (SELECT id FROM content_scripts WHERE script_code = 'T-11'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id)
    VALUES ('September 2026', '2026-09-11', 'Friday', 42, 'carousel', 'Carousel derived from T-11', (SELECT id FROM content_scripts WHERE script_code = 'T-11'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
            VALUES ('September 2026', '2026-09-13', 'Sunday', 43, 'question', '', NULL, (SELECT id FROM content_scripts WHERE script_code = 'Q-09'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
            VALUES ('September 2026', '2026-09-16', 'Wednesday', 44, 'question', '', NULL, (SELECT id FROM content_scripts WHERE script_code = 'Q-10'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
    VALUES ('September 2026', '2026-09-19', 'Saturday', 45, 'deep_reel', 'Real and Specific Beats Polished and Generic. Every Single Time.', NULL, (SELECT id FROM content_scripts WHERE script_code = 'T-12'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id)
    VALUES ('September 2026', '2026-09-21', 'Monday', 46, 'carousel', 'Carousel derived from T-12', (SELECT id FROM content_scripts WHERE script_code = 'T-12'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
            VALUES ('September 2026', '2026-09-23', 'Wednesday', 47, 'question', '', NULL, (SELECT id FROM content_scripts WHERE script_code = 'Q-11'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
            VALUES ('September 2026', '2026-09-26', 'Saturday', 48, 'question', '', NULL, (SELECT id FROM content_scripts WHERE script_code = 'Q-12'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
    VALUES ('September 2026', '2026-09-29', 'Tuesday', 49, 'deep_reel', 'The Gap Between Expectation and Reality Is Where Interest Lives.', NULL, (SELECT id FROM content_scripts WHERE script_code = 'T-13'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id)
    VALUES ('October 2026', '2026-10-01', 'Thursday', 50, 'carousel', 'Carousel derived from T-13', (SELECT id FROM content_scripts WHERE script_code = 'T-13'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
            VALUES ('October 2026', '2026-10-03', 'Saturday', 51, 'contrast', 'The Visiting Card', NULL, (SELECT id FROM content_scripts WHERE script_code = 'C-01'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
            VALUES ('October 2026', '2026-10-06', 'Tuesday', 52, 'contrast', 'The Email Signature', NULL, (SELECT id FROM content_scripts WHERE script_code = 'C-02'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
    VALUES ('October 2026', '2026-10-09', 'Friday', 53, 'deep_reel', 'There Are No Boring Businesses. Only Boring Content.', NULL, (SELECT id FROM content_scripts WHERE script_code = 'T-14'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id)
    VALUES ('October 2026', '2026-10-11', 'Sunday', 54, 'carousel', 'Carousel derived from T-14', (SELECT id FROM content_scripts WHERE script_code = 'T-14'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
            VALUES ('October 2026', '2026-10-13', 'Tuesday', 55, 'contrast', 'The Logo at Scale', NULL, (SELECT id FROM content_scripts WHERE script_code = 'C-03'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
            VALUES ('October 2026', '2026-10-16', 'Friday', 56, 'contrast', 'The Website on Mobile', NULL, (SELECT id FROM content_scripts WHERE script_code = 'C-04'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
    VALUES ('October 2026', '2026-10-19', 'Monday', 57, 'deep_reel', 'The Marketing Isn''t Broken. The Foundation Isn''t Built Yet.', NULL, (SELECT id FROM content_scripts WHERE script_code = 'T-15'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id)
    VALUES ('October 2026', '2026-10-21', 'Wednesday', 58, 'carousel', 'Carousel derived from T-15', (SELECT id FROM content_scripts WHERE script_code = 'T-15'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
            VALUES ('October 2026', '2026-10-23', 'Friday', 59, 'contrast', 'The Proposal Cover', NULL, (SELECT id FROM content_scripts WHERE script_code = 'C-05'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
            VALUES ('October 2026', '2026-10-26', 'Monday', 60, 'contrast', 'The Trade Fair Stall', NULL, (SELECT id FROM content_scripts WHERE script_code = 'C-06'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
    VALUES ('October 2026', '2026-10-29', 'Thursday', 61, 'deep_reel', 'The Drink Didn''t Change. Everything the Buyer Felt Before Tasting It Did.', NULL, (SELECT id FROM content_scripts WHERE script_code = 'IN-01'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id)
    VALUES ('October 2026', '2026-10-31', 'Saturday', 62, 'carousel', 'Carousel derived from IN-01', (SELECT id FROM content_scripts WHERE script_code = 'IN-01'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
            VALUES ('November 2026', '2026-11-02', 'Monday', 63, 'contrast', 'The Catalog Cover', NULL, (SELECT id FROM content_scripts WHERE script_code = 'C-07'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
            VALUES ('November 2026', '2026-11-05', 'Thursday', 64, 'contrast', 'The Google Search Result', NULL, (SELECT id FROM content_scripts WHERE script_code = 'C-08'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
    VALUES ('November 2026', '2026-11-08', 'Sunday', 65, 'deep_reel', 'Same Motorcycle. Different Meaning. That''s What Saved the Company.', NULL, (SELECT id FROM content_scripts WHERE script_code = 'IN-02'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id)
    VALUES ('November 2026', '2026-11-10', 'Tuesday', 66, 'carousel', 'Carousel derived from IN-02', (SELECT id FROM content_scripts WHERE script_code = 'IN-02'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
            VALUES ('November 2026', '2026-11-12', 'Thursday', 67, 'contrast', 'The Three Logo Problem', NULL, (SELECT id FROM content_scripts WHERE script_code = 'C-09'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
            VALUES ('November 2026', '2026-11-15', 'Sunday', 68, 'contrast', 'The Brand Before/After', NULL, (SELECT id FROM content_scripts WHERE script_code = 'C-10'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
    VALUES ('November 2026', '2026-11-18', 'Wednesday', 69, 'deep_reel', 'The Right Product. The Wrong Brand. What Tanishq Taught Us About Trust.', NULL, (SELECT id FROM content_scripts WHERE script_code = 'IN-03'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id)
    VALUES ('November 2026', '2026-11-20', 'Friday', 70, 'carousel', 'Carousel derived from IN-03', (SELECT id FROM content_scripts WHERE script_code = 'IN-03'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
            VALUES ('November 2026', '2026-11-22', 'Sunday', 71, 'contrast', 'The Font Problem', NULL, (SELECT id FROM content_scripts WHERE script_code = 'C-11'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
            VALUES ('November 2026', '2026-11-25', 'Wednesday', 72, 'contrast', 'The Homepage First Impression', NULL, (SELECT id FROM content_scripts WHERE script_code = 'C-12'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
    VALUES ('November 2026', '2026-11-28', 'Saturday', 73, 'deep_reel', 'A Manufacturer from Rajasthan Now Sells to Luxury Hotels in New York. One Thing Changed.', NULL, (SELECT id FROM content_scripts WHERE script_code = 'IN-04'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id)
    VALUES ('November 2026', '2026-11-30', 'Monday', 74, 'carousel', 'Carousel derived from IN-04', (SELECT id FROM content_scripts WHERE script_code = 'IN-04'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
            VALUES ('December 2026', '2026-12-02', 'Wednesday', 75, 'frame', '', NULL, (SELECT id FROM content_scripts WHERE script_code = 'F-01'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
            VALUES ('December 2026', '2026-12-05', 'Saturday', 76, 'frame', '', NULL, (SELECT id FROM content_scripts WHERE script_code = 'F-02'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
    VALUES ('December 2026', '2026-12-08', 'Tuesday', 77, 'deep_reel', 'The Gap Between Rs 80 and Rs 1200 Is a Brand Decision.', NULL, (SELECT id FROM content_scripts WHERE script_code = 'IN-05'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id)
    VALUES ('December 2026', '2026-12-10', 'Thursday', 78, 'carousel', 'Carousel derived from IN-05', (SELECT id FROM content_scripts WHERE script_code = 'IN-05'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
            VALUES ('December 2026', '2026-12-12', 'Saturday', 79, 'frame', '', NULL, (SELECT id FROM content_scripts WHERE script_code = 'F-03'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
            VALUES ('December 2026', '2026-12-15', 'Tuesday', 80, 'frame', '', NULL, (SELECT id FROM content_scripts WHERE script_code = 'F-04'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
    VALUES ('December 2026', '2026-12-18', 'Friday', 81, 'deep_reel', 'Your Website Is Working Right Now. The Question Is Which Direction.', NULL, (SELECT id FROM content_scripts WHERE script_code = 'W-01'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id)
    VALUES ('December 2026', '2026-12-20', 'Sunday', 82, 'carousel', 'Carousel derived from W-01', (SELECT id FROM content_scripts WHERE script_code = 'W-01'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
            VALUES ('December 2026', '2026-12-22', 'Tuesday', 83, 'frame', '', NULL, (SELECT id FROM content_scripts WHERE script_code = 'F-05'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
            VALUES ('December 2026', '2026-12-25', 'Friday', 84, 'frame', '', NULL, (SELECT id FROM content_scripts WHERE script_code = 'F-06'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
    VALUES ('December 2026', '2026-12-28', 'Monday', 85, 'deep_reel', 'Design for Where You''re Going. Not Where You Started.', NULL, (SELECT id FROM content_scripts WHERE script_code = 'W-02'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id)
    VALUES ('December 2026', '2026-12-30', 'Wednesday', 86, 'carousel', 'Carousel derived from W-02', (SELECT id FROM content_scripts WHERE script_code = 'W-02'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
            VALUES ('January 2027', '2027-01-01', 'Friday', 87, 'frame', '', NULL, (SELECT id FROM content_scripts WHERE script_code = 'F-07'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
            VALUES ('January 2027', '2027-01-04', 'Monday', 88, 'frame', '', NULL, (SELECT id FROM content_scripts WHERE script_code = 'F-08'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
    VALUES ('January 2027', '2027-01-07', 'Thursday', 89, 'deep_reel', 'Your Website Makes Perfect Sense to You. That''s the Problem.', NULL, (SELECT id FROM content_scripts WHERE script_code = 'W-03'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id)
    VALUES ('January 2027', '2027-01-09', 'Saturday', 90, 'carousel', 'Carousel derived from W-03', (SELECT id FROM content_scripts WHERE script_code = 'W-03'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
            VALUES ('January 2027', '2027-01-11', 'Monday', 91, 'frame', '', NULL, (SELECT id FROM content_scripts WHERE script_code = 'F-09'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
            VALUES ('January 2027', '2027-01-14', 'Thursday', 92, 'frame', '', NULL, (SELECT id FROM content_scripts WHERE script_code = 'F-10'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
    VALUES ('January 2027', '2027-01-17', 'Sunday', 93, 'deep_reel', 'The Version of Your Website Most Buyers See First Was Never Designed.', NULL, (SELECT id FROM content_scripts WHERE script_code = 'W-04'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id)
    VALUES ('January 2027', '2027-01-19', 'Tuesday', 94, 'carousel', 'Carousel derived from W-04', (SELECT id FROM content_scripts WHERE script_code = 'W-04'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
            VALUES ('January 2027', '2027-01-21', 'Thursday', 95, 'frame', '', NULL, (SELECT id FROM content_scripts WHERE script_code = 'F-11'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
            VALUES ('January 2027', '2027-01-24', 'Sunday', 96, 'frame', '', NULL, (SELECT id FROM content_scripts WHERE script_code = 'F-12'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
    VALUES ('January 2027', '2027-01-27', 'Wednesday', 97, 'deep_reel', 'First Impressions Are Made Before You''re in the Room.', NULL, (SELECT id FROM content_scripts WHERE script_code = 'L-01'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id)
    VALUES ('January 2027', '2027-01-29', 'Friday', 98, 'carousel', 'Carousel derived from L-01', (SELECT id FROM content_scripts WHERE script_code = 'L-01'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
            VALUES ('January 2027', '2027-01-31', 'Sunday', 99, 'frame', '', NULL, (SELECT id FROM content_scripts WHERE script_code = 'F-13'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
            VALUES ('February 2027', '2027-02-03', 'Wednesday', 100, 'frame', '', NULL, (SELECT id FROM content_scripts WHERE script_code = 'F-14'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
    VALUES ('February 2027', '2027-02-06', 'Saturday', 101, 'deep_reel', 'You Don''t Have a Logo. You Have a Logo Image. There''s a Difference.', NULL, (SELECT id FROM content_scripts WHERE script_code = 'L-02'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id)
    VALUES ('February 2027', '2027-02-08', 'Monday', 102, 'carousel', 'Carousel derived from L-02', (SELECT id FROM content_scripts WHERE script_code = 'L-02'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
            VALUES ('February 2027', '2027-02-10', 'Wednesday', 103, 'frame', '', NULL, (SELECT id FROM content_scripts WHERE script_code = 'F-15'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
            VALUES ('February 2027', '2027-02-13', 'Saturday', 104, 'frame', '', NULL, (SELECT id FROM content_scripts WHERE script_code = 'F-16'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
    VALUES ('February 2027', '2027-02-16', 'Tuesday', 105, 'deep_reel', 'Your Visiting Card Is Still in Their Pocket. Your Website Visit Lasted 11 Seconds.', NULL, (SELECT id FROM content_scripts WHERE script_code = 'S-01'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id)
    VALUES ('February 2027', '2027-02-18', 'Thursday', 106, 'carousel', 'Carousel derived from S-01', (SELECT id FROM content_scripts WHERE script_code = 'S-01'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
            VALUES ('February 2027', '2027-02-20', 'Saturday', 107, 'frame', '', NULL, (SELECT id FROM content_scripts WHERE script_code = 'F-17'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
    VALUES ('February 2027', '2027-02-23', 'Tuesday', 108, 'deep_reel', 'The Business Winning Your Deals Probably Has a Weaker Product.', NULL, (SELECT id FROM content_scripts WHERE script_code = 'S-02'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id)
    VALUES ('February 2027', '2027-02-25', 'Thursday', 109, 'carousel', 'Carousel derived from S-02', (SELECT id FROM content_scripts WHERE script_code = 'S-02'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
            VALUES ('February 2027', '2027-02-27', 'Saturday', 110, 'frame', '', NULL, (SELECT id FROM content_scripts WHERE script_code = 'F-18'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
    VALUES ('March 2027', '2027-03-02', 'Tuesday', 111, 'deep_reel', 'Make the Website as Impressive as the Factory Tour. That''s All It Has to Do.', NULL, (SELECT id FROM content_scripts WHERE script_code = 'S-03'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id)
    VALUES ('March 2027', '2027-03-04', 'Thursday', 112, 'carousel', 'Carousel derived from S-03', (SELECT id FROM content_scripts WHERE script_code = 'S-03'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
            VALUES ('March 2027', '2027-03-06', 'Saturday', 113, 'frame', '', NULL, (SELECT id FROM content_scripts WHERE script_code = 'F-19'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
    VALUES ('March 2027', '2027-03-09', 'Tuesday', 114, 'deep_reel', 'The Most Important Brand Touchpoints Are the Ones Nobody Thinks of as Brand Touchpoints.', NULL, (SELECT id FROM content_scripts WHERE script_code = 'S-04'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id)
    VALUES ('March 2027', '2027-03-11', 'Thursday', 115, 'carousel', 'Carousel derived from S-04', (SELECT id FROM content_scripts WHERE script_code = 'S-04'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
            VALUES ('March 2027', '2027-03-13', 'Saturday', 116, 'frame', '', NULL, (SELECT id FROM content_scripts WHERE script_code = 'F-20'));
