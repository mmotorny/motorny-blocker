chrome.action.onClicked.addListener((tab) => {
  console.log(`${tab.url} blocked.`);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (!changeInfo.url) {
    return;
  }
  const url = new URL(changeInfo.url);

  const blockedHostnames = chrome.storage.sync.get('blockedHostnames');
  if (!blockedHostnames) {
    console.log('No blocked hostnames.');
    return;
  }

  const blockedHostname = blockedHostnames[url.hostname];
  if (!blockedHostname) {
    console.log(`${url.hostname} is not blocked.`);
    return;
  }

  if (new Date().getTime() < (blockedHostname.unblockedUntil ?? 0)) {
    console.log(
      `${url.hostname} is unblocked until ${new Date(
        blockedHostname.unblockedUntil
      )}.`
    );
    return;
  }

  console.log(`${url.hostname} is blocked.`);
  chrome.tabs.update(tabId, {
    url: `chrome-extension://${
      chrome.runtime.id
    }/speed-bump.html?blocked-url=${encodeURI(url)}`,
  });
});
