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
-- BBMh Content OS V4.0.0-PRO Clean Data Import

INSERT INTO content_sources (id, title, source_type, source_label) VALUES
('11111111-1111-1111-1111-111111111111', 'BBMh — 30 Complete Scripts', 'pasted_text', 'Core 30 Scripts'),
('22222222-2222-2222-2222-222222222222', 'BBMh — Fast Reel Format System', 'pasted_text', 'Fast Reel Formats');

INSERT INTO content_scripts (source_id, script_code, title, hook, script_body, content_type, theme, caption_notes, thumbnail_headline) VALUES ('11111111-1111-1111-1111-111111111111', 'T-01', $$You're Still in Era Zero.$$, $$$$, $$**INSIGHT**


**REFRAME**


**CLOSE**
$$, 'deep_reel', $$Apple Brand Eras · Deep Reel · Talking head$$, $$Most businesses evolve their product, their team, their pricing — and freeze their brand in the year it was first designed. Apple went through Think Different, the iPod era, Shot on iPhone — each one a deliberate choice matching where the company was going. If your brand still looks the way it did five years ago, it isn't representing the business you've built. It's representing the business you used to be.
#bbmh #beanbagmediahouse #brandingindia #b2bbranding #brandstrategy$$, $$A: "You're Still in Era Zero."
B: "Apple changed their entire brand 3 times before it worked. Where are you?"
C: "Your business grew. Your brand didn't. That gap is costing you deals."$$);
INSERT INTO content_scripts (source_id, script_code, title, hook, script_body, content_type, theme, caption_notes, thumbnail_headline) VALUES ('11111111-1111-1111-1111-111111111111', 'T-02', $$Heritage That Isn't Visible Doesn't Count.$$, $$$$, $$**INSIGHT**


**REFRAME**


**CLOSE**
$$, 'deep_reel', $$Officine Universelle Buly · Heritage Maximalism · Deep Reel$$, $$Depth isn't just time. It's the deliberate communication of craft, care, and intention across every visual touchpoint. A brand founded a decade ago can look older and more established than one with 40 years of real history — simply because it invested in surfacing that depth visually. Your history is an asset. The brand is the only mechanism that makes it visible to someone who has never met you.
#bbmh #beanbagmediahouse #familybusiness #heritagebrand #brandingindia$$, $$A: "Heritage That Isn't Visible Doesn't Count."
B: "A brand founded in 2014 looks 200 years old. Your 40-year business looks brand new. Why?"
C: "Your family business has more depth than most global brands. You'd never know it from the logo."$$);
INSERT INTO content_scripts (source_id, script_code, title, hook, script_body, content_type, theme, caption_notes, thumbnail_headline) VALUES ('11111111-1111-1111-1111-111111111111', 'T-03', $$The Product Gets You In. The Brand Gets You In the Room First.$$, $$$$, $$**INSIGHT**


**REFRAME**


**CLOSE**
$$, 'deep_reel', $$Athletic Brewing · Camouflage Positioning · Deep Reel$$, $$Athletic Brewing didn't change what was in the can. They changed what the can communicated — and solved a social problem their customer was too polite to name. Your brand does this same work for your business whether you've designed it to or not. The question is whether it's doing it well, doing it badly, or doing nothing at all.
#bbmh #beanbagmediahouse #brandpositioning #b2bmarketing #visualidentity$$, $$A: "They Made Non-Alcoholic Beer Look Like Craft Beer. Not to Deceive. To Belong."
B: "What does your brand communicate before you walk into the meeting?"
C: "Fit the tier you want. Not the tier you're currently in."$$);
INSERT INTO content_scripts (source_id, script_code, title, hook, script_body, content_type, theme, caption_notes, thumbnail_headline) VALUES ('11111111-1111-1111-1111-111111111111', 'T-04', $$You Have 3 of 7. That's Why the Price Negotiation Always Starts the Same Way.$$, $$$$, $$**INSIGHT**


**REFRAME**


**CLOSE**
$$, 'deep_reel', $$7 Pillars of Luxury · Framework · Deep Reel$$, $$Quality and time are table stakes. Every vendor claims them and neither is visible before the relationship begins. The five visible pillars — design, desirability, experience, brand world, perceived equity — are what buyers evaluate before the first conversation. Luxury pricing is built before the quote is sent, not during the negotiation.
#bbmh #beanbagmediahouse #luxurybranding #premiumpricing #b2bbranding$$, $$A: "You Have 3 of 7 Things. That's Why the Price Negotiation Never Goes Your Way."
B: "What luxury brands have that most B2B businesses are missing — and it has nothing to do with the product."
C: "Premium pricing is decided before the quote is sent. Here's where."$$);
INSERT INTO content_scripts (source_id, script_code, title, hook, script_body, content_type, theme, caption_notes, thumbnail_headline) VALUES ('11111111-1111-1111-1111-111111111111', 'T-05', $$If You Can't Finish This Sentence, Your Brand Is Invisible.$$, $$$$, $$**INSIGHT**


**REFRAME**


**CLOSE**
$$, 'deep_reel', $$Blank for X Framework · Direct Address · Deep Reel$$, $$Generic positioning is the most expensive mistake a business can make. Not because it looks bad — it often looks perfectly fine. But because it speaks to no one specifically, it resonates with no one deeply. The businesses winning right now can describe exactly who they're for, exactly what they solve, and exactly why they're the only logical choice for that person. Can yours?
#bbmh #beanbagmediahouse #brandpositioning #b2bmarketing #branding$$, $$A: "If You Can't Finish This Sentence, Your Brand Is Invisible."
B: "'We are ___ for ___.' Most businesses leave this blank. That's why they stay generic."
C: "The one-sentence test that tells you whether your brand will make it."$$);
INSERT INTO content_scripts (source_id, script_code, title, hook, script_body, content_type, theme, caption_notes, thumbnail_headline) VALUES ('11111111-1111-1111-1111-111111111111', 'T-06', $$First Build the Brand. Then You Earn the Right to Be Simple.$$, $$$$, $$**INSIGHT**


**REFRAME**


**CLOSE**
$$, 'deep_reel', $$Rimowa · Brand Equity · Deep Reel$$, $$Rimowa's website is essentially a product grid. It works because the brand did all the selling long before anyone landed on the URL. That equity took three decades. If your business name means nothing to the first-time visitor, the website can't afford to say nothing. It has to do the work the brand hasn't earned yet. Simplicity is a reward. Not a starting point.
#bbmh #beanbagmediahouse #websitedesign #brandequity #b2bbranding$$, $$A: "Rimowa Has a Basic Website. That's a Privilege 30 Years in the Making. You Haven't Earned It Yet."
B: "The most minimal website in premium retail — and why copying it will destroy you."
C: "Brand equity lets you say less. Build it first."$$);
INSERT INTO content_scripts (source_id, script_code, title, hook, script_body, content_type, theme, caption_notes, thumbnail_headline) VALUES ('11111111-1111-1111-1111-111111111111', 'T-07', $$Same Product. Ten Times the Price. One Difference.$$, $$$$, $$**INSIGHT**


**REFRAME**


**CLOSE**
$$, 'deep_reel', $$Vacation Sunscreen · Little Luxury Recipe · Deep Reel$$, $$Vacation sunscreen didn't reinvent sun protection. They reinvented what buying sunscreen feels like — before the buyer even opens it. Your B2B business has the product. The question is whether the brand, the website, the proposal, the catalog are doing the same justification work on your behalf. If not, every price negotiation starts from the same place: zero.
#bbmh #beanbagmediahouse #premiumbranding #brandstrategy #b2bmarketing$$, $$A: "Same SPF. Ten Times the Price. The Only Difference Is the Brand."
B: "How a sunscreen charges 10x more for the same protection — and what your B2B business can take from it."
C: "Performance alone doesn't hold the price. These three things do."$$);
INSERT INTO content_scripts (source_id, script_code, title, hook, script_body, content_type, theme, caption_notes, thumbnail_headline) VALUES ('11111111-1111-1111-1111-111111111111', 'T-08', $$The Spec Sheet Confirms. The Brand Decides.$$, $$$$, $$**INSIGHT**


**REFRAME**


**CLOSE**
$$, 'deep_reel', $$Rhode Skin · Sensory Brand Language · Deep Reel$$, $$Every procurement decision has an emotional layer. The feeling forms before the specs are read, before the meeting happens, before the quote is compared. Rhode understood this for skincare. The same principle applies to a manufacturer, an exporter, a service business. Your brand should be doing emotional work before the rational evaluation begins. Most B2B brands aren't.
#bbmh #beanbagmediahouse #brandingindia #b2bbranding #visualidentity$$, $$A: "Rhode Makes You Feel the Product Before You Buy It. What Does Your Brand Make Buyers Feel?"
B: "The emotional layer of every B2B buying decision that nobody in your industry is thinking about."
C: "The spec sheet confirms. The brand decides."$$);
INSERT INTO content_scripts (source_id, script_code, title, hook, script_body, content_type, theme, caption_notes, thumbnail_headline) VALUES ('11111111-1111-1111-1111-111111111111', 'T-09', $$Build a World. Not a Product List.$$, $$$$, $$**INSIGHT**


**REFRAME**


**CLOSE**
$$, 'deep_reel', $$Gentle Monster · Brand World Building · Deep Reel$$, $$Gentle Monster's galleries, bakeries, and film campaigns aren't distractions from the sunglasses. They are the sunglasses. By the time you hold the product, you've already bought into the universe it exists in. Your B2B brand doesn't need bakeries. It needs every touchpoint to feel like it belongs to the same coherent world — the same quality, the same intention, designed for the same buyer.
#bbmh #beanbagmediahouse #brandworld #b2bbranding #brandstrategy$$, $$A: "Gentle Monster Sells Sunglasses. They Also Run a Surreal Bakery. Your B2B Business Needs a World Too."
B: "Gentle Monster doesn't just sell eyewear. They sell belonging to something."
C: "Your buyers don't fall in love with products. They fall in love with worlds."$$);
INSERT INTO content_scripts (source_id, script_code, title, hook, script_body, content_type, theme, caption_notes, thumbnail_headline) VALUES ('11111111-1111-1111-1111-111111111111', 'T-10', $$Don't Modernise Into Invisibility.$$, $$$$, $$**INSIGHT**


**REFRAME**


**CLOSE**
$$, 'deep_reel', $$Cracker Barrel / Blanding · Visual Identity · Deep Reel$$, $$When you modernise a brand, you're making one claim: this still looks like us, just better. Cracker Barrel made a different claim — this no longer looks like us. Their customers noticed immediately. Brand evolution preserves the DNA and improves the presentation. It doesn't erase what made the brand recognisable. The roots stay. The presentation grows.
#bbmh #beanbagmediahouse #rebranding #brandidentity #brandingindia$$, $$A: "Cracker Barrel Modernised Their Logo. Their Stock Dropped. Don't Modernise Into Invisibility."
B: "The rebrand that backfired — and what it tells every Indian family business about visual identity."
C: "Simplifying is not the same as genericising. Know the difference before you touch the brand."$$);
INSERT INTO content_scripts (source_id, script_code, title, hook, script_body, content_type, theme, caption_notes, thumbnail_headline) VALUES ('11111111-1111-1111-1111-111111111111', 'T-11', $$Show the Ceiling. Everything Else Looks More Valuable From There.$$, $$$$, $$**INSIGHT**


**REFRAME**


**CLOSE**
$$, 'deep_reel', $$Balenciaga Trash Bag · Product Mix / Price Ceiling · Deep Reel$$, $$The $1790 trash bag didn't exist to sell trash bags. It existed to make a $500 jacket feel like a reasonable middle ground. Every brand needs a visible ceiling — the most extraordinary version of what it can do. In B2B, that ceiling is your best reference, your most ambitious project, your highest-quality outcome. Without it, buyers have no basis to price you above the baseline.
#bbmh #beanbagmediahouse #brandstrategy #b2bmarketing #premiumbranding$$, $$A: "Balenciaga Sold a Trash Bag for $1790. Your Business Needs Its Own Version."
B: "The product that wasn't meant to sell — but made everything else sell better."
C: "If your ceiling isn't visible, buyers price you from the floor."$$);
INSERT INTO content_scripts (source_id, script_code, title, hook, script_body, content_type, theme, caption_notes, thumbnail_headline) VALUES ('11111111-1111-1111-1111-111111111111', 'T-12', $$Real and Specific Beats Polished and Generic. Every Single Time.$$, $$$$, $$**INSIGHT**


**REFRAME**


**CLOSE**
$$, 'deep_reel', $$Stussy Homie Lookbook · Authenticity in Brand · Deep Reel$$, $$Real is persuasive in a way polished isn't. Stussy's community campaigns feel true because they are — those people actually live in the clothes. Your B2B brand equivalent is actual work, actual clients, actual outcomes — without the stock photo gloss. The right buyer reading a specific, honest case study recognises themselves. And recognition is more powerful than any persuasion.
#bbmh #beanbagmediahouse #brandauthenticity #b2bbranding #visualidentity$$, $$A: "Stussy Never Used Professional Models. It's Their Smartest Brand Decision."
B: "Why the most authentic brands always outperform the most polished ones."
C: "Real and specific beats polished and generic. Here's the B2B version."$$);
INSERT INTO content_scripts (source_id, script_code, title, hook, script_body, content_type, theme, caption_notes, thumbnail_headline) VALUES ('11111111-1111-1111-1111-111111111111', 'T-13', $$The Gap Between Expectation and Reality Is Where Interest Lives.$$, $$$$, $$**INSIGHT**


**REFRAME**


**CLOSE**
$$, 'deep_reel', $$Cognitive Dissonance / Manufacturer Who Looks Too Good · Deep Reel$$, $$Most B2B businesses dress for their category. They look exactly like the other ten vendors on the shortlist. The buyer's brain processes the familiar and keeps scrolling. The businesses that pause buyers are the ones operating at a visual level their category didn't expect. That pause is designed, not accidental. And it's the only opening you get.
#bbmh #beanbagmediahouse #b2bbranding #visualidentity #brandingindia$$, $$A: "A Manufacturer Who Looks Too Good. That's What Stops a B2B Buyer Mid-Scroll."
B: "What happens when a B2B business looks better than its entire category expects."
C: "The gap between what buyers expect and what they find — that's where deals are won."$$);
INSERT INTO content_scripts (source_id, script_code, title, hook, script_body, content_type, theme, caption_notes, thumbnail_headline) VALUES ('11111111-1111-1111-1111-111111111111', 'T-14', $$There Are No Boring Businesses. Only Boring Content.$$, $$$$, $$**INSIGHT**


**REFRAME**


**CLOSE**
$$, 'deep_reel', $$No Boring Industry Principle · Provocation · Deep Reel$$, $$The businesses making the most compelling B2B content right now aren't in glamorous industries. They're in manufacturing, logistics, industrial supply, agriculture. What they understand that most don't: expert content from an unglamorous industry is more valuable and more watchable than generic content from any industry. The barrier is assumption, not reality.
#bbmh #beanbagmediahouse #b2bcontent #contentmarketing #brandingindia$$, $$A: "MRE Taste Tests. Millions of Views. What's Your Excuse?"
B: "There are no boring businesses. Only businesses that haven't figured out their content language yet."
C: "The most watchable B2B content right now is coming from the most unglamorous industries."$$);
INSERT INTO content_scripts (source_id, script_code, title, hook, script_body, content_type, theme, caption_notes, thumbnail_headline) VALUES ('11111111-1111-1111-1111-111111111111', 'T-15', $$The Marketing Isn't Broken. The Foundation Isn't Built Yet.$$, $$$$, $$**INSIGHT**


**REFRAME**


**CLOSE**
$$, 'deep_reel', $$Brand Foundation / Level 2 · Diagnostic · Deep Reel$$, $$Most marketing failures aren't marketing failures. They're foundation failures — ads sending buyers to a website that doesn't convert, campaigns building awareness of a brand that can't hold it. The brand is the infrastructure that everything else runs on. Fix the infrastructure, and the marketing you've already been paying for starts working.
#bbmh #beanbagmediahouse #brandstrategy #marketingfoundation #b2bmarketing$$, $$A: "The Reason Your Marketing Isn't Working Isn't Your Marketing."
B: "You're running ads on a brand that doesn't hold attention. That's the real problem."
C: "Fix the pipe. Then turn up the volume."$$);
INSERT INTO content_scripts (source_id, script_code, title, hook, script_body, content_type, theme, caption_notes, thumbnail_headline) VALUES ('11111111-1111-1111-1111-111111111111', 'IN-01', $$The Drink Didn't Change. Everything the Buyer Felt Before Tasting It Did.$$, $$$$, $$**INSIGHT**


**REFRAME**


**CLOSE**
$$, 'deep_reel', $$Paper Boat · Commodity to Premium · Deep Reel$$, $$Paper Boat didn't create a new recipe. They created a new feeling around an old one — nostalgia, craft, intention, all communicated through one beautifully designed package before the buyer takes a single sip. Your business has a product that's genuinely good. The question is: what does the brand communicate before anyone experiences it?
#bbmh #beanbagmediahouse #indianbrands #paperboat #brandingindia$$, $$A: "Paper Boat Charges 6x More for the Same Aam Panna. One Difference."
B: "Why does a Rs 5 drink lose to a Rs 30 one every time? This."
C: "The product didn't change. The feeling around it did. That's worth 6x."$$);
INSERT INTO content_scripts (source_id, script_code, title, hook, script_body, content_type, theme, caption_notes, thumbnail_headline) VALUES ('11111111-1111-1111-1111-111111111111', 'IN-02', $$Same Motorcycle. Different Meaning. That's What Saved the Company.$$, $$$$, $$**INSIGHT**


**REFRAME**


**CLOSE**
$$, 'deep_reel', $$Royal Enfield · Brand Meaning Over Specs · Deep Reel$$, $$Royal Enfield's revival is one of the most instructive brand stories in India. The motorcycle didn't fundamentally change. The meaning of owning one did. Every business competing purely on specs and features is having the wrong conversation. The brands that escape commodity competition are the ones who understand what their product means — not just what it does.
#bbmh #beanbagmediahouse #royalenfield #indianbrands #brandstrategy$$, $$A: "Royal Enfield Was Nearly Dead in 2000. A Two-Year Waiting List by 2012. Same Bike."
B: "They stopped selling what the motorcycle does. They started selling what it says about you."
C: "Near bankruptcy to a two-year waitlist. Not a new engine. A new brand."$$);
INSERT INTO content_scripts (source_id, script_code, title, hook, script_body, content_type, theme, caption_notes, thumbnail_headline) VALUES ('11111111-1111-1111-1111-111111111111', 'IN-03', $$The Right Product. The Wrong Brand. What Tanishq Taught Us About Trust.$$, $$$$, $$**INSIGHT**


**REFRAME**


**CLOSE**
$$, 'deep_reel', $$Tanishq · Brand Trust Signals · Deep Reel$$, $$Tata built Tanishq with excellent product and contemporary positioning. It failed because Indian jewellery buyers don't trust contemporary — they trust craft, purity, and generational reliability. When the brand was rebuilt around those signals, the same product started selling at scale. The product was never the problem. In India, trust has its own visual language. If your brand doesn't speak it, the buyer doesn't stay long enough to find out what you're actually worth.
#bbmh #beanbagmediahouse #tanishq #indianbrands #brandingindia$$, $$A: "Tanishq Failed for Years. The Jewellery Was Excellent. The Brand Was the Problem."
B: "In India, trust has a visual language. If your brand doesn't speak it, the product doesn't get evaluated."
C: "Same jewellery. Different brand. Different India."$$);
INSERT INTO content_scripts (source_id, script_code, title, hook, script_body, content_type, theme, caption_notes, thumbnail_headline) VALUES ('11111111-1111-1111-1111-111111111111', 'IN-04', $$A Manufacturer from Rajasthan Now Sells to Luxury Hotels in New York. One Thing Changed.$$, $$$$, $$**INSIGHT**


**REFRAME**


**CLOSE**
$$, 'deep_reel', $$Jaipur Rugs · B2B Export Brand Building · Deep Reel$$, $$Jaipur Rugs had a product that could sit in a luxury hotel in Manhattan. For years, it sat in a wholesaler's warehouse instead, negotiated down on every order. What changed wasn't the craft — it was the decision to sell the story directly. The weaver's name. The village. The months of work. The product gained a meaning that made price comparison irrelevant. Every Indian manufacturer has this choice.
#bbmh #beanbagmediahouse #jaipurrugs #indianmanufacturing #exportbranding$$, $$A: "Jaipur to New York. Same Craft. Different Brand. Different Buyers."
B: "How a Rajasthan manufacturer escaped price negotiations by changing what they were actually selling."
C: "The product didn't change. The story did. That changed everything."$$);
INSERT INTO content_scripts (source_id, script_code, title, hook, script_body, content_type, theme, caption_notes, thumbnail_headline) VALUES ('11111111-1111-1111-1111-111111111111', 'IN-05', $$The Gap Between Rs 80 and Rs 1200 Is a Brand Decision.$$, $$$$, $$**INSIGHT**


**REFRAME**


**CLOSE**
$$, 'deep_reel', $$Forest Essentials vs Himalaya · Heritage Made Visible · Deep Reel$$, $$Himalaya says: here is a product. Forest Essentials says: here is a world — ancient, intentional, documented in gold packaging and Sanskrit labels that make you feel the depth before you open the bottle. Both companies have access to the same heritage. Only one has built a brand that surfaces it visibly. That gap is not a product gap. It is entirely a brand decision.
#bbmh #beanbagmediahouse #forestessentials #indianbrands #luxurybranding$$, $$A: "Forest Essentials: Rs 1200. Himalaya: Rs 80. Both Ayurvedic. One Difference."
B: "5000 years of the same heritage. Only one brand is making it visible — and charging accordingly."
C: "The gap between Rs 80 and Rs 1200 isn't a product gap. It's entirely a brand decision."$$);
INSERT INTO content_scripts (source_id, script_code, title, hook, script_body, content_type, theme, caption_notes, thumbnail_headline) VALUES ('11111111-1111-1111-1111-111111111111', 'W-01', $$Your Website Is Working Right Now. The Question Is Which Direction.$$, $$$$, $$**INSIGHT**


**REFRAME**


**CLOSE**
$$, 'deep_reel', $$Website as Trust Builder or Trust Leak · Direct Address · Deep Reel$$, $$Your website is the only member of your team who works 24 hours a day, 7 days a week, without you present to explain anything. Most business owners have never seen their own website the way a first-time visitor sees it — without the context of knowing what's behind it. That view is the only one that counts. Do the phone test. Right now.
#bbmh #beanbagmediahouse #websitedesign #b2bwebsite #framerwebsite$$, $$A: "Your Website Is Working Right Now. The Question Is Which Direction."
B: "Open your company website on your phone. Time how long it loads. What does a stranger decide in those 8 seconds?"
C: "The only member of your team who works 24/7 without you — and most businesses have never briefed it properly."$$);
INSERT INTO content_scripts (source_id, script_code, title, hook, script_body, content_type, theme, caption_notes, thumbnail_headline) VALUES ('11111111-1111-1111-1111-111111111111', 'W-02', $$Design for Where You're Going. Not Where You Started.$$, $$$$, $$**INSIGHT**


**REFRAME**


**CLOSE**
$$, 'deep_reel', $$Logo Scale and System · Visual Identity · Direct Challenge$$, $$A logo isn't a fixed image. It's a system that needs to work at 16 pixels and at 16 feet simultaneously. Most small business logos were designed once, for one context, and never tested beyond it. The moment the business grows beyond that context — trade fairs, export catalogs, corporate tenders — the logo is already failing. Scale is not an afterthought in logo design. It's the entire brief.
#bbmh #beanbagmediahouse #logodesign #brandidentity #brandingindia$$, $$A: "Pull Your Logo Up as a WhatsApp DP. Then as a 3-Metre Banner. Tell Me How It Holds Up."
B: "Your logo was designed for a visiting card. It breaks everywhere else."
C: "A logo needs to work at 16 pixels and 16 feet. Most small business logos work at neither."$$);
INSERT INTO content_scripts (source_id, script_code, title, hook, script_body, content_type, theme, caption_notes, thumbnail_headline) VALUES ('11111111-1111-1111-1111-111111111111', 'W-03', $$Your Website Makes Perfect Sense to You. That's the Problem.$$, $$$$, $$**INSIGHT**


**REFRAME**


**CLOSE**
$$, 'deep_reel', $$Website Written for the Owner Not the Buyer · New Script · Deep Reel$$, $$You wrote your website knowing everything about your business. Your buyer arrives knowing nothing. They need to understand in 8 seconds what you do, who it's for, and why it matters to them. Most B2B homepages answer none of those questions — because they were written by someone who already knew the answers. Rewrite it for the person who doesn't.
#bbmh #beanbagmediahouse #websitedesign #b2bwebsite #uxdesign$$, $$A: "Your Website Makes Perfect Sense to You. That's Exactly the Problem."
B: "The homepage that explains everything to the owner and nothing to the buyer."
C: "A website written for the owner is a brochure. A website written for the buyer is a sales tool."$$);
INSERT INTO content_scripts (source_id, script_code, title, hook, script_body, content_type, theme, caption_notes, thumbnail_headline) VALUES ('11111111-1111-1111-1111-111111111111', 'W-04', $$The Version of Your Website Most Buyers See First Was Never Designed.$$, $$$$, $$**INSIGHT**


**REFRAME**


**CLOSE**
$$, 'deep_reel', $$Mobile vs Desktop · The Invisible First Impression · Deep Reel$$, $$Most B2B websites were designed on a laptop and optimised for a laptop. Most buyers discover new vendors on their phone. The version they see first — slightly misaligned, requiring zooming, with a contact button that barely works on a thumb — is the one making the first impression. That impression was never designed. It just happened. That's a fixable problem.
#bbmh #beanbagmediahouse #websitedesign #mobiledesign #b2bwebsite$$, $$A: "Your Website Looks Great on Your Laptop. It's Breaking on the Device Your Buyer Uses First."
B: "Most B2B buyers check a new vendor on their phone. Does yours hold up in 8 seconds?"
C: "The invisible version of your website — the one that most buyers see first, that was never designed."$$);
INSERT INTO content_scripts (source_id, script_code, title, hook, script_body, content_type, theme, caption_notes, thumbnail_headline) VALUES ('11111111-1111-1111-1111-111111111111', 'L-01', $$First Impressions Are Made Before You're in the Room.$$, $$$$, $$**INSIGHT**


**REFRAME**


**CLOSE**
$$, 'deep_reel', $$What a Logo Communicates in One Second · New Script · Deep Reel$$, $$The logo on your email header, your visiting card, your brochure — it makes a statement before a single word is read. That statement is either: this company operates at a certain level. Or it quietly creates doubt. Most business owners have never asked the honest question: what does mine actually communicate to someone who has never heard of us before today?
#bbmh #beanbagmediahouse #logodesign #brandidentity #b2bbranding$$, $$A: "Your Logo Is Already Saying Something. The Question Is Whether You Designed What It Says."
B: "Before the meeting. Before the proposal. Before anything. Your logo already spoke."
C: "First impressions are made before you're in the room. Is yours working for you or against you?"$$);
INSERT INTO content_scripts (source_id, script_code, title, hook, script_body, content_type, theme, caption_notes, thumbnail_headline) VALUES ('11111111-1111-1111-1111-111111111111', 'L-02', $$You Don't Have a Logo. You Have a Logo Image. There's a Difference.$$, $$$$, $$**INSIGHT**


**REFRAME**


**CLOSE**
$$, 'deep_reel', $$Logo as System Not Image · Visual Identity · Deep Reel$$, $$A logo image is a file. A logo system is a set of rules for how that mark behaves at every size, in every colour, on every surface. Without the system, every person who touches your brand makes a different decision. That's why your visiting card, website, proposal, and trade fair stall all look like they belong to slightly different companies. The inconsistency wasn't careless. It was never designed.
#bbmh #beanbagmediahouse #logodesign #brandidentity #visualsystem$$, $$A: "You Don't Have a Logo. You Have a Logo Image. There's a Significant Difference."
B: "Your visiting card, website, and banner all look slightly different. This is why."
C: "A logo image is a file. A logo system is what makes a brand look like one company everywhere it appears."$$);
INSERT INTO content_scripts (source_id, script_code, title, hook, script_body, content_type, theme, caption_notes, thumbnail_headline) VALUES ('11111111-1111-1111-1111-111111111111', 'S-01', $$Your Visiting Card Is Still in Their Pocket. Your Website Visit Lasted 11 Seconds.$$, $$$$, $$**INSIGHT**


**REFRAME**


**CLOSE**
$$, 'deep_reel', $$Physical vs Digital Brand Permanence · Surprise · Deep Reel$$, $$Digital impressions disappear. Physical ones stay. A well-designed visiting card sits on desks, goes through trouser pockets, gets found months later — and every time it reappears, it makes the same impression. Most businesses invest more in the digital and less in the physical. But in B2B, the physical pieces are doing your selling in the quiet moments between decisions — when you're not there to explain anything.
#bbmh #beanbagmediahouse #visitingcard #b2bbranding #branddesign$$, $$A: "Your Visiting Card Is Still in Their Pocket. Your Website Visit Lasted 11 Seconds."
B: "The brand touchpoints that stay with buyers the longest are the ones most businesses invest in least."
C: "Digital disappears. Physical stays. Design accordingly."$$);
INSERT INTO content_scripts (source_id, script_code, title, hook, script_body, content_type, theme, caption_notes, thumbnail_headline) VALUES ('11111111-1111-1111-1111-111111111111', 'S-02', $$The Business Winning Your Deals Probably Has a Weaker Product.$$, $$$$, $$**INSIGHT**


**REFRAME**


**CLOSE**
$$, 'deep_reel', $$Visual Credibility Over Product Quality · Provocation · Deep Reel$$, $$In a competitive vendor evaluation, buyers can't test product quality before committing. What they can evaluate immediately — without any expertise — is visual credibility. The website, the proposal, the catalog. These become proxies for quality and reliability. A competitor who looks more organised is perceived as lower risk. And in B2B, lower perceived risk wins. The product is already good enough. Fix the evidence.
#bbmh #beanbagmediahouse #b2bsales #brandcredibility #visualidentity$$, $$A: "The Business Beating You Probably Has a Worse Product. Here's Why It's Still Winning."
B: "Your product is better. Their brand looks better. That's why they're winning."
C: "In a competitive evaluation, the most credible-looking option wins. Not always the best one."$$);
INSERT INTO content_scripts (source_id, script_code, title, hook, script_body, content_type, theme, caption_notes, thumbnail_headline) VALUES ('11111111-1111-1111-1111-111111111111', 'S-03', $$Make the Website as Impressive as the Factory Tour. That's All It Has to Do.$$, $$$$, $$**INSIGHT**


**REFRAME**


**CLOSE**
$$, 'deep_reel', $$Factory Tour vs Website Mismatch · Observation · Deep Reel$$, $$We hear this from client after client. The factory visit closes deals — quality is visible the moment someone walks in. But the website that has to create enough confidence for that visit to happen communicates none of it. Your best asset is locked behind a first impression that isn't working. Make the website as impressive as the tour. That's the whole brief.
#bbmh #beanbagmediahouse #b2bbranding #websitedesign #manufacturingbrand$$, $$A: "Your Factory Impresses Every Visitor. Your Website Sends Almost None of Them There."
B: "The factory tour is your best sales tool. The website is what has to earn it. Is it?"
C: "Level 1 is the website. Level 3 is the factory. Most buyers never make it past Level 1."$$);
INSERT INTO content_scripts (source_id, script_code, title, hook, script_body, content_type, theme, caption_notes, thumbnail_headline) VALUES ('11111111-1111-1111-1111-111111111111', 'S-04', $$The Most Important Brand Touchpoints Are the Ones Nobody Thinks of as Brand Touchpoints.$$, $$$$, $$**INSIGHT**


**REFRAME**


**CLOSE**
$$, 'deep_reel', $$WhatsApp as Brand Touchpoint · India-specific · Deep Reel$$, $$In India, business moves on WhatsApp. New enquiries, trade fair follow-ups, supply chain negotiations — all of it happens there before the formal conversation begins. And in every one of those exchanges, the first thing the buyer sees is your profile picture. Most businesses manage the formal brand touchpoints and ignore the informal ones entirely. In India, the informal ones are where the decision starts.
#bbmh #beanbagmediahouse #brandingindia #b2bbranding #digitalbranding$$, $$A: "Your Company WhatsApp Profile Picture Is a Business Decision You've Never Made."
B: "In India, business happens on WhatsApp. Is your brand ready for where business actually happens?"
C: "The brand touchpoints most businesses ignore are the ones Indian buyers judge you on first."$$);
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES ('22222222-2222-2222-2222-222222222222', 'M-01', 'Mirror M-01', $$Most B2B businesses have spent years getting the product right and about three days getting the brand right. The price negotiation shows it every time.
*[pause]*
The product was never the problem.$$, 'mirror');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES ('22222222-2222-2222-2222-222222222222', 'M-02', 'Mirror M-02', $$There's a version of your business that has been live on the internet for years. You've never seen it the way a first-time buyer does. That view is the one that counts.$$, 'mirror');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES ('22222222-2222-2222-2222-222222222222', 'M-03', 'Mirror M-03', $$Your best salesperson has a deck, a pitch, a follow-up sequence. Your brand — the thing that runs ahead of your salesperson into every room — has none of that. It just shows up and says whatever it says.$$, 'mirror');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES ('22222222-2222-2222-2222-222222222222', 'M-04', 'Mirror M-04', $$The business that wins the deal isn't always the best. It's the one that looked most ready to deliver before anyone checked.
*[pause]*
That's not unfair. That's just how buyers manage risk.$$, 'mirror');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES ('22222222-2222-2222-2222-222222222222', 'M-05', 'Mirror M-05', $$You'd notice immediately if your factory floor looked like your competitor's. You've probably never noticed that your website does.$$, 'mirror');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES ('22222222-2222-2222-2222-222222222222', 'M-06', 'Mirror M-06', $$Your oldest client doesn't know what your website looks like. Your newest prospect made a decision based on nothing else.
*[pause]*
Those two things are connected.$$, 'mirror');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES ('22222222-2222-2222-2222-222222222222', 'M-07', 'Mirror M-07', $$Most business owners can describe in detail what they make. Almost none of them can finish this sentence cleanly: we are this, for this person, and here's why only we do it this way.
*[pause]*
That's not a product problem. That's a brand problem.$$, 'mirror');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES ('22222222-2222-2222-2222-222222222222', 'M-08', 'Mirror M-08', $$You spent six months getting the product right. Your competitor spent six months getting the brand right. The buyer can't tell the difference between the two until they've already chosen one of you.$$, 'mirror');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES ('22222222-2222-2222-2222-222222222222', 'M-09', 'Mirror M-09', $$A buyer who finds you through a referral already trusts you. A buyer who finds you through Google trusts nothing. Your website is the only difference between those two conversations — and most businesses have written it for the first person, not the second.$$, 'mirror');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES ('22222222-2222-2222-2222-222222222222', 'M-10', 'Mirror M-10', $$Premium pricing isn't something you decide at the quoting stage. It's built — or not built — long before the buyer asks for a number.$$, 'mirror');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES ('22222222-2222-2222-2222-222222222222', 'M-11', 'Mirror M-11', $$Most Indian family businesses are running on a brand that was designed for the market they were in ten years ago. The market changed. The brand didn't get the message.$$, 'mirror');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES ('22222222-2222-2222-2222-222222222222', 'M-12', 'Mirror M-12', $$The brand inconsistency that buyers notice isn't the big stuff. It's the three slightly different logos. The two different fonts on the same proposal. The website colour that doesn't match the visiting card. Small things. That together say: this company doesn't have its house in order.$$, 'mirror');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES ('22222222-2222-2222-2222-222222222222', 'Q-01', 'Question Q-01', $$When did you last open your own website on your phone as if you'd never heard of the company?$$, 'question');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES ('22222222-2222-2222-2222-222222222222', 'Q-02', 'Question Q-02', $$If a buyer who had never heard of you Googled your company name right now — what would they find? And would it be enough?$$, 'question');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES ('22222222-2222-2222-2222-222222222222', 'Q-03', 'Question Q-03', $$Does your logo work in black and white? Have you checked?$$, 'question');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES ('22222222-2222-2222-2222-222222222222', 'Q-04', 'Question Q-04', $$Can you describe what your brand communicates in one sentence — without mentioning the product?$$, 'question');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES ('22222222-2222-2222-2222-222222222222', 'Q-05', 'Question Q-05', $$Has your brand evolved since your business did?$$, 'question');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES ('22222222-2222-2222-2222-222222222222', 'Q-06', 'Question Q-06', $$Your best client would recommend you enthusiastically. Would the brand they find when they look you up hold up to that recommendation?$$, 'question');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES ('22222222-2222-2222-2222-222222222222', 'Q-07', 'Question Q-07', $$If you sent your own visiting card to the client you most want to win — would you feel proud or slightly apologetic about it?$$, 'question');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES ('22222222-2222-2222-2222-222222222222', 'Q-08', 'Question Q-08', $$What does your email signature say about your company to someone who has never heard of you?$$, 'question');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES ('22222222-2222-2222-2222-222222222222', 'Q-09', 'Question Q-09', $$Is the first thing a buyer finds about your business better or worse than the first thing they'd find about your best competitor?$$, 'question');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES ('22222222-2222-2222-2222-222222222222', 'Q-10', 'Question Q-10', $$You know exactly what makes your product better than the competition. Does your brand communicate any of it before the conversation starts?$$, 'question');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES ('22222222-2222-2222-2222-222222222222', 'Q-11', 'Question Q-11', $$If you had to describe your ideal client and they had to describe their ideal vendor — would each description fit the other?$$, 'question');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES ('22222222-2222-2222-2222-222222222222', 'Q-12', 'Question Q-12', $$The last deal you lost on price — are you certain it was actually about price?$$, 'question');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES ('22222222-2222-2222-2222-222222222222', 'C-01', $$The Visiting Card$$, $$Show: Two visiting cards, same industry (manufacturing, export, textile — pick your BBMh client archetype)
Version A: Generic font, crowded, clip-art logo, no visual hierarchy
Version B: Clean, weighted, considered typography, strong mark
Text line: "Both people left the same meeting. One got called back."$$, 'contrast');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES ('22222222-2222-2222-2222-222222222222', 'C-02', $$The Email Signature$$, $$Show: Two email signature screenshots
Version A: Plain text, Gmail address, no logo, no designation clarity
Version B: Logo, company domain, clean layout, one visual accent
Text line: "This is the first thing they see before they read your email."$$, 'contrast');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES ('22222222-2222-2222-2222-222222222222', 'C-03', $$The Logo at Scale$$, $$Show: Same logo (or two comparable logos) at three sizes — WhatsApp DP, visiting card, banner
Version A: Breaks at small size, illegible at large, inconsistent weights
Version B: Holds at all three sizes, readable, intentional
Text line: "A logo needs to work here, here, and here. Most work at only one."$$, 'contrast');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES ('22222222-2222-2222-2222-222222222222', 'C-04', $$The Website on Mobile$$, $$Show: Screen recording — same type of business, two different mobile websites
Version A: Misaligned, requires zooming, contact button hard to reach
Version B: Clean, fast loading, clear CTA, works with a thumb
Text line: "This is how most buyers see you first."$$, 'contrast');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES ('22222222-2222-2222-2222-222222222222', 'C-05', $$The Proposal Cover$$, $$Show: Two proposal cover pages
Version A: Word document, clip-art border, inconsistent fonts, no visual hierarchy
Version B: Designed PDF, brand colours, considered layout, company logo properly placed
Text line: "Before they read a single word."$$, 'contrast');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES ('22222222-2222-2222-2222-222222222222', 'C-06', $$The Trade Fair Stall$$, $$Show: Two trade fair or exhibition stall setups (can be illustrated or reference images)
Version A: Mismatched banners, too much text, no clear visual identity
Version B: Unified brand across every piece, clean messaging, designed materials
Text line: "Same industry. Same product. Different shortlist."$$, 'contrast');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES ('22222222-2222-2222-2222-222222222222', 'C-07', $$The Catalog Cover$$, $$Show: Two product catalog covers for the same industry
Version A: Text-heavy, photo quality inconsistent, no design grid
Version B: Editorial photography, considered layout, brand consistent
Text line: "The buyer doesn't know your product yet. This is all they have."$$, 'contrast');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES ('22222222-2222-2222-2222-222222222222', 'C-08', $$The Google Search Result$$, $$Show: Two Google search result screenshots for two similar business names
Version A: No website, no Google Business listing, nothing but a phone directory entry
Version B: Clean website snippet, Google Business listing, reviews, some presence
Text line: "This is the due diligence. 90 seconds. Already decided."$$, 'contrast');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES ('22222222-2222-2222-2222-222222222222', 'C-09', $$The Three Logo Problem$$, $$Show: Three slightly different versions of "the same" logo — different weights, different colours, different files used across different materials
Text line: "Which one is the real you? Your buyers are asking the same question."$$, 'contrast');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES ('22222222-2222-2222-2222-222222222222', 'C-10', $$The Brand Before/After$$, $$Show: BBMh actual client work — before the rebrand and after
No labels. No explanation. Just the transformation.
Text line: "Same business. Different conversation."
*(This one is BBMh's portfolio in motion. Strong CTA post.)*$$, 'contrast');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES ('22222222-2222-2222-2222-222222222222', 'C-11', $$The Font Problem$$, $$Show: Same company name written in five different fonts across five different touchpoints (card, website header, brochure, proposal, social bio)
Text line: "Consistency is a trust signal. This is what inconsistency looks like to a buyer."$$, 'contrast');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES ('22222222-2222-2222-2222-222222222222', 'C-12', $$The Homepage First Impression$$, $$Show: Two homepages — first fold only, no scrolling
Version A: Generic hero image, vague headline like "Solutions for Your Business"
Version B: Specific headline, clear offering, visual identity immediately readable
Text line: "8 seconds. This is the entire decision."$$, 'contrast');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES ('22222222-2222-2222-2222-222222222222', 'F-01', 'Frame F-01', $$Your brand is working 24 hours a day.
The question is what it's saying.$$, 'frame');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES ('22222222-2222-2222-2222-222222222222', 'F-02', 'Frame F-02', $$The buyer who didn't call you back already knew what they needed to know.
They got it from your website.$$, 'frame');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES ('22222222-2222-2222-2222-222222222222', 'F-03', 'Frame F-03', $$Cheap looks expensive to make.
Premium looks cheap to fake.
One of those is you.$$, 'frame');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES ('22222222-2222-2222-2222-222222222222', 'F-04', 'Frame F-04', $$Most B2B brands were designed for the visiting card and left there.$$, 'frame');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES ('22222222-2222-2222-2222-222222222222', 'F-05', 'Frame F-05', $$Your product earned the premium.
Your brand didn't get the message.$$, 'frame');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES ('22222222-2222-2222-2222-222222222222', 'F-06', 'Frame F-06', $$The business that looks more ready gets the meeting.
The meeting is where you prove the product.
You're not getting the meeting.$$, 'frame');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES ('22222222-2222-2222-2222-222222222222', 'F-07', 'Frame F-07', $$There's no such thing as too small to have a brand.
There's only too small to ignore not having one.$$, 'frame');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES ('22222222-2222-2222-2222-222222222222', 'F-08', 'Frame F-08', $$Your referral network knows you.
Everyone else only has your website.
Fix the thing the everyone else sees.$$, 'frame');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES ('22222222-2222-2222-2222-222222222222', 'F-09', 'Frame F-09', $$A logo that works on a visiting card is not enough.
It's a starting point that most businesses mistake for the finish line.$$, 'frame');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES ('22222222-2222-2222-2222-222222222222', 'F-10', 'Frame F-10', $$Consistency is a trust signal.
Your three different logos are a distrust signal.$$, 'frame');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES ('22222222-2222-2222-2222-222222222222', 'F-11', 'Frame F-11', $$The deal doesn't start when you pitch.
It starts when they Google you.$$, 'frame');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES ('22222222-2222-2222-2222-222222222222', 'F-12', 'Frame F-12', $$Heritage that isn't visible doesn't count.
You have the heritage.
Surface it.$$, 'frame');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES ('22222222-2222-2222-2222-222222222222', 'F-13', 'Frame F-13', $$Your brand isn't what you say you are.
It's what a stranger finds when they look you up.$$, 'frame');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES ('22222222-2222-2222-2222-222222222222', 'F-14', 'Frame F-14', $$Modernising a brand and genericising a brand are not the same thing.
Most rebrands do the second by accident.$$, 'frame');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES ('22222222-2222-2222-2222-222222222222', 'F-15', 'Frame F-15', $$Price negotiation starts before the quote is sent.
It starts the moment the buyer forms an opinion about your business.
That opinion is formed by what they see.$$, 'frame');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES ('22222222-2222-2222-2222-222222222222', 'F-16', 'Frame F-16', $$The best version of your business exists.
It lives in your factory, your team, your work.
Your brand is the only thing that makes it visible to people who haven't met you yet.$$, 'frame');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES ('22222222-2222-2222-2222-222222222222', 'F-17', 'Frame F-17', $$Your competitor is charging more.
For the same product.
And winning.
The product is not the variable.$$, 'frame');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES ('22222222-2222-2222-2222-222222222222', 'F-18', 'Frame F-18', $$B2B buyers are not rational evaluators.
They are humans who need a reason to feel safe.
Your brand is that reason — or it isn't.$$, 'frame');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES ('22222222-2222-2222-2222-222222222222', 'F-19', 'Frame F-19', $$You built something real.
The brand's job is to make sure the right people know it.$$, 'frame');
INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES ('22222222-2222-2222-2222-222222222222', 'F-20', 'Frame F-20', $$Every touchpoint is either building trust or leaking it.
There is no neutral.$$, 'frame');

-- FLOW
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

-- CALENDAR
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('June 2026', '2026-06-01', 'Monday', 1, 'deep_reel', (SELECT title FROM content_scripts WHERE script_code = 'T-01'), (SELECT id FROM content_scripts WHERE script_code = 'T-01'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('June 2026', '2026-06-03', 'Wednesday', 2, 'carousel', $$Carousel: T-01 Insights$$, (SELECT id FROM content_scripts WHERE script_code = 'T-01'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('June 2026', '2026-06-05', 'Friday', 3, 'mirror', (SELECT title FROM content_scripts WHERE script_code = 'M-01'), (SELECT id FROM content_scripts WHERE script_code = 'M-01'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('June 2026', '2026-06-07', 'Sunday', 4, 'question', (SELECT title FROM content_scripts WHERE script_code = 'Q-01'), (SELECT id FROM content_scripts WHERE script_code = 'Q-01'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('June 2026', '2026-06-08', 'Monday', 5, 'deep_reel', (SELECT title FROM content_scripts WHERE script_code = 'T-02'), (SELECT id FROM content_scripts WHERE script_code = 'T-02'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('June 2026', '2026-06-10', 'Wednesday', 6, 'carousel', $$Carousel: T-02 Insights$$, (SELECT id FROM content_scripts WHERE script_code = 'T-02'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('June 2026', '2026-06-12', 'Friday', 7, 'mirror', (SELECT title FROM content_scripts WHERE script_code = 'M-02'), (SELECT id FROM content_scripts WHERE script_code = 'M-02'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('June 2026', '2026-06-14', 'Sunday', 8, 'question', (SELECT title FROM content_scripts WHERE script_code = 'Q-02'), (SELECT id FROM content_scripts WHERE script_code = 'Q-02'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('June 2026', '2026-06-15', 'Monday', 9, 'deep_reel', (SELECT title FROM content_scripts WHERE script_code = 'T-03'), (SELECT id FROM content_scripts WHERE script_code = 'T-03'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('June 2026', '2026-06-17', 'Wednesday', 10, 'carousel', $$Carousel: T-03 Insights$$, (SELECT id FROM content_scripts WHERE script_code = 'T-03'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('June 2026', '2026-06-19', 'Friday', 11, 'mirror', (SELECT title FROM content_scripts WHERE script_code = 'M-03'), (SELECT id FROM content_scripts WHERE script_code = 'M-03'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('June 2026', '2026-06-21', 'Sunday', 12, 'question', (SELECT title FROM content_scripts WHERE script_code = 'Q-03'), (SELECT id FROM content_scripts WHERE script_code = 'Q-03'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('June 2026', '2026-06-22', 'Monday', 13, 'deep_reel', (SELECT title FROM content_scripts WHERE script_code = 'T-04'), (SELECT id FROM content_scripts WHERE script_code = 'T-04'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('June 2026', '2026-06-24', 'Wednesday', 14, 'carousel', $$Carousel: T-04 Insights$$, (SELECT id FROM content_scripts WHERE script_code = 'T-04'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('June 2026', '2026-06-26', 'Friday', 15, 'mirror', (SELECT title FROM content_scripts WHERE script_code = 'M-04'), (SELECT id FROM content_scripts WHERE script_code = 'M-04'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('June 2026', '2026-06-28', 'Sunday', 16, 'question', (SELECT title FROM content_scripts WHERE script_code = 'Q-04'), (SELECT id FROM content_scripts WHERE script_code = 'Q-04'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('June 2026', '2026-06-29', 'Monday', 17, 'deep_reel', (SELECT title FROM content_scripts WHERE script_code = 'T-05'), (SELECT id FROM content_scripts WHERE script_code = 'T-05'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('July 2026', '2026-07-01', 'Wednesday', 18, 'carousel', $$Carousel: T-05 Insights$$, (SELECT id FROM content_scripts WHERE script_code = 'T-05'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('July 2026', '2026-07-03', 'Friday', 19, 'mirror', (SELECT title FROM content_scripts WHERE script_code = 'M-05'), (SELECT id FROM content_scripts WHERE script_code = 'M-05'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('July 2026', '2026-07-05', 'Sunday', 20, 'question', (SELECT title FROM content_scripts WHERE script_code = 'Q-05'), (SELECT id FROM content_scripts WHERE script_code = 'Q-05'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('July 2026', '2026-07-06', 'Monday', 21, 'deep_reel', (SELECT title FROM content_scripts WHERE script_code = 'T-06'), (SELECT id FROM content_scripts WHERE script_code = 'T-06'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('July 2026', '2026-07-08', 'Wednesday', 22, 'carousel', $$Carousel: T-06 Insights$$, (SELECT id FROM content_scripts WHERE script_code = 'T-06'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('July 2026', '2026-07-10', 'Friday', 23, 'mirror', (SELECT title FROM content_scripts WHERE script_code = 'M-06'), (SELECT id FROM content_scripts WHERE script_code = 'M-06'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('July 2026', '2026-07-12', 'Sunday', 24, 'question', (SELECT title FROM content_scripts WHERE script_code = 'Q-06'), (SELECT id FROM content_scripts WHERE script_code = 'Q-06'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('July 2026', '2026-07-13', 'Monday', 25, 'deep_reel', (SELECT title FROM content_scripts WHERE script_code = 'T-07'), (SELECT id FROM content_scripts WHERE script_code = 'T-07'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('July 2026', '2026-07-15', 'Wednesday', 26, 'carousel', $$Carousel: T-07 Insights$$, (SELECT id FROM content_scripts WHERE script_code = 'T-07'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('July 2026', '2026-07-17', 'Friday', 27, 'mirror', (SELECT title FROM content_scripts WHERE script_code = 'M-07'), (SELECT id FROM content_scripts WHERE script_code = 'M-07'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('July 2026', '2026-07-19', 'Sunday', 28, 'question', (SELECT title FROM content_scripts WHERE script_code = 'Q-07'), (SELECT id FROM content_scripts WHERE script_code = 'Q-07'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('July 2026', '2026-07-20', 'Monday', 29, 'deep_reel', (SELECT title FROM content_scripts WHERE script_code = 'T-08'), (SELECT id FROM content_scripts WHERE script_code = 'T-08'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('July 2026', '2026-07-22', 'Wednesday', 30, 'carousel', $$Carousel: T-08 Insights$$, (SELECT id FROM content_scripts WHERE script_code = 'T-08'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('July 2026', '2026-07-24', 'Friday', 31, 'mirror', (SELECT title FROM content_scripts WHERE script_code = 'M-08'), (SELECT id FROM content_scripts WHERE script_code = 'M-08'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('July 2026', '2026-07-26', 'Sunday', 32, 'question', (SELECT title FROM content_scripts WHERE script_code = 'Q-08'), (SELECT id FROM content_scripts WHERE script_code = 'Q-08'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('July 2026', '2026-07-27', 'Monday', 33, 'deep_reel', (SELECT title FROM content_scripts WHERE script_code = 'T-09'), (SELECT id FROM content_scripts WHERE script_code = 'T-09'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('July 2026', '2026-07-29', 'Wednesday', 34, 'carousel', $$Carousel: T-09 Insights$$, (SELECT id FROM content_scripts WHERE script_code = 'T-09'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('July 2026', '2026-07-31', 'Friday', 35, 'mirror', (SELECT title FROM content_scripts WHERE script_code = 'M-09'), (SELECT id FROM content_scripts WHERE script_code = 'M-09'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('August 2026', '2026-08-02', 'Sunday', 36, 'question', (SELECT title FROM content_scripts WHERE script_code = 'Q-09'), (SELECT id FROM content_scripts WHERE script_code = 'Q-09'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('August 2026', '2026-08-03', 'Monday', 37, 'deep_reel', (SELECT title FROM content_scripts WHERE script_code = 'T-10'), (SELECT id FROM content_scripts WHERE script_code = 'T-10'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('August 2026', '2026-08-05', 'Wednesday', 38, 'carousel', $$Carousel: T-10 Insights$$, (SELECT id FROM content_scripts WHERE script_code = 'T-10'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('August 2026', '2026-08-07', 'Friday', 39, 'mirror', (SELECT title FROM content_scripts WHERE script_code = 'M-10'), (SELECT id FROM content_scripts WHERE script_code = 'M-10'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('August 2026', '2026-08-09', 'Sunday', 40, 'question', (SELECT title FROM content_scripts WHERE script_code = 'Q-10'), (SELECT id FROM content_scripts WHERE script_code = 'Q-10'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('August 2026', '2026-08-10', 'Monday', 41, 'deep_reel', (SELECT title FROM content_scripts WHERE script_code = 'T-11'), (SELECT id FROM content_scripts WHERE script_code = 'T-11'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('August 2026', '2026-08-12', 'Wednesday', 42, 'carousel', $$Carousel: T-11 Insights$$, (SELECT id FROM content_scripts WHERE script_code = 'T-11'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('August 2026', '2026-08-14', 'Friday', 43, 'mirror', (SELECT title FROM content_scripts WHERE script_code = 'M-11'), (SELECT id FROM content_scripts WHERE script_code = 'M-11'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('August 2026', '2026-08-16', 'Sunday', 44, 'question', (SELECT title FROM content_scripts WHERE script_code = 'Q-11'), (SELECT id FROM content_scripts WHERE script_code = 'Q-11'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('August 2026', '2026-08-17', 'Monday', 45, 'deep_reel', (SELECT title FROM content_scripts WHERE script_code = 'T-12'), (SELECT id FROM content_scripts WHERE script_code = 'T-12'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('August 2026', '2026-08-19', 'Wednesday', 46, 'carousel', $$Carousel: T-12 Insights$$, (SELECT id FROM content_scripts WHERE script_code = 'T-12'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('August 2026', '2026-08-21', 'Friday', 47, 'mirror', (SELECT title FROM content_scripts WHERE script_code = 'M-12'), (SELECT id FROM content_scripts WHERE script_code = 'M-12'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('August 2026', '2026-08-23', 'Sunday', 48, 'question', (SELECT title FROM content_scripts WHERE script_code = 'Q-12'), (SELECT id FROM content_scripts WHERE script_code = 'Q-12'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('August 2026', '2026-08-24', 'Monday', 49, 'deep_reel', (SELECT title FROM content_scripts WHERE script_code = 'T-13'), (SELECT id FROM content_scripts WHERE script_code = 'T-13'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('August 2026', '2026-08-26', 'Wednesday', 50, 'carousel', $$Carousel: T-13 Insights$$, (SELECT id FROM content_scripts WHERE script_code = 'T-13'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('August 2026', '2026-08-28', 'Friday', 51, 'mirror', (SELECT title FROM content_scripts WHERE script_code = 'M-01'), (SELECT id FROM content_scripts WHERE script_code = 'M-01'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('August 2026', '2026-08-30', 'Sunday', 52, 'question', (SELECT title FROM content_scripts WHERE script_code = 'Q-01'), (SELECT id FROM content_scripts WHERE script_code = 'Q-01'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('August 2026', '2026-08-31', 'Monday', 53, 'deep_reel', (SELECT title FROM content_scripts WHERE script_code = 'T-14'), (SELECT id FROM content_scripts WHERE script_code = 'T-14'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('September 2026', '2026-09-02', 'Wednesday', 54, 'carousel', $$Carousel: T-14 Insights$$, (SELECT id FROM content_scripts WHERE script_code = 'T-14'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('September 2026', '2026-09-04', 'Friday', 55, 'mirror', (SELECT title FROM content_scripts WHERE script_code = 'M-02'), (SELECT id FROM content_scripts WHERE script_code = 'M-02'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('September 2026', '2026-09-06', 'Sunday', 56, 'question', (SELECT title FROM content_scripts WHERE script_code = 'Q-02'), (SELECT id FROM content_scripts WHERE script_code = 'Q-02'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('September 2026', '2026-09-07', 'Monday', 57, 'deep_reel', (SELECT title FROM content_scripts WHERE script_code = 'T-15'), (SELECT id FROM content_scripts WHERE script_code = 'T-15'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('September 2026', '2026-09-09', 'Wednesday', 58, 'carousel', $$Carousel: T-15 Insights$$, (SELECT id FROM content_scripts WHERE script_code = 'T-15'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('September 2026', '2026-09-11', 'Friday', 59, 'mirror', (SELECT title FROM content_scripts WHERE script_code = 'M-03'), (SELECT id FROM content_scripts WHERE script_code = 'M-03'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('September 2026', '2026-09-13', 'Sunday', 60, 'question', (SELECT title FROM content_scripts WHERE script_code = 'Q-03'), (SELECT id FROM content_scripts WHERE script_code = 'Q-03'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('September 2026', '2026-09-14', 'Monday', 61, 'deep_reel', (SELECT title FROM content_scripts WHERE script_code = 'T-01'), (SELECT id FROM content_scripts WHERE script_code = 'T-01'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('September 2026', '2026-09-16', 'Wednesday', 62, 'carousel', $$Carousel: T-01 Insights$$, (SELECT id FROM content_scripts WHERE script_code = 'T-01'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('September 2026', '2026-09-18', 'Friday', 63, 'mirror', (SELECT title FROM content_scripts WHERE script_code = 'M-04'), (SELECT id FROM content_scripts WHERE script_code = 'M-04'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('September 2026', '2026-09-20', 'Sunday', 64, 'question', (SELECT title FROM content_scripts WHERE script_code = 'Q-04'), (SELECT id FROM content_scripts WHERE script_code = 'Q-04'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('September 2026', '2026-09-21', 'Monday', 65, 'deep_reel', (SELECT title FROM content_scripts WHERE script_code = 'T-02'), (SELECT id FROM content_scripts WHERE script_code = 'T-02'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('September 2026', '2026-09-23', 'Wednesday', 66, 'carousel', $$Carousel: T-02 Insights$$, (SELECT id FROM content_scripts WHERE script_code = 'T-02'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('September 2026', '2026-09-25', 'Friday', 67, 'mirror', (SELECT title FROM content_scripts WHERE script_code = 'M-05'), (SELECT id FROM content_scripts WHERE script_code = 'M-05'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('September 2026', '2026-09-27', 'Sunday', 68, 'question', (SELECT title FROM content_scripts WHERE script_code = 'Q-05'), (SELECT id FROM content_scripts WHERE script_code = 'Q-05'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('September 2026', '2026-09-28', 'Monday', 69, 'deep_reel', (SELECT title FROM content_scripts WHERE script_code = 'T-03'), (SELECT id FROM content_scripts WHERE script_code = 'T-03'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('September 2026', '2026-09-30', 'Wednesday', 70, 'carousel', $$Carousel: T-03 Insights$$, (SELECT id FROM content_scripts WHERE script_code = 'T-03'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('October 2026', '2026-10-02', 'Friday', 71, 'mirror', (SELECT title FROM content_scripts WHERE script_code = 'M-06'), (SELECT id FROM content_scripts WHERE script_code = 'M-06'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('October 2026', '2026-10-04', 'Sunday', 72, 'question', (SELECT title FROM content_scripts WHERE script_code = 'Q-06'), (SELECT id FROM content_scripts WHERE script_code = 'Q-06'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('October 2026', '2026-10-05', 'Monday', 73, 'deep_reel', (SELECT title FROM content_scripts WHERE script_code = 'T-04'), (SELECT id FROM content_scripts WHERE script_code = 'T-04'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('October 2026', '2026-10-07', 'Wednesday', 74, 'carousel', $$Carousel: T-04 Insights$$, (SELECT id FROM content_scripts WHERE script_code = 'T-04'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('October 2026', '2026-10-09', 'Friday', 75, 'mirror', (SELECT title FROM content_scripts WHERE script_code = 'M-07'), (SELECT id FROM content_scripts WHERE script_code = 'M-07'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('October 2026', '2026-10-11', 'Sunday', 76, 'question', (SELECT title FROM content_scripts WHERE script_code = 'Q-07'), (SELECT id FROM content_scripts WHERE script_code = 'Q-07'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('October 2026', '2026-10-12', 'Monday', 77, 'deep_reel', (SELECT title FROM content_scripts WHERE script_code = 'T-05'), (SELECT id FROM content_scripts WHERE script_code = 'T-05'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('October 2026', '2026-10-14', 'Wednesday', 78, 'carousel', $$Carousel: T-05 Insights$$, (SELECT id FROM content_scripts WHERE script_code = 'T-05'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('October 2026', '2026-10-16', 'Friday', 79, 'mirror', (SELECT title FROM content_scripts WHERE script_code = 'M-08'), (SELECT id FROM content_scripts WHERE script_code = 'M-08'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('October 2026', '2026-10-18', 'Sunday', 80, 'question', (SELECT title FROM content_scripts WHERE script_code = 'Q-08'), (SELECT id FROM content_scripts WHERE script_code = 'Q-08'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('October 2026', '2026-10-19', 'Monday', 81, 'deep_reel', (SELECT title FROM content_scripts WHERE script_code = 'T-06'), (SELECT id FROM content_scripts WHERE script_code = 'T-06'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('October 2026', '2026-10-21', 'Wednesday', 82, 'carousel', $$Carousel: T-06 Insights$$, (SELECT id FROM content_scripts WHERE script_code = 'T-06'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('October 2026', '2026-10-23', 'Friday', 83, 'mirror', (SELECT title FROM content_scripts WHERE script_code = 'M-09'), (SELECT id FROM content_scripts WHERE script_code = 'M-09'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('October 2026', '2026-10-25', 'Sunday', 84, 'question', (SELECT title FROM content_scripts WHERE script_code = 'Q-09'), (SELECT id FROM content_scripts WHERE script_code = 'Q-09'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('October 2026', '2026-10-26', 'Monday', 85, 'deep_reel', (SELECT title FROM content_scripts WHERE script_code = 'T-07'), (SELECT id FROM content_scripts WHERE script_code = 'T-07'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('October 2026', '2026-10-28', 'Wednesday', 86, 'carousel', $$Carousel: T-07 Insights$$, (SELECT id FROM content_scripts WHERE script_code = 'T-07'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('October 2026', '2026-10-30', 'Friday', 87, 'mirror', (SELECT title FROM content_scripts WHERE script_code = 'M-10'), (SELECT id FROM content_scripts WHERE script_code = 'M-10'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('November 2026', '2026-11-01', 'Sunday', 88, 'question', (SELECT title FROM content_scripts WHERE script_code = 'Q-10'), (SELECT id FROM content_scripts WHERE script_code = 'Q-10'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('November 2026', '2026-11-02', 'Monday', 89, 'deep_reel', (SELECT title FROM content_scripts WHERE script_code = 'T-08'), (SELECT id FROM content_scripts WHERE script_code = 'T-08'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('November 2026', '2026-11-04', 'Wednesday', 90, 'carousel', $$Carousel: T-08 Insights$$, (SELECT id FROM content_scripts WHERE script_code = 'T-08'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('November 2026', '2026-11-06', 'Friday', 91, 'mirror', (SELECT title FROM content_scripts WHERE script_code = 'M-11'), (SELECT id FROM content_scripts WHERE script_code = 'M-11'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('November 2026', '2026-11-08', 'Sunday', 92, 'question', (SELECT title FROM content_scripts WHERE script_code = 'Q-11'), (SELECT id FROM content_scripts WHERE script_code = 'Q-11'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('November 2026', '2026-11-09', 'Monday', 93, 'deep_reel', (SELECT title FROM content_scripts WHERE script_code = 'T-09'), (SELECT id FROM content_scripts WHERE script_code = 'T-09'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('November 2026', '2026-11-11', 'Wednesday', 94, 'carousel', $$Carousel: T-09 Insights$$, (SELECT id FROM content_scripts WHERE script_code = 'T-09'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('November 2026', '2026-11-13', 'Friday', 95, 'mirror', (SELECT title FROM content_scripts WHERE script_code = 'M-12'), (SELECT id FROM content_scripts WHERE script_code = 'M-12'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('November 2026', '2026-11-15', 'Sunday', 96, 'question', (SELECT title FROM content_scripts WHERE script_code = 'Q-12'), (SELECT id FROM content_scripts WHERE script_code = 'Q-12'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('November 2026', '2026-11-16', 'Monday', 97, 'deep_reel', (SELECT title FROM content_scripts WHERE script_code = 'T-10'), (SELECT id FROM content_scripts WHERE script_code = 'T-10'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('November 2026', '2026-11-18', 'Wednesday', 98, 'carousel', $$Carousel: T-10 Insights$$, (SELECT id FROM content_scripts WHERE script_code = 'T-10'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('November 2026', '2026-11-20', 'Friday', 99, 'mirror', (SELECT title FROM content_scripts WHERE script_code = 'M-01'), (SELECT id FROM content_scripts WHERE script_code = 'M-01'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('November 2026', '2026-11-22', 'Sunday', 100, 'question', (SELECT title FROM content_scripts WHERE script_code = 'Q-01'), (SELECT id FROM content_scripts WHERE script_code = 'Q-01'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('November 2026', '2026-11-23', 'Monday', 101, 'deep_reel', (SELECT title FROM content_scripts WHERE script_code = 'T-11'), (SELECT id FROM content_scripts WHERE script_code = 'T-11'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('November 2026', '2026-11-25', 'Wednesday', 102, 'carousel', $$Carousel: T-11 Insights$$, (SELECT id FROM content_scripts WHERE script_code = 'T-11'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('November 2026', '2026-11-27', 'Friday', 103, 'mirror', (SELECT title FROM content_scripts WHERE script_code = 'M-02'), (SELECT id FROM content_scripts WHERE script_code = 'M-02'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('November 2026', '2026-11-29', 'Sunday', 104, 'question', (SELECT title FROM content_scripts WHERE script_code = 'Q-02'), (SELECT id FROM content_scripts WHERE script_code = 'Q-02'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('November 2026', '2026-11-30', 'Monday', 105, 'deep_reel', (SELECT title FROM content_scripts WHERE script_code = 'T-12'), (SELECT id FROM content_scripts WHERE script_code = 'T-12'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('December 2026', '2026-12-02', 'Wednesday', 106, 'carousel', $$Carousel: T-12 Insights$$, (SELECT id FROM content_scripts WHERE script_code = 'T-12'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('December 2026', '2026-12-04', 'Friday', 107, 'mirror', (SELECT title FROM content_scripts WHERE script_code = 'M-03'), (SELECT id FROM content_scripts WHERE script_code = 'M-03'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('December 2026', '2026-12-06', 'Sunday', 108, 'question', (SELECT title FROM content_scripts WHERE script_code = 'Q-03'), (SELECT id FROM content_scripts WHERE script_code = 'Q-03'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('December 2026', '2026-12-07', 'Monday', 109, 'deep_reel', (SELECT title FROM content_scripts WHERE script_code = 'T-13'), (SELECT id FROM content_scripts WHERE script_code = 'T-13'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('December 2026', '2026-12-09', 'Wednesday', 110, 'carousel', $$Carousel: T-13 Insights$$, (SELECT id FROM content_scripts WHERE script_code = 'T-13'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('December 2026', '2026-12-11', 'Friday', 111, 'mirror', (SELECT title FROM content_scripts WHERE script_code = 'M-04'), (SELECT id FROM content_scripts WHERE script_code = 'M-04'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('December 2026', '2026-12-13', 'Sunday', 112, 'question', (SELECT title FROM content_scripts WHERE script_code = 'Q-04'), (SELECT id FROM content_scripts WHERE script_code = 'Q-04'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('December 2026', '2026-12-14', 'Monday', 113, 'deep_reel', (SELECT title FROM content_scripts WHERE script_code = 'T-14'), (SELECT id FROM content_scripts WHERE script_code = 'T-14'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('December 2026', '2026-12-16', 'Wednesday', 114, 'carousel', $$Carousel: T-14 Insights$$, (SELECT id FROM content_scripts WHERE script_code = 'T-14'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('December 2026', '2026-12-18', 'Friday', 115, 'mirror', (SELECT title FROM content_scripts WHERE script_code = 'M-05'), (SELECT id FROM content_scripts WHERE script_code = 'M-05'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('December 2026', '2026-12-20', 'Sunday', 116, 'question', (SELECT title FROM content_scripts WHERE script_code = 'Q-05'), (SELECT id FROM content_scripts WHERE script_code = 'Q-05'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('December 2026', '2026-12-21', 'Monday', 117, 'deep_reel', (SELECT title FROM content_scripts WHERE script_code = 'T-15'), (SELECT id FROM content_scripts WHERE script_code = 'T-15'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('December 2026', '2026-12-23', 'Wednesday', 118, 'carousel', $$Carousel: T-15 Insights$$, (SELECT id FROM content_scripts WHERE script_code = 'T-15'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('December 2026', '2026-12-25', 'Friday', 119, 'mirror', (SELECT title FROM content_scripts WHERE script_code = 'M-06'), (SELECT id FROM content_scripts WHERE script_code = 'M-06'));
INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, script_id) VALUES ('December 2026', '2026-12-27', 'Sunday', 120, 'question', (SELECT title FROM content_scripts WHERE script_code = 'Q-06'), (SELECT id FROM content_scripts WHERE script_code = 'Q-06'));
