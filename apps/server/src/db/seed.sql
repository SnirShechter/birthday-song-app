-- Birthday Song App - Seed Data
-- Run after schema.sql

-- ============================================================
-- REFERRAL CODES
-- ============================================================
INSERT INTO referral_codes (code, owner_name, discount_percent, max_uses, current_uses) VALUES
  ('BIRTHDAY10', 'Marketing Campaign', 10, 1000, 42),
  ('VIP20', 'VIP Partner', 20, 100, 7);

-- ============================================================
-- ORDERS
-- ============================================================

-- Order 1: Completed flow (Hebrew, pop)
INSERT INTO orders (
  id, email, recipient_name, recipient_nickname, recipient_gender, recipient_age,
  relationship, personality_traits, hobbies, funny_story, occupation,
  desired_tone, questionnaire_raw, language, selected_style, status,
  referral_code, created_at, updated_at
) VALUES (
  'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
  'david@example.com',
  'Yossi Cohen',
  'Yossi',
  'male',
  35,
  'Best Friend',
  ARRAY['Funny', 'Adventurous', 'Sarcastic'],
  'Playing guitar, hiking, cooking bad pasta',
  'He once tried to make sushi and set off the fire alarm',
  'Software Developer',
  'funny',
  '{"recipientName":"Yossi Cohen","recipientNickname":"Yossi","recipientGender":"male","recipientAge":35,"relationship":"Best Friend","personalityTraits":["Funny","Adventurous","Sarcastic"],"hobbies":"Playing guitar, hiking, cooking bad pasta","funnyStory":"He once tried to make sushi and set off the fire alarm","occupation":"Software Developer","desiredTone":"funny","language":"he"}',
  'he',
  'pop',
  'completed',
  'BIRTHDAY10',
  NOW() - INTERVAL '5 days',
  NOW() - INTERVAL '4 days'
);

-- Order 2: Lyrics ready (English, rap)
INSERT INTO orders (
  id, email, recipient_name, recipient_nickname, recipient_gender, recipient_age,
  relationship, personality_traits, hobbies, funny_story, occupation,
  desired_tone, questionnaire_raw, language, selected_style, status,
  created_at, updated_at
) VALUES (
  'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e',
  'sarah@example.com',
  'Emma Johnson',
  'Em',
  'female',
  28,
  'Sister',
  ARRAY['Creative', 'Dramatic', 'Kind'],
  'Painting, yoga, collecting vintage records',
  'She once showed up to a costume party on the wrong day in full clown makeup',
  'Graphic Designer',
  'mixed',
  '{"recipientName":"Emma Johnson","recipientNickname":"Em","recipientGender":"female","recipientAge":28,"relationship":"Sister","personalityTraits":["Creative","Dramatic","Kind"],"hobbies":"Painting, yoga, collecting vintage records","funnyStory":"She once showed up to a costume party on the wrong day in full clown makeup","occupation":"Graphic Designer","desiredTone":"mixed","language":"en"}',
  'en',
  'rap',
  'lyrics_ready',
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '1 day'
);

-- Order 3: Draft (Hebrew, no style yet)
INSERT INTO orders (
  id, email, recipient_name, recipient_gender, recipient_age,
  relationship, personality_traits,
  desired_tone, questionnaire_raw, language, status,
  created_at, updated_at
) VALUES (
  'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f',
  NULL,
  'Noa Levi',
  'female',
  40,
  'Partner',
  ARRAY['Romantic', 'Stubborn', 'Athletic'],
  'emotional',
  '{"recipientName":"Noa Levi","recipientGender":"female","recipientAge":40,"relationship":"Partner","personalityTraits":["Romantic","Stubborn","Athletic"],"desiredTone":"emotional","language":"he"}',
  'he',
  'questionnaire_done',
  NOW() - INTERVAL '1 hour',
  NOW() - INTERVAL '1 hour'
);

-- ============================================================
-- LYRICS VARIATIONS (for Order 1 and Order 2)
-- ============================================================

