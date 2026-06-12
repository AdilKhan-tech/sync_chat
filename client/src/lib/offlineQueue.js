const KEY = "syncchat_offline_queue";

export const getQueue = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
};

export const addToQueue = (item) => {
  const queue = getQueue();
  queue.push({ ...item, queuedAt: Date.now() });
  localStorage.setItem(KEY, JSON.stringify(queue));
};

export const clearQueue = () => localStorage.setItem(KEY, "[]");

export const removeFromQueue = (id) => {
  const queue = getQueue().filter((q) => q.tempId !== id);
  localStorage.setItem(KEY, JSON.stringify(queue));
};
