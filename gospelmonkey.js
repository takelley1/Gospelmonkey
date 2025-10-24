// ==UserScript==
// @name         Gospelmonkey
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automates specific parts of GMO's PATH application.
// @author       Austin Kelley
// @match        https://path.globalmediaoutreach.com/*
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
        'Control+Shift+F': () => {
            console.log('Ctrl+Shift+F pressed - Pasting follow-up message!');
            pasteMessage("Hi $contact, did you get my last message? I look forward to speaking with you!\n\nYou can read the Bible for free here: https://www.biblegateway.com/passage/?search=John%201&version=NIV");
        },
        'Control+Shift+G': () => {
            console.log('Ctrl+Shift+G pressed - Pasting gospel message!');
            pasteMessage("Hi $contact, I'm Austin. God created us people in His image and blessed us and gave us dominion over everything in the earth. Why? I believe He did so because He is love and He wants to share His love with us. But then Adam, the first man, sinned and disobeyed God and broke the wonderful relationship he and all people to come had with God, for we all sinned. \"But your iniquities have separated you from your God; and your sins have hidden His face from you, so that He will not hear\" (Isaiah 59:2).God sent His One and only Son Jesus Christ to earth to die for our sins. After 3 days, Jesus rose from the dead. I want to help you know God. $contact, God loves you. \"For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life\" (John 3:16). When I first experienced God, I first asked Jesus Christ to forgive me my sins and come into my life. I encourage you to read the Gospel of John in the Bible. John was Jesus' closest disciple when Jesus Christ the Son of God was ministering on earth. You can download a Bible onto your phone at bible.com/app. Who is Jesus Christ to you, $contact? Please let me hear from you. I look forward to reading your words.");
        },
        'Control+Shift+N': () => {
            addContactAndOpen();
        },
        'Control+Shift+O': () => {
            console.log('Ctrl+Shift+O pressed - Clicking bottom contact!');
            clickBottomContact();
        },
        'Shift+Enter': () => {
            console.log('Shift+Enter pressed - Sending message and going back!');
            sendAndGoBack();
        },
        'Shift+Backspace': () => {
            console.log('Shift+Backspace pressed - Performing browser back action!');
            window.history.back();
        },
    };

    // --- Helper Functions (for DOM interaction) ---

    /**
     * Pastes a given message into the message text area and focuses it.
     * Replaces "$contact" with the first name of the person in the conversation.
     * @param {string} message - The message to paste. Can contain "$contact" placeholder.
     */
    function pasteMessage(message) {
        const textArea = document.getElementById('text-area');
        if (textArea) {
            let finalMessage = message;

            const firstName = getContactFirstName();
            if (firstName) {
                finalMessage = finalMessage.replace(/\$contact/g, firstName);
            }

            textArea.value = finalMessage;
            textArea.focus();
            textArea.dispatchEvent(new Event('input', { bubbles: true }));
            textArea.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }


    /**
     * Extracts the first name of the contact from the conversation title.
     * @returns {string|null} The first name of the contact, or null if not found.
     */
    function getContactFirstName() {
        const titleElement = document.querySelector('app-seeker-request ion-toolbar ion-title');
        if (titleElement) {
            const fullText = titleElement.textContent.trim();
            const nameMatch = fullText.match(/^(\w+)/);
            if (nameMatch && nameMatch[1]) {
                return nameMatch[1];
            }
        }
        return null;
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

    /**
     * Clicks the bottom-most contact in the list of contacts, ensuring all contacts are loaded by scrolling.
     */
    async function clickBottomContact() {
        const scrollableContent = document.querySelector('ion-content[role="main"]'); // Assuming this is the main scrollable area
        if (!scrollableContent) {
            console.warn('Scrollable content area (ion-content[role="main"]) not found.');
            return;
        }

        let previousScrollHeight = 0;
        let currentScrollHeight = scrollableContent.scrollHeight;

        // Scroll to the bottom repeatedly until no new content loads
        while (currentScrollHeight > previousScrollHeight) {
            previousScrollHeight = currentScrollHeight;
            scrollableContent.scrollTop = currentScrollHeight;
            console.log('Scrolling to bottom to load more contacts...');
            await new window.Promise(resolve => window.setTimeout(resolve, 500)); // Wait for content to load
            currentScrollHeight = scrollableContent.scrollHeight;
        }
        console.log('Finished scrolling. All contacts should be loaded.');

        // Now, find and click the bottom-most contact
        const contactListItems = document.querySelectorAll('ion-list ion-item-sliding');
        if (contactListItems.length > 0) {
            const bottomContactSlidingItem = contactListItems[contactListItems.length - 1];
            // Try clicking the h2 element within the ion-label, as it contains the contact name
            const contactNameHeading = bottomContactSlidingItem.querySelector('ion-item ion-label h2');
            if (contactNameHeading) {
                contactNameHeading.click();
                console.log('Clicked the h2 element (contact name) of the bottom-most contact.');
            } else {
                console.warn('Contact name heading (h2) not found within the bottom-most ion-item.');
            }
        } else {
            console.warn('No contact list items found to click.');
        }
    }

    /**
     * Adds a new contact and clicks on it once it appears in the list.
     */
    async function addContactAndOpen() {
        console.log('Adding new contact and opening it.');

        const contactList = document.querySelector('app-tab-seekers ion-list');
        if (!contactList) {
            console.warn('Contact list (app-tab-seekers ion-list) not found.');
            return;
        }

        const initialContactCount = contactList.querySelectorAll('ion-item-sliding').length;

        const addButton = document.querySelector('ion-fab-button');
        if (addButton) {
            addButton.click();
        } else {
            console.warn('Add button (ion-fab-button) not found.');
            return;
        }

        const observer = new window.MutationObserver((mutationsList, observer) => {
            for(let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    const newContactCount = contactList.querySelectorAll('ion-item-sliding').length;
                    if (newContactCount > initialContactCount) {
                        console.log('New contact added. Clicking it.');
                        const firstContactSlidingItem = contactList.querySelector('ion-item-sliding');
                        if (firstContactSlidingItem) {
                            const contactNameHeading = firstContactSlidingItem.querySelector('ion-item ion-label h2');
                            if (contactNameHeading) {
                                contactNameHeading.click();
                                console.log('Clicked the h2 element (contact name) of the new contact.');
                            } else {
                                console.warn('Contact name heading (h2) not found within the new contact.');
                            }
                        }
                        observer.disconnect();
                        return;
                    }
                }
            }
        });

        observer.observe(contactList, { childList: true, subtree: true });

        // Timeout to prevent observer from running indefinitely
        window.setTimeout(() => {
            observer.disconnect();
            console.warn('Observer timed out. New contact was not detected.');
        }, 10000); // 10 seconds timeout
    }

    /**
     * Clicks the send message button, waits for 2 seconds, then navigates back in browser history.
     */
    async function sendAndGoBack() {
        const sendButton = document.querySelector('ion-button:has(ion-icon[name="send"])');
        if (sendButton) {
            sendButton.click();
            console.log('Send button clicked. Waiting 2 seconds before going back...');
            await new window.Promise(resolve => window.setTimeout(resolve, 2000)); // Wait for 2 seconds
            window.history.back();
            console.log('Navigated back in browser history.');
        } else {
            console.warn('Send button (ion-button with ion-icon name="send") not found.');
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



    console.log('Gospelmonkey script loaded.');

})();
