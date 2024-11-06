import '@/styles/globals.css'
import 'plyr/dist/plyr.css'
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <Component {...pageProps} />
            <Toaster position="bottom-right" />
        </>
    )
} 