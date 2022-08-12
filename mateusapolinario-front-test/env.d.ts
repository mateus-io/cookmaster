interface ImportMetaEnv {
  readonly VITE_API: string,
  readonly VITE_DOMAIN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}