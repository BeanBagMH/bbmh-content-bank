const fs = require('fs');
const { v4: uuidv4 } = require('crypto'); // We can just generate hardcoded sequential UUIDs for simplicity or use pure SQL string

const raw30 = fs.readFileSync('raw_30_scripts.md', 'utf-8');
const rawFast = fs.readFileSync('raw_fast_reel_scripts.md', 'utf-8');

// Parse scripts exactly as before to get their codes
const scripts = [];

const scriptRegex = /### ([A-Z]+-\d+) — "(.*?)"/g;
let match;
while ((match = scriptRegex.exec(raw30)) !== null) {
    scripts.push({ code: match[1], type: 'deep_reel', title: match[2].replace(/'/g, "''") });
}

// Fast reels
const fastRegex = /\*\*(M-\d+|Q-\d+|C-\d+|F-\d+)(?: — (.*?))?\*\*\n/g;
while ((match = fastRegex.exec(rawFast)) !== null) {
    let type = 'other';
    if (match[1].startsWith('M')) type = 'mirror';
    if (match[1].startsWith('Q')) type = 'question';
    if (match[1].startsWith('C')) type = 'contrast';
    if (match[1].startsWith('F')) type = 'frame';
    
    scripts.push({ code: match[1], type, title: match[2] ? match[2].replace(/'/g, "''") : '' });
}

// Schedule from June 2026 to Jan 2027
// 116 posts
let sql = `-- CALENDAR DATA\n`;
let currentDate = new Date('2026-06-01T10:00:00Z');
let postCount = 1;

// Deep Reels generate Carousels
// So we'll iterate the scripts. Deep Reels will be scheduled, then 2 days later, a Carousel.
// Then we distribute Fast Reels.
// But we can just write pure SQL inserts that fetch the script_id using subqueries based on script_code!

let currentMonth = 'June 2026';
let deepReels = scripts.filter(s => s.type === 'deep_reel');
let fastReels = scripts.filter(s => s.type !== 'deep_reel');

let fastReelIdx = 0;

for (let i = 0; i < deepReels.length; i++) {
    const dr = deepReels[i];
    
    // Day 1: Deep Reel
    const drDateStr = currentDate.toISOString().split('T')[0];
    const drMonth = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    
    sql += `INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
    VALUES ('${drMonth}', '${drDateStr}', '${currentDate.toLocaleDateString('en-US', {weekday: 'long'})}', ${postCount++}, 'deep_reel', '${dr.title}', NULL, (SELECT id FROM content_scripts WHERE script_code = '${dr.code}'));\n`;
    
    // Add 2 days
    currentDate.setDate(currentDate.getDate() + 2);
    
    // Day 3: Carousel (Cascade from Deep Reel)
    const carDateStr = currentDate.toISOString().split('T')[0];
    const carMonth = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    
    sql += `INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id)
    VALUES ('${carMonth}', '${carDateStr}', '${currentDate.toLocaleDateString('en-US', {weekday: 'long'})}', ${postCount++}, 'carousel', 'Carousel derived from ${dr.code}', (SELECT id FROM content_scripts WHERE script_code = '${dr.code}'));\n`;
    
    // Add 2 days
    currentDate.setDate(currentDate.getDate() + 2);

    // Schedule 1-2 fast reels
    let fastsToSchedule = i < 26 ? 2 : 1; // total fast reels is 56, 30 deep reels. 26*2 + 4 = 56. Perfect.
    for(let j=0; j<fastsToSchedule; j++) {
        if(fastReelIdx < fastReels.length) {
            const fr = fastReels[fastReelIdx++];
            const frDateStr = currentDate.toISOString().split('T')[0];
            const frMonth = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
            
            sql += `INSERT INTO content_calendar_posts (month, date, day, post_number, content_type, title_or_hook, cascade_parent_script_id, script_id)
            VALUES ('${frMonth}', '${frDateStr}', '${currentDate.toLocaleDateString('en-US', {weekday: 'long'})}', ${postCount++}, '${fr.type}', '${fr.title}', NULL, (SELECT id FROM content_scripts WHERE script_code = '${fr.code}'));\n`;
            
            currentDate.setDate(currentDate.getDate() + 3);
        }
    }
}

fs.writeFileSync('MIGRATION_CALENDAR_DATA.sql', sql);
console.log('Calendar SQL generated. Total posts:', postCount - 1);
