export const CURRENT_VERSION = "1.0.1";

// Helper to compare semantic versions (e.g., "1.0.1" vs "1.0.10")
export const isNewerVersion = (current: string, latest: string) => {
    const currentParts = current.split('.').map(Number);
    const latestParts = latest.split('.').map(Number);

    for (let i = 0; i < Math.max(currentParts.length, latestParts.length); i++) {
        const currentPart = currentParts[i] || 0;
        const latestPart = latestParts[i] || 0;
        if (latestPart > currentPart) return true;
        if (latestPart < currentPart) return false;
    }
    return false;
}
