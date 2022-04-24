export const getChrome = (options: any, callback: (params?: any) => void) => {
  chrome.storage.sync.get(options, callback);
};

export const setChrome = (options: any, callback?: (params?: any) => void) => {
  chrome.storage.sync.set(options, callback);
};

export const onChangeChrome = (callback: (params?: any) => void) => {
  chrome.storage.onChanged.addListener(callback);
};
