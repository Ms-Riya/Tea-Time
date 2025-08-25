// Comprehensive offline Supabase client that works completely without network
import type { Story, Profile } from "./supabase";

// Mock data for offline mode
const mockStories: Story[] = [
  {
    id: "offline-1",
    title: "Demo Story: The Dating App Disaster",
    preview:
      "Matched with someone who used their ex's photo from 5 years ago... 😳",
    author: "DemoUser1",
    ex_name: "Catfish Chris",
    location: "Coffee shop downtown",
    image_url: null,
    is_blurred: false,
    created_at: new Date(Date.now() - 3600000).toISOString(),
    comments: "23",
    flags_red: "87",
    flags_green: "12",
    hearts: "156",
    tags: "red-flags,online-dating,catfish",
    premium: false,
    author_id: "demo-user-1",
  },
  {
    id: "offline-2",
    title: "Demo Story: Green Flag Paradise",
    preview:
      "He brought soup when I was sick, remembered my coffee order, and actually listens when I talk! 💚",
    author: "LuckyInLove",
    ex_name: "The Perfect One",
    location: "My apartment",
    image_url: null,
    is_blurred: false,
    created_at: new Date(Date.now() - 7200000).toISOString(),
    comments: "45",
    flags_red: "3",
    flags_green: "234",
    hearts: "445",
    tags: "green-flags,healthy-relationship,sweet",
    premium: true,
    author_id: "demo-user-2",
  },
];

const mockProfile: Profile = {
  id: "demo-user",
  name: "Demo User",
  email: "demo@sourtea.app",
  avatar_url: null,
  bio: "Living my best demo life! ☕️",
  created_at: new Date().toISOString(),
};

let localStories = [...mockStories];
let localComments: any[] = [];

export const createOfflineSupabaseClient = () => ({
  auth: {
    getUser: async () => ({
      data: {
        user: {
          id: "demo-user",
          email: "demo@sourtea.app",
          user_metadata: { name: "Demo User" },
        },
      },
      error: null,
    }),
    getSession: async () => ({
      data: {
        session: {
          user: {
            id: "demo-user",
            email: "demo@sourtea.app",
            user_metadata: { name: "Demo User" },
          },
        },
      },
      error: null,
    }),
    signOut: async () => {
      console.log("Demo sign out - clearing local session");
      return { error: null };
    },
  },

  from: (table: string) => ({
    select: (columns: string = "*") => {
      if (table === "stories") {
        return {
          eq: (column: string, value: any) => ({
            single: async () => ({
              data: localStories[0] || null,
              error: null,
            }),
          }),
          order: (column: string, options: any) => ({
            then: async (callback: any) => {
              const sortedStories = [...localStories].sort(
                (a, b) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime(),
              );
              return callback({ data: sortedStories, error: null });
            },
          }),
        };
      }

      if (table === "profiles") {
        return {
          eq: (column: string, value: any) => ({
            single: async () => ({ data: mockProfile, error: null }),
          }),
        };
      }

      if (table === "comments") {
        return {
          eq: (column: string, value: any) => ({
            order: (col: string, opts: any) => ({
              then: async (callback: any) => {
                const storyComments = localComments.filter(
                  (c) => c.story_id === value,
                );
                return callback({ data: storyComments, error: null });
              },
            }),
          }),
          order: (column: string, options: any) => ({
            then: async (callback: any) =>
              callback({ data: localComments, error: null }),
          }),
        };
      }

      return {
        eq: () => ({ single: async () => ({ data: null, error: null }) }),
        order: () => ({
          then: async (callback: any) => callback({ data: [], error: null }),
        }),
      };
    },

    insert: (data: any) => {
      if (table === "stories") {
        const newStory = {
          ...data,
          id: `offline-${Date.now()}`,
          created_at: new Date().toISOString(),
          comments: "0",
          flags_red: "0",
          flags_green: "0",
          hearts: "0",
        };
        localStories.unshift(newStory);

        return {
          select: () => ({
            single: async () => ({ data: newStory, error: null }),
          }),
        };
      }

      if (table === "comments") {
        const newComment = {
          ...data,
          id: `comment-${Date.now()}`,
          created_at: new Date().toISOString(),
        };
        localComments.push(newComment);

        return {
          select: () => ({
            single: async () => ({ data: newComment, error: null }),
          }),
        };
      }

      return {
        select: () => ({
          single: async () => ({
            data: { ...data, id: Date.now().toString() },
            error: null,
          }),
        }),
      };
    },

    update: (data: any) => ({
      eq: (column: string, value: any) => ({
        then: async (callback: any) => {
          if (table === "stories") {
            const storyIndex = localStories.findIndex((s) => s.id === value);
            if (storyIndex >= 0) {
              localStories[storyIndex] = {
                ...localStories[storyIndex],
                ...data,
              };
            }
          }
          const result = { data: null, error: null };
          return callback ? callback(result) : result;
        },
      }),
    }),

    delete: () => ({
      eq: (column: string, value: any) => ({
        then: async (callback: any) => {
          if (table === "stories") {
            localStories = localStories.filter((s) => s.id !== value);
          } else if (table === "comments") {
            localComments = localComments.filter((c) => c.id !== value);
          }
          const result = { data: null, error: null };
          return callback ? callback(result) : result;
        },
      }),
    }),
  }),

  channel: (name: string) => ({
    on: () => ({ subscribe: () => ({}) }),
    subscribe: () => ({}),
  }),

  removeChannel: (channel: any) => Promise.resolve(),
});

export { mockStories, mockProfile };
