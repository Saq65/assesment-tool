"use client";

import React, { useState } from "react";
import Permissions from "../../elements/Permissions";
import { useSelector } from "react-redux";
import { userAuthSelector } from "@/store/features/userAuth/selectors";
import TestSections from "../../elements/TestSections";
import { CONSTANTS } from "@/constants";

const { PRE_TEST_WINDOW_VIEW } = CONSTANTS
const Page = () => {
  const { user } = useSelector(userAuthSelector);
  const [canProceed, setCanProceed] = useState(false); // Track if the button should be active

  const [currentView, setCurrentView] = useState(PRE_TEST_WINDOW_VIEW.PERMISSIONS)



  return (
    // <div class="container mx-auto h-screen items-center flex flex-col md:flex-row">
    <div class="flex-grow flex items-center justify-center container mx-auto">
      <div class="w-full md:w-1/2 p-4">
        <h2 className="text-[25px] text-blue-400">Hi {user?.candidateName}</h2>
        <h2 className="text-[20px] mt-1 text-blue-400">Welcome to</h2>
        <h1 className="text-[40px] mt-1 font-bold text-blue-400">
          Zeus Tech Assessment
        </h1>
        <div class="flex flex-col md:flex-row mt-1">
          <div class="w-full md:w-1/3 text-white">
            <span className="block">Question count:</span>
            <span className="font-semibold">
              {user?.questionsLength} Questions
            </span>
          </div>
          {user?.sectionsCount > 1 && <div class="w-full md:w-1/3 text-white">
            <span className="block">Section count:</span>
            <span className="font-semibold">
              {user?.sectionsCount} Section
            </span>
          </div>}
          <div class="w-full md:w-1/3 text-white">
            <span className="block">Test duration:</span>
            <span className="font-semibold">
              {user?.totalDuration} Minutes
            </span>
          </div>
        </div>
      </div>
      <div class="w-full md:w-1/2 p-4">
        {currentView == PRE_TEST_WINDOW_VIEW.PERMISSIONS && <Permissions setCurrentView={setCurrentView} canProceed={canProceed} setCanProceed={setCanProceed} />}
        {currentView == PRE_TEST_WINDOW_VIEW.SECTIONS && <TestSections canProceed={canProceed} setCanProceed={setCanProceed} />}

      </div>
    </div>
  );
};

export default Page;
