import type { Story, Profile } from "./supabase";

// Mock stories for demo/offline mode
export const mockStories: Story[] = [
  {
    id: "1",
    title: "He said he was 'traditional' but...",
    preview:
      "Turns out his idea of traditional was me paying for everything while he 'focuses on his startup' (which is just a crypto Twitter account) 🙄",
    author: "TeaSpiller2024",
    ex_name: "Crypto Chad",
    location: "Trendy coffee shop",
    image_url: null,
    is_blurred: false,
    created_at: new Date().toISOString(),
    comments: "42",
    flags_red: "156",
    flags_green: "23",
    hearts: "289",
    tags: "red-flags,dating-fails,crypto-bros",
    premium: false,
    author_id: "mock-user-1",
  },
  {
    id: "2",
    title: "Best first date ever! 💕",
    preview:
      "He actually listened when I talked, brought me flowers, and split the bill without making it weird. Plus he texted right after to make sure I got home safe ✨",
    author: "HopefulRomantic",
    ex_name: "The Good One",
    location: "Local bookstore cafe",
    image_url: null,
    is_blurred: false,
    created_at: new Date(Date.now() - 3600000).toISOString(),
    comments: "67",
    flags_red: "8",
    flags_green: "234",
    hearts: "445",
    tags: "green-flags,first-date,wholesome",
    premium: true,
    author_id: "mock-user-2",
  },
  {
    id: "3",
    title: "The audacity of this man...",
    preview:
      "Asked me to be his 'sugar mama' on the second date because he 'doesn't believe in capitalism' but somehow still wanted me to buy him designer clothes 💸",
    author: "DodgedABullet",
    ex_name: "Anti-Cap Hypocrite",
    location: "Expensive restaurant",
    image_url: null,
    is_blurred: false,
    created_at: new Date(Date.now() - 7200000).toISOString(),
    comments: "89",
    flags_red: "378",
    flags_green: "12",
    hearts: "567",
    tags: "red-flags,hypocrisy,sugar-mama",
    premium: false,
    author_id: "mock-user-3",
  },
];

export const mockProfile: Profile = {
  id: "demo-user",
  name: "Demo User",
  email: "demo@sourtea.app",
  avatar_url: null,
  bio: "Just here to spill some tea ☕ Demo mode active!",
  created_at: new Date().toISOString(),
};

// Mock API functions that mirror Supabase structure
export class MockSupabaseClient {
  // Mock auth
  auth = {
    getUser: async () => ({
      data: { user: { id: "demo-user", email: "demo@sourtea.app" } },
      error: null,
    }),
    getSession: async () => ({
      data: {
        session: { user: { id: "demo-user", email: "demo@sourtea.app" } },
      },
      error: null,
    }),
    signOut: async () => ({ error: null }),
  };

  // Mock database operations
  from(table: string) {
    return {
      select: (columns: string = "*") => ({
        eq: (column: string, value: any) => ({
          single: async () => {
            if (table === "profiles") {
              return { data: mockProfile, error: null };
            }
            return { data: null, error: null };
          },
        }),
        order: (column: string, options: any) => this,
        then: async (callback: any) => {
          if (table === "stories") {
            return callback({ data: mockStories, error: null });
          }
          return callback({ data: [], error: null });
        },
      }),
      insert: (data: any) => ({
        select: () => ({
          single: async () => ({
            data: { ...data, id: Date.now().toString() },
            error: null,
          }),
        }),
      }),
      update: (data: any) => ({
        eq: (column: string, value: any) => ({
          then: async (callback: any) => callback({ data: null, error: null }),
        }),
      }),
      delete: () => ({
        eq: (column: string, value: any) => ({
          then: async (callback: any) => callback({ data: null, error: null }),
        }),
      }),
    };
  }

  // Mock real-time
  channel(name: string) {
    return {
      on: () => this,
      subscribe: () => this,
    };
  }

  removeChannel() {
    return Promise.resolve();
  }
}
