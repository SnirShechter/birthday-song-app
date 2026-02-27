import type { MusicStyle, LyricsModel, QuestionnaireAnswers } from '@birthday-song/shared';

interface LyricsVariationResult {
  model: LyricsModel;
  content: string;
}

// Template tokens: {{NAME}}, {{NICKNAME}}, {{AGE}}, {{HOBBY}}, {{FUNNY}}, {{OCCUPATION}}, {{TRAIT1}}, {{TRAIT2}}, {{TRAIT3}}

function replaceTokens(template: string, answers: QuestionnaireAnswers): string {
  const name = answers.recipientName || 'Friend';
  const nickname = answers.recipientNickname || answers.recipientName || 'Friend';
  const age = answers.recipientAge?.toString() || '??';
  const hobby = answers.hobbies || 'having fun';
  const funny = answers.funnyStory || 'always making us laugh';
  const occupation = answers.occupation || 'superstar';
  const traits = answers.personalityTraits || [];
  const trait1 = traits[0] || 'amazing';
  const trait2 = traits[1] || 'wonderful';
  const trait3 = traits[2] || 'incredible';

  return template
    .replace(/\{\{NAME\}\}/g, name)
    .replace(/\{\{NICKNAME\}\}/g, nickname)
    .replace(/\{\{AGE\}\}/g, age)
    .replace(/\{\{HOBBY\}\}/g, hobby)
    .replace(/\{\{FUNNY\}\}/g, funny)
    .replace(/\{\{OCCUPATION\}\}/g, occupation)
    .replace(/\{\{TRAIT1\}\}/g, trait1)
    .replace(/\{\{TRAIT2\}\}/g, trait2)
    .replace(/\{\{TRAIT3\}\}/g, trait3);
}

// ============================================================
// HEBREW LYRICS
// ============================================================

