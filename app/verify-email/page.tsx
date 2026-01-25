import { Suspense } from "react"
import { VerifyEmailForm } from "@/components/verify-email-form"

function VerifyEmailLoading() {
  return null
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyEmailLoading />}>
      <VerifyEmailForm />
    </Suspense>
  )
}
