// Bulletproof Supabase client with comprehensive error protection
console.log(
  "🔧 Initializing ultra-safe Supabase client with maximum error protection",
);

// Mock data for fallback
const fallbackStories = [
  {
    id: "local-1",
    title: "The Dating App Disaster 📱",
    preview:
      "Met someone online who used their ex's photos from 5 years ago. The audacity! When I confronted them, they said 'those were my aspirational photos' 😂",
    author: "CatfishDetective",
    ex_name: "Fake Profile Frank",
    location: "Coffee shop downtown",
    image_url: null,
    is_blurred: false,
    created_at: new Date(Date.now() - 3600000).toISOString(),
    comments: "1542",
    flags_red: "2156",
    flags_green: "108",
    hearts: "8900",
    tags: "red-flags,online-dating,catfish",
    premium: false,
    author_id: "user-1",
  },
  {
    id: "local-2",
    title: "Green Flag Paradise Found 💚",
    preview:
      "Finally found someone who remembers my coffee order, brings soup when I'm sick, and actually listens when I talk. They exist! Send help, I think I'm in love 🥰",
    author: "BlessedAndLucky",
    ex_name: "The Perfect One",
    location: "My apartment",
    image_url: null,
    is_blurred: false,
    created_at: new Date(Date.now() - 7200000).toISOString(),
    comments: "2378",
    flags_red: "12",
    flags_green: "4289",
    hearts: "12445",
    tags: "green-flags,healthy-relationship,love",
    premium: true,
    author_id: "user-2",
  },
  {
    id: "local-3",
    title: "Plot Twist of the Century 🎭",
    preview:
      "Discovered my 'ex' was married the whole time. Plot twist: his wife found my number and we became besties. Now we're planning a girls trip to Bali! 🏝️",
    author: "PlotTwistQueen",
    ex_name: "The Married Liar",
    location: "His wife's living room",
    image_url: null,
    is_blurred: false,
    created_at: new Date(Date.now() - 10800000).toISOString(),
    comments: "3234",
    flags_red: "567",
    flags_green: "1123",
    hearts: "9567",
    tags: "plot-twist,friendship,karma",
    premium: false,
    author_id: "user-3",
  },
  {
    id: "local-4",
    title: "The Breadcrumber 🍞",
    preview:
      "He only texts me at 2 AM saying 'wyd' and then disappears for days. Sir, this is not a late-night snack ordering service! The bar is in hell and he brought a shovel.",
    author: "OverIt2024",
    ex_name: "2AM Texter",
    location: "My DMs unfortunately",
    image_url: null,
    is_blurred: false,
    created_at: new Date(Date.now() - 14400000).toISOString(),
    comments: "1889",
    flags_red: "3234",
    flags_green: "45",
    hearts: "7156",
    tags: "red-flags,breadcrumbing,late-night-texts,disrespect",
    premium: false,
    author_id: "user-4",
  },
  {
    id: "local-5",
    title: "He Cooks AND Cleans?! 👨‍🍳",
    preview:
      "Y'all, I came home to him making dinner, laundry folded, and flowers on the counter 'just because.' I asked what he did wrong and he was genuinely confused. Men like this exist?!",
    author: "Spoiled4Life",
    ex_name: "House Husband Goals",
    location: "Our shared apartment",
    image_url: null,
    is_blurred: false,
    created_at: new Date(Date.now() - 18000000).toISOString(),
    comments: "2956",
    flags_red: "21",
    flags_green: "6445",
    hearts: "11678",
    tags: "green-flags,cooking,cleaning,thoughtful,relationship-goals",
    premium: true,
    author_id: "user-5",
  },
  {
    id: "local-6",
    title: "The Cheapskate Chronicles 💸",
    preview:
      "This man asked ME to pay for HIS coffee because he 'forgot his wallet' for the 5th time. Then had the nerve to order the most expensive drink on the menu. The math ain't mathing!",
    author: "WalletWatcher",
    ex_name: "Broke Boy Bradley",
    location: "Starbucks",
    image_url: null,
    is_blurred: false,
    created_at: new Date(Date.now() - 21600000).toISOString(),
    comments: "1567",
    flags_red: "2189",
    flags_green: "43",
    hearts: "6134",
    tags: "red-flags,cheap,money-issues,first-date",
    premium: false,
    author_id: "user-6",
  },
  {
    id: "local-7",
    title: "Emotional Intelligence King 👑",
    preview:
      "When I had a panic attack, he didn't try to 'fix' me or tell me to calm down. He just sat with me, brought me water, and asked what I needed. This is what emotional maturity looks like!",
    author: "SafeSpace",
    ex_name: "The Supporter",
    location: "His car",
    image_url: null,
    is_blurred: false,
    created_at: new Date(Date.now() - 25200000).toISOString(),
    comments: "3123",
    flags_red: "10",
    flags_green: "7567",
    hearts: "13789",
    tags: "green-flags,emotional-support,mental-health,maturity,keeper",
    premium: true,
    author_id: "user-7",
  },
  {
    id: "local-8",
    title: "The Instagram Stalker 📸",
    preview:
      "Found out he's been screenshotting my female friends' stories and saving them to his phone. When confronted, he said it was 'for the aesthetic.' Boy, what aesthetic?! The restraining order aesthetic?",
    author: "CreepedOut",
    ex_name: "Screenshot Steve",
    location: "Everywhere apparently",
    image_url: null,
    is_blurred: false,
    created_at: new Date(Date.now() - 28800000).toISOString(),
    comments: "1998",
    flags_red: "4345",
    flags_green: "21",
    hearts: "6167",
    tags: "red-flags,stalking,social-media,creepy,boundaries",
    premium: false,
    author_id: "user-8",
  },
  {
    id: "local-9",
    title: "Family Approval Secured 👨‍👩‍👧‍👦",
    preview:
      "Not only did he charm my parents, but he remembered my grandma's birthday and sent her flowers. My dad, who hates everyone I date, asked when we're getting married. I can't even...",
    author: "FamilyFavorite",
    ex_name: "The Charmer",
    location: "Family dinner",
    image_url: null,
    is_blurred: false,
    created_at: new Date(Date.now() - 32400000).toISOString(),
    comments: "2145",
    flags_red: "32",
    flags_green: "5389",
    hearts: "9456",
    tags: "green-flags,family-approval,thoughtful,marriage-material",
    premium: false,
    author_id: "user-9",
  },
  {
    id: "local-10",
    title: "The Gaslighting Olympics 🏆",
    preview:
      "He cheated, I caught him, and somehow I ended up apologizing for 'invading his privacy' by reading the messages. The mental gymnastics this man performed deserve a gold medal.",
    author: "GaslitSurvivor",
    ex_name: "The Manipulator",
    location: "Crazytown",
    image_url: null,
    is_blurred: false,
    created_at: new Date(Date.now() - 36000000).toISOString(),
    comments: "1589",
    flags_red: "5456",
    flags_green: "20",
    hearts: "7234",
    tags: "red-flags,gaslighting,cheating,manipulation,toxic",
    premium: false,
    author_id: "user-10",
  },
  {
    id: "local-11",
    title: "Surprise Date Night Success ✨",
    preview:
      "He planned an entire surprise date around things I mentioned liking months ago. Mini golf (I said I wanted to try), my favorite Thai food, and ended at the bookstore. He was taking notes all along!",
    author: "DetailedLove",
    ex_name: "The Listener",
    location: "Around town",
    image_url: null,
    is_blurred: false,
    created_at: new Date(Date.now() - 39600000).toISOString(),
    comments: "1567",
    flags_red: "21",
    flags_green: "3234",
    hearts: "8345",
    tags: "green-flags,surprise-date,listening,thoughtful,planning",
    premium: false,
    author_id: "user-11",
  },
  {
    id: "local-12",
    title: "The Pick-Me Energy 🤡",
    preview:
      "She kept saying she's 'not like other girls' and how she 'doesn't have female friends because drama.' Girl, the common denominator is YOU. Red flag parade with confetti cannons!",
    author: "DramaDetector",
    ex_name: "Pick-Me Patricia",
    location: "Girls night (ironically)",
    image_url: null,
    is_blurred: false,
    created_at: new Date(Date.now() - 43200000).toISOString(),
    comments: "2134",
    flags_red: "2189",
    flags_green: "67",
    hearts: "5123",
    tags: "red-flags,pick-me,female-dating,internalized-misogyny",
    premium: false,
    author_id: "user-12",
  },
  {
    id: "local-13",
    title: "The Finance Bro Nightmare 📈",
    preview:
      "He spent 2 hours explaining cryptocurrency to me without asking if I was interested. When I mentioned I work in finance, he said 'that's cute, but this is real money stuff.' Sir, I manage a $50M portfolio.",
    author: "WallStreetWoman",
    ex_name: "Crypto Chad",
    location: "Overpriced cocktail bar",
    image_url: null,
    is_blurred: false,
    created_at: new Date(Date.now() - 1800000).toISOString(),
    comments: "3456",
    flags_red: "6789",
    flags_green: "145",
    hearts: "15823",
    tags: "finance-bro,mansplaining,condescending,cryptocurrency,career",
    premium: true,
    author_id: "user-13",
  },
  {
    id: "local-14",
    title: "Househusband Material Found 🏠",
    preview:
      "This man meal prepped for BOTH of us, has plants that are actually alive, and his bathroom is cleaner than mine. When I complimented his cooking, he said 'I love taking care of people I care about.' MARRY ME.",
    author: "DomesticBliss",
    ex_name: "The Homemaker",
    location: "His spotless apartment",
    image_url: null,
    is_blurred: false,
    created_at: new Date(Date.now() - 5400000).toISOString(),
    comments: "4245",
    flags_red: "18",
    flags_green: "8892",
    hearts: "16567",
    tags: "green-flags,domestic,cooking,caring,clean,keeper",
    premium: true,
    author_id: "user-14",
  },
  {
    id: "local-15",
    title: "Love Language Expert 💕",
    preview:
      "He learned my love language is acts of service and now fills my car with gas, meal preps my lunches, and handles all the adulting I hate. Found my person and he speaks fluent care.",
    author: "LoveLanguageLearner",
    ex_name: "Service King",
    location: "Living my best life",
    image_url: null,
    is_blurred: false,
    created_at: new Date(Date.now() - 900000).toISOString(),
    comments: "2890",
    flags_red: "15",
    flags_green: "7234",
    hearts: "14567",
    tags: "green-flags,love-language,acts-of-service,caring,relationship-goals",
    premium: true,
    author_id: "user-15",
  },
  {
    id: "local-16",
    title: "The Ex Who Kept My Netflix Password 📺",
    preview:
      "Three months post-breakup and he's still using my Netflix. Watching rom-coms at 2 AM with someone else. The audacity to cry during 'The Notebook' on MY account while I'm locked out because too many devices are streaming.",
    author: "StreamingStruggles",
    ex_name: "Netflix Thief Nick",
    location: "My couch, but not really",
    image_url: null,
    is_blurred: false,
    created_at: new Date(Date.now() - 1800000).toISOString(),
    comments: "3456",
    flags_red: "5234",
    flags_green: "89",
    hearts: "18900",
    tags: "breakup,petty,netflix,boundaries,ex-drama",
    premium: false,
    author_id: "user-16",
  },
  {
    id: "local-17",
    title: "He Cleaned My Entire Apartment 🧹",
    preview:
      "Came home from a 12-hour shift to find my place spotless. Dishes done, laundry folded, fresh flowers on the counter. He said 'You work so hard, thought you deserved to come home to peace.' I might just marry this man.",
    author: "SpoiledByLove",
    ex_name: "Cleaning Angel Chris",
    location: "My now-spotless apartment",
    image_url: null,
    is_blurred: false,
    created_at: new Date(Date.now() - 2700000).toISOString(),
    comments: "2134",
    flags_red: "5",
    flags_green: "8967",
    hearts: "21450",
    tags: "green-flags,acts-of-service,cleaning,thoughtful,keeper",
    premium: true,
    author_id: "user-17",
  },
  {
    id: "local-18",
    title: "The Parking Lot Philosopher 🚗",
    preview:
      "My date spent 45 minutes explaining why he doesn't 'believe' in tipping because 'it's enabling capitalism.' Then asked me to Venmo him for gas money. Sir, this is a Wendy's parking lot and your philosophical inconsistencies are showing.",
    author: "LogicDetector",
    ex_name: "Hypocrite Henry",
    location: "Wendy's parking lot",
    image_url: null,
    is_blurred: false,
    created_at: new Date(Date.now() - 3600000).toISOString(),
    comments: "4567",
    flags_red: "6789",
    flags_green: "45",
    hearts: "16780",
    tags: "first-date,cheap,philosophy,hypocrisy,red-flags",
    premium: false,
    author_id: "user-18",
  },
  {
    id: "local-19",
    title: "Surprise Birthday Detective Work 🎂",
    preview:
      "Thought he forgot my birthday until I came home to 47 photos printed from my Instagram, recreating my childhood bedroom, and a cake made from scratch because he remembered I mentioned missing my mom's recipe. Three months of secret planning. I'm crying.",
    author: "BirthdayBlessed",
    ex_name: "Detective Daniel",
    location: "My heart",
    image_url: null,
    is_blurred: false,
    created_at: new Date(Date.now() - 4500000).toISOString(),
    comments: "1876",
    flags_red: "8",
    flags_green: "9876",
    hearts: "24500",
    tags: "birthday,thoughtful,planning,green-flags,emotional-intelligence",
    premium: true,
    author_id: "user-19",
  },
  {
    id: "local-20",
    title: "The Group Chat Exposé 💬",
    preview:
      "His phone died and he asked to use mine to call his friend. Screen-shared to the group chat where they rated my photos 1-10 and discussed my 'potential.' Plot twist: I screenshot everything and sent it to my group chat. The reviews are in, ladies.",
    author: "ReceiptsCollector",
    ex_name: "Rating Ryan",
    location: "The group chat evidence locker",
    image_url: null,
    is_blurred: false,
    created_at: new Date(Date.now() - 5400000).toISOString(),
    comments: "5678",
    flags_red: "8234",
    flags_green: "234",
    hearts: "19800",
    tags: "group-chat,rating,disrespect,screenshots,exposed",
    premium: false,
    author_id: "user-20",
  },
  {
    id: "local-21",
    title: "Library Date Turned Book Club 📚",
    preview:
      "What started as a simple coffee date turned into 4 hours at the library. We ended up reading to each other, sharing favorite quotes, and he made a whole playlist based on the poetry book I mentioned. Intellectual connection hits different.",
    author: "BookwormRomance",
    ex_name: "Literature Luke",
    location: "Local library, poetry section",
    image_url: null,
    is_blurred: false,
    created_at: new Date(Date.now() - 6300000).toISOString(),
    comments: "1234",
    flags_red: "12",
    flags_green: "7890",
    hearts: "17650",
    tags: "books,intellectual,connection,poetry,green-flags,library",
    premium: true,
    author_id: "user-21",
  },
  {
    id: "local-22",
    title: "The Spotify Wrapped Confession 🎵",
    preview:
      "His Spotify Wrapped showed he listened to 'drivers license' by Olivia Rodrigo 847 times this year. Sir, are you okay? Do you need therapy? Should I be concerned about your emotional well-being? The breakup was in 2019.",
    author: "SpotifyDetective",
    ex_name: "Sad Song Sam",
    location: "His Spotify stats",
    image_url: null,
    is_blurred: false,
    created_at: new Date(Date.now() - 7200000).toISOString(),
    comments: "2890",
    flags_red: "3456",
    flags_green: "234",
    hearts: "16890",
    tags: "spotify,breakup-songs,emotional-baggage,music-taste,red-flags",
    premium: false,
    author_id: "user-22",
  },
  {
    id: "local-23",
    title: "The Coffee Shop Miracle ☕",
    preview:
      "Barista wrote my name wrong on my cup. He noticed, went back, and got me a new one with the correct spelling just because 'everyone deserves to see their name written right.' The bar for men is on the floor but this one jumped over it.",
    author: "CoffeeAppreciator",
    ex_name: "Considerate Carl",
    location: "Local coffee shop",
    image_url: null,
    is_blurred: false,
    created_at: new Date(Date.now() - 9000000).toISOString(),
    comments: "1567",
    flags_red: "23",
    flags_green: "5678",
    hearts: "19450",
    tags: "coffee,considerate,small-gestures,green-flags,kindness",
    premium: true,
    author_id: "user-23",
  },
  {
    id: "local-24",
    title: "The Ex Who Became a Fitness Influencer 💪",
    preview:
      "Three months post-breakup and suddenly he's a fitness influencer posting thirst traps every day. Sir, you couldn't even open a pickle jar when we were together and now you're flexing for the gram? The transformation is suspicious.",
    author: "PickleJarWitness",
    ex_name: "Fake Flex Felix",
    location: "Instagram explore page",
    image_url: null,
    is_blurred: false,
    created_at: new Date(Date.now() - 10800000).toISOString(),
    comments: "3245",
    flags_red: "2678",
    flags_green: "456",
    hearts: "14567",
    tags: "fitness-influencer,thirst-traps,post-breakup,instagram,fake",
    premium: false,
    author_id: "user-24",
  },
  {
    id: "local-25",
    title: "The Grocery List Love Language 📝",
    preview:
      "He noticed I always forget to buy vegetables and started adding little sticky notes to my grocery list with cute drawings. 'Don't forget spinach! -🥬' Now my fridge is covered in his veggie reminders and my health has improved.",
    author: "NutritionallyLoved",
    ex_name: "Vegetable Victor",
    location: "My kitchen",
    image_url: null,
    is_blurred: false,
    created_at: new Date(Date.now() - 12600000).toISOString(),
    comments: "1789",
    flags_red: "12",
    flags_green: "6789",
    hearts: "22340",
    tags: "grocery-list,health,sticky-notes,caring,green-flags,cute",
    premium: true,
    author_id: "user-25",
  },
  {
    id: "local-26",
    title: "The Podcast Mansplainer 🎧",
    preview:
      "He spent our entire dinner date explaining Joe Rogan podcasts to me. When I mentioned I have my own podcast with 50K downloads, he said 'That's cute but real podcasts are about business and philosophy.' Sir, I interview Nobel Prize winners.",
    author: "PodcastProfessional",
    ex_name: "Rogan Randy",
    location: "Restaurant table",
    image_url: null,
    is_blurred: false,
    created_at: new Date(Date.now() - 14400000).toISOString(),
    comments: "4567",
    flags_red: "6789",
    flags_green: "123",
    hearts: "18976",
    tags: "mansplaining,podcasts,joe-rogan,condescending,career,red-flags",
    premium: false,
    author_id: "user-26",
  },
];

