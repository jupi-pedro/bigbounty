import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import AuthenticatedLayout from "@/components/layouts/authenticated-layout"
import UnauthenticatedLayout from "@/components/layouts/unauthenticated-layout"
import { auth } from "@/lib/auth/auth"
import { Metadata } from "next"
import { Toaster } from "@/components/ui/sonner"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
        {isLoggedIn ? (
          <AuthenticatedLayout>{children}</AuthenticatedLayout>
        ) : (
          <UnauthenticatedLayout>{children}</UnauthenticatedLayout>
        )}
        <Toaster position="top-center" />
      </body>
    </html>
  )
}
