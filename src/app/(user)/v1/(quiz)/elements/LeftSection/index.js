"use client";
import { currentSectionSelector, testSelector } from "@/store/features/test/selectors";
import React from "react";
import { useSelector } from "react-redux";
import RevisitButton from "../RevisitButton";
import { CONSTANTS } from "@/constants";
import { userAuthSelector } from "@/store/features/userAuth/selectors";

const { TEST_SECTIONS } = CONSTANTS

const LeftSection = () => {
  const currentSection = useSelector(currentSectionSelector)
  const testState = useSelector(testSelector); // Access the entire test state
  const currentQuestion = currentSection == TEST_SECTIONS.PROGRAM ? testState?.testInfo?.programs?.[testState?.currentProgramIndex] : testState?.testInfo?.question?.[testState?.currentIndex];


  return (
    <div
      className="flex-1 border rounded-lg border-solid border-primary-400 p-6 text-white bg-[#272C33] "
      style={{
        height: testState?.testInfo?.sectionsCount == 2 ? 'calc(100vh - 230px)' : 'calc(100vh - 200px)',
        overflowY:'scroll'
      }}
    >
      <div className="flex flex-col h-full">
        <div className="mb-4">
          <RevisitButton />
          <pre className="mt-4 pb-20 overflow-y-auto"
            style={{
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
            }}>
            {currentQuestion?.question}
          </pre>
        </div>
      </div>
    </div >
  );
};

export default LeftSection;
