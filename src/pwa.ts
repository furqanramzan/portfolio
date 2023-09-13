import { registerSW } from 'virtual:pwa-register';

registerSW({
  immediate: true,
  onOfflineReady: () => {
    localStorage.setItem('offline-ready', 'yes');
  },
});
