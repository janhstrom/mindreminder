"use client"

import { useState, useEffect } from "react"

export default function SimpleTest() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    console.log("✅ SimpleTest component mounted!")
    const timer = setInterval(() => {
      setCount((prev) => prev + 1)
      console.log("⏰ Timer tick:", count + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [count])

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Dashboard Test</h1>
        <p className="text-lg">Counter: {count}</p>
        <p className="text-sm text-gray-600 mt-2">If you see this counting, React is working!</p>
      </div>
    </div>
  )
}
