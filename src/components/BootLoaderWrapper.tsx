'use client'

import { useState, useEffect, useCallback } from 'react'
import { BootLoader } from './BootLoader'

export function BootLoaderWrapper({ children }: { children: React.ReactNode }) {
  const [isBooting, setIsBooting] = useState(true)

  useEffect(() => {
    // Check if previously booted
    // const hasBooted = sessionStorage.getItem('app-booted')
    
    // if (hasBooted) {
    //   setIsBooting(false)
    // }
  }, [])

  const handleBootComplete = useCallback(() => {
    setIsBooting(false)
    sessionStorage.setItem('app-booted', 'true')
  }, [])

  if (isBooting) {
    return <BootLoader onComplete={handleBootComplete} />
  }

  return <>{children}</>
}
