import Image from 'next/image'
import React from 'react'

const Header = () => {
    return (
        <header className="bg-newCodes-foreground text-white">
            <div className="container mx-auto flex items-center justify-between py-[12px] px-1">
                <div className="flex items-center">
                    {/* Replace the placeholders with actual logo URLs */}
                    <Image
                        src="../../logo.svg"
                        alt="Zeus Logo"
                        width={30}
                        height={30}
                    />
                </div>
                <h1 className="text-lg font-semibold">Prove Your Talent with ZEUS Tech Assessment</h1>
            </div>
        </header>
    )
}

export default Header