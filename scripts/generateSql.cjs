const fs = require('fs');

const raw30 = fs.readFileSync('raw_30_scripts.md', 'utf-8');
const rawFast = fs.readFileSync('raw_fast_reel_scripts.md', 'utf-8');

let sql = `-- INSERT SCRIPT DATA
`;

// IDs for sources
const source30Id = '11111111-1111-1111-1111-111111111111';
const sourceFastId = '22222222-2222-2222-2222-222222222222';

sql += `INSERT INTO content_sources (id, title, source_type, source_label, raw_text) VALUES 
('${source30Id}', 'BBMh — 30 Complete Scripts', 'pasted_text', 'Core 30 Scripts', '...'),
('${sourceFastId}', 'BBMh — Fast Reel Format System', 'pasted_text', 'Fast Reel Formats', '...');\n\n`;

// Parse 30 Complete Scripts
const scriptRegex = /### ([A-Z]+-\d+) — "(.*?)"\n\*([^\n]+)\*\n\n\*\*\[HOOK — [^\]]+\]\*\*\n([\s\S]*?)\n\n\*\*\[INSIGHT — [^\]]+\]\*\*\n([\s\S]*?)\n\n\*\*\[REFRAME — [^\]]+\]\*\*\n([\s\S]*?)\n\n\*\*\[CLOSE — [^\]]+\]\*\*\n([\s\S]*?)\n\n\*\*REEL TITLES\*\*\n([\s\S]*?)\n\n\*\*INSTAGRAM CAPTION\*\*\n([\s\S]*?)(?=\n\n---|---$)/g;

let match;
while ((match = scriptRegex.exec(raw30)) !== null) {
    const [_, code, title, tags, hook, insight, reframe, close, titles, caption] = match;
    const body = `**INSIGHT**\n${insight.trim()}\n\n**REFRAME**\n${reframe.trim()}\n\n**CLOSE**\n${close.trim()}`;
    const escapedTitle = title.replace(/'/g, "''");
    const escapedHook = hook.trim().replace(/'/g, "''");
    const escapedBody = body.replace(/'/g, "''");
    const escapedTags = tags.replace(/'/g, "''");
    const escapedCaption = caption.trim().replace(/'/g, "''");
    const escapedTitles = titles.trim().replace(/'/g, "''");
    
    sql += `INSERT INTO content_scripts (source_id, script_code, title, hook, script_body, content_type, theme, caption_notes, thumbnail_headline) VALUES 
('${source30Id}', '${code}', '${escapedTitle}', '${escapedHook}', '${escapedBody}', 'deep_reel', '${escapedTags}', '${escapedCaption}', '${escapedTitles}');\n`;
}

// Parse Fast Reel Scripts
const mirrorRegex = /\*\*(M-\d+)\*\*\n([\s\S]*?)(?=\*\*(M-\d+)\*\*|---)/g;
while ((match = mirrorRegex.exec(rawFast)) !== null) {
    const code = match[1];
    const text = match[2].trim().replace(/'/g, "''");
    sql += `INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES 
('${sourceFastId}', '${code}', 'The Mirror ${code}', '${text}', 'mirror');\n`;
}

const questionRegex = /\*\*(Q-\d+)\*\*\n([\s\S]*?)(?=\*\*(Q-\d+)\*\*|---)/g;
while ((match = questionRegex.exec(rawFast)) !== null) {
    const code = match[1];
    const text = match[2].trim().replace(/'/g, "''");
    sql += `INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES 
('${sourceFastId}', '${code}', 'The Question ${code}', '${text}', 'question');\n`;
}

const contrastRegex = /\*\*(C-\d+) — (.*?)\*\*\n([\s\S]*?)(?=\*\*(C-\d+) —|---)/g;
while ((match = contrastRegex.exec(rawFast)) !== null) {
    const code = match[1];
    const title = match[2].trim().replace(/'/g, "''");
    const text = match[3].trim().replace(/'/g, "''");
    sql += `INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES 
('${sourceFastId}', '${code}', '${title}', '${text}', 'contrast');\n`;
}

const frameRegex = /\*\*(F-\d+)\*\*\n([\s\S]*?)(?=\*\*(F-\d+)\*\*|---)/g;
while ((match = frameRegex.exec(rawFast)) !== null) {
    const code = match[1];
    const text = match[2].trim().replace(/'/g, "''");
    sql += `INSERT INTO content_scripts (source_id, script_code, title, script_body, content_type) VALUES 
('${sourceFastId}', '${code}', 'The Frame ${code}', '${text}', 'frame');\n`;
}

// Write the publishing flow stages
const stages = [
    'idea / script source',
    'script approved',
    'visual direction',
    'shoot / design / edit',
    'thumbnail / carousel asset',
    'caption',
    'internal review',
    'scheduled',
    'published',
    'performance tracking',
    'repurposed'
];

sql += `\n-- PUBLISHING FLOW\n`;
stages.forEach((stage, i) => {
    sql += `INSERT INTO content_publishing_flow (stage_name, stage_order, status) VALUES ('${stage}', ${i+1}, 'active');\n`;
});

fs.writeFileSync('MIGRATION_CONTENT_RESET_AND_IMPORT_DATA.sql', sql);
console.log('SQL generated!');
