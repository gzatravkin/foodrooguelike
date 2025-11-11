/**
 * CombatLogManager - Manages combat log entries and their lifecycle
 */
export class CombatLogManager {
  private combatLog: Array<{text: string; timestamp: number; color: string}> = [];
  private readonly MAX_LOG_ENTRIES = 8;
  private readonly LOG_DURATION = 15000; // 15 seconds

  addEntry(text: string, color: string = '#FFF'): void {
    const entry = {
      text,
      timestamp: Date.now(),
      color
    };
    this.combatLog.unshift(entry);

    // Keep only the most recent entries
    if (this.combatLog.length > this.MAX_LOG_ENTRIES) {
      this.combatLog = this.combatLog.slice(0, this.MAX_LOG_ENTRIES);
    }

    // Debug logging
    console.log(`[Combat Log] ${text}`);
  }

  update(): void {
    const now = Date.now();
    this.combatLog = this.combatLog.filter(entry => now - entry.timestamp < this.LOG_DURATION);
  }

  getEntries(): Array<{text: string; timestamp: number; color: string}> {
    return this.combatLog;
  }

  clear(): void {
    this.combatLog = [];
  }
}
