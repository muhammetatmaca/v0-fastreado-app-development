import { NextResponse } from "next/server"
import { checkUserPremiumStatus } from "@/lib/subscription"

export async function POST(req: Request) {
  try {
    const { userId } = await req.json()
    
    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }
    
    const premiumStatus = await checkUserPremiumStatus(userId)
    
    return NextResponse.json(premiumStatus)
    
  } catch (error) {
    console.error("Check premium API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}