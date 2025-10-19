import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import Checkout from "@/components/checkout"
import { getPlanById } from "@/lib/products"

export default function CheckoutPage({ params }: { params: { planId: string } }) {
  const plan = getPlanById(params.planId)

  if (!plan || plan.id === "free") {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/pricing"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Fiyatlandırmaya Dön
        </Link>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">{plan.name} Planı</h1>
            <p className="text-muted-foreground">{plan.description}</p>
          </div>

          <Checkout planId={params.planId} />
        </div>
      </div>
    </div>
  )
}
