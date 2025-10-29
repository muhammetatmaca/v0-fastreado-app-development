"use client"

import { useState, useEffect } from 'react'

interface PremiumStatus {
  isPremium: boolean
  isExpired: boolean
  endDate?: Date
  daysLeft?: number
  loading: boolean
}

export function usePremium() {
  const [premiumStatus, setPremiumStatus] = useState<PremiumStatus>({
    isPremium: false,
    isExpired: false,
    loading: true
  })

  const checkPremiumStatus = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      if (!user.id) {
        setPremiumStatus({ isPremium: false, isExpired: false, loading: false })
        return
      }

      const response = await fetch('/api/check-premium', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      })

      if (response.ok) {
        const data = await response.json()
        setPremiumStatus({
          ...data,
          loading: false,
          endDate: data.endDate ? new Date(data.endDate) : undefined
        })
      } else {
        setPremiumStatus({ isPremium: false, isExpired: false, loading: false })
      }
    } catch (error) {
      console.error('Premium status check error:', error)
      setPremiumStatus({ isPremium: false, isExpired: false, loading: false })
    }
  }

  useEffect(() => {
    checkPremiumStatus()
  }, [])

  return {
    ...premiumStatus,
    refreshPremiumStatus: checkPremiumStatus
  }
}