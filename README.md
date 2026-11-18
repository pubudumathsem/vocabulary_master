# JLPT Vocabulary Flashcards

A read-only flashcard application for GitHub Pages. Vocabulary is loaded from text files selected through the dropdown.

## Files

- `index.html` – application page
- `app.js` – flashcard and vocabulary-loading logic
- `styles.css` – application styling
- `vocabulary.txt` – your current vocabulary deck
- `vocabulary-files.json` – list of vocabulary files shown in the dropdown

## Add another JLPT vocabulary file

1. Upload the new TXT file to the same GitHub repository root. For example, `vocabulary_N1.txt`.
2. Open `vocabulary-files.json` and add an entry to the `files` array:

```json
{ "file": "vocabulary_N1.txt", "label": "JLPT N1 (vocabulary_N1.txt)" }
```

3. Commit the changes. The new deck will appear in the dropdown after the GitHub Pages site updates.

The TXT file must use this format, with a header row and one vocabulary item per line:

```text
number|kanji|reading|english|sinhala
1|福祉|ふくし|Welfare|සුබසාධනය
```

The app loads the selected file when the dropdown changes. GitHub Pages is a static host and browsers cannot automatically enumerate repository files, so `vocabulary-files.json` is the file list that controls the dropdown.

## Run locally

Run a local web server from this folder (do not open `index.html` directly with `file://`):

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deploy with GitHub Pages

Upload all files in this folder to the repository root, then configure **Settings → Pages → Deploy from a branch → main → /(root)**.

This version does not provide add, edit, delete, export, or browser-local vocabulary modifications. Edit the TXT files in GitHub to update the decks.
