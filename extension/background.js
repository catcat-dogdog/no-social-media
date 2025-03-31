chrome.declarativeNetRequest.updateDynamicRules({
    addRules: [{
      "id": 1,
      "priority": 1,
      "action": { "type": "block" },
      "condition": {
        "urlFilter": "|http*://*.facebook.com/*|http*://*.twitter.com/*|http*://*.youtube.com/*|http*://*.bilibili.com/*",
        "resourceTypes": ["main_frame"]
      }
    }],
    removeRuleIds: [1]
  });