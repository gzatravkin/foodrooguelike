/**
 * PluginRegistry - Automatic entity registration system
 * This system allows adding new game entities by just creating a single file.
 * No more manual imports or enum updates!
 */

export interface Plugin {
  id: string;
  enabled?: boolean;
}

export class PluginRegistry<T extends Plugin> {
  private plugins: Map<string, T> = new Map();
  private initialized: boolean = false;

  register(plugin: T): void {
    if (this.plugins.has(plugin.id)) {
      console.warn(`Plugin '${plugin.id}' is already registered. Skipping.`);
      return;
    }

    if (plugin.enabled === false) {
      console.log(`Plugin '${plugin.id}' is disabled. Skipping.`);
      return;
    }

    this.plugins.set(plugin.id, plugin);
    console.log(`✓ Registered plugin: ${plugin.id}`);
  }

  get(id: string): T | undefined {
    return this.plugins.get(id);
  }

  getAll(): T[] {
    return Array.from(this.plugins.values());
  }

  getAllIds(): string[] {
    return Array.from(this.plugins.keys());
  }

  has(id: string): boolean {
    return this.plugins.has(id);
  }

  markInitialized(): void {
    this.initialized = true;
    console.log(`Registry initialized with ${this.plugins.size} plugins`);
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  clear(): void {
    this.plugins.clear();
    this.initialized = false;
  }
}
