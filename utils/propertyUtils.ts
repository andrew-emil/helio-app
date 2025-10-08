export const parseBoldSegments = (input: string) => {
    const parts: { text: string; bold?: boolean }[] = [];
    if (!input) return parts;
    const regex = /\*\*(.*?)\*\*/g;
    let lastIndex = 0;
    let m;
    while ((m = regex.exec(input)) !== null) {
        const [match, inner] = m;
        const idx = m.index;
        if (idx > lastIndex) {
            parts.push({ text: input.substring(lastIndex, idx) });
        }
        parts.push({ text: inner, bold: true });
        lastIndex = idx + match.length;
    }
    if (lastIndex < input.length) {
        parts.push({ text: input.substring(lastIndex) });
    }
    // If no matches, return whole string
    if (parts.length === 0) parts.push({ text: input });
    return parts;
};