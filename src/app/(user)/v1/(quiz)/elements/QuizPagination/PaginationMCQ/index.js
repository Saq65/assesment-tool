import { socketSelector } from '@/store/features/socket/selectors';
import { goToQuestion } from '@/store/features/test';
import { testSelector } from '@/store/features/test/selectors';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';

const PaginationMCQ = () => {

    const dispatch = useDispatch();

    const socket = useSelector(socketSelector);


    const { currentIndex, testInfo } = useSelector(testSelector);

    const handleQuestionClick = (idx) => {
        dispatch(goToQuestion({ idx, socket }));
    };
    return (
        <div className="flex flex-wrap gap-x-2 gap-y-3">
            {testInfo?.question?.map((question, index) => (
                <button
                    key={question.id}
                    onClick={() => handleQuestionClick(index)}
                    className={`font-bold text-white rounded-lg w-8 h-8 
                               ${question.status === "review"
                            ? "bg-yellow-700"
                            : ""
                        } 
                               ${question.status === "attempted"
                            ? "bg-green-600"
                            : ""
                        } 
                               ${question.status === "skipped"
                            ? "bg-red-600"
                            : ""
                        } 
                               ${index === currentIndex
                            ? "text-white border-2 border-white flex justify-center items-center"
                            : ""
                        }`}
                >
                    {index + 1}
                </button>
            ))}
        </div>
    )
}

export default PaginationMCQ