# GitHub Contribution Streak Extension

Adds a banner beneath the GitHub contribution graph showing your **current** and **longest** commit streak within a specified date range. Avoids timezone issues by comparing raw date strings (`YYYY-MM-DD`).

## Installation

1. Clone or download this repository.
2. Open your browser’s extensions page:
   - **Chrome:** `chrome://extensions`
   - **Brave:** `brave://extensions`
3. Enable **Developer mode**.
4. Click **Load unpacked** and select this directory.
5. Grant the extension access to `github.com` when prompted.
6. Navigate to any GitHub profile to see your streak stats for the chosen period.

## Configuration

Edit `content.js`:
```js
const startDateStr = 'YYYY-MM-DD';
const endDateStr = 'YYYY-MM-DD';
```

## Development

- Modify **content.js** or **manifest.json**.
- Reload the extension (⟳) on the extensions page.
- Refresh the GitHub profile page.

## License

[MIT](LICENSE)