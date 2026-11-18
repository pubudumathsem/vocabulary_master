# JLPT N2 Flashcards

A static flashcard application for GitHub Pages. It loads the initial deck from `vocabulary.txt`.

## Corrected numbering
The two supplied ranges contained 45 + 42 terms. This project renumbers all 87 terms continuously from **1 to 87**.

## Run locally
Because the browser loads `vocabulary.txt` with `fetch`, do not double-click `index.html`. Run a local server:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Upload and deploy with GitHub Pages
1. Create a new public GitHub repository.
2. Upload all five files from this folder to the repository root.
3. Open **Settings > Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select `main`, choose `/ (root)`, and click **Save**.

GitHub will show the published site address after deployment.

## Editing data
- Directly edit `vocabulary.txt` in GitHub for permanent shared changes.
- Changes made inside the app are stored only in that browser using `localStorage`.
- Use **Export TXT** to download the modified data, then replace `vocabulary.txt` in GitHub.

A static GitHub Pages website cannot directly write changes back to the repository without authentication and a backend or GitHub API token. Do not put a GitHub token in client-side JavaScript.

## Text format
One card per line, separated by `|`:

```text
number|kanji|reading|english|sinhala
1|福祉|ふくし|Welfare|සුබසාධනය
```
