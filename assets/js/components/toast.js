let toastHost = null;
let seed = 0;

const ICONS = {
    success: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true"><path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>`,
    error: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true"><path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm0-160q17 0 28.5-11.5T520-480v-240q0-17-11.5-28.5T480-760q-17 0-28.5 11.5T440-720v240q0 17 11.5 28.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Z"/></svg>`,
    info: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true"><path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>`,
    favoriteAdd: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z"/></svg>`,
    favoriteRemove: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/></svg>`,
    edit: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true"><path d="M120-120v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm584-528 56-56-56-56-56 56 56 56Z"/></svg>`,
    delete: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm80-160h80v-360h-80v360Zm160 0h80v-360h-80v360Z"/></svg>`,
    add: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>`,
};

const VARIANT_ICON_KEYS = {
    success: 'success',
    error: 'error',
    info: 'info',
    'favorite-add': 'favoriteAdd',
    'favorite-remove': 'favoriteRemove',
    edit: 'edit',
    delete: 'delete',
    add: 'add',
};

export function ensureToastHost() {
    if (toastHost && document.body.contains(toastHost)) {
        return toastHost;
    }

    const existing = document.getElementById('toast-host');
    if (existing) {
        toastHost = existing;
        return toastHost;
    }

    toastHost = document.createElement('div');
    toastHost.id = 'toast-host';
    toastHost.className = 'toast-host';
    toastHost.setAttribute('aria-live', 'polite');
    toastHost.setAttribute('aria-atomic', 'false');

    document.body.appendChild(toastHost);
    return toastHost;
}

export function showToast({ message, variant = 'info', duration = 3800 }) {
    if (!message || typeof message !== 'string') {
        throw new Error('showToast: "message" is required');
    }

    const host = ensureToastHost();
    const id = `toast-${Date.now()}-${seed++}`;

    const toast = document.createElement('div');
    toast.className = `toast toast--${variant}`;
    toast.dataset.toastId = id;
    toast.setAttribute('role', variant === 'error' ? 'alert' : 'status');

    const icon = document.createElement('span');
    icon.className = 'toast__icon';
    icon.innerHTML = ICONS[VARIANT_ICON_KEYS[variant] || variant] || ICONS.info;

    const body = document.createElement('div');
    body.className = 'toast__body';
    body.textContent = message;

    toast.appendChild(icon);
    toast.appendChild(body);
    host.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('is-visible'));

    let removed = false;
    let timer = null;

    const close = () => {
        if (removed) return;
        removed = true;
        toast.classList.remove('is-visible');

        const onEnd = (e) => {
            if (e.propertyName !== 'transform') return;
            toast.removeEventListener('transitionend', onEnd);
            toast.remove();
        };
        toast.addEventListener('transitionend', onEnd);

        window.setTimeout(() => {
            if (toast.isConnected) toast.remove();
        }, 350);
    };

    if (duration > 0) {
        timer = window.setTimeout(close, duration);

        toast.addEventListener('mouseenter', () => {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
        });

        toast.addEventListener('mouseleave', () => {
            if (!timer) {
                timer = window.setTimeout(close, 1200);
            }
        });
    }

    return { id, close };
}

export function toastSuccess(message, duration = 3200) {
    return showToast({ message, variant: 'success', duration });
}

export function toastError(message, duration = 5000) {
    return showToast({ message, variant: 'error', duration });
}

export function toastInfo(message, duration = 3800) {
    return showToast({ message, variant: 'info', duration });
}

export function toastFavoriteAdded(message = 'Ajouté aux favoris', duration = 3200) {
    return showToast({ message, variant: 'favorite-add', duration });
}

export function toastFavoriteRemoved(message = 'Retiré des favoris', duration = 3200) {
    return showToast({ message, variant: 'favorite-remove', duration });
}

export function toastUpdated(message = 'Film modifié', duration = 3200) {
    return showToast({ message, variant: 'edit', duration });
}

export function toastDeleted(message = 'Film supprimé', duration = 3200) {
    return showToast({ message, variant: 'delete', duration });
}

export function toastAdded(message = 'Film ajouté avec succès', duration = 3200) {
    return showToast({ message, variant: 'add', duration });
}
