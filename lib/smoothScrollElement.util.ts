/** Eased horizontal scroll for carousels (smoother than native scrollBy in many browsers). */
export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

export function animateScrollLeft(
  element: HTMLElement,
  targetLeft: number,
  durationMs: number,
  onComplete?: () => void,
): () => void {
  const startLeft = element.scrollLeft;
  const distance = targetLeft - startLeft;
  const maxLeft = element.scrollWidth - element.clientWidth;
  const clampedTarget = Math.max(0, Math.min(maxLeft, targetLeft));

  if (Math.abs(clampedTarget - startLeft) < 0.5) {
    onComplete?.();
    return () => undefined;
  }

  const startTime = performance.now();
  let rafId = 0;

  const tick = (now: number) => {
    const progress = Math.min(1, (now - startTime) / durationMs);
    element.scrollLeft = startLeft + (clampedTarget - startLeft) * easeInOutCubic(progress);
    if (progress < 1) {
      rafId = requestAnimationFrame(tick);
    } else {
      element.scrollLeft = clampedTarget;
      onComplete?.();
    }
  };

  rafId = requestAnimationFrame(tick);

  return () => {
    if (rafId) cancelAnimationFrame(rafId);
  };
}
