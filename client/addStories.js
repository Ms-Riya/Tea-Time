// Run this in browser console to add curated stories
const curatedStories = [
  {
    title: "The Finance Bro Nightmare 📈",
    preview: "He spent 2 hours explaining cryptocurrency to me without asking if I was interested. When I mentioned I work in finance, he said 'that's cute, but this is real money stuff.' Sir, I manage a $50M portfolio.",
    author: "WallStreetWoman",
    ex_name: "Crypto Chad",
    location: "Overpriced cocktail bar",
    tags: "finance-bro,mansplaining,condescending,cryptocurrency,career",
    premium: true
  },
  {
    title: "Green Flag King Alert 👑",
    preview: "He noticed I was having a rough day and showed up with my favorite coffee, a handwritten note, and said 'No pressure to hang out, just wanted you to know someone's thinking of you.' I CANNOT with this man! 😭",
    author: "BlessedGirl",
    ex_name: "The Sweetheart",
    location: "My doorstep",
    tags: "green-flags,thoughtful,keeper,coffee,sweet",
    premium: true
  },
  {
    title: "The Audacity Chronicles 💅",
    preview: "This man really asked me to split the bill on a first date, then had the NERVE to ask if I wanted to come back to his place. Sir, you couldn't even pay for my $12 salad and you think I'm coming to see your studio apartment?",
    author: "TeaSpiller",
    ex_name: "Cheap Charlie",
    location: "Some basic restaurant",
    tags: "first-date,cheap,audacity,dating-fails",
    premium: false
  },
  {
    title: "Househusband Material Found 🏠",
    preview: "This man meal prepped for BOTH of us, has plants that are actually alive, and his bathroom is cleaner than mine. When I complimented his cooking, he said 'I love taking care of people I care about.' MARRY ME.",
    author: "DomesticBliss",
    ex_name: "The Homemaker",
    location: "His spotless apartment",
    tags: "green-flags,domestic,cooking,caring,clean,keeper",
    premium: true
  },
  {
    title: "The Breadcrumber Returns 🍞",
    preview: "Three months of 'hey stranger' texts at 2 AM, zero actual dates planned. Then he posts on Instagram with another girl calling her his 'queen.' The DISRESPECT. I'm blocking and moving ON.",
    author: "DoneWithGames",
    ex_name: "Late Night Larry",
    location: "My DMs (unfortunately)",
    tags: "breadcrumbing,texting,inconsistent,social-media",
    premium: false
  },
  {
    title: "Emotional Intelligence King 👑",
    preview: "When I had a panic attack, he didn't try to 'fix' me or tell me to call down. He just sat with me, brought me water, and asked what I needed. This is what emotional maturity looks like!",
    author: "SafeSpace",
    ex_name: "The Supporter",
    location: "His car",
    tags: "green-flags,emotional-support,mental-health,maturity,keeper",
    premium: true
  },
  {
    title: "Love Language Expert 💕",
    preview: "He learned my love language is acts of service and now fills my car with gas, meal preps my lunches, and handles all the adulting I hate. Found my person and he speaks fluent care.",
    author: "LoveLanguageLearner",
    ex_name: "Service King",
    location: "Living my best life",
    tags: "green-flags,love-language,acts-of-service,caring,relationship-goals",
    premium: true
  },
  {
    title: "The Gaslighting Olympics 🏆",
    preview: "He cheated, I caught him, and somehow I ended up apologizing for 'invading his privacy' by reading the messages. The mental gymnastics this man performed deserve a gold medal.",
    author: "GaslitSurvivor",
    ex_name: "The Manipulator",
    location: "Crazytown",
    tags: "red-flags,gaslighting,cheating,manipulation,toxic",
    premium: false
  }
];

// Function to add stories
async function addCuratedStories() {
  // Import supabase from the lib
  const { supabase } = await import('./lib/supabase.js');
  
  console.log('🔥 Adding curated stories to Tea Time...');
  
  for (const story of curatedStories) {
    try {
      const result = await supabase.from('stories').insert({
        ...story,
        image_url: null,
        is_blurred: false
      }).select().single();
      
      if (result.error) {
        console.error('❌ Error adding story:', story.title, result.error);
      } else {
        console.log('✅ Added story:', story.title);
      }
    } catch (error) {
      console.error('💥 Failed to add story:', story.title, error);
    }
  }
  
  console.log('🎉 Finished adding curated stories!');
  console.log('📱 Refresh the app to see the new stories');
}

// Export the function
window.addCuratedStories = addCuratedStories;

console.log('💡 Run addCuratedStories() to add quality stories to your app!');
