const STORAGE_KEY = 'cineflix-splash-seen';
const HOLD_MS = 380;

function markSeen() {
    try {
        sessionStorage.setItem(STORAGE_KEY, '1');
    } catch (_) {
        // private mode / quota — ignore
    }
    document.documentElement.classList.add('splash-done');
}

function dismiss(el) {
    markSeen();
    el.remove();
}

function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function waitAnimationEnd(el) {
    return new Promise((resolve) => {
        const onEnd = (event) => {
            if (event.target !== el) return;
            el.removeEventListener('animationend', onEnd);
            resolve();
        };
        el.addEventListener('animationend', onEnd);
    });
}

function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Plays the logo splash once per browser session.
 * Skips immediately if already seen or if the user prefers reduced motion.
 */
export async function playSplash() {
    const el = document.getElementById('splash');
    if (!el) return;

    if (
        document.documentElement.classList.contains('splash-done')
        || prefersReducedMotion()
    ) {
        dismiss(el);
        return;
    }

    const logo = el.querySelector('.splash__logo');
    if (!logo) {
        dismiss(el);
        return;
    }

    // Start enter animation on the next frame so the browser paints the resting state first.
    await new Promise((resolve) => requestAnimationFrame(() => resolve()));
    el.classList.add('is-entering');

    await waitAnimationEnd(logo);
    await wait(HOLD_MS);

    el.classList.remove('is-entering');
    el.classList.add('is-leaving');
    await waitAnimationEnd(el);

    dismiss(el);
}
