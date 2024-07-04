# WordSense

WordSense is a Chrome extension that provides instant word definitions and pronunciations. It enhances your reading experience by allowing you to quickly look up the meaning of words and listen to their pronunciations directly from your browser.

## Features

- **Instant Definitions**: Select any word on a webpage to get its definition.
- **Pronunciations**: Listen to the pronunciation of selected words.
- **Enable/Disable Toggle**: Easily enable or disable the extension using the popup menu.
- **Dark Mode Support**: Tooltip adapts to dark or light themes based on the webpage background.

## Files

- **background.js**: Manages context menus and message passing.
- **content.js**: Handles text selection, fetches word meanings and pronunciations, and displays tooltips.
- **manifest.json**: Configures the extension.
- **popup.html**: Provides the toggle interface for enabling/disabling the extension.
- **popup.js**: Manages the toggle state and updates the UI.
- **styles.css**: (Currently empty, but can be used for custom styles).
- **Icons**: `icon128.png`, `power_on.png`, `power_off.png`.

## Installation

1. Clone this repository.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" using the toggle switch in the top right corner.
4. Click "Load unpacked" and select the directory where you cloned the repository.
5. The WordSense extension should now be installed and active.

## Usage

1. Enable the extension from the popup by clicking on the icon in the browser toolbar.
2. Select any word on a webpage to see its definition and listen to its pronunciation.
3. Use the toggle in the popup to enable or disable the extension as needed.

## Contributions

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/vedantbhamare-11/WordSense/issues).
