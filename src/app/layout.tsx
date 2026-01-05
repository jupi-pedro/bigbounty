import localFont from "next/font/local"
import "./globals.css"
import AuthenticatedLayout from "@/components/layouts/authenticated-layout"
import UnauthenticatedLayout from "@/components/layouts/unauthenticated-layout"
import { auth } from "@/lib/auth/auth"
import { Metadata } from "next"
import { Toaster } from "@/components/ui/sonner"
import { Providers } from "@/components/providers"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
})
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
})

export const metadata: Metadata = {
  title: "DroneUp",
  description: "Internal tool for DroneUp Brothers.",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isLoggedIn = !!(await auth())

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {isLoggedIn ? (
            <AuthenticatedLayout>{children}</AuthenticatedLayout>
          ) : (
            <UnauthenticatedLayout>{children}</UnauthenticatedLayout>
          )}
          <Toaster position="top-center" />
        </Providers>
      </body>
    </html>
  )
}
