// ==UserScript==
// @name         No Social Media
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  禁止访问特定视频网站或社交媒体
// @author       Your Name
// @match        *://*.facebook.com/*
// @match        *://*.twitter.com/*
// @match        *://*.youtube.com/*
// @match        *://*.bilibili.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 重定向到一个空白页面或显示自定义消息
    document.body.innerHTML = '<h1>访问被禁止</h1><p>您已成功阻止访问此网站。</p>';
    document.title = "访问被禁止";
})();