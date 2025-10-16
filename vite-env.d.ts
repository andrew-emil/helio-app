/// <reference types="vite/client" />

interface ViteTypeOptions {
    // By adding this line, you can make the type of ImportMetaEnv strict
    // to disallow unknown keys.
    // strictImportMetaEnv: unknown
}

interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL: string
    readonly VITE_SUPABASE_KEY: string
    readonly VITE_API_KEY: string
    readonly VITE_APP_ID: string
    readonly VITE_MESSAGING_SENDER_ID: string
    readonly VITE_AUTH_DOMAIN: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}