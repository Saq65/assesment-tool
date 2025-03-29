import { questionsSelector } from '@/store/features/questions/selectors'
import React from 'react'
import { useSelector } from 'react-redux'

const TestCases = () => {

    const question = useSelector(questionsSelector)


    return (
        <div className="space-y-4">
            <div> Test Cases: </div>
            {question?.testCases?.map((item, index) => {
                return <div
                    key={index}
                    className="bg-[#1D2126] text-gray-200 p-4 rounded-md flex flex-col"
                >
                    <h3 className='font-bold mb-3'>Case {index + 1}</h3>
                    <div className='flex flex-col gap-y-2'>

                        <div>
                            <p className="text-sm font-medium text-gray-400 mb-1">Input:</p>
                            <p className="text-lg font-semibold">{item.input}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-400 mb-1">Expected Output:</p>
                            <p className="text-lg font-semibold">{item.output}</p>
                        </div>
                    </div>
                </div>

            })}
        </div>
    )
}

export default TestCases