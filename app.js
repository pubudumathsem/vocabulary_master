const $ = (s) => document.querySelector(s);

let cards = [],
    view = [],
    at = 0;

const KEY = "jlpt-n2-cards-v1";

async function load() {
    const saved = localStorage.getItem(KEY);

    if (saved) {
        cards = JSON.parse(saved);
    } else {
        const text = await fetch("vocabulary.txt").then((r) => {
            if (!r.ok) {
                throw Error("Could not load vocabulary.txt");
            }
            return r.text();
        });

        cards = text
            .trim()
            .split(/\r?\n/)
            .slice(1)
            .map((line) => {
                const [number, kanji, reading, english, sinhala] =
                    line.split("|");

                return {
                    number: +number,
                    kanji,
                    reading,
                    english,
                    sinhala,
                };
            });
    }

    applyFilter();
}

function save() {
    cards.forEach((x, i) => (x.number = i + 1));
    localStorage.setItem(KEY, JSON.stringify(cards));
    applyFilter();
}

function applyFilter() {
    const q = $("#search").value.trim().toLowerCase();

    view = cards.filter((x) =>
        [x.kanji, x.reading, x.english, x.sinhala].some((v) =>
            v.toLowerCase().includes(q)
        )
    );

    at = Math.min(at, Math.max(0, view.length - 1));

    render();
}

function render() {
    const c = view[at];

    $("#card").classList.remove("flipped");

    if (!c) {
        $("#number").textContent = "";
        $("#kanji").textContent = "No cards";
        $("#reading").textContent = "";
        $("#english").textContent = "";
        $("#sinhala").textContent = "";
        $("#progress").textContent = "0 cards";
        return;
    }

    $("#number").textContent = `No. ${c.number}`;
    $("#kanji").textContent = c.kanji;
    $("#reading").textContent = c.reading;
    $("#english").textContent = c.english;
    $("#sinhala").textContent = c.sinhala;

    $("#progress").textContent =
        `Card ${at + 1} of ${view.length} • ${cards.length} total`;
}

function move(n) {
    if (view.length) {
        at = (at + n + view.length) % view.length;
        render();
    }
}

$("#card").onclick = () => $("#card").classList.toggle("flipped");

$("#card").onkeydown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        $("#card").click();
    }
};

$("#prev").onclick = () => move(-1);
$("#next").onclick = () => move(1);

document.onkeydown = (e) => {
    if (e.key === "ArrowLeft") move(-1);
    if (e.key === "ArrowRight") move(1);
};

$("#search").oninput = () => {
    at = 0;
    applyFilter();
};

$("#shuffle").onclick = () => {
    view.sort(() => Math.random() - 0.5);
    at = 0;
    render();
};

function openEditor(c = null) {
    $("#formTitle").textContent = c ? "Edit card" : "Add card";

    $("#editIndex").value = c ? cards.indexOf(c) : "";
    $("#fKanji").value = c?.kanji || "";
    $("#fReading").value = c?.reading || "";
    $("#fEnglish").value = c?.english || "";
    $("#fSinhala").value = c?.sinhala || "";

    $("#editor").showModal();
}

$("#add").onclick = () => openEditor();

$("#edit").onclick = () => {
    if (view[at]) openEditor(view[at]);
};

$("#cancel").onclick = () => $("#editor").close();

$("#form").onsubmit = (e) => {
    e.preventDefault();

    const item = {
        kanji: $("#fKanji").value.trim(),
        reading: $("#fReading").value.trim(),
        english: $("#fEnglish").value.trim(),
        sinhala: $("#fSinhala").value.trim(),
    };

    const i = $("#editIndex").value;

    if (i === "") {
        cards.push(item);
    } else {
        cards[+i] = {
            ...cards[+i],
            ...item,
        };
    }

    save();
    $("#editor").close();
};

$("#delete").onclick = () => {
    const c = view[at];

    if (c && confirm(`Delete ${c.kanji}?`)) {
        cards.splice(cards.indexOf(c), 1);
        save();
    }
};

$("#reset").onclick = () => {
    if (confirm("Remove local changes and reload vocabulary.txt?")) {
        localStorage.removeItem(KEY);
        location.reload();
    }
};

$("#speak").onclick = () => {
    const c = view[at];

    if (c && "speechSynthesis" in window) {
        speechSynthesis.cancel();

        const u = new SpeechSynthesisUtterance(
            c.kanji + "、" + c.reading
        );

        u.lang = "ja-JP";
        speechSynthesis.speak(u);
    }
};

$("#export").onclick = () => {
    const rows = [
        "number|kanji|reading|english|sinhala",
        ...cards.map((c, i) =>
            [i + 1, c.kanji, c.reading, c.english, c.sinhala].join("|")
        ),
    ];

    const a = document.createElement("a");

    a.href = URL.createObjectURL(
        new Blob([rows.join("\n") + "\n"], {
            type: "text/plain;charset=utf-8",
        })
    );

    a.download = "vocabulary.txt";
    a.click();

    URL.revokeObjectURL(a.href);
};

$("#theme").onclick = () =>
    document.body.classList.toggle("dark");

load().catch((e) => {
    $("#progress").textContent =
        e.message +
        " (open through a web server, not file://)";
});