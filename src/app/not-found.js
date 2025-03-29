"use client"
import Button from '@/components/atoms/Button'
import React from 'react'

const NotFound = () => {
    const handleGoBack = () => {
        window.history.back()  // Goes back to the previous page in history
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-primary-300 px-4 py-12">
            <div className="text-center max-w-md w-full space-y-6">
                <h1 className="text-6xl font-extrabold text-blue-400">
                    404
                </h1>
                <p className="text-lg text-gray-200">
                    Page Not Found
                </p>
                <p className="text-md text-white">
                    The page you are looking for might have been moved or deleted.
                </p>
                <Button
                    onClick={handleGoBack}
                    className="px-8 py-4 text-white rounded-lg shadow-md hover:bg-gray-700 transition-all"
                    style={{ backgroundColor: "#272C33", color: "#FFFFFF" }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = "#343A40")} 
                    onMouseLeave={(e) => (e.target.style.backgroundColor = "#272C33")} 
                >
                    Go back
                </Button>
            </div>
        </div>
    )
}

export default NotFound