-- Order 1 lyrics (Hebrew pop)
INSERT INTO lyrics_variations (order_id, model, style_variant, content, selected) VALUES
(
  'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
  'claude',
  'pop',
  E'[Verse 1]\nיוסי בן שלושים וחמש, עוד שנה עפה\nמפתח קוד ביום, בלילה מנגן על גיטרה\nהכי מצחיק בחבורה, הכי סרקסטי שיש\nעם חיוך שמפיל את כולם, בלי שום מאמץ\n\n[Chorus]\nיום הולדת שמח, יוסי שלנו\nעוד שנה של הרפתקאות, עוד שנה של אושר גדול\nאתה האחד, אתה הכוכב\nיום הולדת שמח, שהכל יהיה בסדר\n\n[Verse 2]\nזוכרים את הפעם שניסית לעשות סושי\nגלאי העשן צרח, השכנים ברחו\nאבל אתה צחקת, כי ככה אתה\nהופך כל בלאגן לסיפור שווה\n\n[Chorus]\nיום הולדת שמח, יוסי שלנו\nעוד שנה של הרפתקאות, עוד שנה של אושר גדול\nאתה האחד, אתה הכוכב\nיום הולדת שמח, שהכל יהיה בסדר\n\n[Bridge]\nמגיטרה ועד טיולים, מקוד ועד פסטה שרופה\nאתה תמיד שם, תמיד בשבילנו\nאז קח את היום הזה, תחגוג בגדול\nכי אתה שווה את זה, יוסי הגדול',
  TRUE
),
(
  'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
  'gpt4o',
  'pop',
  E'[Verse 1]\nהנה מגיע היום, יוסי חוגג שוב\nשלושים וחמש ועדיין עם לב של זהב\nמתכנת בבוקר, שף בערב\nאבל הפסטה שלו? עדיף לא לטעום\n\n[Chorus]\nיוסי, יוסי, יום הולדת לך\nכל החברים פה, חוגגים אותך\nעוד שנה, עוד חיוך, עוד יום מושלם\nיוסי, יום הולדת שמח לך\n\n[Verse 2]\nהרפתקן אמיתי, תמיד על הדרך\nמטפס על הרים, שוחה בנחל\nאבל כשצריך סושי, תתקשר לדליברי\nכי הגלאי כבר מכיר אותך\n\n[Chorus]\nיוסי, יוסי, יום הולדת לך\nכל החברים פה, חוגגים אותך\nעוד שנה, עוד חיוך, עוד יום מושלם\nיוסי, יום הולדת שמח לך\n\n[Bridge]\nאז תרים כוסית, תחייך גדול\nכי היום שלך הגיע, וזה ממש גדול\nאוהבים אותך יוסי, בדיוק כמו שאתה\nמצחיק וסרקסטי, והכי טוב שיש',
  FALSE
),
(
  'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
  'gemini',
  'pop',
  E'[Verse 1]\nעוד יום הולדת הגיע, והפעם ליוסי\nבן שלושים וחמש, אבל צעיר ברוח\nגיטרה ביד ימין, קוד ביד שמאל\nופסטה שרופה? רק ביום שלישי\n\n[Chorus]\nתחגוג יוסי, היום שלך\nכל העולם שמח, כולם איתך\nהרפתקה חדשה מחכה מעבר לפינה\nיום הולדת שמח, יאללה נחגוג\n\n[Verse 2]\nהחבר הכי טוב, הכי סרקסטי\nתמיד יודע מה להגיד, תמיד בול בטיימינג\nומי ישכח את הסושי, הלילה ההוא\nכשכל הבניין חשב שיש שריפה\n\n[Chorus]\nתחגוג יוסי, היום שלך\nכל העולם שמח, כולם איתך\nהרפתקה חדשה מחכה מעבר לפינה\nיום הולדת שמח, יאללה נחגוג\n\n[Bridge]\nאז שנה טובה מתחילה עכשיו\nעם חברים, עם אהבה, עם המון צחוק\nיוסי, אתה מלך, וזה היום שלך\nאז בוא נעשה את זה בלתי נשכח',
  FALSE
);

