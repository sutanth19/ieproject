/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_ANOTHER_KEY?: string;
  // Add other VITE_ variables you use
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
