/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL_DEV: string;
  readonly VITE_API_BASE_URL_PROD: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_USE_API: string;
  readonly PROD: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
