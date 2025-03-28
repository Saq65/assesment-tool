"use client"
import Button from '@/components/atoms/Button'
import CustomInput from '@/components/atoms/TextInput'
import React, { useEffect } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useRouter, useSearchParams } from 'next/navigation'
import { useUserLoginMutation } from '@/services/api-service/user/auth'
import { setCookie } from 'cookies-next'
import { setUser, setUserAuthToken } from '@/store/features/userAuth'
import useSnackbar from '@/hooks/useSnakbar'
import { useDispatch } from 'react-redux'
import { CircularProgress } from '@mui/material'
import { setSectionsCount, setTestId } from '@/store/features/test'


const TestAccessForm = () => {


    const router = useRouter();

    const searchParams = useSearchParams();

    const testCode = searchParams.get("testId");

    const dispatch = useDispatch()
    const [loginUser] = useUserLoginMutation();

    const { showError } = useSnackbar();

    useEffect(() => {
        dispatch(setTestId(testCode))

        testCode && testCode != "null" && sessionStorage.setItem("testId", testCode)
    }, [testCode])



    // Initialize formik with validation schema
    const formik = useFormik({
        initialValues: {
            loginCode: '', // Initial value for test invitation key
        },
        validationSchema: Yup.object({
            loginCode: Yup.string()
                .required('Unique ID is required')
                // .min(5, 'Login code must be at least 5 characters long')
                .max(20, 'Unique ID must be at most 20 characters long'),
        }),
        onSubmit: (values, { setSubmitting }) => {

            const payload = {
                loginCode: values?.loginCode?.trim(),
                testCode: testCode?.trim()
            }

            // return router.push("/instructions")


            loginUser(payload)
                .unwrap()
                .then((res) => {
                    setCookie("userAuthToken", res?.data?.token);
                    dispatch(setUserAuthToken(res?.data?.token))
                    dispatch(setUser({
                        candidateName: res?.data?.candidateName,
                        questionsLength: res?.data?.questionsLength,
                        totalDuration: res?.data?.totalDuration,
                        candidateJobPosition: res?.data?.candidateJobPosition,
                        programs: res?.data?.programs,
                        questions: res?.data?.questions,
                        sectionsCount: res?.data?.sectionsCount,

                    }))

                    dispatch(setSectionsCount(res?.data?.sectionsCount))
                    // router.refresh();
                    setTimeout(() => {
                        router.push("/v1/instructions");
                        setSubmitting(false)
                    }, 300);
                })
                .catch((err) => {

                    showError(err?.message || err?.data?.message);
                    setSubmitting(false)
                }).finally(() => {

                })

        },
    })



    return (
        <main className="flex-grow flex items-center justify-center">
            <div className="bg-newCodes-foreground shadow-md rounded-md p-6 w-full max-w-md">
                <h2 className="text-center text-white text-[20px] font-bold font-medium mb-2">
                    Access Your Assessment
                </h2>
                <h3 className='text-gray-400 text-[14px] font-medium'>Enter the unique ID provided in your email to start your test</h3>
                <form onSubmit={formik.handleSubmit} className="flex flex-col items-center justify-center gap-4">

                    <CustomInput
                        name="loginCode"
                        label="Enter your unique ID"
                        value={formik.values.loginCode}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.errors.loginCode}
                        helperText={formik.errors.loginCode}
                        touched={formik.touched.loginCode}
                        disabled={formik.isSubmitting}

                    />
                    <Button type="submit" disabled={formik.isSubmitting || !formik.values.loginCode.trim()} endIcon={
                        formik.isSubmitting ? <CircularProgress size="1rem" /> : null
                    }
                        style={{ backgroundColor: "#343A40", color: "#FFFFFF" ,cursor:'po'}}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = "#343A40")}
                    >
                        Proceed
                    </Button>
                </form>
            </div>
        </main>
    )
}

export default TestAccessForm
