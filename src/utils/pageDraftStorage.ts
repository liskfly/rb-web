const DATABASE_NAME = "opcenter-page-drafts";
const DATABASE_VERSION = 1;
const STORE_NAME = "drafts";
const FALLBACK_PREFIX = "OPCENTER_PAGE_DRAFT:";

type DraftRecord<T> = {
  key: string;
  value: T;
  updatedAt: number;
};

let databasePromise: Promise<IDBDatabase> | null = null;

function openDatabase() {
  if (typeof indexedDB === "undefined") {
    return Promise.reject(new Error("IndexedDB is not available"));
  }
  if (databasePromise) return databasePromise;

  databasePromise = new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: "key" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("Failed to open draft database"));
    request.onblocked = () => reject(new Error("Draft database is blocked"));
  });

  databasePromise.catch(() => {
    databasePromise = null;
  });
  return databasePromise;
}

function fallbackKey(key: string) {
  return `${FALLBACK_PREFIX}${key}`;
}

function loadFallback<T>(key: string): T | null {
  try {
    const value = localStorage.getItem(fallbackKey(key));
    return value ? JSON.parse(value) as T : null;
  } catch {
    return null;
  }
}

function saveFallback<T>(key: string, value: T) {
  try {
    localStorage.setItem(fallbackKey(key), JSON.stringify(value));
  } catch (error) {
    console.warn("页面草稿保存失败", error);
  }
}

export async function loadPageDraft<T>(key: string): Promise<T | null> {
  if (!key) return null;

  try {
    const database = await openDatabase();
    const record = await new Promise<DraftRecord<T> | undefined>((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, "readonly");
      const request = transaction.objectStore(STORE_NAME).get(key);
      request.onsuccess = () => resolve(request.result as DraftRecord<T> | undefined);
      request.onerror = () => reject(request.error || new Error("Failed to read page draft"));
    });
    return record?.value ?? loadFallback<T>(key);
  } catch {
    return loadFallback<T>(key);
  }
}

export async function savePageDraft<T>(key: string, value: T): Promise<void> {
  if (!key) return;

  try {
    const database = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, "readwrite");
      transaction.objectStore(STORE_NAME).put({
        key,
        value,
        updatedAt: Date.now(),
      } satisfies DraftRecord<T>);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error || new Error("Failed to save page draft"));
      transaction.onabort = () => reject(transaction.error || new Error("Page draft transaction aborted"));
    });
    localStorage.removeItem(fallbackKey(key));
  } catch {
    saveFallback(key, value);
  }
}
