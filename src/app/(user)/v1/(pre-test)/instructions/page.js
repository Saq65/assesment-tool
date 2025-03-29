"use client"
import Button from '@/components/atoms/Button'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import Checkbox from '@mui/material/Checkbox';

const Page = () => {
    const [isAgreed, setIsAgreed] = useState(false)

    const router = useRouter()

    // Handle agreement checkbox change
    const handleAgreeChange = (e) => {
        setIsAgreed(e.target.checked)
    }

    // Handle the "Next" button click
    const handleNextClick = () => {
        router.push("/v1/pre-test-window#permissions-section")
    }

    return (
        <main className="flex-grow flex my-4 items-center justify-center ">
            <div className="bg-primary-200 shadow-md rounded-md w-full max-w-3xl">

                <div className="bg-newCodes-foreground p-6 rounded-md">
                    <h3 className="text-xl font-semibold mb-4 text-white">Test Guidelines</h3>
                    <ul className="pl-6 list-disc space-y-3 mb-2 text-white list-outside">
                        <li className='whitespace-nowrap'>Ensure a stable internet connection throughout the test to avoid any disruptions.</li>
                        <li>Use the latest version of Google Chrome for the best experience.</li>
                        <li>Grant access to your microphone and webcam for identity verification.</li>
                        <li>Screen monitoring will be active during the test for security purposes.</li>
                        <li>Close all other applications to avoid interruptions or distractions.</li>
                        <li>Unstable internet or interruptions may result in test failure.</li>
                        <li className='whitespace-nowrap'>Avoid using the back button or refreshing the test window to prevent disqualification.</li>
                        <li>AI face detection is active throughout the test. Please keep your eyes on the screen to ensure compliance.</li>
                    </ul>

                    <div className="flex items-center mb-2">
                        <Checkbox
                            id="agree"
                            className="mr-2"
                            onChange={handleAgreeChange}
                            onFocus={false}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                color: "white",
                                border: "1px solid #475569",
                                padding: "4px 12px",
                                borderRadius: "8px",
                                cursor: "pointer",
                                marginBottom: 2,
                                marginLeft: 0,
                                '&:hover': {
                                  color: 'gray',
                                  backgroundColor: 'transparent'
                                },
                                '&.Mui-checked': {
                                  color: 'gray',
                                },
                                '&.Mui-checked:hover': {
                                  color: 'gray',
                                },
                                '&.MuiButtonBase-root:hover': {
                                  backgroundColor: 'gray',
                                },
                                '& .MuiSvgIcon-root': {
                                  fontSize: 24,
                                  color: 'gray',
                                  '&:hover': {
                                    color: 'yellow',
                                  }
                                },
                              }}
                        />
                        <label htmlFor="agree" className="text-white cursor-pointer">
                            I agree to the terms and conditions.
                        </label>
                    </div>

                    <div className="flex justify-end items-center">
                        <Button
                            disabled={!isAgreed}
                            onClick={handleNextClick}
                            style={{ backgroundColor: "#343A40", color: "#FFFFFF", cursor: 'pointer' }}
                            onMouseEnter={(e) => (e.target.style.backgroundColor = "#343A40")}
                        >
                            Next
                        </Button>
                    </div>
                </div>

            </div>
        </main>
    )
}

export default Page
