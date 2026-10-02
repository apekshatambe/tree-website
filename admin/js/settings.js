/* ==========================================================================
   ARVELI ADMIN — SETTINGS PAGE
   Store profile + notification preferences. Persisted in localStorage for
   now so the page actually works end-to-end in the browser; swapping to a
   real backend later just means replacing the two functions marked with
   // TODO: with fetch() calls, same pattern as every other admin page.
   Guarded so it does nothing on any page that lacks #settingsForm.
   ========================================================================== */

const SETTINGS_STORAGE_KEY = 'arveliSettings';

const DEFAULT_SETTINGS = {
    storeName: 'ARVELI',
    ownerName: 'Sarang Owner',
    email: 'owner@arveli.com',
    phone: '9876543210',
    address: 'Shop No. 4, Green Valley Road, Pune, Maharashtra',
    currency: 'INR',
    notifyEmailOrders: true,
    notifySmsOrders: false,
    notifyLowStock: true,
    notifyNewCustomer: false,
};

function loadSettings() {
    // TODO: replace with fetch('/api/settings') once the backend exists.
    try {
        const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
        return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : { ...DEFAULT_SETTINGS };
    } catch (error) {
        return { ...DEFAULT_SETTINGS };
    }
}

function saveSettings(settings) {
    // TODO: replace with fetch('/api/settings', { method: 'PUT', ... }).
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}

function applySettingsToForm(settings) {
    document.getElementById('storeName').value = settings.storeName;
    document.getElementById('ownerName').value = settings.ownerName;
    document.getElementById('storeEmail').value = settings.email;
    document.getElementById('storePhone').value = settings.phone;
    document.getElementById('storeAddress').value = settings.address;
    document.getElementById('storeCurrency').value = settings.currency;

    document.getElementById('notifyEmailOrders').checked = settings.notifyEmailOrders;
    document.getElementById('notifySmsOrders').checked = settings.notifySmsOrders;
    document.getElementById('notifyLowStock').checked = settings.notifyLowStock;
    document.getElementById('notifyNewCustomer').checked = settings.notifyNewCustomer;
}

function readSettingsFromForm() {
    return {
        storeName: document.getElementById('storeName').value.trim(),
        ownerName: document.getElementById('ownerName').value.trim(),
        email: document.getElementById('storeEmail').value.trim(),
        phone: document.getElementById('storePhone').value.trim(),
        address: document.getElementById('storeAddress').value.trim(),
        currency: document.getElementById('storeCurrency').value,
        notifyEmailOrders: document.getElementById('notifyEmailOrders').checked,
        notifySmsOrders: document.getElementById('notifySmsOrders').checked,
        notifyLowStock: document.getElementById('notifyLowStock').checked,
        notifyNewCustomer: document.getElementById('notifyNewCustomer').checked,
    };
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('settingsForm');
    if (!form) return; // Not on the Settings page.

    const savedNote = document.getElementById('settingsSavedNote');
    let savedNoteTimer = null;

    applySettingsToForm(loadSettings());

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const settings = readSettingsFromForm();
        saveSettings(settings);

        if (savedNote) {
            savedNote.classList.add('visible');
            clearTimeout(savedNoteTimer);
            savedNoteTimer = setTimeout(() => savedNote.classList.remove('visible'), 2500);
        }
    });

    document.getElementById('resetSettingsBtn').addEventListener('click', () => {
        applySettingsToForm(DEFAULT_SETTINGS);
    });
});
