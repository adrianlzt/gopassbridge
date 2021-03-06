'use strict';

const DEFAULT_SETTINGS = {
    markfields: true,
    sendnotifications: true,
    submitafterfill: true,
    handleauthrequests: true,
    defaultfolder: 'Account',
};

const LAST_DOMAIN_SEARCH_PREFIX = 'LAST_DOMAIN_SEARCH_';
const LAST_DETAIL_VIEW_PREFIX = 'LAST_DETAIL_VIEW_';

function getSettings() {
    return browser.storage.sync.get(DEFAULT_SETTINGS);
}

function sendNativeAppMessage(message) {
    const app = 'com.justwatch.gopass';
    console.log(JSON.stringify(message));
    return browser.runtime.sendNativeMessage(app, message);
}

function logError(error) {
    console.log(error);
}

function openURL(event) {
    event.preventDefault();
    browser.tabs.create({ url: event.target.href });
}

function executeOnSetting(setting, trueCallback, falseCallback) {
    return getSettings().then(result => {
        if (result[setting]) {
            if (trueCallback) trueCallback();
        } else {
            if (falseCallback) falseCallback();
        }
    }, logError);
}

function createButtonWithCallback(className, text, style, callback) {
    const element = document.createElement('button');
    element.className = className;
    element.textContent = text;
    if (style) {
        element.style = style;
    }
    element.addEventListener('click', callback);
    return element;
}

function urlDomain(urlString) {
    const a = document.createElement('a');
    a.href = urlString;
    const parts = a.hostname.split('.');
    return parts.slice(parts.length - 2, parts.length - 1)[0];
}

function setLocalStorageKey(key, value) {
    const update = {};
    update[key] = value;
    console.log('setting local storage', update);
    return browser.storage.local.set(update);
}

function getLocalStorageKey(key) {
    console.log('getting local storage', key);
    return browser.storage.local.get(key).then(values => {
        return values[key];
    }, logError);
}

function showNotificationOnSetting(message) {
    return executeOnSetting('sendnotifications', () => {
        browser.notifications.create({
            type: 'basic',
            iconUrl: browser.runtime.getURL('icons/gopassbridge-96.png'),
            title: 'gopassbridge',
            message: message,
        });
    });
}

function getPopupUrl() {
    return browser.runtime.getURL('gopassbridge.html');
}

function isChrome() {
    return browser.runtime.getURL('/').startsWith('chrome');
}

window.tests = {
    generic: {
        sendNativeAppMessage,
        executeOnSetting,
        urlDomain,
        setLocalStorageKey,
        getLocalStorageKey,
        createButtonWithCallback,
        showNotificationOnSetting,
        getPopupUrl,
        isChrome,
        openURL,
    },
};
