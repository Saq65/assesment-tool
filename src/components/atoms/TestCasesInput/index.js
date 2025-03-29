import React from 'react'
import CustomInput from '../TextInput'
import { FormHelperText, IconButton, Fab, Tooltip } from '@mui/material'
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';

const TestCasesInput = ({
    formik,
    scrollableContentRef
}) => {

    // Add a new test case
    const addTestCase = () => {
        formik.setFieldValue('testCases', [...formik.values.testCases, { input: '', output: '' }]);

        // Ensure that the scrollable content is scrolled to the bottom
        setTimeout(() => {
            if (scrollableContentRef?.current) {
                // Scroll to the bottom with smooth behavior
                scrollableContentRef.current.scrollTop = scrollableContentRef.current.scrollHeight;
            }
        }, 200);
    };

    // Remove a test case
    const removeTestCase = (index) => {
        // Remove the test case from formik values
        const updatedTestCases = formik.values.testCases.filter((_, i) => i !== index);
        formik.setFieldValue('testCases', updatedTestCases);

        // Remove the corresponding errors and touched states for the removed test case
        const updatedErrors = { ...formik.errors };
        const updatedTouched = { ...formik.touched };

        // Remove the test case's error and touched from the respective objects
        delete updatedErrors.testCases?.[index];
        delete updatedTouched.testCases?.[index];

        // Update formik errors and touched state
        formik.setErrors(updatedErrors);
        formik.setTouched(updatedTouched);
    };

    return (
        <>
            <div>
                <h4 className="text-sm font-bold my-4 flex items-center">
                    Add Test Cases
                    <Tooltip title="Test cases should be added in an array format. Each element represents a set of arguments. For example: [1, 3] means first argument is 1 and second argument is 3.">
                        <InfoIcon className="ml-2 text-blue-500 cursor-pointer" />
                    </Tooltip>
                </h4>
                {formik.values.testCases?.map((user, index) => (
                    <div className='flex items-start' key={index}>

                        <div className="d-flex items-start flex-1 justify-between">
                            <span className='mt-7 mr-2'>{index + 1}.</span>
                            {/* Input Field */}
                            <div className="flex-1 pr-2">
                                <CustomInput
                                    name={`testCases[${index}].input`}
                                    label="Input"
                                    value={user.input}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    touched={formik.touched.testCases?.[index]?.input}
                                    error={formik.errors.testCases?.[index]?.input}
                                    helperText={
                                        formik.touched.testCases?.[index]?.input &&
                                        formik.errors.testCases?.[index]?.input
                                    }
                                />
                            </div>

                            {/* Output Field */}
                            <div className="flex-1 pr-2">
                                <CustomInput
                                    name={`testCases[${index}].output`}
                                    label="Expected Output"
                                    value={user.output}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    touched={formik.touched.testCases?.[index]?.output}
                                    error={formik.errors.testCases?.[index]?.output}
                                    helperText={
                                        formik.touched.testCases?.[index]?.output &&
                                        formik.errors.testCases?.[index]?.output
                                    }
                                />
                            </div>

                            {/* Remove Button */}
                            {formik.values.testCases.length > 4 && (
                                <div className="flex justify-end mt-4">
                                    <IconButton
                                        onClick={() => removeTestCase(index)}
                                        aria-label="Delete Test Case"
                                    >
                                        <CancelIcon sx={{ color: '#EF4444' }} />
                                    </IconButton>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {formik.touched.testCases && typeof formik.errors.testCases === 'string' && (
                    <FormHelperText className="!text-[#FF1943]">{formik.errors.testCases}</FormHelperText>
                )}
            </div>
            <div className="flex justify-center py-3 pt-2">
                <Fab
                    color="primary"
                    aria-label="add"
                    onClick={addTestCase}
                    sx={{
                        position: "relative",
                        right: 0,
                        zIndex: 10,
                        color: "black",
                        background: "#7DD3FC",
                        "&:hover": {
                            background: "#7DD3FC", // Same as the background color to disable hover color change
                        },
                    }}
                    size='small'
                >
                    <AddIcon />
                </Fab>
            </div>
        </>
    );
}

export default TestCasesInput;
