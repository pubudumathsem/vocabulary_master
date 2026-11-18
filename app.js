const $ = (selector) => document.querySelector(selector);

let cards = [];
let view = [];
let at = 0;
let selectedFile = "vocabulary.txt";

const vocabularySelect = $("#vocabularySelect");
const searchInput = $("#search");

function parseVocabulary(text) {
    const lines = text.replace(/^\uFEFF/, "").trim().split(/\r?\n/);
    if (lines.length < 2) return [];

    return lines.slice(1).filter((line) => line.trim()).map((line, index) => {
        const columns = line.split("|");
        if (columns.length < 5) return null;
        const [number, kanji, reading, english, ...sinhalaParts] = columns;
        return {
            number: Number(number) || index + 1,
            kanji: kanji.trim(),
            reading: reading.trim(),
            english: english.trim(),
            sinhala: sinhalaParts.join("|").trim()
        };
    }).filter((card) => card && card.kanji);
}

function displayFileName(file) {
    return file.replace(/^vocabulary(?:_|\.txt)/, (match) =>
        match === "vocabulary.txt" ? "JLPT Vocabulary" : "JLPT "
    ).replace(/\.txt$/i, "").replace(/_/g, " ").trim();
}

async function loadVocabularyFiles() {
    try {
        // GitHub Pages cannot list repository files automatically, so this manifest
        // defines the vocabulary files shown in the dropdown.
        const response = await fetch("vocabulary-files.json", { cache: "no-store" });
        if (!response.ok) throw new Error("Could not load vocabulary-files.json");
        const manifest = await response.json();
        const files = Array.isArray(manifest.files) ? manifest.files : [];
        if (!files.length) throw new Error("No vocabulary files are configured.");

        vocabularySelect.innerHTML = "";
        files.forEach((entry) => {
            const file = typeof entry === "string" ? entry : entry.file;
            const label = typeof entry === "string" ? displayFileName(entry) : (entry.label || displayFileName(file));
            if (!file) return;
            const option = document.createElement("option");
            option.value = file;
            option.textContent = label;
            vocabularySelect.appendChild(option);
        });

        if (!vocabularySelect.options.length) throw new Error("No valid vocabulary files are configured.");
        const defaultFile = files.some((entry) => (typeof entry === "string" ? entry : entry.file) === "vocabulary.txt")
            ? "vocabulary.txt"
            : vocabularySelect.options[0].value;
        vocabularySelect.value = defaultFile;
        vocabularySelect.disabled = false;
        await loadVocabulary(defaultFile);
    } catch (error) {
        showError(`${error.message}. Check that vocabulary-files.json is in the repository root.`);
    }
}

async function loadVocabulary(file) {
    selectedFile = file;
    searchInput.value = "";
    searchInput.disabled = true;
    $("#progress").textContent = `Loading ${file}...`;

    try {
        const response = await fetch(file, { cache: "no-store" });
        if (!response.ok) throw new Error(`Could not load ${file} (HTTP ${response.status})`);
        const text = await response.text();
        cards = parseVocabulary(text);
        if (!cards.length) throw new Error(`${file} does not contain any valid vocabulary rows`);

        $("#deckTitle").textContent = displayFileName(file) + " Flashcards";
        searchInput.disabled = false;
        at = 0;
        applyFilter();
    } catch (error) {
        cards = [];
        view = [];
        at = 0;
        render();
        showError(error.message);
    }
}

function showError(message) {
    $("#progress").textContent = message;
    $("#kanji").textContent = "Unable to load";
}

function applyFilter() {
    const query = searchInput.value.trim().toLocaleLowerCase();
    view = cards.filter((card) =>
        [card.kanji, card.reading, card.english, card.sinhala].some((value) =>
            value.toLocaleLowerCase().includes(query)
        )
    );
    at = Math.min(at, Math.max(0, view.length - 1));
    render();
}

function render() {
    const card = view[at];
    $("#card").classList.remove("flipped");

    if (!card) {
        $("#number").textContent = "";
        $("#kanji").textContent = cards.length ? "No matching cards" : "No cards";
        $("#reading").textContent = "";
        $("#english").textContent = "";
        $("#sinhala").textContent = "";
        $("#progress").textContent = cards.length
            ? `0 results • ${cards.length} total in ${selectedFile}`
            : `0 cards • ${selectedFile}`;
        return;
    }

    $("#number").textContent = `No. ${card.number}`;
    $("#kanji").textContent = card.kanji;
    $("#reading").textContent = card.reading;
    $("#english").textContent = card.english;
    $("#sinhala").textContent = card.sinhala;
    $("#progress").textContent = `Card ${at + 1} of ${view.length} • ${cards.length} total`;
}

function move(amount) {
    if (!view.length) return;
    at = (at + amount + view.length) % view.length;
    render();
}

$("#card").addEventListener("click", () => $("#card").classList.toggle("flipped"));
$("#card").addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        $("#card").classList.toggle("flipped");
    }
});

$("#prev").addEventListener("click", () => move(-1));
$("#next").addEventListener("click", () => move(1));
searchInput.addEventListener("input", () => {
    at = 0;
    applyFilter();
});
vocabularySelect.addEventListener("change", () => loadVocabulary(vocabularySelect.value));

document.addEventListener("keydown", (event) => {
    if (event.target.matches("input, select, textarea")) return;
    if (event.key === "ArrowLeft") move(-1);
    if (event.key === "ArrowRight") move(1);
});

$("#speak").addEventListener("click", () => {
    const card = view[at];
    if (card && "speechSynthesis" in window) {
        speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(`${card.kanji}、${card.reading}`);
        utterance.lang = "ja-JP";
        speechSynthesis.speak(utterance);
    }
});

$("#theme").addEventListener("click", () => document.body.classList.toggle("dark"));

loadVocabularyFiles();