-- Order 2 lyrics (English rap)
INSERT INTO lyrics_variations (order_id, model, style_variant, content, selected) VALUES
(
  'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e',
  'claude',
  'rap',
  E'[Verse 1]\nYo, it''s Emma''s birthday, twenty-eight and thriving\nGraphic designer by day, the canvas comes alive then\nCreative soul with a heart of gold, no denying\nDramatic flair, but the kindness? Underlying\n\nVintage records spinning, yoga mat unrolling\nPaintbrush in her hand, watch the masterpiece be forming\nEm, you''re one of a kind, that''s the story I''m telling\nHappy birthday to you, let the party be swelling\n\n[Chorus]\nHappy birthday Emma, blow the candles out\nTwenty-eight years strong, that''s what I''m talking about\nFrom your sister with love, yeah I''m screaming it loud\nEmma J, it''s your day, make us all proud\n\n[Verse 2]\nRemember that time, costume party on a Tuesday\nFull clown makeup, but the party was on Saturday\nEveryone was staring, but you owned it, no delay\nThat''s the Emma energy, wouldn''t have it any other way\n\nCanvas queen, design machine, creative to the core\nEvery year you level up, always wanting more\nSo here''s a birthday track, dropping bars galore\nEm, you''re twenty-eight, open up that door\n\n[Chorus]\nHappy birthday Emma, blow the candles out\nTwenty-eight years strong, that''s what I''m talking about\nFrom your sister with love, yeah I''m screaming it loud\nEmma J, it''s your day, make us all proud\n\n[Bridge]\nSo raise your glass, hit the dance floor tonight\nEmma''s birthday party, everything feels right\nFrom clown makeup to masterpieces bright\nHappy birthday sis, you''re my shining light',
  TRUE
),
(
  'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e',
  'gpt4o',
  'rap',
  E'[Verse 1]\nListen up, it''s time to celebrate\nEmma J turning twenty-eight, and she looking great\nShe designs the graphics, paints the town\nKindest soul around, never let you down\n\nYoga in the morning, records in the night\nVintage vibes and creative highs, everything is right\nDramatic? Sure. But that''s the spice of life\nEmma cuts through ordinary like a knife\n\n[Chorus]\nEmma, Emma, it''s your birthday\nEvery single day should feel this way\nYour sister''s here to say hooray\nHappy birthday Em, let''s slay today\n\n[Verse 2]\nLet me tell a story that''ll make you laugh\nEmma dressed up like a clown, full face, full path\nShowed up to the party, confidence on max\nOnly problem? Wrong day - those are the facts\n\nBut she rocked it anyway, that''s the Emma way\nTurning awkward moments into highlight reels all day\nCreative genius, kind heart, dramatic queen\nThe best sister that the world has ever seen\n\n[Chorus]\nEmma, Emma, it''s your birthday\nEvery single day should feel this way\nYour sister''s here to say hooray\nHappy birthday Em, let''s slay today\n\n[Bridge]\nTwenty-eight candles burning bright\nEvery one a wish, every one''s alight\nHere''s to you Emma, my sister, my friend\nThis birthday love will never end',
  FALSE
),
(
  'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e',
  'gemini',
  'rap',
  E'[Verse 1]\nCheck it, uh, Emma on the beat\nTwenty-eight years, making life complete\nDesigner extraordinaire, pixel perfect art\nWith a dramatic flair and the kindest heart\n\nShe paints and she bends on her yoga mat\nCollects dusty records, imagine that\nFrom Motown to Beatles, her taste is legit\nEmma Johnson, birthday girl, this is it\n\n[Chorus]\nBlow the candles, make a wish tonight\nEmma''s birthday, everything is right\nSister to sister, I wrote you this song\nHappy birthday Em, let''s sing along\n\n[Verse 2]\nNow let me take you back to twenty-twenty-three\nCostume party invite, Em was filled with glee\nFull clown makeup, rainbow wig on tight\nBut the party was next week - what a sight\n\nDid she cry? Nah, she took a bow\nThat''s the Emma spirit, take a look at her now\nTurning twenty-eight with grace and style\nMaking everyone around her smile\n\n[Chorus]\nBlow the candles, make a wish tonight\nEmma''s birthday, everything is right\nSister to sister, I wrote you this song\nHappy birthday Em, let''s sing along\n\n[Bridge]\nSo here''s to the girl who makes life colorful\nWhose kindness and creativity are beautiful\nHappy birthday Emma, from me to you\nMay all your wildest birthday dreams come true',
  FALSE
);

