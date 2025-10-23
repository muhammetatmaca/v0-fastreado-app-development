import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Get IP address from request
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const ip = forwarded?.split(',')[0] || realIp || request.ip || '127.0.0.1'
    
    // For localhost/development, default to Turkish
    if (ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
      return NextResponse.json({ 
        language: 'tr', 
        country: 'TR', 
        ip: ip,
        source: 'localhost' 
      })
    }

    try {
      // Use free IP geolocation service
      const geoResponse = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode`, {
        headers: {
          'User-Agent': 'Fastreado-App/1.0'
        }
      })
      
      if (!geoResponse.ok) {
        throw new Error('Geo API failed')
      }
      
      const geoData = await geoResponse.json()
      
      if (geoData.status === 'success') {
        const language = geoData.countryCode === 'TR' ? 'tr' : 'en'
        
        return NextResponse.json({
          language,
          country: geoData.countryCode,
          countryName: geoData.country,
          ip: ip,
          source: 'geo-api'
        })
      }
    } catch (geoError) {
      console.warn('Geo API error:', geoError)
    }

    // Fallback to English if geo detection fails
    return NextResponse.json({ 
      language: 'en', 
      country: 'Unknown', 
      ip: ip,
      source: 'fallback' 
    })

  } catch (error) {
    console.error('Language detection error:', error)
    return NextResponse.json({ 
      language: 'en', 
      country: 'Unknown',
      source: 'error' 
    }, { status: 500 })
  }
}