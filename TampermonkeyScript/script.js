// ==UserScript==
// @name         No Social Media
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在特定时间段禁止访问特定社交媒体网站
// @author       catcat-dogdog
// @match        *://*.bilibili.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 配置区域开始
    const CONFIG = {
        // 网站访问限制时间段（24小时制，精确到分钟）
        siteRestrictions: {
            'bilibili.com': [
                { start: '0:00', end: '07:30' },
                { start: '8:30', end: '12:00' },
                { start: '14:00', end: '17:00' },
                { start: '19:00', end: '22:00' }
            ]
        },
        // 提示间隔时间（分钟）
        promptInterval: 5,
        // 关闭页面自动封锁延迟（分钟）
        autoBlockDelay: 1,
        // 界面文本
        messages: {
            blocked: '访问被禁止',
            blockedDesc: '您在此时间段无法访问此网站。',
            unblockButton: '暂时解除封锁',
            focusPrompt: (minutes) => `不知不觉已经使用社交媒体${minutes}分钟，请确认没有在浪费时间哦`
        }
    };

    let unblockUntil = localStorage.getItem('unblockUntil') ? new Date(localStorage.getItem('unblockUntil')) : null;
    let focusInterval = null;

    function isBlockedTime(site) {
        if (unblockUntil && new Date() < unblockUntil) {
            return false;
        }

        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        const blockedHours = CONFIG.siteRestrictions[site] || [];

        return blockedHours.some(({ start, end }) => {
            const [startHour, startMinute] = start.split(':').map(Number);
            const [endHour, endMinute] = end.split(':').map(Number);
            const startMinutes = startHour * 60 + startMinute;
            const endMinutes = endHour * 60 + endMinute;

            if (startMinutes < endMinutes) {
                return currentMinutes >= startMinutes && currentMinutes < endMinutes;
            } else {
                return currentMinutes >= startMinutes || currentMinutes < endMinutes;
            }
        });
    }

    function getCurrentSite() {
        const hostname = window.location.hostname;
        return Object.keys(CONFIG.siteRestrictions).find(site => hostname.includes(site));
    }

    function pauseAllVideos() {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => video.pause());
    }

    function showFocusPrompt(minutes) {
        pauseAllVideos();
        const message = CONFIG.messages.focusPrompt(minutes);
        if (!confirm(`${message}\n\n选择"取消"关闭网页，选择"确定"继续使用。`)) {
            unblockUntil = null;
            localStorage.removeItem('unblockUntil');
            window.location.href = 'about:blank';
        }
    }

    function scheduleFocusPrompts() {
        let promptCount = 0;
        
        focusInterval = setInterval(() => {
            promptCount++;
            showFocusPrompt(CONFIG.promptInterval * promptCount);
        }, CONFIG.promptInterval * 60 * 1000);
    }

    function scheduleAutoBlock() {
        setTimeout(() => {
            unblockUntil = null;
            localStorage.removeItem('unblockUntil');
            location.reload();
        }, CONFIG.autoBlockDelay * 60 * 1000);
    }

    const currentSite = getCurrentSite();
    if (currentSite) {
        if (unblockUntil && new Date() < unblockUntil) {
            scheduleFocusPrompts();
            scheduleAutoBlock();
        } else if (isBlockedTime(currentSite)) {
            document.body.innerHTML = `
                <h1>${CONFIG.messages.blocked}</h1>
                <p>${CONFIG.messages.blockedDesc}</p>
                <button id="unblockButton">${CONFIG.messages.unblockButton}</button>
            `;
            document.body.style.textAlign = 'center';
            document.body.style.marginTop = '20%';

            document.getElementById('unblockButton').onclick = function() {
                unblockUntil = new Date(new Date().getTime() + 60 * 60 * 1000);
                localStorage.setItem('unblockUntil', unblockUntil);
                scheduleFocusPrompts();
                scheduleAutoBlock();
                location.reload();
            };
        }
    }
})();