'use client';

import Image from 'next/image';
import { Download, Maximize2, Minimize2, X } from 'lucide-react';
import { useEffect, useId, useRef, useState, type MouseEvent } from 'react';
import { flushSync } from 'react-dom';
import { cn } from '@/lib/cn';

export interface CvPage {
  src: string;
  width: number;
  height: number;
}

type Mode = 'preview' | 'full';

const iconButton =
  'inline-flex size-11 shrink-0 items-center justify-center rounded-md text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-foreground';

/**
 * "View CV" opens the rendered pages in a dialog; clicking a page grows the dialog to fill the screen.
 * The trigger is a plain link to the PDF, so it still works before hydration or with modifier clicks.
 */
export function CvPreview({ pdf, pages, className }: { pdf: string; pages: CvPage[]; className?: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  // Scroll position as a fraction of the content height, held while the dialog resizes.
  const anchor = useRef<number | null>(null);
  const [mode, setMode] = useState<Mode>('preview');
  const titleId = useId();

  // Pages scale with the dialog width, so keeping the same fraction keeps the same line in view.
  useEffect(() => {
    const scroller = scrollRef.current;
    const content = scroller?.firstElementChild;
    if (!scroller || !content) return;
    const observer = new ResizeObserver(() => {
      if (anchor.current !== null) scroller.scrollTop = anchor.current * scroller.scrollHeight;
    });
    observer.observe(content);
    return () => observer.disconnect();
  }, []);

  const switchMode = (next: Mode, pageIndex?: number) => {
    const scroller = scrollRef.current;
    const dialog = dialogRef.current;
    if (!scroller || !dialog) return;
    // A clicked page lands with a little gap above it, so its top edge stays visible.
    const top =
      pageIndex === undefined ? scroller.scrollTop : Math.max(0, (pageRefs.current[pageIndex]?.offsetTop ?? 0) - 12);
    anchor.current = top / scroller.scrollHeight;
    setMode(next);
    const release = () => {
      anchor.current = null;
      dialog.removeEventListener('transitionend', onEnd);
    };
    const onEnd = (event: TransitionEvent) => {
      if (event.target === dialog && event.propertyName === 'width') release();
    };
    dialog.addEventListener('transitionend', onEnd);
    // No transition runs under reduced motion; let the anchor apply once, then let go.
    window.setTimeout(release, 450);
  };

  const open = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    flushSync(() => setMode('preview'));
    dialogRef.current?.showModal();
    scrollRef.current?.scrollTo({ top: 0 });
  };

  const full = mode === 'full';

  return (
    <>
      <a
        href={pdf}
        onClick={open}
        aria-haspopup="dialog"
        className={cn(
          'inline-flex min-h-11 items-center rounded-md border px-4 text-sm font-medium transition-colors hover:bg-fd-accent',
          className,
        )}
      >
        View CV
      </a>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        data-mode={mode}
        className="cv-dialog bg-fd-background text-fd-foreground"
        onCancel={(event) => {
          // Escape steps out of full screen first, then closes.
          if (full) {
            event.preventDefault();
            switchMode('preview');
          }
        }}
        onClick={(event) => {
          if (event.target === dialogRef.current && !full) dialogRef.current.close();
        }}
      >
        <div className="flex h-full flex-col">
          <header className="flex items-center gap-1 border-b py-1 pr-1 pl-4">
            <h2 id={titleId} className="mr-auto text-sm font-semibold">
              CV <span className="font-normal text-fd-muted-foreground">· {pages.length} pages</span>
            </h2>
            <a
              href={pdf}
              download
              className="inline-flex min-h-11 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors hover:bg-fd-accent"
            >
              <Download aria-hidden className="size-4" />
              Download PDF
            </a>
            <button
              type="button"
              className={iconButton}
              aria-label={full ? 'Exit full screen' : 'Full screen'}
              title={full ? 'Exit full screen' : 'Full screen'}
              onClick={() => switchMode(full ? 'preview' : 'full')}
            >
              {full ? <Minimize2 aria-hidden className="size-4" /> : <Maximize2 aria-hidden className="size-4" />}
            </button>
            <button
              type="button"
              className={iconButton}
              aria-label="Close"
              title="Close"
              onClick={() => dialogRef.current?.close()}
            >
              <X aria-hidden className="size-4" />
            </button>
          </header>

          <div ref={scrollRef} className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain bg-fd-muted">
            <div className={cn('mx-auto flex w-full flex-col gap-4 p-3 sm:p-4', full && 'max-w-275')}>
              {pages.map((page, index) => {
                const image = (
                  <Image
                    src={page.src}
                    width={page.width}
                    height={page.height}
                    sizes="(min-width: 1140px) 1100px, 100vw"
                    alt={`Page ${index + 1} of ${pages.length} of the CV`}
                    className="h-auto w-full"
                  />
                );
                // One element in both modes, so the image is not remounted (and does not flash) on resize.
                return (
                  <div
                    key={page.src}
                    ref={(el) => {
                      pageRefs.current[index] = el;
                    }}
                    role={full ? undefined : 'button'}
                    tabIndex={full ? undefined : 0}
                    aria-label={full ? undefined : `Open page ${index + 1} in full screen`}
                    onClick={full ? undefined : () => switchMode('full', index)}
                    onKeyDown={
                      full
                        ? undefined
                        : (event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault();
                              switchMode('full', index);
                            }
                          }
                    }
                    className={cn(
                      'overflow-hidden rounded-sm shadow-sm',
                      !full && 'cursor-zoom-in transition-shadow hover:shadow-md',
                    )}
                  >
                    {image}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
