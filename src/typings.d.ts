// src/typings.d.ts

interface Window {
  initializeAllUI?: () => void; // The '?' makes it optional, meaning it might or might not exist.
  initializeDashboardAllUI?: () => void; // The '?' makes it optional, meaning it might or might not exist.
}