let localStories = [...fallbackStories];
let localComments: any[] = [];

// Fallback user for anonymous usage
const fallbackUser = {
  id: "anonymous-user",
  email: "user@teatime.app",
  user_metadata: { name: "Tea Lover" },
};

// Connection state
let connectionMode: "online" | "offline" | "unknown" = "offline";
let realSupabaseClient: any = null;

// Enhanced safe operation wrapper with multiple layers of protection
async function ultraSafeOperation<T>(
  operation: () => Promise<T>,
  fallbackValue: T,
  timeoutMs: number = 3000,
  context: string = "Supabase Operation",
): Promise<T> {
  return new Promise((resolve) => {
    // First layer: timeout protection
    const timeout = setTimeout(() => {
      console.warn(
        `⚠️ ${context} timed out after ${timeoutMs}ms, using fallback`,
      );
      connectionMode = "offline";
      resolve(fallbackValue);
    }, timeoutMs);

    // Second layer: try-catch with multiple error handling
    try {
      if (!realSupabaseClient) {
        clearTimeout(timeout);
        connectionMode = "offline";
        resolve(fallbackValue);
        return;
      }

      // Third layer: Promise.race with timeout and error handling
      Promise.race([
        operation(),
        new Promise<never>((_, reject) =>
          setTimeout(
            () => reject(new Error(`${context} operation timeout`)),
            timeoutMs - 500,
          ),
        ),
      ])
        .then((result) => {
          clearTimeout(timeout);
          connectionMode = "online";
          resolve(result);
        })
        .catch((error) => {
          clearTimeout(timeout);

          // Fourth layer: specific error type handling
          const errorMessage =
            error?.message || error?.toString() || "Unknown error";

          if (
            errorMessage.includes("Failed to fetch") ||
            errorMessage.includes("NetworkError") ||
            errorMessage.includes("timeout") ||
            errorMessage.includes("AbortError") ||
            error?.name === "TypeError" ||
            error?.code === "NETWORK_ERROR"
          ) {
            console.warn(
              `🌐 ${context} network error (using fallback):`,
              errorMessage,
            );
          } else {
            console.warn(`⚠️ ${context} error (using fallback):`, errorMessage);
          }

          connectionMode = "offline";
          resolve(fallbackValue);
        });
    } catch (syncError) {
      clearTimeout(timeout);
      console.warn(`⚠️ ${context} synchronous error:`, syncError);
      connectionMode = "offline";
      resolve(fallbackValue);
    }
  });
}

