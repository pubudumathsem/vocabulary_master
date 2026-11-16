# Japanese Flashcards

A static Japanese vocabulary flashcard app that can be hosted on GitHub Pages.

## Vocabulary files
Put `.txt` files beside `index.html`. Their filenames must begin with `vocab` (case-insensitive), for example:
- `vocabulary.txt`
- `vocab_n2.txt`
- `vocab_business.txt`

Format:
`number|kanji|reading|english|sinhala`

Because a browser cannot automatically list files inside a GitHub repository/folder, add each vocabulary filename to `vocab-files.json`. The dropdown is generated dynamically from that list and ignores entries that do not start with `vocab`.

## GitHub Pages
1. Create a GitHub repository.
2. Upload `index.html`, `vocab-files.json`, and all vocabulary `.txt` files to the repository root.
3. Open **Settings > Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and `/ (root)`, then Save.

The resulting site is static and can be opened from phone or desktop without a backend.
