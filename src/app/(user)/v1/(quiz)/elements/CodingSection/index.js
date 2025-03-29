import * as React from "react";
import CodeEditor from "@/components/atoms/CodeEditor";
import { socketSelector } from "@/store/features/socket/selectors";
import { testSelector } from "@/store/features/test/selectors";
import { useDispatch, useSelector } from "react-redux";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import RunTestCases from "../RunTestCases";
import { updateIsCodeChanged, updateProgram } from "@/store/features/test";
import { generateInitialCode } from "@/utils";


export default function CodingSection() {

    const [code, setCode] = React.useState("// Write your code here");

    const dispatch = useDispatch()

    const testState = useSelector(testSelector); // Access the entire test state

    const currentQuestion = testState?.testInfo?.programs?.[testState?.currentProgramIndex]


    const handleCodeChange = (newCode) => {
        if (!currentQuestion.isChanged) {
            dispatch(updateIsCodeChanged(true))
        }
        setCode(newCode);
    };


    React.useEffect(() => {

        if (currentQuestion?.isChanged) {
            setCode(currentQuestion?.userInput)
        } else {
            setCode(generateInitialCode(currentQuestion))
        }

    }, [testState?.currentProgramIndex])


    console.log(code, "code>>>>>")

    return (
        <>
            <PanelGroup direction="vertical">
                <Panel>
                    <div className="bg-[#272C33] h-full border rounded-lg border-solid border-primary-400">
                        <CodeEditor
                            language={currentQuestion?.programmingLanguage}
                            code={code}
                            setCode={setCode}
                            onChange={handleCodeChange}
                            onBlur={() => {
                                dispatch(updateProgram(code))
                            }}
                        />
                    </div>
                </Panel>
                <PanelResizeHandle>
                    <div className="relative  justify-center h-2 flex items-center">
                        <svg className="absolute w-4 h-4 text-white" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M8,18H11V15H2V13H22V15H13V18H16L12,22L8,18M12,2L8,6H11V9H2V11H22V9H13V6H16L12,2Z"
                            />
                        </svg>
                    </div>
                </PanelResizeHandle>
                <Panel minSize={30}>
                    <div className="bg-[#272C33] h-full border rounded-lg border-solid border-primary-400">
                        <PanelGroup direction="horizontal">
                            <Panel className="!overflow-auto">
                                <div>
                                    <RunTestCases code={code} language={currentQuestion?.programmingLanguage} />
                                </div>
                            </Panel>
                        </PanelGroup>
                    </div>
                </Panel>
            </PanelGroup>
        </>
    );
}
