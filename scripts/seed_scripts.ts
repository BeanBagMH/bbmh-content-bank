import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ddnyzycqfkkyyddmymuj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkbnl6eWNxZmtreXlkZG15bXVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwODg3MzUsImV4cCI6MjA5MzY2NDczNX0.qxhIqLlZCQRze-UMwY8Xu8AAeltGu7ppdqATPX53cPs';

const supabase = createClient(supabaseUrl, supabaseKey);

const scripts = [
  {
    title: "They Googled you before the meeting",
    content_type: "video",
    cluster: "01",
    cluster_name: "The Invisibility Problem",
    status: "Script Ready",
    hook: "Your client had already decided before you walked into that room. Not because of anything you said. Because of what they found when they Googled you three days before.",
    script_content: `Your client had already decided before you walked into that room. Not because of anything you said. Because of what they found when they Googled you three days before.

[EMPATHY BRIDGE]
You spent months building that relationship. You got the intro. Booked the call. But the meeting felt off — less warm than the phone conversation. You couldn't figure out why. You assumed it was just them.

[INSIGHT]
Here's what happened. Between that call and that meeting, they looked you up. Your website loaded in 9 seconds. The logo looked like it was made in a different decade. The homepage had stock photos of people in suits shaking hands. No work samples. No story. Nothing that said who you actually are. In about 90 seconds, one question formed in their mind: are these people serious? And the website answered it for them. It said: probably not. You were never in the room for that conversation.

[REFRAME]
Your brand isn't just something that shows up when you send a proposal. It shows up every single time someone types your company name. And you're not there. You have no control over that moment — except one: whether what they find matches what you actually are. Most businesses have put years into their product and almost nothing into that moment. And that's the moment that's deciding for them.

[NEW WORLD]
When your brand finally looks like what your business actually is, something shifts. Meetings start warmer. Proposals get read properly. Because the groundwork was already done before you opened your mouth.

[CTA]
Drop AUDIT in the comments. We do three free brand reviews every week.`,
    director_notes: "Open on a phone screen, slow load animation on a dull website. VO is calm, conversational — not alarming. Pause after 'probably not.' Long pause. Let it land."
  },
  {
    title: "The 8-second rule your business doesn't know about",
    content_type: "video",
    cluster: "01",
    cluster_name: "The Invisibility Problem",
    status: "Script Ready",
    hook: "There's a version of your business that exists online. You've never seen it the way your clients do. What it looks like might surprise you.",
    script_content: `There's a version of your business that exists online. You've never seen it the way your clients do. What it looks like might surprise you.

[EMPATHY BRIDGE]
When you look at your own website, you're not actually seeing it. You're seeing everything behind it — the years of work, the clients you've served, the quality you've built. Your brain fills in all of that automatically. A stranger's brain doesn't have that information. They only see what's on the screen.

[INSIGHT]
Here's something worth trying right now. Open your website on your phone — not on desktop where it usually looks fine — on your phone. Time how long it takes to load. Read the first sentence on the homepage. Then ask yourself one question: if this was the first thing I ever saw about this company, would I feel confident calling them? Most business owners who do this are genuinely surprised. Not because the site is broken. Because it's just... quiet. It doesn't say anything. It lists services. It has a contact form. But it doesn't make you feel like these people know what they're doing. And in B2B, that feeling is everything.

[REFRAME]
You are not your website. But your prospect doesn't know that yet. Until they meet you, until they speak to someone who vouches for you, until they see your actual work — the website is you. And it's working 24 hours a day, either building your case or quietly undermining it.

[NEW WORLD]
A website that actually represents your business doesn't just look better. It starts conversations already warm. It hands the prospect over to your sales team pre-convinced. The closing gets easier because the opening already happened.

[CTA]
If you want a second pair of eyes on your site — drop SITE in the comments.`,
    director_notes: "Screen recording style — someone actually doing the phone test in real time. Silence while the page loads. The silence is the content."
  },
  {
    title: "The email signature that's costing you",
    content_type: "social",
    cluster: "01",
    cluster_name: "The Invisibility Problem",
    status: "Script Ready",
    hook: "Email Signature Contrast",
    script_content: `[VISUAL SEQUENCE]
Shot 1: Email open. Signature reads: "Rajesh Mehta | Director | rmehta@gmail.com"
Shot 2: Another email. Signature reads: "Arjun Shah | Managing Director | Avani Industries | arjun@avaniindustries.com | Professional logo | Clean design"
Shot 3: Text on screen: "Both are directors of real companies."
Shot 4: Text on screen: "Only one looks like it."
Shot 5: BBMh logo. "Your brand speaks before you do."`,
    director_notes: "No voiceover. Trending instrumental. Duration: 16 seconds. This is pure scroll-stop visual contrast."
  },
  {
    title: "The person who killed your deal has never met you",
    content_type: "video",
    cluster: "02",
    cluster_name: "The Trust Filter",
    status: "Script Ready",
    hook: "Last year you lost a deal you should have won. Not to a better product. Not to a lower price. To someone in the buyer's office who had never spoken to you and never will.",
    script_content: `Last year you lost a deal you should have won. Not to a better product. Not to a lower price. To someone in the buyer's office who had never spoken to you and never will.

[EMPATHY BRIDGE]
You pitched well. The MD was engaged. You left the meeting feeling like this one was different. And then the silence. Days of follow-up that went nowhere. A polite note saying they'd gone in a different direction. You still don't know exactly why.

[INSIGHT]
Here's the sequence that happened without you. After your meeting, the MD told his team to do some due diligence. Someone junior — PA, associate, executive assistant — was asked to put together a vendor comparison. They Googled your three competitors and you. They pulled the websites, looked at the LinkedIn pages, skimmed the brochures attached to the emails. Yours wasn't the weakest product. But it was the weakest looking. That comparison went into a document. That document went to the decision-makers. Your name sat at the bottom of a list you never knew existed, built by someone who had no context for what you actually do.

[REFRAME]
B2B purchases almost never get decided by one person. There's always a chain. And at every link in that chain, your brand is either holding its own or it isn't. Most business owners only ever think about the person they're presenting to. They never think about the people that person goes back to. Your brand has to work for the whole chain — especially for the people in it who don't know your name.

[NEW WORLD]
When your brand is built to pass the screening that happens without you — the 3-minute Google check, the vendor comparison document, the inbox decision — you stop leaking deals at points you can't even see. You start making the shortlist not because someone fought for you, but because nothing knocked you off.`,
    director_notes: "Recreate the procurement journey visually — meeting → office → Google search → vendor list → document. The junior associate is the character who decides. Slow down on 'never spoke to you and never will.'"
  },
  {
    title: "Your LinkedIn page is doing an interview on your behalf",
    content_type: "video",
    cluster: "02",
    cluster_name: "The Trust Filter",
    status: "Script Ready",
    hook: "Before any serious B2B buyer picks up the phone, they've already decided whether they want to talk to you. That decision happens on LinkedIn. And your company page is either making the case or quietly dropping it.",
    script_content: `Before any serious B2B buyer picks up the phone, they've already decided whether they want to talk to you. That decision happens on LinkedIn. And your company page is either making the case or quietly dropping it.

[EMPATHY BRIDGE]
I know you're thinking: we're not a social media business, LinkedIn doesn't really apply to us. And you're right that you don't need thousands of followers. But here's what does happen, every single time, before a formal B2B conversation.

[INSIGHT]
Someone sends a connection request, or gets introduced, or receives your quote. The first thing they do is not call. The first thing they do is search your company on LinkedIn. What they find in those first 20 seconds tells them whether you're the kind of organisation that takes itself seriously. A banner that looks like a default template, a company description that reads like it was written in 2016, three posts from eight months ago — these things don't disqualify you outright. What they do is create friction. A small hesitation. A reason to slow down. And in B2B, friction kills deals more often than price does.

[REFRAME]
You don't need to be a content machine. You don't need a social media strategy for LinkedIn. You just need your company page to do one job: when a serious buyer looks you up, they should feel like they're dealing with a company that's real, active, and worth their time. That's not a marketing task. That's a brand hygiene task.

[NEW WORLD]
A LinkedIn page that looks the part costs you nothing in ongoing effort once it's done right. But it pays you back on every cold introduction, every trade fair follow-up, every proposal that needs a second look before the buyer decides to call back.`,
    director_notes: "Split screen — bad LinkedIn page versus a clean, credible one. Same business type, same industry. The contrast is everything."
  }
];

async function seed() {
  console.log('Seeding Script Bank...');
  const { data, error } = await supabase
    .from('content_items')
    .insert(scripts);

  if (error) {
    console.error('Error seeding data:', error);
  } else {
    console.log('Successfully seeded Script Bank!');
  }
}

seed();