const hebrewLyrics: Record<string, Record<LyricsModel, string>> = {
  pop: {
    claude: `[Verse 1]
היום יום מיוחד, היום חוגגים ל{{NICKNAME}}
בן {{AGE}} ועדיין עם אנרגיה של ילד
{{TRAIT1}} ו{{TRAIT2}}, אין כמוך בעולם
וכשאתה בחדר, כולם מרגישים שלם

{{HOBBY}} - זה מה שאתה אוהב
ואנחנו אוהבים אותך, כל יום מחדש
{{OCCUPATION}} ביום, כוכב בלילה
{{NICKNAME}}, אתה פשוט פלא

[Chorus]
יום הולדת שמח, {{NICKNAME}} שלנו
תרים את הידיים, תחגוג בגדול
עוד שנה של אושר, עוד שנה של חלומות
{{NAME}}, יום הולדת שמח לך

[Verse 2]
זוכרים את הפעם ש{{FUNNY}}
כולם צחקו עד דמעות, מה אפשר לעשות
כי ככה אתה, {{TRAIT3}} עד הסוף
ואין אף אחד שלא אוהב אותך פה

מ{{HOBBY}} ועד חגיגות יום הולדת
אתה תמיד יודע איך לעשות חגיגה
אז היום אנחנו שרים רק בשבילך
כי {{NICKNAME}}, אתה הכי טוב שיש

[Chorus]
יום הולדת שמח, {{NICKNAME}} שלנו
תרים את הידיים, תחגוג בגדול
עוד שנה של אושר, עוד שנה של חלומות
{{NAME}}, יום הולדת שמח לך

[Bridge]
אז תעצום עיניים, תבקש משאלה
כי {{AGE}} זה רק מספר, הנשמה שלך צעירה
{{NICKNAME}}, שכל מה שתחלום יתגשם
יום הולדת שמח, אוהבים אותך`,

    gpt4o: `[Verse 1]
קונפטי באוויר, עוגה על השולחן
היום {{NICKNAME}} חוגג, וכולם כאן
{{AGE}} שנים של חיוכים ושל צחוק
{{TRAIT1}} ו{{TRAIT2}}, אף פעם לא משעמם

כשאתה עושה {{HOBBY}}, העיניים שלך נדלקות
ו{{OCCUPATION}}? אתה פשוט מספר אחד
אבל מה שהכי חשוב, מה שבאמת נחשב
זה הלב הגדול שלך, {{NICKNAME}}

[Chorus]
שיר יום הולדת, שיר שלך {{NICKNAME}}
כל המילים האלה, ישר מהלב
עוד שנה מתחילה, מלאה באור
{{NAME}}, יום הולדת שמח, תאיר את העולם

[Verse 2]
אה, ואיך אפשר לשכוח
את הסיפור עם {{FUNNY}}
כולנו גלגלנו מצחוק, קלאסי {{NICKNAME}}
{{TRAIT3}} עד הסוף, זה מה שאתה

ואנחנו, כל החברים, כל המשפחה
רוצים להגיד לך תודה על מי שאתה
כי {{NICKNAME}}, אתה עושה את העולם יפה יותר
פשוט בזה שאתה קיים

[Chorus]
שיר יום הולדת, שיר שלך {{NICKNAME}}
כל המילים האלה, ישר מהלב
עוד שנה מתחילה, מלאה באור
{{NAME}}, יום הולדת שמח, תאיר את העולם

[Bridge]
אז תנשוף על הנרות, ותבקש חזק
כי אתה שווה את כל הטוב בעולם
יום הולדת שמח {{NICKNAME}}
שיהיה מדהים, כמוך`,

    gemini: `[Verse 1]
בום בום בום, הלב דופק חזק
כי ל{{NICKNAME}} יש יום הולדת, והמסיבה כבר כאן
{{AGE}} שנים, כל שנה יותר מדהים
{{TRAIT1}}, {{TRAIT2}}, ו{{TRAIT3}} - שילוב מנצח

{{OCCUPATION}} שאוהב {{HOBBY}}
{{NICKNAME}}, אתה קומבינציה מושלמת
והסיפור הזה? {{FUNNY}}
קלאסי אתה, תמיד גורם לנו לצחוק

[Chorus]
יאללה {{NICKNAME}}, יום הולדת שמח
מכל הלב, מכל הנשמה
עוד שנה איתך, עוד שנה של שמחה
{{NAME}}, המסיבה רק מתחילה

[Verse 2]
כל יום איתך זה הרפתקה
מ{{HOBBY}} ועד לילות של צחוק
אתה האחד שתמיד מרים את מצב הרוח
{{NICKNAME}}, בלעדיך זה פשוט לא אותו דבר

אז היום אנחנו עוצרים הכל בשבילך
שיר מיוחד, חגיגה שלמה
כי אתה שווה את זה, כל מילה פה אמיתית
{{NICKNAME}}, אתה פשוט הכוכב שלנו

[Chorus]
יאללה {{NICKNAME}}, יום הולדת שמח
מכל הלב, מכל הנשמה
עוד שנה איתך, עוד שנה של שמחה
{{NAME}}, המסיבה רק מתחילה

[Bridge]
אז תדליק את הנרות, {{AGE}} ועוד אחד למזל
ותבקש משאלה שתתגשם
כי אתה שווה את כל העולם
יום הולדת שמח, {{NICKNAME}} היקר`,
  },

  rap: {
    claude: `[Verse 1]
יו, תקשיבו טוב, הגיע הזמן לחגוג
{{NICKNAME}} בן {{AGE}}, והביט הזה בוער
{{TRAIT1}} ו{{TRAIT2}} - זה הסטייל שלו
{{OCCUPATION}} ביום, בלילה על ה{{HOBBY}}

פלואו כזה חזק, אין מי שיעצור
כל מילה פה אמיתית, ישר מהלב מגיע
{{NICKNAME}}, אתה גנגסטר אמיתי
עם לב של זהב, ועם חיוך שהורג

[Chorus]
יום הולדת שמח, {{NICKNAME}} - בום
{{AGE}} שנים על הפלאנט, ואתה עדיין מספר וואן
כל הצוות פה, מרימים כוסות לשמיים
{{NAME}}, יום הולדת, בוא נעשה היסטוריה

[Verse 2]
עכשיו תקשיבו לסיפור, קלאסי {{NICKNAME}}
{{FUNNY}}
כולם מתים מצחוק, כי ככה זה איתך
{{TRAIT3}} עד הסוף, אי אפשר שלא לאהוב

מ{{HOBBY}} ועד ראפ על הבמה
אתה מלך, {{NICKNAME}}, זה לא סתם מילים
{{OCCUPATION}} שיודע לעשות הכל
ואנחנו פה כדי להגיד - אתה אחד ויחיד

[Chorus]
יום הולדת שמח, {{NICKNAME}} - בום
{{AGE}} שנים על הפלאנט, ואתה עדיין מספר וואן
כל הצוות פה, מרימים כוסות לשמיים
{{NAME}}, יום הולדת, בוא נעשה היסטוריה

[Bridge]
אז תרים את הידיים, תרגיש את הביט
{{NICKNAME}}, היום שלך, תיהנה מכל רגע
{{AGE}} ועוד מיליון סיבות לחגוג
יום הולדת שמח, המלך של הבלוק`,

    gpt4o: `[Verse 1]
צ'ק וואן טו, הביט ירד כבד
{{NICKNAME}} חוגג {{AGE}}, כולם על הרגליים
{{TRAIT1}} בדי אנ איי, {{TRAIT2}} בפול טיים
{{OCCUPATION}} שחי את החיים בסטייל

{{HOBBY}} - זה הפאשן שלו
ואנחנו פה עכשיו, שרים בשביל המלך
כל בר פה אמיתי, כל מילה מהלב
{{NICKNAME}}, יום הולדת, בוא נפוצץ את הלילה

[Chorus]
{{NICKNAME}}, {{NICKNAME}}, המלך שלנו
{{AGE}} שנים של גדולה, ואתה עדיין עולה
דרופ את הביט, תרים את הידיים
יום הולדת שמח, {{NAME}}, לחיים

[Verse 2]
ועכשיו לרגע של אמת, סיפור קטן
{{FUNNY}}
אין עליך {{NICKNAME}}, אתה לג'נד אמיתי
{{TRAIT3}} שגורם לכולם לחייך

מהבוקר עד הלילה, אתה שובר שיאים
{{HOBBY}} ו{{OCCUPATION}} - קומבו של אלופים
אז היום אנחנו שמים אותך על הביט
ושרים לך יום הולדת, כי אתה פשוט הבסט

[Chorus]
{{NICKNAME}}, {{NICKNAME}}, המלך שלנו
{{AGE}} שנים של גדולה, ואתה עדיין עולה
דרופ את הביט, תרים את הידיים
יום הולדת שמח, {{NAME}}, לחיים

[Bridge]
ביס ביס ביס, אחרון חביב
{{NICKNAME}}, נשאר לך רק לחייך
כי {{AGE}} זה המספר שלך היום
ומחר? מחר נמשיך לחגוג`,

    gemini: `[Verse 1]
הנה הוא מגיע, {{NICKNAME}} על המיקרופון
בן {{AGE}} ועדיין טרי כמו יום ראשון
{{TRAIT1}} בטירוף, {{TRAIT2}} ברמות
{{OCCUPATION}} שיודע לשבור את כל המסגרות

{{HOBBY}} זה הדבר שלו, הוא חי את זה
ואנחנו חיים אותו, כל יום מחדש
אז תעלו את הווליום, תרימו את הבס
כי {{NICKNAME}} חוגג, והלילה לא נגמר

[Chorus]
יום הולדת, יום הולדת ל{{NICKNAME}}
{{AGE}} סיבות לחגוג, ועוד מיליון בדרך
הצוות כולו פה, הביט רועד
{{NAME}}, יום הולדת שמח, בום בום בום

[Verse 2]
ועכשיו קטע של נוסטלגיה, תקשיבו טוב
{{FUNNY}}
כולם על הרצפה, {{NICKNAME}} שוב עושה את שלו
{{TRAIT3}} בכל רגע, בכל מקום

מהסטודיו ועד ל{{HOBBY}}
אתה תמיד הכי חזק, הכי אמיתי
{{OCCUPATION}} עם נשמה של אמן
{{NICKNAME}}, היום הזה שלך, תיקח אותו

[Chorus]
יום הולדת, יום הולדת ל{{NICKNAME}}
{{AGE}} סיבות לחגוג, ועוד מיליון בדרך
הצוות כולו פה, הביט רועד
{{NAME}}, יום הולדת שמח, בום בום בום

[Bridge]
מייק דרופ, הסיפור נגמר
אבל המסיבה? המסיבה רק מתחילה
{{NICKNAME}}, {{AGE}} שנים של אגדה
יום הולדת שמח, נהנים עד הבוקר`,
  },

  mizrachi: {
    claude: `[Verse 1]
יא חביבי {{NICKNAME}}, יא רוח שלי
היום חוגגים לך, בן {{AGE}} ואתה עף
{{TRAIT1}} כמו שאין, {{TRAIT2}} שבוער
{{OCCUPATION}} עם נשמה של מלך ממש

כשאתה עושה {{HOBBY}}, כולם עומדים ומסתכלים
כי אתה עושה את זה עם כל הלב
ו{{FUNNY}}?
וואי וואי וואי, קלאסי אתה {{NICKNAME}}

[Chorus]
יא ללה ללי, יום הולדת שמח
{{NICKNAME}} יא חביבי, היום שלך הגיע
עוד שנה של בריאות, עוד שנה של אהבה
{{NAME}}, כולם פה, כולם שרים לך

[Verse 2]
מהדרבוקה נשמע הביט, החצוצרה עולה
כי {{NICKNAME}} חוגג {{AGE}} והמסיבה בוערת
{{TRAIT3}} אתה, אבל בעיקר אתה אחלה בנאדם
מ{{HOBBY}} ועד ריקודים עד הבוקר

כולם אוהבים אותך, מהמשפחה ועד החברים
כי אתה תמיד שם, תמיד עם חיוך
{{OCCUPATION}} ביום, מלך בלילה
{{NICKNAME}}, אין עליך ואלק

[Chorus]
יא ללה ללי, יום הולדת שמח
{{NICKNAME}} יא חביבי, היום שלך הגיע
עוד שנה של בריאות, עוד שנה של אהבה
{{NAME}}, כולם פה, כולם שרים לך

[Bridge]
אז תרקוד {{NICKNAME}}, תרים את הידיים
הלילה שלך, והכוכבים מחייכים
{{AGE}} ועוד הרבה הרבה שנים
יום הולדת שמח, יא נשמה שלי`,

    gpt4o: `[Verse 1]
שמעו שמעו, הלילה מיוחד
{{NICKNAME}} חוגג {{AGE}}, והעולם מתרגש
{{TRAIT1}} ו{{TRAIT2}}, מה עוד אפשר לבקש
{{OCCUPATION}} עם לב חם, שכולם אוהבים אותו

{{HOBBY}} בשעות הפנאי, אבל גם בחיים
{{NICKNAME}} תמיד נותן מאה אחוז ועוד קצת
וואלק, מי יודע את הסיפור הזה?
{{FUNNY}} - קלאסיקה!

[Chorus]
יא חביבי יום הולדת, {{NICKNAME}} מלך
הדרבוקה דופקת, והלב שלנו איתך
{{AGE}} שנים של זהב, עוד מיליון יבואו
{{NAME}}, יום הולדת שמח, אוהבים אותך

[Verse 2]
מהכינרת ועד אילת, כולם מכירים אותך
{{NICKNAME}} שתמיד יודע לגרום לצחוק
{{TRAIT3}} מהסוג הטוב, הסוג שמחמם
ואנחנו פה היום כדי לחגוג אותך

מ{{HOBBY}} ועד ליום הולדת הזה
הדרך הייתה מדהימה, ועוד נמשיך
אז תרים כוסית, ותגיד לחיים
כי {{NICKNAME}}, אתה שווה מיליון

[Chorus]
יא חביבי יום הולדת, {{NICKNAME}} מלך
הדרבוקה דופקת, והלב שלנו איתך
{{AGE}} שנים של זהב, עוד מיליון יבואו
{{NAME}}, יום הולדת שמח, אוהבים אותך

[Bridge]
תדליק את הנרות, תבקש בגדול
כי מגיע לך הכל, {{NICKNAME}} יא גבר
יום הולדת שמח, שהכל יהיה בסדר
אוהבים אותך, עד הירח וחזרה`,

    gemini: `[Verse 1]
וואי וואי וואי, מה הלילה הזה
{{NICKNAME}} חוגג {{AGE}}, והבמה שלו
{{TRAIT1}} כמו שאף אחד לא, {{TRAIT2}} בלי גבול
{{OCCUPATION}} שהפך לאגדה חיה

{{HOBBY}} ומסיבות, זה הקומבו שלו
ו{{FUNNY}}
אנחנו עדיין צוחקים, כי ככה {{NICKNAME}}
תמיד יודע איך לגרום ללב לרקוד

[Chorus]
חביבי {{NICKNAME}}, יום הולדת שמח
הלילה שלך, והמוזיקה בוערת
{{AGE}} שנים ועדיין צעיר בנשמה
{{NAME}}, כל הכבוד, כל האהבה

[Verse 2]
מהבוקר עד הלילה, {{NICKNAME}} חי בגדול
{{TRAIT3}} ומלא חיים, זה הסוד שלו
{{HOBBY}} כשיש זמן, וחגיגות כשצריך
ואנחנו? אנחנו פשוט אוהבים את {{NICKNAME}}

אז היום המוזיקה עולה, הדרבוקה נכנסת
כולם רוקדים ושרים, כי {{NICKNAME}} חוגג
{{OCCUPATION}} בשבוע, מלך בסופשבוע
וואלק, {{NICKNAME}}, מגיע לך הכל

[Chorus]
חביבי {{NICKNAME}}, יום הולדת שמח
הלילה שלך, והמוזיקה בוערת
{{AGE}} שנים ועדיין צעיר בנשמה
{{NAME}}, כל הכבוד, כל האהבה

[Bridge]
אז בוא נרים כוסות, ונשיר ביחד
כי {{NICKNAME}} בן {{AGE}}, וזה סיבה לחגוג
יום הולדת שמח, יא נשמה
שיהיו עוד הרבה שנים של שמחה`,
  },

  comedy: {
    claude: `[Verse 1]
אוקיי אוקיי, תקשיבו טוב
{{NICKNAME}} חוגג {{AGE}}, ועדיין לא למד לבשל
{{TRAIT1}}? כן. {{TRAIT2}}? אולי.
{{OCCUPATION}}? רק כשהבוס מסתכל

{{HOBBY}} - זו ההתמחות שלו
אבל בואו נהיה כנים, הוא עושה את זה בסטייל
וזוכרים את הפעם ש{{FUNNY}}?
אנחנו עדיין משלמים על הטיפולים

[Chorus]
יום הולדת שמח {{NICKNAME}}, יא חיה
{{AGE}} שנים ועדיין בחיים - נס מהשמיים
אנחנו צוחקים איתך, לא עליך... טוב, גם עליך
{{NAME}}, יום הולדת שמח, סליחה על הכל

[Verse 2]
בואו נדבר על {{TRAIT3}}, המאפיין הכי בולט
של {{NICKNAME}} שלנו, ה{{OCCUPATION}} הכי מצחיק
כשאתה עושה {{HOBBY}}, כולם בורחים
לא כי אתה רע, סתם כי זה מפחיד

אבל ברצינות, {{NICKNAME}}, אתה אגדה
מי עוד יכול לעשות {{FUNNY}}
ולצאת מזה בחיים? רק אתה
כי אתה {{NICKNAME}}, והכללים לא חלים עליך

[Chorus]
יום הולדת שמח {{NICKNAME}}, יא חיה
{{AGE}} שנים ועדיין בחיים - נס מהשמיים
אנחנו צוחקים איתך, לא עליך... טוב, גם עליך
{{NAME}}, יום הולדת שמח, סליחה על הכל

[Bridge]
אבל ברגע של רצינות, בלי צחוקים
{{NICKNAME}}, אתה הכי טוב שיש
אנחנו אוהבים אותך עם כל המשוגעות
יום הולדת שמח, יא לג'נד`,

    gpt4o: `[Verse 1]
שימו לב שימו לב, הנה בא {{NICKNAME}}
{{AGE}} שנים על הפלנטה, והיא עדיין שלמה
{{TRAIT1}} - לפחות ככה הוא חושב
{{TRAIT2}} - טוב, זה כבר דיון פתוח

{{OCCUPATION}} שעושה {{HOBBY}} בזמן הפנוי
מה יכול להשתבש? הכל, כנראה
{{FUNNY}}
ומאז? מאז אנחנו פשוט צוחקים

[Chorus]
יום הולדת {{NICKNAME}}, מזל שנולדת
כי בלעדיך, למי היינו צוחקים?
{{AGE}} שנים של בדיחות ובלאגן
{{NAME}}, ממשיך לתת, לעולם אל תפסיק

[Verse 2]
הרופא אמר ש{{NICKNAME}} מיוחד
פשוט לא אמר באיזה כיוון
{{TRAIT3}} ברמה שלא ראיתם
{{OCCUPATION}} שמפחיד את כל הלקוחות

אבל {{HOBBY}}? שם הוא באמת זורח
כמו נורה שרופה, אבל זורח
וכל הסיפורים האלה, הם מרגש
כי {{NICKNAME}}, אתה הבדיחה הכי טובה שלנו

[Chorus]
יום הולדת {{NICKNAME}}, מזל שנולדת
כי בלעדיך, למי היינו צוחקים?
{{AGE}} שנים של בדיחות ובלאגן
{{NAME}}, ממשיך לתת, לעולם אל תפסיק

[Bridge]
אוקיי, רגע של רצינות
{{NICKNAME}}, אנחנו ממש אוהבים אותך
עם כל הטירוף, עם כל הצחוקים
יום הולדת שמח, אל תשתנה לעולם`,

    gemini: `[Verse 1]
חדשות של הבוקר: {{NICKNAME}} חוגג {{AGE}}
העולם נערך, ביטוח הבריאות כבר יודע
{{TRAIT1}} - כך הוא מתאר את עצמו
{{TRAIT2}} - כך המשטרה מתארת אותו

{{OCCUPATION}} במקצוע, {{HOBBY}} בתחביב
שילוב שאף יועץ קריירה לא ימליץ עליו
אבל {{NICKNAME}} לא שומע לאף אחד
וזה בדיוק למה אנחנו אוהבים אותו

[Chorus]
יום הולדת שמח {{NICKNAME}}, יא תותח
{{AGE}} שנים, ועדיין לא נתפסת
מכל הבלאגנים, מכל ההרפתקאות
{{NAME}}, יום הולדת, תמשיך להיות מטורף

[Verse 2]
ועכשיו הסיפור שכולם חיכו לו
{{FUNNY}}
מי עושה דברים כאלה? רק {{NICKNAME}}
{{TRAIT3}} ברמות שהמדע עוד לא הכיר

{{HOBBY}} זה קוד ליום בלי עבודה
ו{{OCCUPATION}} זה קוד ליום בלי {{HOBBY}}
אבל {{NICKNAME}} עושה את שניהם, איכשהו
ועדיין מספיק לישון שלוש שעות

[Chorus]
יום הולדת שמח {{NICKNAME}}, יא תותח
{{AGE}} שנים, ועדיין לא נתפסת
מכל הבלאגנים, מכל ההרפתקאות
{{NAME}}, יום הולדת, תמשיך להיות מטורף

[Bridge]
רגע, רגע, עכשיו ברצינות
{{NICKNAME}}, אתה המתנה הכי טובה שיש
יום הולדת שמח, מגיע לך את הכל
חוץ מהחזר על הנזקים`,
  },

  ballad: {
    claude: `[Verse 1]
{{NICKNAME}} יקר, היום אני רוצה לספר
כמה אתה חשוב, כמה אתה מיוחד
{{AGE}} שנים של חיים מלאים באור
{{TRAIT1}} ו{{TRAIT2}}, איש כזה נדיר

ב{{HOBBY}} מצאת את עצמך
ובתפקיד של {{OCCUPATION}}, נתת מעצמך
כל יום איתך הוא מתנה אמיתית
{{NICKNAME}}, שהעולם ידע איך אתה מאיר

[Chorus]
יום הולדת שמח, אור של חיי
{{NAME}}, המילים האלה מהלב
כל שנה שעוברת, האהבה רק גדלה
יום הולדת שמח, תמיד תישאר

[Verse 2]
ויש את הרגעים האלה, כמו {{FUNNY}}
שמזכירים לנו כמה החיים איתך צבעוניים
{{TRAIT3}} שבך, זה מה שמחבר אותנו
ובכל שנה, הקשר רק מתחזק

מ{{HOBBY}} ועד שיחות עמוקות בלילה
אתה תמיד יודע להיות שם בשביל כולם
{{NICKNAME}}, המילים לא מספיקות
אבל אני מנסה, כי אתה שווה את זה

[Chorus]
יום הולדת שמח, אור של חיי
{{NAME}}, המילים האלה מהלב
כל שנה שעוברת, האהבה רק גדלה
יום הולדת שמח, תמיד תישאר

[Bridge]
אז תעצום עיניים, תרגיש את האהבה
{{AGE}} נרות דולקים, כמו הלב שלנו בשבילך
{{NICKNAME}}, יום הולדת שמח
מאחלים לך הכל, עם כל הלב`,

    gpt4o: `[Verse 1]
יש מישהו שעושה את העולם יפה יותר
ושמו {{NICKNAME}}, ו{{AGE}} שנים הוא כאן
{{TRAIT1}} בלי מאמץ, {{TRAIT2}} מטבעו
{{OCCUPATION}} שנוגע בלבבות כל יום

{{HOBBY}} - המקום שבו הנשמה שלך שרה
ואנחנו שומעים אותה, {{NICKNAME}}, תמיד
כל רגע איתך שווה עולם שלם
והיום, ביום הולדתך, הגיע הזמן להגיד

[Chorus]
תודה, {{NICKNAME}}, על מי שאתה
על כל רגע, על כל חיוך שנתת
{{NAME}}, יום הולדת שמח
שהעולם יחזיר לך את כל הטוב

[Verse 2]
כשאני חושב על {{FUNNY}}
אני מחייך, כי ככה אתה מאיר את חיינו
{{TRAIT3}} מהסוג שמשנה אנשים
{{NICKNAME}}, אתה השיר הכי יפה שיש

מ{{HOBBY}} ועד לרגעים הקטנים
אתה תמיד מלא באור ובאהבה
{{OCCUPATION}} עם לב ענק
{{NICKNAME}}, אין לנו מילים גדולות מספיק

[Chorus]
תודה, {{NICKNAME}}, על מי שאתה
על כל רגע, על כל חיוך שנתת
{{NAME}}, יום הולדת שמח
שהעולם יחזיר לך את כל הטוב

[Bridge]
{{AGE}} נרות, {{AGE}} שנים של אהבה
כל אחד מהם דולק בשבילך
{{NICKNAME}}, יום הולדת שמח
מאחלים לך חיים מלאים ומאושרים`,

    gemini: `[Verse 1]
בשקט של הערב, כשהנרות דולקים
אני חושב עליך {{NICKNAME}}, ואיך הזמן רץ
{{AGE}} שנים כמו רגע, ואתה כל כך גדלת
{{TRAIT1}} ו{{TRAIT2}}, הנשמה שלך כל כך יפה

{{OCCUPATION}} במקצוע, אבל בלב - אתה אמן
{{HOBBY}} הוא המנוחה, המקום שלך בעולם
ו{{FUNNY}}
רגע שנחרט בלב לנצח

[Chorus]
{{NICKNAME}}, יום הולדת שמח
המילים האלה הן שיר מהנשמה
{{NAME}}, שכל חלום שלך יתגשם
ושתמשיך להאיר כמו שרק אתה יודע

[Verse 2]
{{TRAIT3}} - זו המילה שמתארת אותך
{{NICKNAME}}, בלעדיך הכל אפור
מ{{HOBBY}} ועד ערבים של שיחות
אתה תמיד יודע מה להגיד

{{OCCUPATION}} עם לב של זהב טהור
ואנחנו כל כך גאים בך, כל יום מחדש
אז היום, ביום הולדתך
אנחנו שרים לך את השיר הזה

[Chorus]
{{NICKNAME}}, יום הולדת שמח
המילים האלה הן שיר מהנשמה
{{NAME}}, שכל חלום שלך יתגשם
ושתמשיך להאיר כמו שרק אתה יודע

[Bridge]
הנרות דולקים, {{AGE}} אורות קטנים
כל אחד מייצג שנה של אהבה
{{NICKNAME}}, תבקש משאלה
ונדע שהעולם שומע`,
  },

  rock: {
    claude: `[Verse 1]
הגיטרות בוערות, הביט דופק חזק
{{NICKNAME}} חוגג {{AGE}} והבמה שלו
{{TRAIT1}} ו{{TRAIT2}} - רוק סטאר אמיתי
{{OCCUPATION}} ביום, אבל בלילה? הוא מלך

{{HOBBY}} עם אנרגיה שלא נגמרת
{{NICKNAME}}, כשאתה נכנס - כולם מרגישים
ו{{FUNNY}}? זה רוק אנד רול בייבי
מפיל קירות ובונה אגדות

[Chorus]
יום הולדת שמח, {{NICKNAME}} - תרים את הווליום
{{AGE}} שנים של אש, והלהבה עוד בוערת
{{NAME}}, הלילה שלך, הגיטרות בוכות
יום הולדת שמח, רוק אנד רול

[Verse 2]
{{TRAIT3}} - זה הסימן המסחרי שלך
כמו אנקור שאף פעם לא נגמר
מ{{HOBBY}} ועד חגיגות לילה
{{NICKNAME}}, אתה החיים עצמם

{{OCCUPATION}} שיודע לחיות בגדול
ואנחנו שרים לך בקולות של רעם
כי {{NICKNAME}}, היום הולדת שלך
ואין כוח בעולם שיעצור את המסיבה

[Chorus]
יום הולדת שמח, {{NICKNAME}} - תרים את הווליום
{{AGE}} שנים של אש, והלהבה עוד בוערת
{{NAME}}, הלילה שלך, הגיטרות בוכות
יום הולדת שמח, רוק אנד רול

[Bridge]
מיתרים רועדים, תופים מתפוצצים
{{NICKNAME}} בן {{AGE}}, והוא עדיין חי ובועט
יום הולדת שמח, יא אגדה
תמשיך לנגן, תמשיך לחיות`,

    gpt4o: `[Verse 1]
אחד שתיים שלוש ארבע, הנה זה מתחיל
{{NICKNAME}} בן {{AGE}}, הנה בא הטייפון
{{TRAIT1}} כמו גיטרה חשמלית
{{TRAIT2}} כמו סולו שלא נגמר

{{OCCUPATION}} מתשע עד חמש, רוקר מחמש ומעלה
{{HOBBY}} בסטייל של מי ש{{AGE}} ולא אכפת לו
ו{{FUNNY}}? זה הקטע הכי רוק
שאי פעם קרה ל{{NICKNAME}}

[Chorus]
{{NICKNAME}}, יום הולדת שמח
הגיטרה צורחת, התופים רועדים
{{AGE}} שנים של רוק אנד רול
{{NAME}}, הלילה - אנחנו שורפים את הבמה

[Verse 2]
{{TRAIT3}} - כמו ריף שנתקע בראש
{{NICKNAME}} שלנו, האיש, האגדה, הבאס
מ{{HOBBY}} ועד להופעה חיה
הוא תמיד נותן מאה אחוז ועוד

{{OCCUPATION}} עם גיטרה אוויר
ואנחנו פה שרים לו עד שהגרון נשבר
כי {{NICKNAME}}, היום שלך
ואנחנו לא הולכים הביתה

[Chorus]
{{NICKNAME}}, יום הולדת שמח
הגיטרה צורחת, התופים רועדים
{{AGE}} שנים של רוק אנד רול
{{NAME}}, הלילה - אנחנו שורפים את הבמה

[Bridge]
תדליק את המצית, תנפנף באוויר
{{NICKNAME}} בן {{AGE}}, ועדיין הכי מגניב
יום הולדת שמח, רוק פוראבר
הלילה שלך, {{NICKNAME}}, לנצח`,

    gemini: `[Verse 1]
קיק דראם, סנייר, בס נכנס חזק
{{NICKNAME}} על הבמה, בן {{AGE}} ובוער
{{TRAIT1}} ו{{TRAIT2}}, אנרגיה של רוקר
{{OCCUPATION}} ביום, רוק סטאר בחשיכה

{{HOBBY}} עם דיסטורשן מלא
{{NICKNAME}}, אתה האנקור של כולנו
ו{{FUNNY}}
זה הסולו הכי מטורף שנשמע פה

[Chorus]
יום הולדת {{NICKNAME}} - רוק אנד רול
{{AGE}} שנים, והמוזיקה לא נעצרת
{{NAME}}, תרים את הידיים
יום הולדת שמח, עד שהמגבר יתפוצץ

[Verse 2]
{{TRAIT3}} כמו אקורד שלא נשכח
{{NICKNAME}}, אתה המנגינה של החיים שלנו
מ{{HOBBY}} ועד לילות של רוק
אתה חי את החיים בווליום מקסימלי

{{OCCUPATION}} שמנגן גיטרה אוויר
ואנחנו פה בשבילך, מרימים ידיים
כי {{NICKNAME}}, היום שלך
והגיטרות לא ינוחו

[Chorus]
יום הולדת {{NICKNAME}} - רוק אנד רול
{{AGE}} שנים, והמוזיקה לא נעצרת
{{NAME}}, תרים את הידיים
יום הולדת שמח, עד שהמגבר יתפוצץ

[Bridge]
הנרות על העוגה רועדים מהבאס
{{NICKNAME}} בן {{AGE}}, ועוד מליון שנה של רוק
יום הולדת שמח
הבמה שלך, הלילה שלך, הקהל שלך`,
  },

  classic: {
    claude: `[Verse 1]
בליל מיוחד כזה, תחת כוכבי הזהב
{{NICKNAME}} חוגג {{AGE}}, בסטייל שאין כמוהו
{{TRAIT1}} ו{{TRAIT2}}, ג'נטלמן אמיתי
{{OCCUPATION}} עם טעם משובח

בעניין של {{HOBBY}}, אין עליך דבר
{{NICKNAME}}, אתה קלאסיקה שלא יוצאת מהאופנה
ו{{FUNNY}} - סיפור שנשמע
כמו ג'אז - עם הפתעות בכל פינה

[Chorus]
יום הולדת שמח, {{NICKNAME}}, בסטייל של פעם
{{AGE}} שנים של אלגנטיות, כמו יין משובח
{{NAME}}, הלילה שלך, הפסנתר מנגן
יום הולדת שמח, שנה נפלאה

[Verse 2]
כמו סווינג קלאסי, אתה מרקיד את כולם
{{TRAIT3}} בטעם טוב, ובסטייל מושלם
מ{{HOBBY}} ועד ערבי ג'אז מושלמים
{{NICKNAME}}, אתה הנעימה הכי יפה

{{OCCUPATION}} עם נגיעה של אומנות
ואנחנו שרים לך בתשע שמינית
כי {{NICKNAME}}, בן {{AGE}} ומשגשג
והלילה, כולנו חוגגים אותך

[Chorus]
יום הולדת שמח, {{NICKNAME}}, בסטייל של פעם
{{AGE}} שנים של אלגנטיות, כמו יין משובח
{{NAME}}, הלילה שלך, הפסנתר מנגן
יום הולדת שמח, שנה נפלאה

[Bridge]
אז תרים כוס שמפניה, {{NICKNAME}}
כי {{AGE}} זה גיל שנהנים ממנו
יום הולדת שמח, בסטייל קלאסי
שהשנה הזו תהיה המנגינה הכי יפה`,

    gpt4o: `[Verse 1]
ברגע שהפסנתר מתחיל לנגן
ו{{NICKNAME}} נכנס לחדר, הכל משתנה
{{AGE}} שנים של קלאסיקה, של טעם טוב
{{TRAIT1}} ו{{TRAIT2}}, שילוב מושלם

{{OCCUPATION}} עם סטייל, {{HOBBY}} עם שיק
{{NICKNAME}}, אתה כמו אקורד מושלם
ו{{FUNNY}}
סיפור שהפך לקלאסיקה משפחתית

[Chorus]
{{NICKNAME}}, יום הולדת שמח
כמו מנגינה שחוזרת אליך שוב ושוב
{{AGE}} שנים, כל אחת שווה זהב
{{NAME}}, הלילה הזה בשבילך

[Verse 2]
{{TRAIT3}} כמו סולו ג'אז אלגנטי
{{NICKNAME}}, אתה תמיד יודע מתי להיכנס
מ{{HOBBY}} ועד לרגעים הגדולים
אתה הריתמוס של כולנו

{{OCCUPATION}} שהפך לאמן
ואנחנו שרים לך כמו שיר מהתקליט
כי {{NICKNAME}}, יום הולדתך הגיע
ואין לנו מילים יפות מספיק

[Chorus]
{{NICKNAME}}, יום הולדת שמח
כמו מנגינה שחוזרת אליך שוב ושוב
{{AGE}} שנים, כל אחת שווה זהב
{{NAME}}, הלילה הזה בשבילך

[Bridge]
אז בסטייל של פעם, עם טעם של היום
{{NICKNAME}} חוגג {{AGE}} - ובגדול
יום הולדת שמח
שהמוזיקה לא תפסיק לנגן`,

    gemini: `[Verse 1]
בצלילי פסנתר עדינים, וחצוצרה רכה
{{NICKNAME}} חוגג {{AGE}}, ערב של קסם
{{TRAIT1}} ו{{TRAIT2}}, כמו מנגינה עתיקה
{{OCCUPATION}} עם חן שלא נגמר

{{HOBBY}} בין תווים, בין אקורדים
{{NICKNAME}}, אתה הסווינג של חיינו
ו{{FUNNY}}
כמו אימפרוביזציה מושלמת

[Chorus]
יום הולדת שמח, {{NICKNAME}}
{{AGE}} שנים כמו יין יקר
{{NAME}}, הערב מתחיל
יום הולדת בסטייל, שנה של הרמוניה

[Verse 2]
{{TRAIT3}} כמו צלילי קלרינט
{{NICKNAME}}, אתה הנעימה שנשארת בראש
מ{{HOBBY}} ועד ללילות ארוכים
אתה תמיד יודע איך להוסיף צבע

{{OCCUPATION}} מהשורה הראשונה
ואנחנו שרים לך בפול אורקסטרה
כי {{NICKNAME}}, הלילה מיוחד
{{AGE}} שנים ועדיין מפתיע

[Chorus]
יום הולדת שמח, {{NICKNAME}}
{{AGE}} שנים כמו יין יקר
{{NAME}}, הערב מתחיל
יום הולדת בסטייל, שנה של הרמוניה

[Bridge]
אז תרים כוס קוקטייל, {{NICKNAME}}
והפסנתרן ינגן רק בשבילך
יום הולדת שמח, בצלילי ג'אז
שהשנה הזו תהיה הסולו הכי מדהים`,
  },
};

