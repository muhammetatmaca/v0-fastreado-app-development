// Mobile app bridge for wrapped web app
// This handles communication between the web app and native mobile wrapper

export interface MobileBridge {
  // Google Play Billing
  initializeBilling(): Promise<boolean>
  getProducts(): Promise<any[]>
  purchaseProduct(productId: string): Promise<any>
  restorePurchases(): Promise<any[]>
  
  // Device info
  getDeviceInfo(): any
  
  // Storage
  setSecureStorage(key: string, value: string): void
  getSecureStorage(key: string): string | null
  
  // Notifications
  requestNotificationPermission(): Promise<boolean>
  scheduleNotification(title: string, body: string, delay: number): void
}

// Check if running in mobile app wrapper
export function isMobileApp(): boolean {
  if (typeof window === 'undefined') return false
  
  // Check for Android WebView interface
  if ((window as any).AndroidInterface) return true
  
  // Check for iOS WKWebView interface
  if ((window as any).webkit?.messageHandlers?.iosInterface) return true
  
  return false
}

// Get mobile bridge interface
export function getMobileBridge(): MobileBridge | null {
  if (!isMobileApp()) return null
  
  return {
    // Google Play Billing
    async initializeBilling(): Promise<boolean> {
      try {
        if ((window as any).AndroidInterface) {
          return (window as any).AndroidInterface.initializeBilling()
        }
        
        if ((window as any).webkit?.messageHandlers?.iosInterface) {
          return new Promise((resolve) => {
            (window as any).webkit.messageHandlers.iosInterface.postMessage({
              action: 'initializeBilling',
              callback: 'billingInitialized'
            })
            
            // Set up callback
            ;(window as any).billingInitialized = (success: boolean) => {
              resolve(success)
            }
          })
        }
        
        return false
      } catch (error) {
        console.error('Initialize billing error:', error)
        return false
      }
    },
    
    async getProducts(): Promise<any[]> {
      try {
        if ((window as any).AndroidInterface) {
          const products = (window as any).AndroidInterface.getProducts()
          return JSON.parse(products)
        }
        
        if ((window as any).webkit?.messageHandlers?.iosInterface) {
          return new Promise((resolve) => {
            (window as any).webkit.messageHandlers.iosInterface.postMessage({
              action: 'getProducts',
              callback: 'productsReceived'
            })
            
            ;(window as any).productsReceived = (products: any[]) => {
              resolve(products)
            }
          })
        }
        
        return []
      } catch (error) {
        console.error('Get products error:', error)
        return []
      }
    },
    
    async purchaseProduct(productId: string): Promise<any> {
      try {
        if ((window as any).AndroidInterface) {
          const result = (window as any).AndroidInterface.purchaseProduct(productId)
          return JSON.parse(result)
        }
        
        if ((window as any).webkit?.messageHandlers?.iosInterface) {
          return new Promise((resolve) => {
            (window as any).webkit.messageHandlers.iosInterface.postMessage({
              action: 'purchaseProduct',
              productId: productId,
              callback: 'purchaseCompleted'
            })
            
            ;(window as any).purchaseCompleted = (result: any) => {
              resolve(result)
            }
          })
        }
        
        return { success: false, error: 'Not supported' }
      } catch (error) {
        console.error('Purchase product error:', error)
        return { success: false, error: error.message }
      }
    },
    
    async restorePurchases(): Promise<any[]> {
      try {
        if ((window as any).AndroidInterface) {
          const purchases = (window as any).AndroidInterface.restorePurchases()
          return JSON.parse(purchases)
        }
        
        if ((window as any).webkit?.messageHandlers?.iosInterface) {
          return new Promise((resolve) => {
            (window as any).webkit.messageHandlers.iosInterface.postMessage({
              action: 'restorePurchases',
              callback: 'purchasesRestored'
            })
            
            ;(window as any).purchasesRestored = (purchases: any[]) => {
              resolve(purchases)
            }
          })
        }
        
        return []
      } catch (error) {
        console.error('Restore purchases error:', error)
        return []
      }
    },
    
    getDeviceInfo(): any {
      try {
        if ((window as any).AndroidInterface) {
          return JSON.parse((window as any).AndroidInterface.getDeviceInfo())
        }
        
        if ((window as any).webkit?.messageHandlers?.iosInterface) {
          // iOS device info would be handled differently
          return {
            platform: 'ios',
            userAgent: navigator.userAgent
          }
        }
        
        return {
          platform: 'web',
          userAgent: navigator.userAgent
        }
      } catch (error) {
        console.error('Get device info error:', error)
        return { platform: 'unknown' }
      }
    },
    
    setSecureStorage(key: string, value: string): void {
      try {
        if ((window as any).AndroidInterface) {
          (window as any).AndroidInterface.setSecureStorage(key, value)
          return
        }
        
        if ((window as any).webkit?.messageHandlers?.iosInterface) {
          (window as any).webkit.messageHandlers.iosInterface.postMessage({
            action: 'setSecureStorage',
            key: key,
            value: value
          })
          return
        }
        
        // Fallback to localStorage
        localStorage.setItem(`secure_${key}`, value)
      } catch (error) {
        console.error('Set secure storage error:', error)
      }
    },
    
    getSecureStorage(key: string): string | null {
      try {
        if ((window as any).AndroidInterface) {
          return (window as any).AndroidInterface.getSecureStorage(key)
        }
        
        if ((window as any).webkit?.messageHandlers?.iosInterface) {
          // iOS would need a different approach for synchronous calls
          return localStorage.getItem(`secure_${key}`)
        }
        
        // Fallback to localStorage
        return localStorage.getItem(`secure_${key}`)
      } catch (error) {
        console.error('Get secure storage error:', error)
        return null
      }
    },
    
    async requestNotificationPermission(): Promise<boolean> {
      try {
        if ((window as any).AndroidInterface) {
          return (window as any).AndroidInterface.requestNotificationPermission()
        }
        
        if ((window as any).webkit?.messageHandlers?.iosInterface) {
          return new Promise((resolve) => {
            (window as any).webkit.messageHandlers.iosInterface.postMessage({
              action: 'requestNotificationPermission',
              callback: 'notificationPermissionResult'
            })
            
            ;(window as any).notificationPermissionResult = (granted: boolean) => {
              resolve(granted)
            }
          })
        }
        
        // Web fallback
        if ('Notification' in window) {
          const permission = await Notification.requestPermission()
          return permission === 'granted'
        }
        
        return false
      } catch (error) {
        console.error('Request notification permission error:', error)
        return false
      }
    },
    
    scheduleNotification(title: string, body: string, delay: number): void {
      try {
        if ((window as any).AndroidInterface) {
          (window as any).AndroidInterface.scheduleNotification(title, body, delay)
          return
        }
        
        if ((window as any).webkit?.messageHandlers?.iosInterface) {
          (window as any).webkit.messageHandlers.iosInterface.postMessage({
            action: 'scheduleNotification',
            title: title,
            body: body,
            delay: delay
          })
          return
        }
        
        // Web fallback - simple timeout notification
        setTimeout(() => {
          if (Notification.permission === 'granted') {
            new Notification(title, { body })
          }
        }, delay)
      } catch (error) {
        console.error('Schedule notification error:', error)
      }
    }
  }
}

// Helper function to show mobile app features
export function showMobileFeatures(): boolean {
  return isMobileApp()
}

// Helper function to get platform-specific payment methods
export function getAvailablePaymentMethods(): string[] {
  const bridge = getMobileBridge()
  
  if (bridge) {
    const deviceInfo = bridge.getDeviceInfo()
    
    if (deviceInfo.platform === 'android') {
      return ['googleplay', 'lemon', 'paddle']
    } else if (deviceInfo.platform === 'ios') {
      return ['appstore', 'lemon', 'paddle']
    }
  }
  
  // Web fallback
  return ['lemon', 'paddle', 'freemius']
}