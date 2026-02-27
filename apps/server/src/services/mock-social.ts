import type { SocialProfile } from '@birthday-song/shared';

const FAKE_PROFILES: SocialProfile[] = [
  {
    status: 'found',
    name: 'Yossi Cohen',
    estimatedAge: 35,
    personalityTraits: ['Funny', 'Adventurous', 'Sarcastic'],
    hobbies: ['Playing guitar', 'Hiking', 'Cooking'],
    humorStyle: 'Dry and witty, loves puns',
    funnyThings: [
      'Posted a selfie with a burnt omelette captioned "MasterChef material"',
      'Made a reel about debugging code at 3am with dramatic music',
      'His profile bio says "Professional nap enthusiast"',
    ],
    occupationHints: 'Software Developer',
    petInfo: 'Has a cat named Bugfix',
    favoriteFood: 'Sushi (despite the fire alarm incident)',
    travelPlaces: ['Thailand', 'Iceland', 'Patagonia'],
    keyPhrases: ['Living my best life', 'Coffee first', 'Git push and pray'],
    suggestedSongTone: 'funny',
    songMaterial: [
      'Loves to cook but his food is dangerous',
      'Codes by day, rock star by night',
      'His cat runs his life',
    ],
    photoUrls: [
      '/mock-assets/photos/profile-male-1.jpg',
      '/mock-assets/photos/profile-male-2.jpg',
    ],
    profilePhoto: 'https://picsum.photos/400/400?random=1',
  },
  {
    status: 'found',
    name: 'Noa Levi',
    estimatedAge: 30,
    personalityTraits: ['Creative', 'Romantic', 'Dramatic'],
    hobbies: ['Painting', 'Yoga', 'Travel photography'],
    humorStyle: 'Self-deprecating, playful',
    funnyThings: [
      'Posted a "before and after" of her painting that looked exactly the same',
      'Made a story about accidentally wearing two different shoes to a meeting',
      'Her yoga fails compilation has 10K views',
    ],
    occupationHints: 'Interior Designer',
    petInfo: 'Two rescue dogs named Pixel and Brush',
    favoriteFood: 'Shakshuka and anything from her mom',
    travelPlaces: ['Bali', 'Morocco', 'Japan'],
    keyPhrases: ['Creating magic', 'Design is life', 'Namaste in bed'],
    suggestedSongTone: 'mixed',
    songMaterial: [
      'A creative soul who turns everything into art',
      'Her yoga poses are more drama than zen',
      'Two dogs that are basically her children',
    ],
    photoUrls: [
      '/mock-assets/photos/profile-female-1.jpg',
      '/mock-assets/photos/profile-female-2.jpg',
    ],
    profilePhoto: 'https://picsum.photos/400/400?random=2',
  },
  {
    status: 'found',
    name: 'Mike Thompson',
    estimatedAge: 42,
    personalityTraits: ['Athletic', 'Kind', 'Stubborn'],
    hobbies: ['Marathon running', 'Craft beer brewing', 'Woodworking'],
    humorStyle: 'Dad jokes, observational humor',
    funnyThings: [
      'His bio says "Marathon runner, craft beer undoer"',
      'Posted his woodworking "masterpiece" that was clearly a wobbly shelf',
      'Made a video ranking gas station snacks during a road trip',
    ],
    occupationHints: 'Project Manager',
    petInfo: 'Golden retriever named Murphy',
    favoriteFood: 'BBQ and homemade bread',
    travelPlaces: ['Scotland', 'New Zealand', 'Colorado'],
    keyPhrases: ['Sunday long run', 'Just one more beer', 'Measure twice, cut once... then cut again'],
    suggestedSongTone: 'funny',
    songMaterial: [
      'Runs marathons but can not run from dad jokes',
      'His woodworking is more creative than functional',
      'Murphy the dog is the real boss of the house',
    ],
    photoUrls: [
      '/mock-assets/photos/profile-male-en-1.jpg',
      '/mock-assets/photos/profile-male-en-2.jpg',
    ],
    profilePhoto: 'https://picsum.photos/400/400?random=3',
  },
];

export async function scanSocialProfile(url: string): Promise<SocialProfile> {
  // Simulate network delay (2 seconds)
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // If the URL contains "private", return private status
  if (url.toLowerCase().includes('private')) {
    return { status: 'private' };
  }

  // If the URL contains "notfound" or "404", return not found
  if (url.toLowerCase().includes('notfound') || url.toLowerCase().includes('404')) {
    return { status: 'not_found' };
  }

  // Pick a profile based on URL hash to be deterministic for the same URL
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  const index = Math.abs(hash) % FAKE_PROFILES.length;

  return FAKE_PROFILES[index];
}
