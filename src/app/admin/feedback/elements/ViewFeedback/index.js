import StarRatings from "@/components/atoms/StarRatings";
import { feedbackSelector } from "@/store/features/questions/selectors";
import React from "react";
import { useSelector } from "react-redux";

const ViewFeedback = () => {

    const feedback = useSelector(feedbackSelector);

    return (
        <div className="w-full mx-auto p-8 bg-newCodes-foreground rounded-lg shadow-lg h-full mt-10 space-y-8">
            {/* Header with Candidate Info */}
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-semibold text-gray-200">Feedback from {feedback?.name}</h2>
                <div className="flex items-center space-x-2">
                    {/* <span className="text-gray-200">Rating:</span> */}
                    <StarRatings rating={feedback?.rating} readonly />
                    {/* <span className="text-blue-400 font-bold">{feedback?.rating}</span> */}
                </div>
            </div>

            {/* Feedback Section */}
            <div className="space-y-4">
                <h3 className="text-xl font-medium text-gray-200">Candidate's Feedback</h3>
                <p className="text-gray-200">{feedback?.feedback}</p>
            </div>

            {/* Candidate Details Section */}
            <div className="space-y-4">
                <h3 className="text-xl font-medium text-gray-200">Candidate Information</h3>
                <div className="text-gray-200">
                    <p><strong>Name:</strong> {feedback?.name}</p>
                    <p><strong className="mr-1">Email:</strong> {feedback?.email}</p>
                </div>
            </div>
        </div>
    );
};

export default ViewFeedback;
