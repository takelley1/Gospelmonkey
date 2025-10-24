# Tampermonkey Script for Global Media Outreach

This Tampermonkey script enhances your workflow in the path.globalmediaoutreach.com web application by providing hotkeys for common actions and personalized message pasting.
This allows navigating PATH mostly using only the keyboard.

## Features

*   **`Control + Shift + A`**: Archives the oldest conversation in the list.
*   **`Control + Shift + F`**: Pastes a personalized follow-up message into the conversation's message box. The message includes the contact's first name.
*   **`Control + Shift + G`**: Pastes a personalized gospel message into the conversation's message box. The message includes the contact's first name.
*   **`Control + Shift + N`**: Clicks the "Add" button (used for adding new contacts or opening options).
*   **`Control + Shift + O`**: Clicks the bottom-most contact in the list, ensuring all contacts are loaded by scrolling to the bottom of the page first.
*   **`Control + Shift + Enter`**: Clicks the send message button, waits for 2 seconds, then navigates back in browser history.
*   **`Control + Shift + Backspace`**: Performs the browser's "back" function.

## Prerequisites

*   A web browser (Chrome, Firefox, Edge, Opera, Safari).
*   The [Tampermonkey browser extension](https://www.tampermonkey.net/) installed in your browser.

## Installation

1.  **Install Tampermonkey**: If you don't have it already, install the Tampermonkey extension for your browser from its official website or your browser's extension store.
2.  **Create a New Script**:
    *   Click on the Tampermonkey icon in your browser's toolbar.
    *   Select "Create a new script..."
3.  **Copy the Script**: Delete any existing code in the new script editor. Then, copy the entire content of the `Gospelmonkey.user.js` file and paste it into the Tampermonkey editor.
4.  **Save the Script**: Click on "File" -> "Save".

## Usage

1.  Navigate to the PATH web application URL and login: `https://path.globalmediaoutreach.com`
2.  Once the page is loaded, use the defined hotkeys:
    *   Press `Control + Shift + A` to archive the oldest conversation.
    *   Press `Control + Shift + F` to paste the follow-up message.
    *   Press `Control + Shift + G` to paste the gospel message.
    *   Press `Control + Shift + N` to click the "Add" button.
    *   Press `Control + Shift + O` to click the bottom-most contact.
    *   Press `Control + Shift + Enter` to send the message and go back.
    *   Press `Control + Shift + Backspace` to go back in your browser history.
