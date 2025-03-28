"use client";
import React, { useEffect } from "react";
import QuizHeader from "../elements/QuizHeader";
import QuizPagination from "../elements/QuizPagination";
import LeftSection from "../elements/LeftSection";
import RightSection from "../elements/RightSection";
import ArrowButton from "../elements/ArrowButton";
import { SOCKET_EVENTS } from "@/lib/socket/events";
import { updateWarnings } from "@/store/features/test";
import { useDispatch, useSelector } from "react-redux";
import { userAuthSelector } from "@/store/features/userAuth/selectors";
import { socketSelector } from "@/store/features/socket/selectors";
import { useRouter } from "next/navigation";
import {
  fireEventWithAck,
  isDebugMode,
} from "@/utils";
import { testSelector } from "@/store/features/test/selectors";
import { permissionsSelector } from "@/store/features/permissions/selectors";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import useDisableKeys from "@/hooks/useDisableKeys";

function QuizLayout() {
  const router = useRouter();

  const dispatch = useDispatch();

  const userAuthToken = useSelector(userAuthSelector);
  const socket = useSelector(socketSelector);
  const { startRecording } = useSelector(permissionsSelector);

  useDisableKeys()

  useEffect(() => {
    const handleNavigationWarning = () => {
      if (socket) {
        router.push("/v1/test-window/navigation-warning");

        fireEventWithAck(socket, {
          eventName: SOCKET_EVENTS.ADD_WARNING,
          callback: (response) => {
            if (!response?.result?.error) {
              dispatch(updateWarnings(response?.result?.data));
            } else {
            }
          },
        });
      }
    };

    const handleBlur = () => {
      if (!isDebugMode()) {
        handleNavigationWarning();
      }
    };

    if (userAuthToken && startRecording) {
      // Attach listeners for visibility and blur events
      window.addEventListener("blur", handleBlur);
    }

    // Cleanup on component unmount
    return () => {
      window.removeEventListener("blur", handleBlur);
    };
  }, [userAuthToken, socket]);

  return (
    <div className="bg-[#1B1F24] flex flex-col min-h-screen">
      <QuizHeader />

      <div className="flex-1 flex flex-col mx-10 relative top-[-10px] shadow-md">
        <QuizPagination />
        {/* Main Content Section */}
        <div className="flex-1 flex relative ">
          <ArrowButton direction="right" />

          {/* Left Navigation Button */}
          <div className="flex flex-1 relative">

            <div className="flex flex-1 mt-2">
              <PanelGroup direction="horizontal" className="">
                <Panel className="" minSize={30}>
                  <LeftSection />
                </Panel>
                <PanelResizeHandle>
                  <div className="relative bg-[#272C33] justify-center w-2 flex items-center h-full">
                    <svg
                      className="absolute w-4 h-4 rotate-90 text-white"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M8,18H11V15H2V13H22V15H13V18H16L12,22L8,18M12,2L8,6H11V9H2V11H22V9H13V6H16L12,2Z"
                      />
                    </svg>
                  </div>
                </PanelResizeHandle>
                <Panel minSize={30}>
                  <RightSection />
                </Panel>
              </PanelGroup>
              {/* Right Navigation Button */}
            </div>
          </div>
          <ArrowButton direction="left" />
        </div>
      </div>
    </div>
  );
}

export default QuizLayout;