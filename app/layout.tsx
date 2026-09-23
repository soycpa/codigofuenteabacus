import './globals.css'
import { Bebas_Neue, Inter } from 'next/font/google'
import { Providers } from '@/components/providers'
import { Toaster } from '@/components/ui/sonner'

const bebas = Bebas_Neue({ subsets: ['latin'], weight: '400', variable: '--font-display' })
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata = {
  title: { default: 'Marketia — Embudos que convierten', template: '%s | Marketia' },
  description: 'Convierte tu lista de prospectos fríos en clientes calificados con embudos personalizados estilo TikTok. Captura leads, agenda citas y cierra ventas en automático.',
  keywords: ['embudo de ventas', 'prospección magnética', 'TikTok funnel', 'captura de leads', 'WhatsApp marketing', 'Onofre López'],
  authors: [{ name: 'Onofre López' }],
  openGraph: {
    title: 'Marketia — Embudos que convierten',
    description: 'Embudos personalizados estilo TikTok para convertir prospectos fríos en clientes.',
    type: 'website',
    locale: 'es_MX',
  },
  twitter: { card: 'summary_large_image', title: 'Marketia', description: 'Embudos que convierten prospectos en clientes.' },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script src="https://apps.abacus.ai/chatllm/appllm-lib.js"></script>
      </head>
      <body className={`${inter.variable} ${bebas.variable} font-sans bg-black text-white`}>
        <Providers>{children}</Providers>
        <Toaster theme="dark" />
      </body>
    </html>
  )
}
