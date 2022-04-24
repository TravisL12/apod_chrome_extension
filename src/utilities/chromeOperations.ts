export const getChrome = (options: any, callback: (params?: any) => void) => {
  chrome.storage.sync.get(options, callback);
};

export const setChrome = (options: any, callback?: (params?: any) => void) => {
  chrome.storage.sync.set(options, callback);
};

export const onChangeChrome = (callback: (params?: any) => void) => {
  chrome.storage.onChanged.addListener(callback);
};

// LOCAL STORAGE
export const getLocalChrome = (
  options: any,
  callback: (params?: any) => void
) => {
  chrome.storage.local.get(options, callback);
};

export const setLocalChrome = (
  options: any,
  callback?: (params?: any) => void
) => {
  chrome.storage.local.set(options, callback);
};
