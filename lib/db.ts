// IndexedDB Database Manager for HealyMate
// Handles all client-side data persistence with encryption support

const DB_NAME = 'HealyMate';
const DB_VERSION = 1;

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: number;
}

export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string; // encrypted
  mood: number; // 1-5
  tags: string[];
  sentiment?: string; // AI-analyzed
  createdAt: number;
  updatedAt: number;
}

export interface MoodEntry {
  id: string;
  userId: string;
  mood: number; // 1-5
  intensity: number; // 1-10
  notes?: string;
  timestamp: number;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: 'health' | 'career' | 'relationship' | 'personal' | 'other';
  progress: number; // 0-100
  deadline?: number;
  createdAt: number;
  updatedAt: number;
}

export interface Meditation {
  id: string;
  userId: string;
  title: string;
  duration: number; // in minutes
  category: 'breathing' | 'body-scan' | 'visualization' | 'mindfulness' | 'sleep';
  completed: boolean;
  completedAt?: number;
  createdAt: number;
}

export interface CommunityPost {
  id: string;
  userId: string;
  username: string;
  title: string;
  content: string;
  category: 'support' | 'discussion' | 'achievement' | 'resource';
  likes: number;
  likedBy: string[];
  createdAt: number;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  username: string;
  content: string;
  createdAt: number;
}

let db: IDBDatabase | null = null;

async function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;

      // Users store
      if (!database.objectStoreNames.contains('users')) {
        const userStore = database.createObjectStore('users', { keyPath: 'id' });
        userStore.createIndex('email', 'email', { unique: true });
      }

      // Journal entries store
      if (!database.objectStoreNames.contains('journals')) {
        const journalStore = database.createObjectStore('journals', { keyPath: 'id' });
        journalStore.createIndex('userId', 'userId');
        journalStore.createIndex('createdAt', 'createdAt');
      }

      // Mood entries store
      if (!database.objectStoreNames.contains('moods')) {
        const moodStore = database.createObjectStore('moods', { keyPath: 'id' });
        moodStore.createIndex('userId', 'userId');
        moodStore.createIndex('timestamp', 'timestamp');
      }

      // Goals store
      if (!database.objectStoreNames.contains('goals')) {
        const goalStore = database.createObjectStore('goals', { keyPath: 'id' });
        goalStore.createIndex('userId', 'userId');
      }

      // Meditations store
      if (!database.objectStoreNames.contains('meditations')) {
        const medStore = database.createObjectStore('meditations', { keyPath: 'id' });
        medStore.createIndex('userId', 'userId');
      }

      // Community posts store
      if (!database.objectStoreNames.contains('communityPosts')) {
        const postStore = database.createObjectStore('communityPosts', { keyPath: 'id' });
        postStore.createIndex('userId', 'userId');
        postStore.createIndex('createdAt', 'createdAt');
      }

      // Comments store
      if (!database.objectStoreNames.contains('comments')) {
        const commentStore = database.createObjectStore('comments', { keyPath: 'id' });
        commentStore.createIndex('postId', 'postId');
        commentStore.createIndex('userId', 'userId');
      }
    };
  });
}

async function getDB(): Promise<IDBDatabase> {
  if (!db) {
    db = await initDB();
  }
  return db;
}

// Generic put operation
async function put<T>(storeName: string, data: T): Promise<string> {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(data);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

// Generic get operation
async function get<T>(storeName: string, key: string): Promise<T | undefined> {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get(key);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

// Generic getAll with index
async function getAllByIndex<T>(
  storeName: string,
  indexName: string,
  value: any
): Promise<T[]> {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const index = store.index(indexName);
    const request = index.getAll(value);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

// Generic delete operation
async function delete_(storeName: string, key: string): Promise<void> {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(key);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

// User operations
export const userDB = {
  create: (user: User) => put('users', user),
  get: (id: string) => get<User>('users', id),
  getByEmail: async (email: string) => {
    const database = await getDB();
    return new Promise<User | undefined>((resolve, reject) => {
      const transaction = database.transaction('users', 'readonly');
      const store = transaction.objectStore('users');
      const index = store.index('email');
      const request = index.get(email);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  },
};

// Journal operations
export const journalDB = {
  create: (entry: JournalEntry) => put('journals', entry),
  get: (id: string) => get<JournalEntry>('journals', id),
  getByUserId: (userId: string) => getAllByIndex<JournalEntry>('journals', 'userId', userId),
  update: (entry: JournalEntry) => put('journals', entry),
  delete: (id: string) => delete_('journals', id),
};

// Mood operations
export const moodDB = {
  create: (entry: MoodEntry) => put('moods', entry),
  get: (id: string) => get<MoodEntry>('moods', id),
  getByUserId: (userId: string) => getAllByIndex<MoodEntry>('moods', 'userId', userId),
  delete: (id: string) => delete_('moods', id),
};

// Goal operations
export const goalDB = {
  create: (goal: Goal) => put('goals', goal),
  get: (id: string) => get<Goal>('goals', id),
  getByUserId: (userId: string) => getAllByIndex<Goal>('goals', 'userId', userId),
  update: (goal: Goal) => put('goals', goal),
  delete: (id: string) => delete_('goals', id),
};

// Meditation operations
export const meditationDB = {
  create: (meditation: Meditation) => put('meditations', meditation),
  get: (id: string) => get<Meditation>('meditations', id),
  getByUserId: (userId: string) => getAllByIndex<Meditation>('meditations', 'userId', userId),
  update: (meditation: Meditation) => put('meditations', meditation),
  delete: (id: string) => delete_('meditations', id),
};

// Community post operations
export const communityPostDB = {
  create: (post: CommunityPost) => put('communityPosts', post),
  get: (id: string) => get<CommunityPost>('communityPosts', id),
  getByUserId: (userId: string) => getAllByIndex<CommunityPost>('communityPosts', 'userId', userId),
  getAll: async () => {
    const database = await getDB();
    return new Promise<CommunityPost[]>((resolve, reject) => {
      const transaction = database.transaction('communityPosts', 'readonly');
      const store = transaction.objectStore('communityPosts');
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result.sort((a, b) => b.createdAt - a.createdAt));
    });
  },
  update: (post: CommunityPost) => put('communityPosts', post),
};

// Comment operations
export const commentDB = {
  create: (comment: Comment) => put('comments', comment),
  getByPostId: (postId: string) => getAllByIndex<Comment>('comments', 'postId', postId),
  getByUserId: (userId: string) => getAllByIndex<Comment>('comments', 'userId', userId),
  delete: (id: string) => delete_('comments', id),
};

// Clear all data (for logout)
export const clearAllData = async () => {
  const database = await getDB();
  const transaction = database.transaction(
    ['users', 'journals', 'moods', 'goals', 'meditations', 'communityPosts', 'comments'],
    'readwrite'
  );

  const stores = [
    'users',
    'journals',
    'moods',
    'goals',
    'meditations',
    'communityPosts',
    'comments',
  ];

  for (const storeName of stores) {
    await new Promise<void>((resolve, reject) => {
      const request = transaction.objectStore(storeName).clear();
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }
};
