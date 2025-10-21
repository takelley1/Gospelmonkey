// ==UserScript==
// @name         Gospelmonkey
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automates specific parts of GMO's PATH application.
// @author       Austin Kelley
// @match        https://path.globalmediaoutreach.com/tab-home/tab-seekers*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    // Define your hotkeys and their corresponding actions here.
    const hotkeys = {
        'Control+Shift+A': () => {
            console.log('Ctrl+Shift+A pressed - Archiving oldest conversation!');
            archiveOldestConversation();
        },
    };

    // Define actions for specific button clicks here.
    const buttonActions = {
        // Add your button actions here if needed
    };

    // --- Helper Functions (for DOM interaction) ---

    /**
     * Fills an input field with a given value.
     * @param {string} selector - CSS selector for the input field (e.g., '#myInputId', '.my-class input').
     * @param {string} value - The value to set.
     */
    function fillInputField(selector, value) {
        const input = document.querySelector(selector);
        if (input) {
            input.value = value;
            input.dispatchEvent(new Event('input', { bubbles: true })); // Trigger input event for frameworks
            input.dispatchEvent(new Event('change', { bubbles: true })); // Trigger change event
            console.log(`Filled input '${selector}' with '${value}'`);
        } else {
            console.warn(`Input field with selector '${selector}' not found.`);
        }
    }

    /**
     * Clicks an element.
     * @param {string} selector - CSS selector for the element to click (e.g., '#myButtonId', '.my-class button').
     */
    function clickElement(selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.click();
            console.log(`Clicked element '${selector}'.`);
        } else {
            console.warn(`Element with selector '${selector}' not found.`);
        }
    }

    /**
     * Archives the oldest conversation, which is assumed to be the last item in the list.
     */
    function archiveOldestConversation() {
        const conversationListItems = document.querySelectorAll('ion-list ion-item-sliding');
        if (conversationListItems.length > 0) {
            const oldestConversation = conversationListItems[conversationListItems.length - 1];
            const archiveButton = oldestConversation.querySelector('ion-item-option:has(ion-icon[name="archive"])');
            if (archiveButton) {
                // Simulate a click on the archive button
                archiveButton.click();
            } else {
                console.warn('Archive button not found for the oldest conversation.');
            }
        } else {
            console.warn('No conversations found to archive.');
        }
    }

    // --- Event Listeners ---

    // Hotkey listener
    document.addEventListener('keydown', (event) => {
        const keyCombination = [];
        if (event.ctrlKey) keyCombination.push('Control');
        if (event.shiftKey) keyCombination.push('Shift');
        if (event.altKey) keyCombination.push('Alt');
        keyCombination.push(event.key);
        const hotkey = keyCombination.join('+');

        if (hotkeys[hotkey]) {
            event.preventDefault(); // Prevent default browser action for the hotkey
            hotkeys[hotkey]();
        }
    });

    // Button click listener (using event delegation for dynamically added buttons)
    document.addEventListener('click', (event) => {
        for (const selector in buttonActions) {
            if (event.target.matches(selector)) {
                buttonActions[selector](event);
                break;
            }
        }
    });

    console.log('Gospelmonkey script loaded.');

})();
