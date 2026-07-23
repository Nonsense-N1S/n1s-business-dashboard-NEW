import type { WidgetComponent, WidgetRegistryEntry, WidgetType } from './types'

const registry = new Map<WidgetType, WidgetRegistryEntry>()

export function registerWidget(
  type: WidgetType,
  entry: WidgetRegistryEntry,
): void {
  registry.set(type, entry)
}

export function getWidget(type: WidgetType): WidgetRegistryEntry | undefined {
  return registry.get(type)
}

export function getAllWidgets(): Map<WidgetType, WidgetRegistryEntry> {
  return registry
}

// Utility: dynamic import helper for lazy-loaded widgets
export function createLazyWidget(
  loader: () => Promise<{ default: WidgetComponent }>,
  label: string,
  defaultSize: WidgetRegistryEntry['defaultSize'],
): WidgetRegistryEntry {
  return {
    component: loader as unknown as WidgetComponent,
    label,
    defaultSize,
  }
}
