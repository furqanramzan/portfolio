import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
  immediate: true,
  onOfflineReady: () => {
    localStorage.setItem('offline-ready', 'yes');
  },
  onNeedRefresh() {
    updateSW(true); // activate the new service worker
    window.location.reload();
  },
});
