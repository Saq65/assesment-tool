"use client"
import Button from "@/components/atoms/Button";
import { socketSelector } from "@/store/features/socket/selectors";
import { nextQuestion, prevQuestion } from "@/store/features/test";
import { testSelector } from "@/store/features/test/selectors";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import FinishButton from "../FinishButton";

function ArrowButton({ direction }) {
    const isLeft = direction === "left";

    const dispatch = useDispatch()

    const { nextBtnDisabled, prevBtnDisabled } = useSelector(testSelector);

    const socket = useSelector(socketSelector)


    const handleClick = () => {

        if (isLeft) {
            dispatch(nextQuestion({ socket }))
        } else {
            dispatch(prevQuestion({ socket }))
        }
    }


    if (isLeft) {

        if (nextBtnDisabled) {
            return <div className="fixed z-20 right-[50px] bottom-[22px]"><FinishButton /></div>
        }
        return <Button
            size="small"
            variant="contained"
            sx={{
                color: '#fff',
                '&:hover': {
                    backgroundColor: 'gray',
                    color: 'black', // Set text color on hover
                },
                zIndex: 20,
                position: "fixed",
                bottom: 22,
                right: 50,
                display: nextBtnDisabled ? "none" : "block"
            }}
            onClick={handleClick}
            style={{ backgroundColor: "#343A40", color: "#FFFFFF", cursor: 'pointer' }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#343A40")}
        >
            Next
        </Button>
    } else {
        return <Button
            size="small"
            variant="contained"
            sx={{

                color: '#fff',
                '&:hover': {
                    backgroundColor: 'gray', // Set background on hover
                    color: '#fff', // Set text color on hover
                },
                zIndex: 20,
                position: "fixed",
                bottom: 22,
                left: 50,
                display: prevBtnDisabled ? "none" : "block"

            }}
            onClick={handleClick}
            style={{ backgroundColor: "#343A40", color: "#FFFFFF", cursor: 'pointer' }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#343A40")}
        >
            Prev
        </Button>
    }


}

export default ArrowButton;
