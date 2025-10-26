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
    const CONFIG = {
        selectors: {
            toastContainer: '.toast-container',
            toastButton: 'button.toast-button-cancel',
            textArea: '#text-area',
            subjectInput: '.subjectInput',
            contactTitle: 'app-seeker-request ion-toolbar ion-title',
            conversationList: 'ion-list ion-item-sliding',
            archiveButton: 'ion-item-option:has(ion-icon[name="archive"])',
            scrollableContent: 'ion-content[role="main"]',
            contactNameHeading: 'ion-item ion-label h2',
            addContactButton: 'ion-fab-button',
            contactListContainer: 'app-tab-seekers ion-list',
            sendButton: 'ion-button:has(ion-icon[name="send"])',
        },
        timeouts: {
            toast: 500,
            scroll: 500,
            send: 2000,
            observer: 10000,
        },
        messages: {
            followUp: "Hi $contact, did you get my last message? I look forward to speaking with you!\n\nYou can read the Bible for free here: https://www.biblegateway.com/passage/?search=John%201&version=NIV\nYou can also install the Bible app for free at https://bible.com/app",
            gospel: "Hi $contact, I'm Austin. God created us people in His image and blessed us and gave us dominion over everything in the earth. Why? I believe He did so because He is love and He wants to share His love with us. But then Adam, the first man, sinned and disobeyed God and broke the wonderful relationship he and all people to come had with God, for we all sinned. \"But your iniquities have separated you from your God; and your sins have hidden His face from you, so that He will not hear\" (Isaiah 59:2).God sent His One and only Son Jesus Christ to earth to die for our sins. After 3 days, Jesus rose from the dead. I want to help you know God. $contact, God loves you. \"For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life\" (John 3:16). When I first experienced God, I first asked Jesus Christ to forgive me my sins and come into my life. I encourage you to read the Gospel of John in the Bible. John was Jesus' closest disciple when Jesus Christ the Son of God was ministering on earth. You can download a Bible onto your phone at bible.com/app. Who is Jesus Christ to you, $contact? Please let me hear from you. I look forward to reading your words.",
            muslim: "Hello $contact, My name is Austin. Thank you for contacting us. Your relationship with God is the most important thing in your life. Please remember that you are a human trying to understand God. Only God can reveal Himself to you. You can ask God to show you who He really is and how to have a relationship with Him. God loves you and wants you to know Him. Talk to Him directly and ask for His help. Jesus Christ (Isa) paid for our sins. 'He was delivered over to death for our sins and was raised to life for our justification' (Romans 4:25).\n\nhttps://whoisjesus-really.com explains the life of Jesus, the miracles He performed, what others said about Him, how He has influenced the world and what all this means to you, https://jesusfactorfiction.com is a series of excellent multi-media presentations exploring the life and claims of Jesus. These are just two of Christ's claims. 'Truly, truly I say to you, the one hearing my word and believing the One having sent me has eternal life and comes not into judgment but has passed over out of death into life....I am the way and the truth and the life; no one comes to the Father except through me' (John 5:24 and 14:6). The Bible is the best book I recommend to discover Jesus' story. I encourage you to begin reading the Gospel of John in the New Testament. If you don’t have a Bible, you can get one free for your phone at https://bible.com/app What questions are you struggling with these days, $contact? Austin",
        },
        subjects: {
            followUp: "Follow up",
            gospel: "Good news",
            muslim: "Good news",
        }
    };

    // Define your hotkeys and their corresponding actions here.
    const hotkeys = {
        'Control+Shift+A': () => {
            console.log('Ctrl+Shift+A pressed - Archiving oldest conversation!');
            archiveOldestConversation();
        },
        'Control+Shift+F': () => {
            console.log('Ctrl+Shift+F pressed - Pasting follow-up message!');
            pasteMessage(CONFIG.messages.followUp, CONFIG.subjects.followUp);
        },
        'Control+Shift+G': () => {
            console.log('Ctrl+Shift+G pressed - Pasting gospel message!');
            pasteMessage(CONFIG.messages.gospel, CONFIG.subjects.gospel);
        },
        'Control+Shift+M': () => {
            console.log('Ctrl+Shift+M pressed - Pasting message for Muslims!');
            pasteMessage(CONFIG.messages.muslim, CONFIG.subjects.muslim);
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
     * Checks for and dismisses a toast notification if it's present.
     * @returns {void}
     */
    function dismissToast() {
        // Wait a bit for the toast to appear
        setTimeout(() => {
            const toastContainer = document.querySelector(CONFIG.selectors.toastContainer);
            if (toastContainer) {
                const okButton = toastContainer.querySelector(CONFIG.selectors.toastButton);
                if (okButton) {
                    okButton.click();
                    console.log('Toast notification dismissed.');
                }
            }
        }, CONFIG.timeouts.toast); // Wait for the toast to appear
    }

    /**
     * Dispatches 'input' and 'change' events on a given element.
     * @param {HTMLElement} element - The element to dispatch events on.
     */
    function dispatchEvents(element) {
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
    }

    /**
     * Pastes a given message into the message text area and focuses it.
     * Replaces "$contact" with the first name of the person in the conversation.
     * If a subject field is present, the first line of the message is used as the subject.
     * @param {string} message - The message to paste. Can contain "$contact" placeholder.
     * @param {string} [subject] - The subject to use. If not provided, the first line of the message will be used.
     */
    function pasteMessage(message, subject = '') {
        const textArea = document.querySelector(CONFIG.selectors.textArea);
        const subjectInput = document.querySelector(CONFIG.selectors.subjectInput);

        if (textArea) {
            let finalMessage = message;
            const firstName = getContactFirstName();
            if (firstName) {
                finalMessage = finalMessage.replace(/\$contact/g, firstName);
            }

            let body = finalMessage;

            if (subjectInput) {
                let finalSubject = subject;
                if (!finalSubject) {
                    const firstLineEnd = finalMessage.indexOf('\n');
                    if (firstLineEnd !== -1) {
                        finalSubject = finalMessage.substring(0, firstLineEnd);
                        body = finalMessage.substring(firstLineEnd + 1);
                    } else {
                        finalSubject = finalMessage;
                        body = '';
                    }
                }
                subjectInput.value = finalSubject;
                dispatchEvents(subjectInput);
            }

            textArea.value = body;
            textArea.focus();
            dispatchEvents(textArea);
        }
    }


    /**
     * Extracts the first name of the contact from the conversation title.
     * @returns {string|null} The first name of the contact, or null if not found.
     */
    function getContactFirstName() {
        const titleElement = document.querySelector(CONFIG.selectors.contactTitle);
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
     * @returns {void}
     */
    function archiveOldestConversation() {
        const conversationListItems = document.querySelectorAll(CONFIG.selectors.conversationList);
        if (conversationListItems.length > 0) {
            const oldestConversation = conversationListItems[conversationListItems.length - 1];
            const archiveButton = oldestConversation.querySelector(CONFIG.selectors.archiveButton);
            if (archiveButton) {
                // Simulate a click on the archive button
                archiveButton.click();
                dismissToast();
            } else {
                console.warn('Archive button not found for the oldest conversation.');
            }
        } else {
            console.warn('No conversations found to archive.');
        }
    }

    /**
     * Clicks the bottom-most contact in the list of contacts, ensuring all contacts are loaded by scrolling.
     * @returns {Promise<void>}
     */
    async function clickBottomContact() {
        const scrollableContent = document.querySelector(CONFIG.selectors.scrollableContent); // Assuming this is the main scrollable area
        if (!scrollableContent) {
            console.warn('Scrollable content area not found.');
            return;
        }

        let previousScrollHeight = 0;
        let currentScrollHeight = scrollableContent.scrollHeight;

        // Scroll to the bottom repeatedly until no new content loads
        while (currentScrollHeight > previousScrollHeight) {
            previousScrollHeight = currentScrollHeight;
            scrollableContent.scrollTop = currentScrollHeight;
            console.log('Scrolling to bottom to load more contacts...');
            await new window.Promise(resolve => window.setTimeout(resolve, CONFIG.timeouts.scroll)); // Wait for content to load
            currentScrollHeight = scrollableContent.scrollHeight;
        }
        console.log('Finished scrolling. All contacts should be loaded.');

        // Now, find and click the bottom-most contact
        const contactListItems = document.querySelectorAll(CONFIG.selectors.conversationList);
        if (contactListItems.length > 0) {
            const bottomContactSlidingItem = contactListItems[contactListItems.length - 1];
            // Try clicking the h2 element within the ion-label, as it contains the contact name
            const contactNameHeading = bottomContactSlidingItem.querySelector(CONFIG.selectors.contactNameHeading);
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
     * @returns {Promise<void>}
     */
    async function addContactAndOpen() {
        console.log('Adding new contact and opening it.');

        const contactList = document.querySelector(CONFIG.selectors.contactListContainer);
        if (!contactList) {
            console.warn('Contact list not found.');
            return;
        }

        const initialContactCount = contactList.querySelectorAll(CONFIG.selectors.conversationList).length;

        const addButton = document.querySelector(CONFIG.selectors.addContactButton);
        if (addButton) {
            addButton.click();
            dismissToast();
        } else {
            console.warn('Add button not found.');
            return;
        }

        const observer = new window.MutationObserver((mutationsList, observer) => {
            for(let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    const newContactCount = contactList.querySelectorAll(CONFIG.selectors.conversationList).length;
                    if (newContactCount > initialContactCount) {
                        console.log('New contact added. Clicking it.');
                        const firstContactSlidingItem = contactList.querySelector(CONFIG.selectors.conversationList);
                        if (firstContactSlidingItem) {
                            const contactNameHeading = firstContactSlidingItem.querySelector(CONFIG.selectors.contactNameHeading);
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
        }, CONFIG.timeouts.observer); // 10 seconds timeout
    }

    /**
     * Clicks the send message button, waits for 2 seconds, then navigates back in browser history.
     * @returns {Promise<void>}
     */
    async function sendAndGoBack() {
        const sendButton = document.querySelector(CONFIG.selectors.sendButton);
        if (sendButton) {
            sendButton.click();
            console.log('Send button clicked. Waiting before going back...');
            await new window.Promise(resolve => window.setTimeout(resolve, CONFIG.timeouts.send)); // Wait for 2 seconds
            window.history.back();
            console.log('Navigated back in browser history.');
        } else {
            console.warn('Send button not found.');
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