-- ============================================================
-- SONG VARIATIONS (for Order 1)
-- ============================================================
INSERT INTO song_variations (order_id, provider, provider_id, style_prompt, audio_url, preview_url, duration_seconds, selected) VALUES
(
  'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
  'suno',
  'suno_abc123',
  'pop, upbeat, birthday, celebration, happy, catchy, major key, 120 bpm, hebrew',
  '/mock-assets/songs/order1-v1-full.mp3',
  '/mock-assets/songs/order1-v1-preview.mp3',
  180,
  TRUE
),
(
  'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
  'suno',
  'suno_def456',
  'pop, upbeat, birthday, celebration, happy, catchy, major key, 120 bpm, hebrew',
  '/mock-assets/songs/order1-v2-full.mp3',
  '/mock-assets/songs/order1-v2-preview.mp3',
  165,
  FALSE
),
(
  'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
  'udio',
  'udio_ghi789',
  'pop, upbeat, birthday, celebration, happy, catchy, major key, 120 bpm, hebrew',
  '/mock-assets/songs/order1-v3-full.mp3',
  '/mock-assets/songs/order1-v3-preview.mp3',
  175,
  FALSE
),
(
  'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e',
  'suno',
  'suno_jkl012',
  'hip-hop, rap, birthday, energetic, rhythmic, 95 bpm, trap beats, english',
  '/mock-assets/songs/order2-v1-full.mp3',
  '/mock-assets/songs/order2-v1-preview.mp3',
  190,
  FALSE
);

-- ============================================================
-- VIDEO CLIPS (for Order 1)
-- ============================================================
INSERT INTO video_clips (order_id, provider, provider_id, photo_urls, video_style, video_url, status, completed_at) VALUES
(
  'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
  'runway',
  'runway_xyz123',
  ARRAY['/mock-assets/photos/photo1.jpg', '/mock-assets/photos/photo2.jpg'],
  'party',
  '/mock-assets/videos/demo-video.mp4',
  'completed',
  NOW() - INTERVAL '4 days'
);

-- ============================================================
-- PAYMENTS
-- ============================================================
INSERT INTO payments (order_id, product_type, amount_cents, currency, stripe_session_id, stripe_payment_intent, status, paid_at) VALUES
(
  'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
  'bundle',
  1999,
  'ILS',
  'cs_mock_session_001',
  'pi_mock_intent_001',
  'completed',
  NOW() - INTERVAL '4 days'
),
(
  'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e',
  'song',
  999,
  'ILS',
  'cs_mock_session_002',
  NULL,
  'pending',
  NULL
);

-- ============================================================
-- EVENTS
-- ============================================================
INSERT INTO events (order_id, event_type, payload) VALUES
(
  'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
  'order_created',
  '{"source": "web"}'
),
(
  'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
  'lyrics_generated',
  '{"style": "pop", "model_count": 3}'
),
(
  'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
  'song_generated',
  '{"provider": "suno", "variation_count": 3}'
),
(
  'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
  'payment_completed',
  '{"product_type": "bundle", "amount_cents": 1999}'
),
(
  'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e',
  'order_created',
  '{"source": "web"}'
),
(
  'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e',
  'lyrics_generated',
  '{"style": "rap", "model_count": 3}'
),
(
  'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f',
  'order_created',
  '{"source": "web"}'
);
