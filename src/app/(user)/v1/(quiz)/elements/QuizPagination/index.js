"use client";
import { socketSelector } from "@/store/features/socket/selectors";
import { goToQuestion } from "@/store/features/test";
import { currentSectionSelector, testSelector } from "@/store/features/test/selectors";
import {
  getAttemptedQuestionsCount,
  getReviwQuestionsCount,
  getSkippedQuestionsCount,
  getUnattemptedQuestionsCount,
  getUnvisitedQuestionsCount,
} from "@/utils";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import QuestionTypeSwitch from "../QuestionTypeSwitch";
import PaginationMCQ from "./PaginationMCQ";
import { CONSTANTS } from "@/constants";
import PaginationCode from "./PaginationCode";

const { TEST_SECTIONS } = CONSTANTS

const QuizPagination = () => {
  const dispatch = useDispatch();
  const { currentIndex, testInfo } = useSelector(testSelector);

  const currentSection = useSelector(currentSectionSelector)

  const [activeQuestionId] = useState(1);
  const socket = useSelector(socketSelector);



  return (
    <div className="p-4 bg-[#272C33] rounded-lg shadow-md">
      {/* Questions  */}
      <div className="flex items-center mb-4">
        <QuestionTypeSwitch />
        <div className="flex flex-row items-start justify-center flex-shrink-0 space-x-2 ml-auto">
          <div className="flex items-center space-x-2">
            <span className="w-4 h-4 bg-blue-600 rounded-full"></span>
            <span className="text-sm text-white">
              Attempted ({getAttemptedQuestionsCount(testInfo)})
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-4 h-4 bg-yellow-700 rounded-full"></span>
            <span className="text-sm text-white">
              Revisit Later ({getReviwQuestionsCount(testInfo)})
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-4 h-4 bg-red-600 rounded-full"></span>
            <span className="text-sm text-white">
              Skipped ({getSkippedQuestionsCount(testInfo)})
            </span>
          </div>
          {/* <div className="flex items-center space-x-2">
            <span className="w-4 h-4 bg-red-600 rounded-full invisible"></span>
            <span className="text-sm text-white">
              Not Visited ({getUnvisitedQuestionsCount(testInfo?.question)})
            </span>
          </div> */}
        </div>
      </div>

      <>
        <div className="flex justify-between gap-x-2">
          {currentSection == TEST_SECTIONS.MCQ && <PaginationMCQ />}
          {currentSection == TEST_SECTIONS.PROGRAM && <PaginationCode />}
        </div>
      </>
    </div>
  );
};

export default QuizPagination;
