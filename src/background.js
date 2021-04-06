chrome.action.onClicked.addListener((tab) => {
  const url = new URL(tab.url);
  console.log(`Blocking ${url.hostname}.`);
  chrome.storage.local.get(null, (localStorage) => {
    const blockedHostnames = (localStorage['blockedHostnames'] ??= {});
    const blockedHostname = (blockedHostnames[url.hostname] ??= {});
    blockedHostname['unblockedUntil'] = 0;
    chrome.storage.local.set(localStorage, () => {
      chrome.tabs.update(tab.id, {
        url: `chrome-extension://${
          chrome.runtime.id
        }/speed-bump.html?blocked-url=${encodeURI(url)}`,
      });
    });
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (!changeInfo.url) {
    return;
  }
  const url = new URL(changeInfo.url);

  chrome.storage.local.get(null, (localStorage) => {
    const blockedHostnames = localStorage['blockedHostnames'];
    if (!blockedHostnames) {
      console.log('No blocked hostnames.');
      return;
    }

    const blockedHostname = blockedHostnames[url.hostname];
    if (!blockedHostname) {
      console.log(`${url.hostname} is not blocked.`);
      return;
    }

    if (Date.now() < (blockedHostname['unblockedUntil'] ?? 0)) {
      console.log(
        `${url.hostname} is unblocked until ${new Date(
          blockedHostname['unblockedUntil']
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
});
