export function normalizeImageUrls(input: string | string[] | undefined | null): string[] {
    if (!input) return [];

    if (Array.isArray(input)) {
        return input.map(String).filter(Boolean);
    }

    // now input is a string
    const trimmed = input.trim();
    if (!trimmed) return [];

    // try parsing a JSON array string like '["a","b"]'
    if ((trimmed.startsWith('[') && trimmed.endsWith(']')) || trimmed.includes('","')) {
        try {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
        } catch {
            // fall through to other heuristics
        }
    }

    // split comma-separated values (but avoid splitting data URLs)
    if (trimmed.includes(',') && !trimmed.startsWith('data:')) {
        return trimmed.split(',').map(s => s.trim()).filter(Boolean);
    }

    // fallback: single url string
    return [trimmed];
}