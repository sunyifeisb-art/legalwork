import { describe, expect, it } from 'vitest'
import {
  findKeyboardShortcutCommand,
  findKeyboardShortcutConflict,
  keyboardEventToShortcut,
  normalizeKeyboardShortcuts,
  normalizeKeyboardShortcut,
  resolveKeyboardShortcutBindings
} from './keyboard-shortcuts'

describe('keyboard shortcuts', () => {
  it('normalizes common shortcut strings', () => {
    expect(normalizeKeyboardShortcut('shift + tab')).toBe('Shift+Tab')
    expect(normalizeKeyboardShortcut('ctrl++')).toBe('Ctrl++')
    expect(normalizeKeyboardShortcut('control + shift + i')).toBe('Ctrl+Shift+I')
  })

  it('converts keyboard events to shortcut strings', () => {
    expect(keyboardEventToShortcut({ key: 'Tab', shiftKey: true })).toBe('Shift+Tab')
    expect(keyboardEventToShortcut({ key: '+', ctrlKey: true })).toBe('Ctrl++')
    expect(keyboardEventToShortcut({ key: 'Shift', shiftKey: true })).toBeNull()
  })

  it('uses defaults unless a command has a custom binding', () => {
    const bindings = resolveKeyboardShortcutBindings({
      bindings: {
        'toggle-plan-mode': ['Ctrl+Shift+P'],
        'new-chat': []
      }
    })

    expect(bindings['toggle-plan-mode']).toEqual(['Ctrl+Shift+P'])
    expect(bindings['new-chat']).toEqual(['Ctrl+N'])
  })

  it('ignores unknown commands and detects conflicts', () => {
    const bindings = resolveKeyboardShortcutBindings(normalizeKeyboardShortcuts({
      bindings: {
        'toggle-plan-mode': ['Ctrl+Shift+P'],
        unknown: ['Ctrl+Shift+X']
      } as Record<string, string[]>
    }))

    expect(findKeyboardShortcutCommand(bindings, 'Ctrl+Shift+P')).toBe('toggle-plan-mode')
    expect(findKeyboardShortcutCommand(bindings, 'Ctrl+Shift+X')).toBeNull()
    expect(findKeyboardShortcutConflict(bindings, 'settings', 'Ctrl+Shift+P')).toBe('toggle-plan-mode')
  })
})
