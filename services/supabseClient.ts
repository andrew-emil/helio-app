
import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient, processLock } from '@supabase/supabase-js'

export const supabase = createClient(
    "https://hgokcgcltapuntjyqrqr.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhnb2tjZ2NsdGFwdW50anlxcnFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNTEzMTQsImV4cCI6MjA3NDcyNzMxNH0.BV4eFQnW9DMXUpNuiCxMUcly_e5s6OElB_w51T_quU0",
    {
        auth: {
            storage: AsyncStorage,
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false,
            lock: processLock,
        },
    })
