/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string;
  readonly VITE_CREDITS_PER_CENT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
