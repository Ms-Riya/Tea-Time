import { useEffect, useState } from "react";
import { supabase, type Story } from "@/lib/supabase";

// Fallback stories for when fetch fails
const fallbackStories: Story[] = [
  {
    id: "fallback-1",
    title: "The Dating App Chronicles 📱",
    preview:
      "So I matched with someone who claimed to be 6'2\" but showed up looking like they had to ask their mom to drive them to our date. The audacity! 😂",
    author: "HeightDetective",
    ex_name: "The Exaggerator",
    location: "Coffee shop downtown",
    image_url: null,
    is_blurred: false,
    created_at: new Date(Date.now() - 3600000).toISOString(),
    comments: "42",
    flags_red: "89",
    flags_green: "12",
    hearts: "156",
    tags: "red-flags,dating-fails,height-lies",
    premium: false,
    author_id: "fallback-user-1",
  },
  {
    id: "fallback-2",
    title: "Green Flag Paradise Found 💚",
    preview:
      "Finally found someone who actually remembers my coffee order, brings soup when I'm sick, and listens when I talk about my day. They EXIST! 🥰",
    author: "LuckyInLove",
    ex_name: "The Good One",
    location: "My apartment",
    image_url: null,
    is_blurred: false,
    created_at: new Date(Date.now() - 7200000).toISOString(),
    comments: "78",
    flags_red: "3",
    flags_green: "234",
    hearts: "445",
    tags: "green-flags,healthy-relationship,keeper",
    premium: true,
    author_id: "fallback-user-2",
  },
  {
    id: "fallback-3",
    title: "Plot Twist of the Year 🎭",
    preview:
      "Discovered my 'ex' was married the whole time. Plot twist: his wife found my number and we became best friends! Now we're planning a girls trip to Greece! ✈️",
    author: "UnexpectedBFF",
    ex_name: "The Married Liar",
    location: "His wife's living room",
    image_url: null,
    is_blurred: false,
    created_at: new Date(Date.now() - 10800000).toISOString(),
    comments: "156",
    flags_red: "67",
    flags_green: "123",
    hearts: "345",
    tags: "plot-twist,friendship,karma",
    premium: false,
    author_id: "fallback-user-3",
  },
];