// ============================================================
// ENGLISH LYRICS
// ============================================================

const englishLyrics: Record<string, Record<LyricsModel, string>> = {
  pop: {
    claude: `[Verse 1]
It's a brand new day, the sun is shining bright
{{NICKNAME}}'s turning {{AGE}}, and everything feels right
{{TRAIT1}} and {{TRAIT2}}, that's what makes you, you
From {{HOBBY}} to your smile, in everything you do

Working as a {{OCCUPATION}}, living life your way
{{NICKNAME}}, you light up every room, every single day
And remember when {{FUNNY}}?
That's the kind of magic only you can bring

[Chorus]
Happy birthday {{NICKNAME}}, it's your special day
{{AGE}} years of awesome, hip hip hooray
{{NAME}}, we're singing this for you
Happy birthday, may all your dreams come true

[Verse 2]
{{TRAIT3}} through and through, we love you as you are
{{NICKNAME}}, in our eyes, you'll always be a star
From {{HOBBY}} on the weekends to adventures yet to come
You make this world a better place for everyone

So blow out all the candles, make your biggest wish
'Cause {{NICKNAME}}, you deserve every bit of bliss
{{OCCUPATION}} by day, legend all the time
{{AGE}} never looked so fine

[Chorus]
Happy birthday {{NICKNAME}}, it's your special day
{{AGE}} years of awesome, hip hip hooray
{{NAME}}, we're singing this for you
Happy birthday, may all your dreams come true

[Bridge]
So here's to you, {{NICKNAME}}, the one and only
{{AGE}} candles burning bright, you're never lonely
Happy birthday, from the bottom of our hearts
Here's to a brand new year, a brand new start`,

    gpt4o: `[Verse 1]
Wake up, wake up, it's a celebration
{{NICKNAME}}'s birthday, no more hesitation
{{AGE}} years young and looking so fine
{{TRAIT1}} and {{TRAIT2}}, one of a kind

Love that {{HOBBY}} energy you bring
{{OCCUPATION}} by day, but tonight you're the king
And that time when {{FUNNY}}?
Classic {{NICKNAME}}, wouldn't change a thing

[Chorus]
It's your birthday {{NICKNAME}}, let's party tonight
{{AGE}} years strong, and the future is bright
{{NAME}}, this song is all for you
Happy birthday, we love everything you do

[Verse 2]
{{TRAIT3}} is your middle name, we know it's true
Nobody does it quite the way that you do
From {{HOBBY}} to late-night conversations
You bring the joy to every situation

{{OCCUPATION}} with a heart of gold
The kind of person everybody wants to hold
So let the confetti fall, let the music play
{{NICKNAME}}, this is your birthday day

[Chorus]
It's your birthday {{NICKNAME}}, let's party tonight
{{AGE}} years strong, and the future is bright
{{NAME}}, this song is all for you
Happy birthday, we love everything you do

[Bridge]
Make a wish, close your eyes real tight
{{NICKNAME}}, everything's gonna be alright
{{AGE}} and counting, so much more to see
Happy birthday, you mean the world to me`,

    gemini: `[Verse 1]
Strike up the band, get the party started
{{NICKNAME}}'s turning {{AGE}}, and we're wholehearted
{{TRAIT1}}, {{TRAIT2}}, that's the perfect blend
A {{OCCUPATION}} and the world's best friend

You love your {{HOBBY}}, and we love your style
{{NICKNAME}}, you make every moment worthwhile
And when {{FUNNY}}
We laughed so hard, we're still not recovered

[Chorus]
Happy birthday to you, {{NICKNAME}}
{{AGE}} candles on the cake, it's finally here
{{NAME}}, let's raise a glass
Happy birthday, this day was meant to last

[Verse 2]
{{TRAIT3}} - that's what everyone says
{{NICKNAME}} lights up rooms in a million ways
From {{HOBBY}} to your weekend vibes
You're the kind of person everyone describes

As the one, the only, the absolute best
{{OCCUPATION}} who's better than the rest
So turn the music up, let's dance all night
{{NICKNAME}}, we're celebrating you tonight

[Chorus]
Happy birthday to you, {{NICKNAME}}
{{AGE}} candles on the cake, it's finally here
{{NAME}}, let's raise a glass
Happy birthday, this day was meant to last

[Bridge]
Here's to all the memories we've made
And all the ones still waiting, unafraid
{{NICKNAME}}, happy birthday once more
{{AGE}} is gonna be your best year, for sure`,
  },

  rap: {
    claude: `[Verse 1]
Yo, listen up, this beat is for the legend
{{NICKNAME}} turning {{AGE}}, yeah the party never ended
{{TRAIT1}} and {{TRAIT2}}, that's the combo we respect
{{OCCUPATION}} by day, but at night you're the architect

Of every good time, every memory we treasure
{{HOBBY}} is your thing, and you do it beyond measure
And that story, yo, when {{FUNNY}}
Had the whole crew dying, that's the {{NICKNAME}} way

[Chorus]
Happy birthday {{NICKNAME}}, blow the candles out
{{AGE}} years in the game, that's what I'm talking about
From the whole squad with love, yeah we're screaming it loud
{{NAME}}, it's your day, make us all proud

[Verse 2]
{{TRAIT3}} on the daily, never faking, always real
{{NICKNAME}} in the building, everybody knows the deal
From {{HOBBY}} sessions to the late-night hangouts
You're the MVP, no question, no doubts

{{OCCUPATION}} who runs it like a boss
Without you in our lives, man, we'd all be lost
So here's a birthday anthem, dropping bars with soul
{{NICKNAME}} at {{AGE}}, still on a roll

[Chorus]
Happy birthday {{NICKNAME}}, blow the candles out
{{AGE}} years in the game, that's what I'm talking about
From the whole squad with love, yeah we're screaming it loud
{{NAME}}, it's your day, make us all proud

[Bridge]
So throw your hands up, feel the bass drop low
{{NICKNAME}}'s birthday, and we're stealing the show
{{AGE}} and counting, legend status achieved
Happy birthday, {{NICKNAME}}, you're everything we need`,

    gpt4o: `[Verse 1]
Check it, one two, the beat goes hard
{{NICKNAME}} on the mic, yeah, birthday card
{{AGE}} years deep, still fresh, still fly
{{TRAIT1}} and {{TRAIT2}}, reaching for the sky

{{OCCUPATION}} hustle, {{HOBBY}} passion
{{NICKNAME}} does it all with mad compassion
And yo, remember when {{FUNNY}}?
That's legendary status, documented proof

[Chorus]
It's the birthday anthem for {{NICKNAME}}
{{AGE}} years real, no gimmick
{{NAME}}, we celebrate your name
Birthday vibes, we're fanning the flame

[Verse 2]
{{TRAIT3}} - that's the word on the street
{{NICKNAME}}'s the one that nobody can beat
From {{HOBBY}} goals to the nine-to-five grind
{{OCCUPATION}} with a one-of-a-kind mind

So light the candles up, one by one
{{AGE}} flames burning, we're just getting begun
This birthday rap is certified gold
{{NICKNAME}}'s story is the greatest ever told

[Chorus]
It's the birthday anthem for {{NICKNAME}}
{{AGE}} years real, no gimmick
{{NAME}}, we celebrate your name
Birthday vibes, we're fanning the flame

[Bridge]
Last verse, and I'm keeping it one hundred
{{NICKNAME}}, you're a gift, a straight up wonder
{{AGE}} and thriving, future looking bright
Happy birthday, keep shining your light`,

    gemini: `[Verse 1]
Ayo, the stage is set, the crowd goes wild
{{NICKNAME}} in the spotlight, birthday child
{{AGE}} years of greatness, no cap, no lies
{{TRAIT1}}, {{TRAIT2}}, that's the vibes

{{OCCUPATION}} money, {{HOBBY}} time
{{NICKNAME}} balances it all, every single rhyme
That time when {{FUNNY}}?
Pure {{NICKNAME}} energy, couldn't be anyone else

[Chorus]
Birthday flow for {{NICKNAME}}, turn it up
{{AGE}} years of fire, we can't get enough
{{NAME}}, this one's for you, feel the love
Happy birthday, we're rising above

[Verse 2]
{{TRAIT3}} is the word that fits you best
{{NICKNAME}}, you're above and beyond the rest
{{HOBBY}} on the side, main character energy
{{OCCUPATION}} with a whole lot of synergy

So let the speakers boom, let the bass hit hard
This birthday rap's a personalized birthday card
{{NICKNAME}} at {{AGE}}, still the GOAT
Every bar in this song is a love note

[Chorus]
Birthday flow for {{NICKNAME}}, turn it up
{{AGE}} years of fire, we can't get enough
{{NAME}}, this one's for you, feel the love
Happy birthday, we're rising above

[Bridge]
Mic drop moment, but before I go
{{NICKNAME}}, you should know
You're loved, you're legendary, you're the real deal
Happy birthday, that's the way we feel`,
  },

  rock: {
    claude: `[Verse 1]
Crank the amps up to eleven, let the guitars scream
{{NICKNAME}}'s turning {{AGE}}, living out the dream
{{TRAIT1}} and {{TRAIT2}}, a rockstar in disguise
{{OCCUPATION}} by day, but tonight we're gonna rise

{{HOBBY}} is the fuel that keeps the fire burning bright
{{NICKNAME}}, you're an anthem, you're the reason that we fight
And when {{FUNNY}}
That was punk rock, baby, that was pure and wild

[Chorus]
Happy birthday {{NICKNAME}}, turn the volume up
{{AGE}} years of thunder, and we just can't get enough
{{NAME}}, tonight we're gonna rock this place
Happy birthday, let's shred at our own pace

[Verse 2]
{{TRAIT3}} like a power chord that never fades away
{{NICKNAME}}, you're the encore that we play and play and play
From {{HOBBY}} to the mosh pit, you're the life and soul
{{OCCUPATION}} who knows how to rock and roll

So light the candles up like lighters in the air
{{AGE}} flames are burning, and we're showing that we care
{{NICKNAME}}, this birthday song is your guitar solo
You're the legend, you're the one, you're our rock and roll hero

[Chorus]
Happy birthday {{NICKNAME}}, turn the volume up
{{AGE}} years of thunder, and we just can't get enough
{{NAME}}, tonight we're gonna rock this place
Happy birthday, let's shred at our own pace

[Bridge]
The drums are pounding, the bass is shaking the floor
{{NICKNAME}} at {{AGE}}, and we're screaming for more
Happy birthday, rock on forever
This is your night, now or never`,

    gpt4o: `[Verse 1]
One two three four, here we go again
{{NICKNAME}}'s birthday, let the chaos begin
{{AGE}} years wild, {{TRAIT1}} and {{TRAIT2}} combined
{{OCCUPATION}} who leaves the boring world behind

{{HOBBY}} at full blast, no holding back
{{NICKNAME}} takes the stage and brings the attack
And that epic time when {{FUNNY}}?
That's the stuff that legends are made of

[Chorus]
Rock on {{NICKNAME}}, it's your birthday night
{{AGE}} years of thunder, everything feels right
{{NAME}}, we're turning amps to ten
Happy birthday, let's do this all again

[Verse 2]
{{TRAIT3}} like a riff that's stuck in your head
{{NICKNAME}}, you're the song that's never been said
From {{HOBBY}} adventures to the daily grind
{{OCCUPATION}} with a rebel state of mind

So let the confetti rain like a stadium show
{{NICKNAME}}'s birthday party, stealing the whole show
{{AGE}} candles blazing, mosh pit in the living room
Happy birthday, let the guitars go boom

[Chorus]
Rock on {{NICKNAME}}, it's your birthday night
{{AGE}} years of thunder, everything feels right
{{NAME}}, we're turning amps to ten
Happy birthday, let's do this all again

[Bridge]
Wave your lighter, scream into the night
{{NICKNAME}} at {{AGE}}, burning twice as bright
Happy birthday, rock forever
Our favorite person, now and forever`,

    gemini: `[Verse 1]
Kick drum pounds, snare cracks like lightning
{{NICKNAME}}'s birthday show, and it's so exciting
{{AGE}} years of rocking, {{TRAIT1}} and {{TRAIT2}}
{{OCCUPATION}} who breaks every single rule

{{HOBBY}} is the anthem of their life
{{NICKNAME}} cuts through the noise like a knife
When {{FUNNY}}
That was the most rock and roll thing ever

[Chorus]
Happy birthday {{NICKNAME}} - rock and roll
{{AGE}} years and the music feeds your soul
{{NAME}}, throw your fists up high
Happy birthday, we're gonna light up the sky

[Verse 2]
{{TRAIT3}} like a guitar solo in the rain
{{NICKNAME}}, you make ordinary feel insane
From {{HOBBY}} to your wild weekend nights
{{OCCUPATION}} who's always reaching for the heights

Speakers shaking, neighbors complaining
{{NICKNAME}}'s birthday party, no one's refraining
{{AGE}} candles flickering in the wind
But the fire in your heart will never end

[Chorus]
Happy birthday {{NICKNAME}} - rock and roll
{{AGE}} years and the music feeds your soul
{{NAME}}, throw your fists up high
Happy birthday, we're gonna light up the sky

[Bridge]
The stage is yours, the crowd is waiting
{{NICKNAME}} at {{AGE}}, no more debating
Happy birthday, rock on through the night
You're the star, you're the spotlight`,
  },

  comedy: {
    claude: `[Verse 1]
Alright alright, gather round everyone
{{NICKNAME}}'s turning {{AGE}}, and this is gonna be fun
{{TRAIT1}}? Debatable. {{TRAIT2}}? Let's say sure.
{{OCCUPATION}}? Only when the boss is watching for sure

{{HOBBY}} is their passion, or so they claim
But honestly, we've seen it, and it's kinda... tame
And remember that time when {{FUNNY}}?
We're still paying for the therapy sessions

[Chorus]
Happy birthday {{NICKNAME}}, you beautiful disaster
{{AGE}} years and still alive - couldn't ask for something faster
We laugh with you, not at you... okay, sometimes at you
{{NAME}}, happy birthday, sorry for the roast, we love you too

[Verse 2]
Let's talk about {{TRAIT3}}, your defining feature
{{NICKNAME}}, the world's most entertaining creature
{{OCCUPATION}} who does {{HOBBY}} on the side
A combination that fills us all with... pride?

But seriously though, you're one of a kind
Nobody else could {{FUNNY}}
And walk away with that grin on your face
{{NICKNAME}}, you're a special case, and we mean that literally

[Chorus]
Happy birthday {{NICKNAME}}, you beautiful disaster
{{AGE}} years and still alive - couldn't ask for something faster
We laugh with you, not at you... okay, sometimes at you
{{NAME}}, happy birthday, sorry for the roast, we love you too

[Bridge]
But for real, underneath all the jokes
{{NICKNAME}}, you're the best of folks
We love you exactly as you are
Happy birthday, you ridiculous superstar`,

    gpt4o: `[Verse 1]
Breaking news, everyone, stop the press
{{NICKNAME}} is {{AGE}}, and still a beautiful mess
{{TRAIT1}} on their resume, {{TRAIT2}} in real life
{{OCCUPATION}} by day, professional menace to society at night

{{HOBBY}} is what they call their "talent"
But we've seen the results, and let's just be gallant
That time when {{FUNNY}}?
Yeah, that pretty much sums up {{NICKNAME}}

[Chorus]
Happy birthday {{NICKNAME}}, miracle of science
{{AGE}} years and the world's shown real compliance
We're not sure how you made it, but here you are
{{NAME}}, happy birthday, our very own shooting star

[Verse 2]
{{TRAIT3}} - that's how their mom describes them
The rest of us use words that are less kind
{{OCCUPATION}} who also does {{HOBBY}}
A dual threat that threatens absolutely nobody

But here's the thing about our {{NICKNAME}}
Despite it all, we wouldn't trade a minute
Every disaster, every story, every laughing fit
You make life entertaining, and that's legit

[Chorus]
Happy birthday {{NICKNAME}}, miracle of science
{{AGE}} years and the world's shown real compliance
We're not sure how you made it, but here you are
{{NAME}}, happy birthday, our very own shooting star

[Bridge]
Okay pause, serious moment incoming
{{NICKNAME}}, beneath the roasting and the funning
You're genuinely the best, and we're blessed to know you
Happy birthday, you gorgeous weirdo, here's to you`,

    gemini: `[Verse 1]
Attention please, this is not a drill
{{NICKNAME}} is turning {{AGE}}, and yes, they're still
{{TRAIT1}} according to their dating profile
{{TRAIT2}} according to literally no one else in a mile

{{OCCUPATION}} - their boss is still confused how they got hired
{{HOBBY}} - their friends wish they'd get tired
But that time when {{FUNNY}}?
That, ladies and gentlemen, is peak {{NICKNAME}}

[Chorus]
Happy birthday {{NICKNAME}}, you absolute legend
{{AGE}} years of chaos, beautifully blended
From your biggest fan (and harshest critic too)
{{NAME}}, happy birthday, the world is stuck with you

[Verse 2]
{{TRAIT3}} on a level that's honestly frightening
{{NICKNAME}} enters a room and it's like a sighting
{{OCCUPATION}} slash {{HOBBY}} enthusiast
A combination that leaves everyone... nonplussed

Google "{{NICKNAME}}" and the first result is "why"
But we love them anyway, and here is why
Because life without you would be boring as heck
So happy birthday, you magnificent train wreck

[Chorus]
Happy birthday {{NICKNAME}}, you absolute legend
{{AGE}} years of chaos, beautifully blended
From your biggest fan (and harshest critic too)
{{NAME}}, happy birthday, the world is stuck with you

[Bridge]
Real talk for a second, dropping the act
{{NICKNAME}}, you're incredible, and that's a fact
We love you more than words could ever say
Happy birthday, never ever change, okay?`,
  },

  ballad: {
    claude: `[Verse 1]
In the quiet of the evening, when the stars come out to play
I think of you, {{NICKNAME}}, and all the words I want to say
{{AGE}} years of moments, laughter, tears and light
{{TRAIT1}} and {{TRAIT2}}, you make everything feel right

Your love for {{HOBBY}} shows the passion in your soul
And as a {{OCCUPATION}}, you make broken things feel whole
That time when {{FUNNY}}
Just another reason why you're unforgettable

[Chorus]
Happy birthday {{NICKNAME}}, my heart sings for you
{{AGE}} years of loving you, and the feeling's always new
{{NAME}}, this melody is yours to keep
A birthday promise, gentle and deep

[Verse 2]
{{TRAIT3}} is the word that paints your portrait best
{{NICKNAME}}, you stand above and beyond the rest
From {{HOBBY}} evenings to quiet morning starts
You've woven yourself into the fabric of our hearts

{{OCCUPATION}} with a soul that shines so bright
You guide us through the darkness, you're our guiding light
So on this birthday evening, let me hold you near
And whisper happy birthday, my dear

[Chorus]
Happy birthday {{NICKNAME}}, my heart sings for you
{{AGE}} years of loving you, and the feeling's always new
{{NAME}}, this melody is yours to keep
A birthday promise, gentle and deep

[Bridge]
Close your eyes and make your wish tonight
{{AGE}} candles glowing, soft and bright
{{NICKNAME}}, happy birthday, now and always
Here's to forever, here's to better days`,

    gpt4o: `[Verse 1]
There's someone who makes the world a gentler place
{{NICKNAME}}, it's you, with that warm and loving face
{{AGE}} years of grace, of kindness and of care
{{TRAIT1}} and {{TRAIT2}}, beyond all compare

{{HOBBY}} is where your spirit comes alive
As a {{OCCUPATION}}, you help others thrive
And {{FUNNY}}
A memory that makes me smile through grateful tears

[Chorus]
Thank you, {{NICKNAME}}, for being who you are
For every moment near, for every moment far
{{NAME}}, happy birthday, here's my heart
You've been a masterpiece right from the start

[Verse 2]
{{TRAIT3}} - if only words could say
How much you mean to us, each and every day
From {{HOBBY}} to the quiet talks at night
{{NICKNAME}}, you make everything feel right

{{OCCUPATION}} with hands that heal and mend
A partner, a soulmate, an everlasting friend
So here's a birthday song, so soft and true
{{NICKNAME}}, every word is just for you

[Chorus]
Thank you, {{NICKNAME}}, for being who you are
For every moment near, for every moment far
{{NAME}}, happy birthday, here's my heart
You've been a masterpiece right from the start

[Bridge]
{{AGE}} candles, {{AGE}} years of love
Each one a blessing sent from above
{{NICKNAME}}, happy birthday, my everything
Here's to the beautiful song our lives will sing`,

    gemini: `[Verse 1]
When the world gets loud, you're the quiet calm
{{NICKNAME}}, you're the peace, you're the healing balm
{{AGE}} years of walking beside us through it all
{{TRAIT1}} and {{TRAIT2}}, standing ten feet tall

{{OCCUPATION}} who gives more than they take
{{HOBBY}} is the joy you always make
And {{FUNNY}}
A story we'll be telling for a hundred years

[Chorus]
{{NICKNAME}}, happy birthday, hear this song
{{AGE}} years beautiful, and still going strong
{{NAME}}, these words are wrapped in love
A birthday blessing, gentle as a dove

[Verse 2]
{{TRAIT3}} - the thread that ties us all to you
{{NICKNAME}}, everything you touch turns true
From {{HOBBY}} moments to the bigger things in life
You cut through every struggle like the warmest knife

{{OCCUPATION}} by title, angel by design
You make the ordinary absolutely shine
So let me sing you softly into your new year
{{NICKNAME}}, the birthday song you deserve to hear

[Chorus]
{{NICKNAME}}, happy birthday, hear this song
{{AGE}} years beautiful, and still going strong
{{NAME}}, these words are wrapped in love
A birthday blessing, gentle as a dove

[Bridge]
{{AGE}} wishes, {{AGE}} dreams to chase
{{NICKNAME}}, the world is brighter for your face
Happy birthday, always and forever
Every day with you is a treasure`,
  },

  mizrachi: {
    claude: `[Verse 1]
Oh habibi {{NICKNAME}}, your day has finally come
Turning {{AGE}} and shining brighter than the sun
{{TRAIT1}} and {{TRAIT2}}, a celebration of your soul
{{OCCUPATION}} who always makes us feel whole

From {{HOBBY}} to dancing through the night
{{NICKNAME}}, you bring the warmth, you bring the light
And when {{FUNNY}}
That was pure magic, only you could pull that off

[Chorus]
Ya lalla li, happy birthday to you
{{NICKNAME}}, habibi, the sky is shining blue
{{AGE}} years of blessings, {{AGE}} years of love
{{NAME}}, everyone's here, singing from above

[Verse 2]
The darbuka's playing, the strings are singing sweet
{{NICKNAME}} turning {{AGE}}, and the rhythm's got its beat
{{TRAIT3}} is what you are, through and through
From {{HOBBY}} to birthdays, everything you do

{{OCCUPATION}} by morning, king by night
{{NICKNAME}}, you make every moment feel so right
So let the music play until the morning comes
Because tonight we celebrate the very best of ones

[Chorus]
Ya lalla li, happy birthday to you
{{NICKNAME}}, habibi, the sky is shining blue
{{AGE}} years of blessings, {{AGE}} years of love
{{NAME}}, everyone's here, singing from above

[Bridge]
So dance, {{NICKNAME}}, raise your hands up high
The stars are smiling down on you tonight
{{AGE}} and many more to come
Happy birthday, you're our number one`,

    gpt4o: `[Verse 1]
The night is warm and the music starts to play
{{NICKNAME}} is celebrating, what a beautiful day
{{AGE}} years of sunshine, {{TRAIT1}} and {{TRAIT2}}
{{OCCUPATION}} with a heart that's shining through

{{HOBBY}} on the weekends, joy throughout the week
{{NICKNAME}}, your spirit is the treasure that we seek
And that story - when {{FUNNY}}
We still tell it at every family gathering

[Chorus]
Habibi {{NICKNAME}}, it's your birthday song
{{AGE}} years of dancing, and the night is long
{{NAME}}, the drums are beating for you
Happy birthday, may every wish come true

[Verse 2]
From east to west, they know your name
{{NICKNAME}}, {{TRAIT3}} is your claim to fame
{{HOBBY}} and celebrations, that's your favorite mix
{{OCCUPATION}} who's always got new tricks

So raise a glass, say l'chaim tonight
{{NICKNAME}}, you make this world feel right
The music's playing, the whole family's here
Celebrating you, our darling, our dear

[Chorus]
Habibi {{NICKNAME}}, it's your birthday song
{{AGE}} years of dancing, and the night is long
{{NAME}}, the drums are beating for you
Happy birthday, may every wish come true

[Bridge]
Light the candles, wish upon the flame
{{NICKNAME}} at {{AGE}}, forever young at heart
Happy birthday, from everyone who loves you
May this be your greatest brand new start`,

    gemini: `[Verse 1]
The tabla starts, the strings begin to sing
{{NICKNAME}}'s birthday party, and it's the real thing
{{AGE}} years of warmth and golden memories
{{TRAIT1}}, {{TRAIT2}}, spreading joy with ease

{{OCCUPATION}} by trade, entertainer by nature
{{HOBBY}} is the hobby of this amazing creature
And {{FUNNY}}
A moment etched in all our hearts forever

[Chorus]
Ya habibi {{NICKNAME}}, happy birthday tonight
{{AGE}} years of magic, underneath the starlight
{{NAME}}, the music plays for you
Happy birthday, a celebration overdue

[Verse 2]
{{TRAIT3}} like the rhythm of the drum
{{NICKNAME}}, when you're here, the party's never done
From {{HOBBY}} to this birthday celebration
You're the heart and soul of every occasion

{{OCCUPATION}} who knows how to live
With so much love and laughter left to give
So let the music carry us away
Because {{NICKNAME}}'s birthday is today

[Chorus]
Ya habibi {{NICKNAME}}, happy birthday tonight
{{AGE}} years of magic, underneath the starlight
{{NAME}}, the music plays for you
Happy birthday, a celebration overdue

[Bridge]
Dance until the morning light appears
{{NICKNAME}} at {{AGE}}, the best of years
Happy birthday, our beloved star
You're perfect, exactly as you are`,
  },

  classic: {
    claude: `[Verse 1]
Under crystal chandeliers, with champagne in the air
{{NICKNAME}}'s turning {{AGE}}, with that distinguished flair
{{TRAIT1}} and {{TRAIT2}}, a classic in every way
{{OCCUPATION}} with sophistication on display

When it comes to {{HOBBY}}, you've perfected the art
{{NICKNAME}}, you play life like a grand piano from the heart
And when {{FUNNY}}
That was jazz, baby - unexpected and brilliant

[Chorus]
Happy birthday {{NICKNAME}}, in a style that's all your own
{{AGE}} years of elegance, like fine wine fully grown
{{NAME}}, tonight the piano plays for you
Happy birthday, classy, timeless, and true

[Verse 2]
{{TRAIT3}} like a saxophone solo, smooth and sweet
{{NICKNAME}}, you make every ordinary moment feel elite
From {{HOBBY}} to evenings of fine conversation
You bring a touch of class to every situation

{{OCCUPATION}} with a taste for the finer things
And when you walk into a room, everybody swings
So raise your crystal glass, let the music fill the air
{{NICKNAME}} at {{AGE}}, beyond compare

[Chorus]
Happy birthday {{NICKNAME}}, in a style that's all your own
{{AGE}} years of elegance, like fine wine fully grown
{{NAME}}, tonight the piano plays for you
Happy birthday, classy, timeless, and true

[Bridge]
So here's a toast to you, in the most refined of ways
{{NICKNAME}}, may your {{AGE}}th year be a beautiful new phase
Happy birthday, with a swing and a smile
You make everything worthwhile`,

    gpt4o: `[Verse 1]
As the piano softly plays and the room begins to glow
{{NICKNAME}}'s turning {{AGE}}, putting on a show
{{TRAIT1}} and {{TRAIT2}}, like a melody refined
{{OCCUPATION}} with the most extraordinary mind

{{HOBBY}} with elegance, with grace and with flair
{{NICKNAME}}, there's something special in the air
And that time - {{FUNNY}}
A story for the ages, told with perfect timing

[Chorus]
{{NICKNAME}}, happy birthday, smooth as jazz
{{AGE}} years of style, no one else has what you has
{{NAME}}, the spotlight finds you naturally
Happy birthday, a classic, beautifully

[Verse 2]
{{TRAIT3}} like a chord progression, rich and deep
{{NICKNAME}}, you're the kind of soul we want to keep
From {{HOBBY}} to the grand moments in between
You're the most sophisticated person we have seen

{{OCCUPATION}} who moves through life like art
With a timeless rhythm playing in your heart
So let the brass play softly, let the bass walk slow
{{NICKNAME}} at {{AGE}}, stealing the whole show

[Chorus]
{{NICKNAME}}, happy birthday, smooth as jazz
{{AGE}} years of style, no one else has what you has
{{NAME}}, the spotlight finds you naturally
Happy birthday, a classic, beautifully

[Bridge]
Champagne bubbles rising, as the night goes on
{{NICKNAME}}, your birthday bash from dusk to dawn
Happy birthday, in the most elegant way
Here's to you, here's to today`,

    gemini: `[Verse 1]
Soft piano notes and a clarinet that sings
{{NICKNAME}}'s birthday night, and it's a beautiful thing
{{AGE}} years of living with a touch of class
{{TRAIT1}} and {{TRAIT2}}, raising every glass

{{OCCUPATION}} with an artist's soul inside
{{HOBBY}} is the place where your heart resides
And {{FUNNY}}
Like a perfect jazz improvisation

[Chorus]
Happy birthday {{NICKNAME}}, vintage and divine
{{AGE}} years maturing, like the very finest wine
{{NAME}}, the orchestra is playing just for you
Happy birthday, sophisticated and true

[Verse 2]
{{TRAIT3}} like a melody that lingers on
{{NICKNAME}}, even when the music's done, you carry on
From {{HOBBY}} to the grandest of occasions
You bring elegance to even simple situations

{{OCCUPATION}} of the highest caliber
Your birthday celebration should be spectacular
So let the swing begin, let the trumpets play
{{NICKNAME}}, this is your magnificent day

[Chorus]
Happy birthday {{NICKNAME}}, vintage and divine
{{AGE}} years maturing, like the very finest wine
{{NAME}}, the orchestra is playing just for you
Happy birthday, sophisticated and true

[Bridge]
A toast, a wish, a gentle birthday prayer
{{NICKNAME}} at {{AGE}}, beyond all compare
Happy birthday, may the music never stop
You're forever at the top`,
  },
};

