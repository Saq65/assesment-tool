"use client"
import Button from '@/components/atoms/Button'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import useCountDown from '@/hooks/useCountDown'
import { fireEventWithAck } from '@/utils'
import { setStartRecording, setVideoStream } from '@/store/features/permissions'
import { SOCKET_EVENTS } from '@/lib/socket/events'
import { socketSelector } from '@/store/features/socket/selectors'
import { setTestInfo } from '@/store/features/test'
import { setLoading } from '@/store/features/alerts'



const Page = () => {

    const router = useRouter();


    const socket = useSelector(socketSelector)

    const dispatch = useDispatch()

    const countdown = useCountDown(10, () => {
        document.getElementById("proceed-btn").click()
    })

    const requestWebcamAudioPermissions = async () => {
        try {
            let videoStream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: true,
            });

            videoStream.getAudioTracks().forEach((track) => (track.enabled = true));

            // updatePermissionStatus(2, "completed");
            return true;
        } catch (error) {
            console.error("Error requesting webcam/audio permissions:", error);
            // updatePermissionStatus(2, "error");

            if (
                error.name === "NotAllowedError" ||
                error.name === "PermissionDeniedError"
            ) {
                setVideoStream(null)
                router.push("/v1/pre-test-window/diagnostics?type=1");
            }

            return false;
        }
    };

    useEffect(() => {
        dispatch(setStartRecording(true))
        requestWebcamAudioPermissions();

        return () => {
            dispatch(setLoading(false))
        }

    }, [])




    const startTest = () => {
        dispatch(setLoading(true))
        fireEventWithAck(socket, {
            eventName: SOCKET_EVENTS.START_TEST, callback: (response) => {
                console.log(response, "START TEST RESONSE>>>>")
                if (response?.result?.error) {
                    dispatch(setLoading(false))
                    return

                }
                dispatch(setTestInfo(response?.result?.data));
                dispatch(setLoading(false))
            },
        });
        router.push("/v1/test-window")

    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-primary-300">
            <div className="bg-newCodes-foreground w-[500px] rounded-lg p-8 shadow-md">
                {/* Header */}
                <h1 className="text-xl font-bold text-white mb-4">Monitored Session</h1>

                {/* Description */}
                <p className="text-sm text-white leading-relaxed mb-6">
                    Zeus will monitor your session for review.
                    <br />
                    <br />
                    Please note that from here on you will be monitored via video/screen feed.
                    This monitoring is being undertaken to eliminate any use of unfair means during
                    the conduct of this session.
                    <br />
                    <br />
                    The said video/screen feed can be viewed whether on a real-time basis
                    and/or accessed subsequently by only an authorized person of your employer /
                    proposed employer / institution for monitoring and audit.
                </p>

                {/* Timer and Camera Section */}
                <div className="flex justify-between items-center mb-6">
                    <div className="text-xl text-white">
                        Test starting in <strong>{countdown} secs</strong>
                    </div>

                </div>

                {/* Button */}
                <Button id="proceed-btn"
                    className="w-full py-2 text-white font-semibold rounded-5 hover:bg-gray-200 transition"
                    onClick={startTest}
                    style={{ backgroundColor: "#343A40", color: "#FFFFFF", cursor: 'pointer' }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = "#343A40")}
                >
                    Proceed to Test
                </Button>
            </div>
        </div>
    )
}

export default Page
