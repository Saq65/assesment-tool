"use client"
import Button from '@/components/atoms/Button';
import StarRatings from '@/components/atoms/StarRatings';
import { SOCKET_EVENTS } from '@/lib/socket/events';
import { socketSelector } from '@/store/features/socket/selectors';
import { fireEventWithAck } from '@/utils';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const TestCompletionPage = () => {
    const [rating, setRating] = useState(4);
    const [feedback, setFeedback] = useState('');
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
    const socket = useSelector(socketSelector);


    const handleSubmitFeedback = () => {

        fireEventWithAck(socket, {
            eventName: SOCKET_EVENTS.ADD_FEEDBACK,
            payload: {
                rating,
                feedback
            }
        })
        // Add logic to handle feedback submission (e.g., send data to an API)
        setFeedbackSubmitted(true);  // Update state to indicate feedback was submitted
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center px-4">
            {/* Test Completion Section */}
            {feedbackSubmitted && <div className="bg-[#272C33] rounded-lg shadow-md p-6 text-center max-w-md w-full">
                <img
                    src="../logo.svg" // Replace with your image URL
                    alt="Completion Illustration"
                    className="mx-auto mb-4"
                />
                <h2 className="text-xl font-bold text-white mb-2">
                    Congratulations !<br></br>Your test is now complete.

                </h2>
                <p className="text-white">Your responses have been submitted</p>
            </div>}

            {!feedbackSubmitted && <div className="bg-[#272C33] rounded-lg shadow-md p-6 text-center max-w-md w-full">
                <img
                    src="../logo.svg" // Replace with your image URL
                    alt="Completion Illustration"
                    className="mx-auto mb-4"
                />
                <h2 className="text-xl font-bold text-white mb-2">
                    Great, your Test has been completed
                </h2>
                <p className="text-white">Your responses have been submitted</p>
            </div>}



            {/* Feedback Section */}
            <div className="bg-[#272C33] rounded-lg shadow-md p-6 text-center mt-6 max-w-md w-full">
                {!feedbackSubmitted ? (
                    <>
                        <h3 className="text-lg font-bold text-white mb-4">
                            How was your test taking experience?
                        </h3>
                        {/* Star Ratings */}
                        <StarRatings rating={rating} setRating={setRating} className='cursor-pointer' />
                        {/* Feedback Input */}
                        <textarea
                            className="w-full text-white bg-[#1D2126] border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-white focus:outline-none placeholder:text-sm placeholder:text-[#64748bc3]"
                            placeholder="To understand your insights and punctuality, what would you optimise in the tool and what bugs did you find? Be as detailed in your findings and suggested solutions/optimisation"
                            value={feedback}
                            onChange={(e) => {
                                const newValue = e.target.value;
                                // Capitalize only the first letter of the first word and keep the rest as is
                                const formattedValue =
                                    newValue.charAt(0).toUpperCase() + newValue.slice(1);
                                setFeedback(formattedValue);
                            }}
                            rows="4"
                            maxLength="1000"
                        />

                        <p className="text-sm text-gray-500 mt-2">
                            * Minimum 4 characters are required to post feedback
                        </p>
                        <p className="text-sm text-gray-500 mb-4">{feedback.length} / 1000</p>
                        {/* Submit Button */}
                        <Button
                            disabled={!feedback?.trim()}
                            onClick={handleSubmitFeedback}
                            className={`w-full`}
                            variant='primary'
                            style={{ backgroundColor: "#343A40", color: "#FFFFFF", cursor: 'pointer' }}
                            onMouseEnter={(e) => (e.target.style.backgroundColor = "#343A40")}
                        >
                            Share your Feedback
                        </Button>
                    </>
                ) : (
                    <div>
                        <h3 className="text-lg font-bold text-white mb-4">
                            Thanks for sharing your experience!
                        </h3>
                        <p className="text-white">
                            We will surely consider your feedback and work to improve the experience.
                        </p>
                    </div>
                )}
            </div>

            {/* Footer */}
            {/* <p className="text-blue-400 text-sm mt-6">You may close this window</p> */}
        </div>
    );
};

export default TestCompletionPage;
