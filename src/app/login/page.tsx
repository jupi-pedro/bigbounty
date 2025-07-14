import { Suspense } from "react"
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm rounded-xl bg-background p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-semibold">Login</h1>

        <Suspense
          fallback={
            <p className="text-center text-sm text-muted-foreground">
              Loading form...
            </p>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
