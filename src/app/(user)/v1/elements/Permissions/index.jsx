"use client";
import React, { useState, useEffect } from "react";
import PermissionCheck from "../PermissionsCheck";
import { useDispatch, useSelector } from "react-redux";

import Button from "@/components/atoms/Button";
import { useRouter } from "next/navigation";
import { delay, enterFullScreen, stopStreams } from "@/utils";
import { permissionsSelector } from "@/store/features/permissions/selectors";
import {
  setPermission,
  setScreenStream,
  setVideoStream,
} from "@/store/features/permissions";
import {
  userAuthSelector,
  userAuthTokenSelector,
} from "@/store/features/userAuth/selectors";
import { setIsFullScreen } from "@/store/features/test";
import { CONSTANTS } from "@/constants";

const { PRE_TEST_WINDOW_VIEW } = CONSTANTS;

const Permissions = ({ canProceed, setCanProceed, setCurrentView }) => {
  const { permissions, screenStream } = useSelector(permissionsSelector);

  const { user } = useSelector(userAuthSelector);

  const userAuthToken = useSelector(userAuthTokenSelector);

  const dispatch = useDispatch();

  const router = useRouter();

  useEffect(() => {
    const startChecks = async () => {
      updatePermissionStatus(1, "loading");
      await delay(2000);
      await checkSystemCompatibility(); //step 1
      updatePermissionStatus(2, "loading");
      await delay(2000);
      let isPermissionGranted = await requestWebcamAudioPermissions(); //step 2
      if (isPermissionGranted) {
        updatePermissionStatus(3, "loading");
        await requestScreenPermissions();
      }
    };

    if (userAuthToken) startChecks();
  }, [userAuthToken]);

  useEffect(() => {
    const checkPermissionsStatus = () => {
      const allCompleted = permissions?.every(
        (permission) => permission?.status === "completed"
      );
      setCanProceed(allCompleted);
    };

    checkPermissionsStatus();
  }, [permissions]);

  const checkSystemCompatibility = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasMicrophone = devices.some(
        (device) => device.kind === "audioinput"
      );
      const hasCamera = devices.some((device) => device.kind === "videoinput");

      if (hasMicrophone && hasCamera) {
        updatePermissionStatus(1, "completed");
        return true;
      } else {
        updatePermissionStatus(1, "error");
        return false;
      }
    } catch (error) {
      console.error("Error checking system compatibility:", error);
      updatePermissionStatus(1, "error");
      return false;
    }
  };
  const requestWebcamAudioPermissions = async () => {
    try {
      let videoStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

      videoStream.getAudioTracks().forEach((track) => (track.enabled = true));

      dispatch(setVideoStream(videoStream));
      updatePermissionStatus(2, "completed");
      return true;
    } catch (error) {
      console.error("Error requesting webcam/audio permissions:", error);
      updatePermissionStatus(2, "error");

      if (
        error.name === "NotAllowedError" ||
        error.name === "PermissionDeniedError"
      ) {
        router.push("/v1/pre-test-window/diagnostics?type=1");
      }

      return false;
    }
  };

  const requestScreenPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: "always", // Show cursor
          displaySurface: "monitor", // Force full screen
        },
        audio: false,
      });

      const track = stream.getVideoTracks()[0];
      const settings = track.getSettings();
      // Listen for when the user stops sharing
      track.onended = () => {
        dispatch(setScreenStream(null)); // Store the stream in Redux
        updatePermissionStatus(3, "pending");
      };

      if (settings.displaySurface === "monitor") {
        dispatch(setScreenStream(stream)); // Store the stream in Redux
        updatePermissionStatus(3, "completed");
        return true;
      } else {
        stopStreams([stream]);
        router.push("/v1/pre-test-window/diagnostics");
        updatePermissionStatus(3, "error");
        return false;
      }
    } catch (error) {
      console.error("Error requesting screen permissions:", error);
      updatePermissionStatus(3, "error");
      return false;
    }
  };

  const updatePermissionStatus = (step, status) => {
    dispatch(setPermission({ step, status }));
  };

  useEffect(() => {
    if (screenStream) {
      screenStream.getVideoTracks()[0].onended = () => {
        updatePermissionStatus(3, "error");
      };
    }
  }, [screenStream]);

  return (
    <>
      <div className="flex">
        <div className="ml-6 flex-1 px-4">
          <h3 className="text-white mb-6 text-[20px]">
            Checking System Permissions
          </h3>

          <div className="bg-newCodes-foreground p-6 rounded-lg shadow-xl w-full">
            <table className="w-full text-left text-white">
              <tbody>
                {permissions?.map((permission, idx) => (
                  <PermissionCheck
                    key={idx}
                    step={permission.step}
                    title={permission.title}
                    description={permission.description}
                    status={permission.status}
                    isLast={permissions.length == idx + 1}
                    button={
                      permission?.button &&
                      ["loading", "error"].includes(permission.status) && (
                        <Button
                          className="disabled:bg-[#7DD3FC] rounded-md mt-3 px-3 py-1"
                          style={{ backgroundColor: "#343A40", color: "#FFFFFF" ,fontWeight:'400'}}
                          onMouseEnter={(e) => (e.target.style.backgroundColor = "#343A40")}
                          onClick={() => {
                            requestScreenPermissions();
                          }}
                        >
                          Start screen capture
                        </Button>
                      )
                    }
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-center">
        <Button
          disabled={!canProceed}
          onClick={() => {
            if (user?.sectionsCount > 1) {
              setCurrentView(PRE_TEST_WINDOW_VIEW.SECTIONS);
            } else {
              enterFullScreen();
              dispatch(setIsFullScreen(true));
              router.push("/v1/monitored-session");
            }
          }}
          style={{ backgroundColor: "#343A40", color: "#FFFFFF", cursor: 'pointer' }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#343A40")}
        >
          Next
        </Button>
      </div>
    </>
  );
};

export default Permissions;
