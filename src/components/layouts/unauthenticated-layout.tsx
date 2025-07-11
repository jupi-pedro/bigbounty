export default function UnauthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-muted">
      <div className="w-full max-w-md min-w-[320px]">{children}</div>
    </main>
  )
}
