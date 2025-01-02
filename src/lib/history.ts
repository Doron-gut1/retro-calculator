import { RetroState } from '@/types';

export class HistoryManager {
  private past: RetroState[] = [];
  private future: RetroState[] = [];
  private maxSize: number;

  constructor(maxSize = 50) {
    this.maxSize = maxSize;
  }

  push(state: RetroState) {
    this.past = [...this.past, state].slice(-this.maxSize);
    this.future = [];
  }

  undo(): RetroState | null {
    if (this.past.length === 0) return null;

    const current = this.past[this.past.length - 1];
    const previous = this.past[this.past.length - 2];
    
    this.future = [current, ...this.future];
    this.past = this.past.slice(0, -1);

    return previous || null;
  }

  redo(): RetroState | null {
    if (this.future.length === 0) return null;

    const next = this.future[0];
    
    this.past = [...this.past, next];
    this.future = this.future.slice(1);

    return next;
  }

  canUndo(): boolean {
    return this.past.length > 1;
  }

  canRedo(): boolean {
    return this.future.length > 0;
  }

  clear() {
    this.past = [];
    this.future = [];
  }
}