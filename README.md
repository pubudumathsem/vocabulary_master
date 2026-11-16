# Dynamic vocabulary flashcards

On GitHub Pages, the app detects the current public GitHub repository through the page URL, uses the GitHub Contents API, and adds all root-level files matching `vocabulary*.txt` to the dropdown.

Examples automatically included:
- `vocabulary.txt`
- `vocabulary_n2.txt`
- `vocabulary-n3.txt`
- `VocabularyBusiness.txt`

Not included: `n2.txt` or `words.txt` because those names do not start with `vocabulary`.

## Setup
Upload `index.html`, `styles.css`, `app.js`, and all vocabulary files to the repository root, then enable GitHub Pages.

If vocabulary files are in a folder such as `decks`, set `DECK_FOLDER='decks'` near the top of `app.js`.

For localhost or a custom domain, set `GITHUB_OWNER` and `GITHUB_REPO` in `app.js`. The repository must be public for anonymous API access.

## File format
```text
number|kanji|reading|english|sinhala
1|福祉|ふくし|Welfare|සුබසාධනය
```