export function useRealtimeStories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectionMode, setConnectionMode] = useState<"online" | "offline">(
    "offline",
  );

  useEffect(() => {
    // Initial fetch with error handling
    fetchStories();

    // Try to set up real-time subscription only if online
    let cleanup = () => {};

    if (connectionMode === "online") {
      try {
        const channel = supabase
          .channel("stories_changes")
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "stories",
            },
            (payload) => {
              try {
                if (payload.eventType === "INSERT") {
                  setStories((prev) => [payload.new as Story, ...prev]);
                } else if (payload.eventType === "UPDATE") {
                  setStories((prev) =>
                    prev.map((story) =>
                      story.id === payload.new.id
                        ? (payload.new as Story)
                        : story,
                    ),
                  );
                } else if (payload.eventType === "DELETE") {
                  setStories((prev) =>
                    prev.filter((story) => story.id !== payload.old.id),
                  );
                }
              } catch (error) {
                console.warn("Error processing real-time update:", error);
              }
            },
          )
          .subscribe();

        cleanup = () => {
          try {
            supabase.removeChannel(channel);
          } catch (error) {
            console.warn("Error removing channel:", error);
          }
        };
      } catch (error) {
        console.warn("Could not set up real-time subscription:", error);
      }
    }

    return cleanup;
  }, [connectionMode]);

  const fetchStories = async () => {
    try {
      setLoading(true);

      // Use a timeout to prevent hanging
      const fetchWithTimeout = Promise.race([
        supabase
          .from("stories")
          .select("*")
          .order("created_at", { ascending: false }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Fetch timeout")), 5000),
        ),
      ]);

      const { data, error } = (await fetchWithTimeout) as any;

      if (error) {
        console.warn("Database fetch failed, using fallback stories:", error);
        setStories(fallbackStories);
        setConnectionMode("offline");
        return;
      }

      if (data && data.length > 0) {
        setStories(data);
        setConnectionMode("online");
        console.log(`✅ Loaded ${data.length} stories from database`);

        // Check if we need to seed quality stories - be more aggressive
        const hasQualityStories = data.some(
          (story) =>
            parseInt(story.hearts || "0") > 1000 ||
            (story.premium && parseInt(story.hearts || "0") > 500) ||
            (story.title &&
              story.title.length > 20 &&
              !story.title.toLowerCase().includes("godd")),
        );

        // Seed stories more aggressively if we don't have enough quality content
        if (!hasQualityStories || data.length < 25) {
          console.log("🌱 Seeding database with curated stories...");
          seedCuratedStories();
        }
      } else {
        // No data but no error - seed with curated stories
        console.log("🌱 Empty database, seeding with curated stories...");
        seedCuratedStories();
        setStories(fallbackStories);
        setConnectionMode("offline");
      }
    } catch (error) {
      console.warn("Network error fetching stories, using fallback:", error);
      setStories(fallbackStories);
      setConnectionMode("offline");
    } finally {
      setLoading(false);
    }
  };

  const seedCuratedStories = async () => {
    const curatedStories = [
      {
        title: "The Playlist That Broke My Heart 💔",
        preview:
          "Found his Spotify playlist titled 'Songs for Sarah'... I'm Jessica. Turns out Sarah is his ex from 3 years ago and he's been adding songs every month. Sir, the dedication to your past is impressive but concerning.",
        author: "WrongNameWrong",
        ex_name: "Playlist Paul",
        location: "His car stereo",
        tags: "ex-obsession,playlist,spotify,still-hung-up,red-flags",
        premium: false,
        image_url: null,
        is_blurred: false,
      },
      {
        title: "He Remembered Everything 🥺",
        preview:
          "Casually mentioned I love sunflowers 4 months ago. Today he surprised me with a whole field trip to a sunflower farm because 'you seemed so happy when you talked about them.' I'm not crying, you're crying.",
        author: "SunflowerSoul",
        ex_name: "Memory Mike",
        location: "Sunflower field",
        tags: "green-flags,memory,sunflowers,thoughtful,romantic-gestures",
        premium: true,
        image_url: null,
        is_blurred: false,
      },
      {
        title: "The Venmo Request Villain 💸",
        preview:
          "This man really Venmo requested me $4.73 for 'my half of the Uber' after our first date. The ride was 6 minutes and he invited ME out. The level of petty is unmatched. I paid it just to see how low he'd go.",
        author: "VenmoVictim",
        ex_name: "Cheap Chuck",
        location: "My Venmo notifications",
        tags: "cheap,first-date,venmo,petty,red-flags,money-issues",
        premium: false,
        image_url: null,
        is_blurred: false,
      },
      {
        title: "Library Card Love Story 📚",
        preview:
          "He found out I love reading and got his first library card at 28 just to check out books I recommended. Now he texts me book reviews and we have our own little book club. Intelligence is so attractive.",
        author: "BookwormRomance",
        ex_name: "Literature Luke",
        location: "Local library",
        tags: "books,reading,intellectual,green-flags,effort,learning",
        premium: true,
        image_url: null,
        is_blurred: false,
      },
      {
        title: "The Ex Folder Exposed 📂",
        preview:
          "His laptop crashed and he asked to use mine. Found a folder labeled 'Ex Research' with screenshots of all his exes' social media from the last 2 years. Sir, this is not normal behavior. This is FBI-level surveillance.",
        author: "DigitalDetective",
        ex_name: "Stalker Steve",
        location: "My laptop screen",
        tags: "stalking,ex-obsession,social-media,digital-red-flags,creepy",
        premium: false,
        image_url: null,
        is_blurred: false,
      },
      {
        title: "The 'I'm Not Like Other Guys' Phenomenon 🙄",
        preview:
          "He told me he's 'not like other guys' because he reads books and respects women. Then proceeded to interrupt me 47 times during dinner and explain my own job to me. The cognitive dissonance is astronomical.",
        author: "InterruptedIntelligence",
        ex_name: "Different Dave",
        location: "Italian restaurant",
        tags: "mansplaining,not-like-other-guys,interrupting,self-awareness,irony",
        premium: false,
        image_url: null,
        is_blurred: false,
      },
      {
        title: "Airport Layover Love Story ✈️",
        preview:
          "8-hour layover in Denver. Stranger offered to share his phone charger, we ended up talking until boarding. Three months later, he flew back to Denver just to recreate our first conversation. Long distance is hard but this one's worth it.",
        author: "SkyHighLove",
        ex_name: "Pilot Pete",
        location: "Denver Airport, Gate B24",
        tags: "meet-cute,airport,long-distance,effort,romantic,green-flags",
        premium: true,
        image_url: null,
        is_blurred: false,
      },
      {
        title: "The Instagram Detective 🔍",
        preview:
          "Found out he was liking his ex's photos from 2019. ALL of them. Went back 156 weeks deep. The dedication to stalking his own past is impressive but sir, I need you to focus on the present relationship sitting right next to you.",
        author: "DigitalDetective",
        ex_name: "Stalker Sam",
        location: "My bed at 3 AM",
        tags: "instagram,ex-stalking,social-media,boundaries,digital-red-flags",
        premium: false,
        image_url: null,
        is_blurred: false,
      },
      {
        title: "The Finance Bro Nightmare 📈",
        preview:
          "He spent 2 hours explaining cryptocurrency to me without asking if I was interested. When I mentioned I work in finance, he said 'that's cute, but this is real money stuff.' Sir, I manage a $50M portfolio.",
        author: "WallStreetWoman",
        ex_name: "Crypto Chad",
        location: "Overpriced cocktail bar",
        tags: "finance-bro,mansplaining,condescending,cryptocurrency,career",
        premium: true,
        image_url: null,
        is_blurred: false,
      },
      {
        title: "Green Flag King Alert 👑",
        preview:
          "He noticed I was having a rough day and showed up with my favorite coffee, a handwritten note, and said 'No pressure to hang out, just wanted you to know someone's thinking of you.' I CANNOT with this man! 😭",
        author: "BlessedGirl",
        ex_name: "The Sweetheart",
        location: "My doorstep",
        tags: "green-flags,thoughtful,keeper,coffee,sweet",
        premium: true,
        image_url: null,
        is_blurred: false,
      },
      {
        title: "The Audacity Chronicles 💅",
        preview:
          "This man really asked me to split the bill on a first date, then had the NERVE to ask if I wanted to come back to his place. Sir, you couldn't even pay for my $12 salad and you think I'm coming to see your studio apartment?",
        author: "TeaSpiller",
        ex_name: "Cheap Charlie",
        location: "Some basic restaurant",
        tags: "first-date,cheap,audacity,dating-fails",
        premium: false,
        image_url: null,
        is_blurred: false,
      },
      {
        title: "Househusband Material Found 🏠",
        preview:
          "This man meal prepped for BOTH of us, has plants that are actually alive, and his bathroom is cleaner than mine. When I complimented his cooking, he said 'I love taking care of people I care about.' MARRY ME.",
        author: "DomesticBliss",
        ex_name: "The Homemaker",
        location: "His spotless apartment",
        tags: "green-flags,domestic,cooking,caring,clean,keeper",
        premium: true,
        image_url: null,
        is_blurred: false,
      },
      {
        title: "Emotional Intelligence King 👑",
        preview:
          "When I had a panic attack, he didn't try to 'fix' me or tell me to calm down. He just sat with me, brought me water, and asked what I needed. This is what emotional maturity looks like!",
        author: "SafeSpace",
        ex_name: "The Supporter",
        location: "His car",
        tags: "green-flags,emotional-support,mental-health,maturity,keeper",
        premium: true,
        image_url: null,
        is_blurred: false,
      },
      {
        title: "The Grocery Store Test 🛒",
        preview:
          "He volunteered to do grocery shopping together. Watched him return the cart, help an elderly lady reach something on a high shelf, and let someone with one item go ahead of us. Basic human decency is apparently attractive now.",
        author: "EverydayObserver",
        ex_name: "Gentleman Gary",
        location: "Target, aisle 7",
        tags: "green-flags,kindness,grocery-shopping,character,everyday-moments",
        premium: false,
        image_url: null,
        is_blurred: false,
      },
      {
        title: "The Ex Who Kept My Hoodies 👕",
        preview:
          "Three months post-breakup and he's still posting mirror selfies in MY favorite hoodie. The one with the coffee stain that I specifically mentioned loving. The emotional manipulation through clothing theft is diabolical.",
        author: "HoodieHeist",
        ex_name: "Klepto Kevin",
        location: "His Instagram story",
        tags: "breakup,hoodies,keeping-clothes,petty,emotional-manipulation",
        premium: false,
        image_url: null,
        is_blurred: false,
      },
      {
        title: "The Mom's Basement Revelation 🏠",
        preview:
          "Three months of dating and I finally discovered he's 29 and lives in his mom's basement. Plot twist: his mom does his laundry, packs his lunch, and calls him 'baby boy.' Ma'am, I didn't sign up to date your son AND you.",
        author: "MommasBoyDetector",
        ex_name: "Basement Brad",
        location: "Mom's house",
        tags: "mama-boy,basement,independence,red-flags,family-issues",
        premium: false,
        image_url: null,
        is_blurred: false,
      },
      {
        title: "The Handwritten Letter Era ✍️",
        preview:
          "He writes me actual handwritten letters. Not texts, not emails - LETTERS. With wax seals and everything. Found out he's been journaling about our relationship like Jane Austen. This man is from another century and I'm here for it.",
        author: "OldSchoolLove",
        ex_name: "Letter Luke",
        location: "The post office",
        tags: "letters,handwritten,old-fashioned,romantic,green-flags,journaling",
        premium: true,
        image_url: null,
        is_blurred: false,
      },
      {
        title: "The Height Lie Investigation 📏",
        preview:
          "His profile said 6'2\". Reality check: I'm 5'6\" in heels and we're eye level. Did some detective work and found his driver's license. 5'9\". Sir, the mathematical impossibility of your height claim is fascinating.",
        author: "HeightInvestigator",
        ex_name: "Short Stack Sam",
        location: "Standing next to each other",
        tags: "height-lies,dating-app,lying,catfish,reality-check",
        premium: false,
        image_url: null,
        is_blurred: false,
      },
      {
        title: "Rain Date Perfection ☔",
        preview:
          "Our outdoor picnic got rained out. Instead of canceling, he turned his living room into an indoor picnic with fairy lights, blanket fort, and homemade sandwiches. Then we danced to his playlist in our socks. Magic exists.",
        author: "RainyDayRomance",
        ex_name: "Weather Wizard Will",
        location: "His living room",
        tags: "rain,indoor-picnic,creative,green-flags,dancing,adaptation",
        premium: true,
        image_url: null,
        is_blurred: false,
      },
      {
        title: "The Gamer Tag Scandal 🎮",
        preview:
          "Discovered his Xbox gamer tag is 'ToxicAlpha69.' Watched him play online and heard him scream at 12-year-olds for 3 hours straight. The way someone treats others in games tells you everything about their character.",
        author: "GamerGatekeeper",
        ex_name: "Toxic Tyler",
        location: "His gaming setup",
        tags: "gaming,toxic-behavior,online-personality,character,red-flags",
        premium: false,
        image_url: null,
        is_blurred: false,
      },
      {
        title: "The Plant Parent Test 🌱",
        preview:
          "He has 47 plants and knows all their names. Talks to them every morning and has a whole watering schedule. Caught him singing lullabies to his succulents. This level of nurturing energy is unmatched.",
        author: "PlantMom",
        ex_name: "Garden Gary",
        location: "His plant paradise apartment",
        tags: "plants,nurturing,green-flags,caring,responsibility,hobbies",
        premium: true,
        image_url: null,
        is_blurred: false,
      },
    ];

    for (let i = 0; i < curatedStories.length; i++) {
      const story = curatedStories[i];
      try {
        // Add delay between story additions to prevent duplicate IDs
        if (i > 0) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        const newStory = await addStory(story);
        if (newStory?.id) {
          // Boost hearts for trending
          const heartsCount = Math.floor(Math.random() * 5000) + 3000; // 3000-8000 hearts
          setTimeout(
            async () => {
              try {
                await supabase
                  .from("stories")
                  .update({ hearts: heartsCount.toString() })
                  .eq("id", newStory.id);
                console.log(
                  `💖 Boosted ${story.title} to ${heartsCount} hearts`,
                );
              } catch (boostError) {
                console.warn("Failed to boost hearts:", boostError);
              }
            },
            500 + i * 100,
          ); // Stagger the updates too
        }
        console.log(
          `✅ Seeded story ${i + 1}/${curatedStories.length}: ${story.title}`,
        );
      } catch (error) {
        console.warn(`Failed to seed story: ${story.title}`, error);
      }
    }
  };

  const addStory = async (storyData: Partial<Story>) => {
    try {
      // Always try to get user first
      const { data: user, error: authError } = await supabase.auth.getUser();

      if (authError && !authError.message?.includes("session")) {
        console.error("Auth error:", authError);
        return null;
      }

      // Get user profile for display name if we have a user
      let authorName = "anonymous";
      let authorId = "anonymous-user";

      if (user.user?.id) {
        authorId = user.user.id;
        try {
          const { data: profile } = await supabase
            .from("profiles")
            .select("name")
            .eq("id", user.user.id)
            .single();

          authorName = profile?.name || `user_${user.user.id.slice(-8)}`;
        } catch (profileError) {
          console.warn("Could not fetch user profile:", profileError);
          authorName = `user_${user.user.id.slice(-8)}`;
        }
      }

      // Try to insert to database with timeout
      const insertWithTimeout = Promise.race([
        supabase
          .from("stories")
          .insert({
            ...storyData,
            author: authorName,
            author_id: authorId,
            created_at: new Date().toISOString(),
            flags_red: "0",
            flags_green: "0",
            hearts: "0",
            comments: "0",
          })
          .select()
          .single(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Insert timeout")), 5000),
        ),
      ]);

      const { data, error } = (await insertWithTimeout) as any;

      if (error) {
        console.warn("Database insert failed, adding to local stories:", error);
        // Add to local stories as fallback
        const localStory = {
          ...storyData,
          id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          author: authorName,
          author_id: authorId,
          created_at: new Date().toISOString(),
          flags_red: "0",
          flags_green: "0",
          hearts: "0",
          comments: "0",
        } as Story;

        setStories((prev) => [localStory, ...prev]);
        setConnectionMode("offline");
        return localStory;
      }

      if (data) {
        setConnectionMode("online");
        return data;
      }

      return null;
    } catch (error) {
      console.warn("Story creation failed, adding locally:", error);

      // Create local story as fallback
      const localStory = {
        ...storyData,
        id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        author: "Tea Lover",
        author_id: "local-user",
        created_at: new Date().toISOString(),
        flags_red: "0",
        flags_green: "0",
        hearts: "0",
        comments: "0",
      } as Story;

      setStories((prev) => [localStory, ...prev]);
      setConnectionMode("offline");
      return localStory;
    }
  };

  const updateStoryFlags = async (storyId: string, type: "red" | "green") => {
    try {
      const { data: user } = await supabase.auth.getUser();
      const userId = user.user?.id || "anonymous-user";

      const story = stories.find((s) => s.id === storyId);
      if (!story) return;

      // Use localStorage to track user interactions
      const storageKey = `flag_${type}_${storyId}_${userId}`;
      const hasInteracted = localStorage.getItem(storageKey) === "true";

      const currentCount = parseInt(story[`flags_${type}`] || "0");
      let newCount: number;

      if (hasInteracted) {
        localStorage.removeItem(storageKey);
        newCount = Math.max(0, currentCount - 1);
      } else {
        localStorage.setItem(storageKey, "true");
        newCount = currentCount + 1;
      }

      // Update local state immediately
      setStories((prev) =>
        prev.map((s) =>
          s.id === storyId
            ? { ...s, [`flags_${type}`]: newCount.toString() }
            : s,
        ),
      );

      // Try to update database with timeout
      try {
        const updateWithTimeout = Promise.race([
          supabase
            .from("stories")
            .update({ [`flags_${type}`]: newCount.toString() })
            .eq("id", storyId),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Update timeout")), 3000),
          ),
        ]);

        await updateWithTimeout;
        setConnectionMode("online");
      } catch (updateError) {
        console.warn(
          "Database update failed, keeping local changes:",
          updateError,
        );
        setConnectionMode("offline");
      }
    } catch (error) {
      console.warn("Flag update error:", error);
    }
  };

  const updateHearts = async (storyId: string) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      const userId = user.user?.id || "anonymous-user";

      const story = stories.find((s) => s.id === storyId);
      if (!story) return;

      const storageKey = `heart_${storyId}_${userId}`;
      const hasLiked = localStorage.getItem(storageKey) === "true";

      const currentCount = parseInt(story.hearts || "0");
      let newCount: number;

      if (hasLiked) {
        localStorage.removeItem(storageKey);
        newCount = Math.max(0, currentCount - 1);
      } else {
        localStorage.setItem(storageKey, "true");
        newCount = currentCount + 1;
      }

      // Update local state immediately
      setStories((prev) =>
        prev.map((s) =>
          s.id === storyId ? { ...s, hearts: newCount.toString() } : s,
        ),
      );

      // Try to update database with timeout
      try {
        const updateWithTimeout = Promise.race([
          supabase
            .from("stories")
            .update({ hearts: newCount.toString() })
            .eq("id", storyId),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Update timeout")), 3000),
          ),
        ]);

        await updateWithTimeout;
        setConnectionMode("online");
      } catch (updateError) {
        console.warn(
          "Database update failed, keeping local changes:",
          updateError,
        );
        setConnectionMode("offline");
      }
    } catch (error) {
      console.warn("Heart update error:", error);
    }
  };

  // Helper functions to check user interactions
  const hasUserLiked = async (storyId: string): Promise<boolean> => {
    try {
      const { data: user } = await supabase.auth.getUser();
      const userId = user.user?.id || "anonymous-user";
      return localStorage.getItem(`heart_${storyId}_${userId}`) === "true";
    } catch (error) {
      return false;
    }
  };

  const hasUserFlagged = async (
    storyId: string,
    type: "red" | "green",
  ): Promise<boolean> => {
    try {
      const { data: user } = await supabase.auth.getUser();
      const userId = user.user?.id || "anonymous-user";
      return (
        localStorage.getItem(`flag_${type}_${storyId}_${userId}`) === "true"
      );
    } catch (error) {
      return false;
    }
  };

  return {
    stories,
    loading,
    addStory,
    updateStoryFlags,
    updateHearts,
    hasUserLiked,
    hasUserFlagged,
    refetch: fetchStories,
    connectionMode, // Export connection mode for UI feedback
  };
}
