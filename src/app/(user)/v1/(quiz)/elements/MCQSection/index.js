
import * as React from "react";
import Box from "@mui/material/Box";
import { SOCKET_EVENTS } from "@/lib/socket/events";
import { socketSelector } from "@/store/features/socket/selectors";

import {
    chooseAnswer,
    clearResponse,
    markAsAttempted,
} from "@/store/features/test";
import { testSelector } from "@/store/features/test/selectors";
import { CHOICES_MAPPING, fireEventWithAck, getKeyByValue, getSectionsCount } from "@/utils";
import {
    Box as MuiBox,
    FormControlLabel,
    Radio,
    RadioGroup,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";




const MCQSection = () => {
    const dispatch = useDispatch();

    // Accessing state directly from the selector without destructuring.
    const testState = useSelector(testSelector);
    const socket = useSelector(socketSelector);

    // No need to destructure - you can use testState directly where needed
    const handleChange = (e) => {
        const { value } = e.target;
        const currentQuestion =
            testState?.testInfo?.question?.[testState?.currentIndex];
        dispatch(markAsAttempted());

        fireEventWithAck(socket, {
            eventName: SOCKET_EVENTS.ADD_QUESTION_STATUS,
            payload: {
                questionStatus: {
                    [currentQuestion?.id]: "attempted",
                },
            },
        });

        const payload = {
            choiceMade: { [currentQuestion?.id]: value },
            currentIndex: testState?.currentIndex,
        };

        fireEventWithAck(socket, {
            eventName: SOCKET_EVENTS.ADD_ANSWER_RESPONSE,
            payload,
            callback: (response) => { },
        });

        dispatch(
            chooseAnswer({ questionId: currentQuestion?.id, selectedIndex: value })
        );
    };

    // console.log(user?.sectionsCount, "user?.sectionsCount>>>");



    return (
        <div className="flex-1 p-6 bg-[#272C33] overflow-y-auto  border rounded-lg border-solid border-primary-400"
            style={{
                height: testState?.testInfo?.sectionsCount == 2 ? 'calc(100vh - 230px)' : 'calc(100vh - 200px)'
            }}
        >
            <div className="flex flex-col h-full">
                <div className="text-lg font-semibold mb-4 flex justify-between items-center">
                    <span className="text-white">Select an option</span>
                    <button
                        className="text-blue-300 text-sm mt-auto self-end"
                        onClick={() => {
                            dispatch(clearResponse({ socket }));
                        }}
                    >
                        Clear Response
                    </button>
                </div>
                <Box className="space-y-4">
                    <RadioGroup
                        value={
                            testState?.testInfo?.question?.[testState?.currentIndex]
                                ?.choiceMade || ""
                        }
                        onChange={handleChange}
                        name="aaa_command"
                    >
                        {testState?.testInfo?.question?.[
                            testState?.currentIndex
                        ]?.choices?.map((option, index) => {
                            const choiceValue = getKeyByValue(CHOICES_MAPPING, index);
                            const isSelected =
                                testState?.testInfo?.question?.[testState?.currentIndex]
                                    ?.choiceMade === choiceValue;

                            return (
                                <FormControlLabel
                                    key={index}
                                    value={choiceValue}
                                    control={
                                        <Radio
                                            sx={{
                                                color: "white",
                                            }}
                                        />
                                    }
                                    label={option}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        color: "white", // Text color
                                        border: `1px solid ${isSelected ? "#fff" : "gray"}`, 
                                        padding: "4px 12px",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                        marginBottom: 2,
                                        "&:hover": {
                                            color: "#000", 
                                            backgroundColor:'#272C33'
                                        },
                                    }}
                                />
                            );
                        })}
                    </RadioGroup>
                </Box>
            </div>
        </div>
    );
};




export default MCQSection