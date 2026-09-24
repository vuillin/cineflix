import { importLetterboxdWatches } from '../api/client.js';
import { toastError, toastSuccess } from '../components/toast.js';

/** Gère les guillemets CSV ("Titre, Director's Cut"). */
function parseCsvLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
            if (inQuotes && line[i + 1] === '"') {
                current += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (ch === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += ch;
        }
    }
    result.push(current);
    return result;
}

function parseWatchedCsv(text) {
    const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/).filter((l) => l.trim() !== '');
    if (lines.length < 2) return [];

    // Date,Name,Year,Letterboxd URI
    const watches = [];
    for (let i = 1; i < lines.length; i++) {
        const cols = parseCsvLine(lines[i]);
        if (cols.length < 3) continue;

        const date = cols[0].trim();
        const title = cols[1].trim();
        const year = Number(cols[2].trim());

        if (!title || !year || !/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;
        watches.push({ title, year, date });
    }
    return watches;
}

export function initLetterboxdImport({ reload } = {}) {
    const btn = document.getElementById('btn-letterboxd-import');
    const input = document.getElementById('letterboxd-csv-input');
    const status = document.getElementById('letterboxd-import-status');
    if (!btn || !input) return;

    btn.addEventListener('click', () => input.click());

    input.addEventListener('change', async () => {
        const file = input.files && input.files[0];
        input.value = '';
        if (!file) return;

        try {
            if (status) status.textContent = 'Lecture du CSV…';
            const text = await file.text();
            const watches = parseWatchedCsv(text);

            if (watches.length === 0) {
                toastError('CSV vide ou format invalide');
                if (status) status.textContent = '';
                return;
            }

            if (status) status.textContent = `Envoi de ${watches.length} visionnages…`;

            const response = await importLetterboxdWatches(watches);
            const body = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(body.error || 'Import impossible');
            }

            const updated = body.updated ?? 0;
            const unmatched = body.unmatched ?? 0;
            toastSuccess(`${updated} film(s) mis à jour · ${unmatched} non trouvé(s)`);
            if (status) {
                status.textContent = `${updated} mis à jour, ${unmatched} non trouvés dans la collection.`;
            }

            if (typeof reload === 'function') {
                await reload();
            }
        } catch (err) {
            console.error(err);
            toastError(err.message || 'Erreur durant l’import');
            if (status) status.textContent = '';
        }
    });
}