// ============================================================
// MAIN FUNCTION
// ============================================================

const allLyrics: Record<string, Record<string, Record<LyricsModel, string>>> = {
  he: hebrewLyrics,
  en: englishLyrics,
};

export async function generateMockLyrics(
  style: MusicStyle,
  answers: QuestionnaireAnswers,
): Promise<LyricsVariationResult[]> {
  const language = answers.language || 'he';
  const langLyrics = allLyrics[language];

  if (!langLyrics || !langLyrics[style]) {
    // Fallback to pop if the requested style doesn't exist for this language
    const fallbackStyle = langLyrics ? 'pop' : 'pop';
    const fallbackLang = langLyrics ? language : 'he';
    const templates = allLyrics[fallbackLang][fallbackStyle];

    const delay = 1500 + Math.random() * 2000;
    await new Promise((resolve) => setTimeout(resolve, delay));

    const models: LyricsModel[] = ['claude', 'gpt4o', 'gemini'];
    return models.map((model) => ({
      model,
      content: replaceTokens(templates[model], answers),
    }));
  }

  const templates = langLyrics[style];

  // Simulate AI generation delay (1500-3500ms)
  const delay = 1500 + Math.random() * 2000;
  await new Promise((resolve) => setTimeout(resolve, delay));

  const models: LyricsModel[] = ['claude', 'gpt4o', 'gemini'];
  return models.map((model) => ({
    model,
    content: replaceTokens(templates[model], answers),
  }));
}
