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
