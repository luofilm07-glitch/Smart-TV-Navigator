import { useEffect, useCallback, useRef } from "react";

export interface FocusableItem {
  id: string;
  row: number;
  col: number;
  element?: HTMLElement | null;
}

interface UseTVNavigationOptions {
  items: FocusableItem[][];
  onSelect?: (item: FocusableItem) => void;
  enabled?: boolean;
}

export function useTVNavigation({ items, onSelect, enabled = true }: UseTVNavigationOptions) {
  const focusedRow = useRef(0);
  const focusedCol = useRef(0);

  const getFlatItems = useCallback(() => items.flat(), [items]);

  const getItem = useCallback(
    (row: number, col: number): FocusableItem | undefined => {
      if (row < 0 || row >= items.length) return undefined;
      const rowItems = items[row];
      if (!rowItems || col < 0 || col >= rowItems.length) return undefined;
      return rowItems[col];
    },
    [items]
  );

  const focusItem = useCallback(
    (row: number, col: number) => {
      const item = getItem(row, col);
      if (!item) return;

      const el = document.querySelector(`[data-tv-id="${item.id}"]`) as HTMLElement;
      if (el) {
        el.focus();
        el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
      }
      focusedRow.current = row;
      focusedCol.current = col;
    },
    [getItem]
  );

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const row = focusedRow.current;
      const col = focusedCol.current;
      const currentItem = getItem(row, col);

      switch (e.key) {
        case "ArrowUp": {
          e.preventDefault();
          if (row > 0) {
            const newRow = row - 1;
            const newRowItems = items[newRow];
            const newCol = Math.min(col, newRowItems ? newRowItems.length - 1 : 0);
            focusItem(newRow, newCol);
          }
          break;
        }
        case "ArrowDown": {
          e.preventDefault();
          if (row < items.length - 1) {
            const newRow = row + 1;
            const newRowItems = items[newRow];
            const newCol = Math.min(col, newRowItems ? newRowItems.length - 1 : 0);
            focusItem(newRow, newCol);
          }
          break;
        }
        case "ArrowLeft": {
          e.preventDefault();
          if (col > 0) {
            focusItem(row, col - 1);
          }
          break;
        }
        case "ArrowRight": {
          e.preventDefault();
          const rowItems = items[row];
          if (rowItems && col < rowItems.length - 1) {
            focusItem(row, col + 1);
          }
          break;
        }
        case "Enter":
        case " ": {
          e.preventDefault();
          if (currentItem && onSelect) {
            onSelect(currentItem);
          }
          break;
        }
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, items, getItem, focusItem, onSelect]);

  return { focusItem, focusedRow, focusedCol };
}
