import './globals.css'

export const metadata = {
  title: 'Disease Outbreak Prediction',
  description: 'AI-powered disease outbreak risk assessment',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