// Initialize Supabase client with maximum protection
async function initializeSupabaseClient() {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      // Dynamic import with error handling
      const supabaseModule = (await Promise.race([
        import("@supabase/supabase-js"),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Supabase import timeout")), 3000),
        ),
      ])) as any;

      const { createClient } = supabaseModule;
      realSupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false, // Disable to avoid storage issues
          autoRefreshToken: false, // Disable to prevent network calls
          detectSessionInUrl: false, // Disable URL detection
        },
        realtime: {
          params: {
            eventsPerSecond: 1,
          },
        },
        global: {
          fetch: async (url: RequestInfo | URL, options?: RequestInit) => {
            try {
              // Wrap all Supabase fetch calls with timeout and error handling
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 3000);

              const response = await fetch(url, {
                ...options,
                signal: controller.signal,
              });

              clearTimeout(timeoutId);

              // If the response indicates network unavailable, return error response
              if (response.status === 503) {
                return new Response(
                  JSON.stringify({ error: "Network unavailable" }),
                  {
                    status: 503,
                    statusText: "Service Unavailable",
                    headers: { "Content-Type": "application/json" },
                  },
                );
              }

              return response;
            } catch (error) {
              // Silently handle error and return error response instead of throwing
              return new Response(
                JSON.stringify({ error: "Network unavailable" }),
                {
                  status: 503,
                  statusText: "Service Unavailable",
                  headers: { "Content-Type": "application/json" },
                },
              );
            }
          },
        },
      });

      console.log("✅ Supabase client created with maximum protection");
      return true;
    }
  } catch (error) {
    console.warn("⚠️ Failed to initialize Supabase client:", error);
    realSupabaseClient = null;
    return false;
  }
}

