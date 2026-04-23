'use client';

import { useEditGame } from '@/hooks/edit-game';
import { dedupe, normalize } from '@/lib/utils';
import clsx from 'clsx';
import { useEffect, useMemo, useRef, useState } from 'react';

export default function InputGameTags({
  placeholder = 'Add tag',
  id,
}: {
  placeholder?: string;
  id?: string;
}) {
  const { categories, game, tagsList, setTagsList, toggleCategory } =
    useEditGame();

  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const sizerRef = useRef<HTMLSpanElement | null>(null);

  // --- Auto width: mirror text to hidden span and set input width (no state) ---
  const mirrored = useMemo(
    () => (value.length ? value : placeholder),
    [value, placeholder]
  );
  useEffect(() => {
    if (!inputRef.current || !sizerRef.current) return;
    inputRef.current.style.width = `${Math.ceil(
      sizerRef.current.offsetWidth + 10
    )}px`;
  }, [mirrored]);

  // --- Helpers ---
  const addTags = (raw: string | string[]) => {
    const list = (Array.isArray(raw) ? raw : [raw])
      .map(normalize)
      .filter(Boolean);
    if (!list.length) return;
    const next = dedupe([...tagsList, ...list]);
    setTagsList(next);
    setValue('');
  };

  const removeAt = (idx: number) => {
    const next = tagsList.filter((_, i) => i !== idx);
    setTagsList(next);
  };

  const categoryNameSet = useMemo(
    () => new Set(categories.map((c) => normalize(c.name))),
    [categories]
  );

  const isCategoryTag = (tag: string) => categoryNameSet.has(normalize(tag));

  // --- Events ---
  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    // Commit on Enter, Comma, Tab
    if (['Enter', 'Tab'].includes(e.key) || (e.key === ',' && !e.shiftKey)) {
      if (value.trim()) {
        e.preventDefault();
        addTags(value.split(','));
      }
    }
    // Backspace removes last tag if input empty
    if (e.key === 'Backspace' && !value && tagsList.length) {
      e.preventDefault();
      removeAt(tagsList.length - 1);
    }
  };

  const onPaste: React.ClipboardEventHandler<HTMLInputElement> = (e) => {
    const text = e.clipboardData.getData('text');
    if (text.includes(',') || text.includes('\n')) {
      e.preventDefault();
      addTags(text.split(/,|\n/));
    }
  };

  return (
    <>
      <div className="w-full relative bg-white text-sm sm:text-base text-black font-medium shadow-inner-hard-1 rounded-lg border-0 py-3 px-4 flex flex-col items-start m-0 gap-0 has-[div[data-tag]]:gap-2">
        {/* Inputted Tags List */}
        <div
          className="flex flex-wrap gap-2"
          id="tag-list"
          aria-live="polite"
          aria-relevant="additions removals"
        >
          {tagsList.map((tag, i) => {
            const categoryTag = isCategoryTag(tag);
            return (
              <div
                data-tag={categoryTag ? 'category' : 'tag'}
                key={`${tag}-${i}`}
                className={clsx(
                  'whitespace-nowrap flex flex-row items-center pl-2 pr-1 py-1 rounded-md mt-0 only:mt-0',
                  categoryTag ? 'bg-gold' : 'bg-black/20'
                )}
              >
                <span>{tag}</span>
                <button
                  type="button"
                  title={`Remove ${tag}`}
                  onClick={() => removeAt(i)}
                  className="cursor-pointer"
                  aria-label={`Remove ${tag} ${
                    categoryTag ? 'category' : 'tag'
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 40 40"
                    className="w-6"
                  >
                    <path
                      fill="currentColor"
                      d="M16 31a11.76 11.76 0 0 1-6.17-6.16 11.48 11.48 0 0 1 0-8.91A11.76 11.76 0 0 1 16 9.81a11.43 11.43 0 0 1 8.89 0 11.73 11.73 0 0 1 3.68 2.49A12 12 0 0 1 31 16a10.94 10.94 0 0 1 .91 4.45 11.18 11.18 0 0 1-.9 4.46A11.85 11.85 0 0 1 24.85 31 11.45 11.45 0 0 1 16 31Zm1.53-6.11L20.41 22l2.93 2.93a1.11 1.11 0 0 0 .8.33 1.07 1.07 0 0 0 .79-.32 1.09 1.09 0 0 0 .31-.79 1.06 1.06 0 0 0-.33-.77L22 20.43l3-2.95a1.1 1.1 0 0 0 0-1.55 1 1 0 0 0-.78-.32 1 1 0 0 0-.78.32l-3 3L17.46 16a1 1 0 0 0-.79-.32 1.09 1.09 0 0 0-.78.31 1.06 1.06 0 0 0-.32.78 1 1 0 0 0 .33.77l2.94 2.94-2.94 3a1 1 0 0 0-.33.76 1.12 1.12 0 0 0 1.91.78Z"
                    />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>

        {/* Tag Input */}
        <div className="whitespace-nowrap px-2 py-1 rounded-md border-black border-dashed border-1">
          <div className="relative">
            {/* Hidden sizer: mirrors input text to measure width */}
            <span
              ref={sizerRef}
              style={{
                position: 'absolute',
                height: 0,
                width: 'auto',
                visibility: 'hidden',
                overflow: 'scroll',
                whiteSpace: 'pre',
                fontSize: 'inherit',
                fontFamily: 'inherit',
                fontWeight: 'inherit',
                letterSpacing: 'inherit',
                fontStyle: 'normal',
                textTransform: 'none',
              }}
            >
              {mirrored}
            </span>

            <input
              id={id}
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
              onPaste={onPaste}
              placeholder={placeholder}
              className="outline-none"
              aria-label="Add tag"
              aria-controls="tag-list"
              aria-describedby="tag-help"
            />
            <span id="tag-help" className="sr-only">
              Type text and press Enter to add tags. Press Backspace to remove
              the last tag. Use comma or paste to add multiple tags.
            </span>
          </div>
        </div>
      </div>

      {/* Add category as tag */}
      <div className="flex flex-wrap gap-1 px-1 py-2 text-sm leading-none text-white font-medium">
        <label className="opacity-60" htmlFor="game-categories">
          Choose one or two main category tags:
        </label>
        {categories.map((c, i) => {
          const selected = game.categories.includes(c.id);
          const limitReached = !selected && game.categories.length >= 2;
          return (
            <ul key={c.id} className="italic" id="game-categories">
              <button
                type="button"
                onClick={() => toggleCategory(c)}
                disabled={limitReached}
                className="hover:underline disabled:no-underline disabled:opacity-60 italic cursor-pointer"
                aria-pressed={selected}
                aria-label={selected ? `Remove ${c.name}` : `Add ${c.name}`}
                aria-controls="tag-list"
                aria-describedby="category-help"
              >
                {c.name}
              </button>
              {i < categories.length - 1 && ','}
            </ul>
          );
        })}
        <span id="category-help" className="sr-only">
          Click to add or remove a category. Choose up to two categories.
        </span>
      </div>
    </>
  );
}
