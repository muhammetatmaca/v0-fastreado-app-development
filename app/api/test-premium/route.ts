import { NextResponse } from "next/server"
import { makeUserPremiumForTest, makeUserFreeForTest } from "@/app/actions/test-premium"

export async function POST(req: Request) {
  try {
    const { userId, action } = await req.json()
    
    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }
    
    let result
    if (action === 'premium') {
      result = await makeUserPremiumForTest(userId)
    } else if (action === 'free') {
      result = await makeUserFreeForTest(userId)
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
    
    return NextResponse.json(result)
    
  } catch (error) {
    console.error("Test premium API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}