// Initialize client immediately
initializeSupabaseClient();

// Enhanced Supabase client with bulletproof protection
export const supabase = {
  auth: {
    getUser: async () => {
      return ultraSafeOperation(
        async () => {
          const result = await realSupabaseClient.auth.getUser();
          return result;
        },
        {
          data: { user: fallbackUser },
          error: null,
        },
        2000,
        "Auth.getUser",
      );
    },

    getSession: async () => {
      return ultraSafeOperation(
        async () => realSupabaseClient.auth.getSession(),
        {
          data: { session: null },
          error: null,
        },
        2000,
        "Auth.getSession",
      );
    },

    signOut: async () => {
      return ultraSafeOperation(
        async () => realSupabaseClient.auth.signOut(),
        { error: null },
        2000,
        "Auth.signOut",
      );
    },

    signInWithPassword: async (credentials: any) => {
      return ultraSafeOperation(
        async () => realSupabaseClient.auth.signInWithPassword(credentials),
        { error: { message: "Sign-in not available in offline mode" } },
        5000,
        "Auth.signInWithPassword",
      );
    },

    signUp: async (credentials: any) => {
      return ultraSafeOperation(
        async () => realSupabaseClient.auth.signUp(credentials),
        { error: { message: "Sign-up not available in offline mode" } },
        5000,
        "Auth.signUp",
      );
    },

    signInWithOtp: async (credentials: any) => {
      return ultraSafeOperation(
        async () => realSupabaseClient.auth.signInWithOtp(credentials),
        { error: { message: "OTP sign-in not available in offline mode" } },
        5000,
        "Auth.signInWithOtp",
      );
    },

    signInWithOAuth: async (provider: any) => {
      return ultraSafeOperation(
        async () => realSupabaseClient.auth.signInWithOAuth(provider),
        { error: { message: "OAuth sign-in not available in offline mode" } },
        5000,
        "Auth.signInWithOAuth",
      );
    },

    resetPasswordForEmail: async (email: string, options?: any) => {
      return ultraSafeOperation(
        async () =>
          realSupabaseClient.auth.resetPasswordForEmail(email, options),
        { error: { message: "Password reset not available in offline mode" } },
        5000,
        "Auth.resetPasswordForEmail",
      );
    },

    updateUser: async (attributes: any) => {
      return ultraSafeOperation(
        async () => realSupabaseClient.auth.updateUser(attributes),
        { error: { message: "User update not available in offline mode" } },
        5000,
        "Auth.updateUser",
      );
    },

    onAuthStateChange: (callback: any) => {
      try {
        if (!realSupabaseClient) {
          return {
            data: {
              subscription: {
                unsubscribe: () => {},
              },
            },
          };
        }
        return realSupabaseClient.auth.onAuthStateChange(callback);
      } catch (error) {
        console.warn("⚠️ Auth state change listener failed:", error);
        return {
          data: {
            subscription: {
              unsubscribe: () => {},
            },
          },
        };
      }
    },
  },

  from: (table: string) => ({
    select: (columns: string = "*") => {
      const createQueryBuilder = (baseQuery: any) => ({
        eq: (column: string, value: any) => {
          const filtered = baseQuery.filter(
            (item: any) => item[column] === value,
          );
          return {
            single: async () => {
              if (table === "profiles") {
                return ultraSafeOperation(
                  async () =>
                    realSupabaseClient
                      .from(table)
                      .select(columns)
                      .eq(column, value)
                      .single(),
                  {
                    data: {
                      id: "anonymous-user",
                      name: "Tea Lover",
                      email: "user@teatime.app",
                      avatar_url: null,
                      bio: "Sharing stories over virtual tea! ☕️✨",
                      created_at: new Date().toISOString(),
                    },
                    error: null,
                  },
                  2000,
                  `${table}.select.eq.single`,
                );
              }

              return ultraSafeOperation(
                async () =>
                  realSupabaseClient
                    .from(table)
                    .select(columns)
                    .eq(column, value)
                    .single(),
                { data: filtered[0] || null, error: null },
                2000,
                `${table}.select.eq.single`,
              );
            },
            then: async (callback: any) => {
              const result = await ultraSafeOperation(
                async () => {
                  const { data, error } = await realSupabaseClient
                    .from(table)
                    .select(columns)
                    .eq(column, value);
                  return { data, error };
                },
                { data: filtered, error: null },
                2000,
                `${table}.select.eq`,
              );
              return callback(result);
            },
          };
        },

        neq: (column: string, value: any) => {
          const filtered = baseQuery.filter(
            (item: any) => item[column] !== value,
          );
          return {
            limit: (count: number) => ({
              then: async (callback: any) => {
                const result = await ultraSafeOperation(
                  async () => {
                    const { data, error } = await realSupabaseClient
                      .from(table)
                      .select(columns)
                      .neq(column, value)
                      .limit(count);
                    return { data, error };
                  },
                  { data: filtered.slice(0, count), error: null },
                  2000,
                  `${table}.select.neq.limit`,
                );
                return callback(result);
              },
            }),
            then: async (callback: any) => {
              const result = await ultraSafeOperation(
                async () => {
                  const { data, error } = await realSupabaseClient
                    .from(table)
                    .select(columns)
                    .neq(column, value);
                  return { data, error };
                },
                { data: filtered, error: null },
                2000,
                `${table}.select.neq`,
              );
              return callback(result);
            },
          };
        },

        limit: (count: number) => ({
          then: async (callback: any) => {
            const result = await ultraSafeOperation(
              async () => {
                const { data, error } = await realSupabaseClient
                  .from(table)
                  .select(columns)
                  .limit(count);
                return { data, error };
              },
              { data: baseQuery.slice(0, count), error: null },
              2000,
              `${table}.select.limit`,
            );
            return callback(result);
          },
        }),

        order: (column: string, options: any) => ({
          then: async (callback: any) => {
            if (table === "stories") {
              const result = await ultraSafeOperation(
                async () => {
                  const { data, error } = await realSupabaseClient
                    .from(table)
                    .select(columns)
                    .order(column, options);
                  return { data, error };
                },
                {
                  data: [...localStories].sort(
                    (a, b) =>
                      new Date(b.created_at).getTime() -
                      new Date(a.created_at).getTime(),
                  ),
                  error: null,
                },
                3000,
                `${table}.select.order`,
              );
              return callback(result);
            }

            if (table === "comments") {
              const result = await ultraSafeOperation(
                async () => {
                  const { data, error } = await realSupabaseClient
                    .from(table)
                    .select(columns)
                    .order(column, options);
                  return { data, error };
                },
                { data: localComments, error: null },
                2000,
                `${table}.select.order`,
              );
              return callback(result);
            }

            const sorted = [...baseQuery].sort((a, b) => {
              const aVal = a[column];
              const bVal = b[column];
              if (options?.ascending === false) {
                return bVal > aVal ? 1 : -1;
              }
              return aVal > bVal ? 1 : -1;
            });

            return callback({ data: sorted, error: null });
          },
        }),

        then: async (callback: any) => {
          const result = await ultraSafeOperation(
            async () => {
              const { data, error } = await realSupabaseClient
                .from(table)
                .select(columns);
              return { data, error };
            },
            { data: baseQuery, error: null },
            3000,
            `${table}.select`,
          );
          return callback(result);
        },
      });

      // Base data for different tables
      let baseData = [];
      if (table === "stories") {
        baseData = localStories;
      } else if (table === "comments") {
        baseData = localComments;
      } else if (table === "profiles") {
        baseData = [
          {
            id: "anonymous-user",
            name: "Tea Lover",
            email: "user@teatime.app",
            avatar_url: null,
            bio: "Sharing stories over virtual tea! ☕️✨",
            created_at: new Date().toISOString(),
          },
          {
            id: "user-1",
            name: "Story Teller",
            email: "user1@teatime.app",
            avatar_url: null,
            bio: "Love sharing relationship stories! 💕",
            created_at: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            id: "user-2",
            name: "Drama Queen",
            email: "user2@teatime.app",
            avatar_url: null,
            bio: "Here for all the tea! ☕️",
            created_at: new Date(Date.now() - 172800000).toISOString(),
          },
        ];
      }

      return createQueryBuilder(baseData);
    },

    insert: (data: any) => ({
      select: () => ({
        single: async () => {
          if (table === "stories") {
            return ultraSafeOperation(
              async () => {
                const { data: result, error } = await realSupabaseClient
                  .from(table)
                  .insert(data)
                  .select()
                  .single();
                return { data: result, error };
              },
              (() => {
                const newStory = {
                  ...data,
                  id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                  created_at: new Date().toISOString(),
                  comments: "0",
                  flags_red: "0",
                  flags_green: "0",
                  hearts: "0",
                  author_id: fallbackUser.id,
                };
                localStories.unshift(newStory);
                return { data: newStory, error: null };
              })(),
              3000,
              `${table}.insert`,
            );
          }

          if (table === "comments") {
            return ultraSafeOperation(
              async () => {
                const { data: result, error } = await realSupabaseClient
                  .from(table)
                  .insert(data)
                  .select()
                  .single();
                return { data: result, error };
              },
              (() => {
                const newComment = {
                  ...data,
                  id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                  created_at: new Date().toISOString(),
                };
                localComments.push(newComment);
                return { data: newComment, error: null };
              })(),
              3000,
              `${table}.insert`,
            );
          }

          return { data: { ...data, id: Date.now().toString() }, error: null };
        },
      }),
    }),

    update: (data: any) => ({
      eq: (column: string, value: any) => ({
        then: async (callback: any) => {
          const result = await ultraSafeOperation(
            async () => {
              const { data: result, error } = await realSupabaseClient
                .from(table)
                .update(data)
                .eq(column, value);
              return { data: result, error };
            },
            (() => {
              if (table === "stories") {
                const storyIndex = localStories.findIndex(
                  (s) => s.id === value,
                );
                if (storyIndex >= 0) {
                  localStories[storyIndex] = {
                    ...localStories[storyIndex],
                    ...data,
                  };
                }
              }
              return { data: null, error: null };
            })(),
            3000,
            `${table}.update`,
          );
          return callback ? callback(result) : result;
        },
      }),
    }),

    delete: () => ({
      eq: (column: string, value: any) => ({
        then: async (callback: any) => {
          const result = await ultraSafeOperation(
            async () => {
              const { data, error } = await realSupabaseClient
                .from(table)
                .delete()
                .eq(column, value);
              return { data, error };
            },
            (() => {
              if (table === "stories") {
                localStories = localStories.filter((s) => s.id !== value);
              } else if (table === "comments") {
                localComments = localComments.filter((c) => c.id !== value);
              }
              return { data: null, error: null };
            })(),
            3000,
            `${table}.delete`,
          );
          return callback ? callback(result) : result;
        },
      }),
    }),
  }),

  channel: (name: string) => {
    console.log("🔄 Using safe real-time channel (offline mode)");
    return {
      on: () => ({ subscribe: () => ({}) }),
      subscribe: () => ({}),
    };
  },

  removeChannel: (channel: any) => {
    console.log("🔄 Safe channel removal");
    return Promise.resolve();
  },
};

// Connection health check with maximum protection
export const checkSupabaseConnection = async (): Promise<boolean> => {
  return ultraSafeOperation(
    async () => {
      if (!realSupabaseClient) return false;
      const { error } = await realSupabaseClient
        .from("stories")
        .select("count", { count: "exact", head: true });
      return !error;
    },
    false,
    2000,
    "Connection Check",
  );
};

// Get current connection status
export const getConnectionStatus = () => connectionMode;

// Database types
export interface Story {
  id: string;
  title: string;
  preview: string;
  author: string;
  ex_name: string | null;
  location: string | null;
  image_url: string | null;
  is_blurred: boolean;
  created_at: string;
  comments: string | null;
  flags_red: string | null;
  flags_green: string | null;
  hearts: string | null;
  tags: string | null;
  premium: boolean;
  author_id: string | null;
}

export interface Profile {
  id: string;
  name: string | null;
  email: string | null;
  avatar_url: string | null;
  bio?: string | null;
  created_at: string;
}

export interface Comment {
  id: string;
  story_id: string;
  author: string;
  author_id: string;
  content: string;
  created_at: string;
}

console.log(
  "✅ Ultra-safe Supabase client initialized with maximum error protection",
);
