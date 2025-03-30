"use client"
import Button from '@/components/atoms/Button';
import CustomInput from '@/components/atoms/TextInput'
import useSnackbar from '@/hooks/useSnakbar';
import { useLoginMutation } from '@/services/api-service/admin/auth';
import { useGetDashboardDataMutation } from '@/services/api-service/admin/dashboard';
import { useGetQuestionsCountMutation } from '@/services/api-service/admin/questions';
import { useGetAllLevelsMutation } from '@/services/api-service/admin/skills';
import { setAuthToken } from '@/store/features/auth';
import { CircularProgress, IconButton } from '@mui/material';
import { setCookie } from 'cookies-next';
import { useFormik } from 'formik'
import { useRouter } from 'next/navigation';
import React from 'react'
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import Visibility from '@mui/icons-material/Visibility';


const LoginForm = () => {


    const [login] = useLoginMutation();

    const [getQuestionsCount] = useGetQuestionsCountMutation()
    const [getDashboardData] = useGetDashboardDataMutation()
    const [getAllLevels] = useGetAllLevelsMutation()



    const { showSuccess, showError } = useSnackbar()
    const dispatch = useDispatch();

    const router = useRouter()

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('The email provided should be a valid email address')
                .max(255)
                .required('The email field is required'),
            password: Yup.string()
                .max(255)
                .required('The password field is required'),
        }),
        onSubmit: (values, { setSubmitting }) => {

            login(values)
                .unwrap()
                .then((res) => {
                    setCookie("authToken", res?.data?.authToken);
                    dispatch(setAuthToken(res?.data?.authToken))
                    getQuestionsCount().unwrap()
                    getDashboardData().unwrap()
                    getAllLevels().unwrap()

                    router.refresh();

                    setTimeout(() => {

                        router.push("/admin/dashboard")
                    }, 1000);


                })
                .catch((err) => {
                    setSubmitting(false)
                    showError(err?.message);
                }).finally(() => {
                    // setTimeout(() => {

                    // }, (1000));

                })

        }
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <div className="">
                <CustomInput
                    name="email"
                    label="Email address"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.errors.email}
                    helperText={formik.errors.email}
                    touched={formik.touched.email}
                    disabled={formik.isSubmitting}
                    shrinkLabel={true}
                />
            </div>
            <div className="mb-6">
                <CustomInput
                    name="password"
                    label="Password"
                    inputType='password'
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.errors.password}
                    helperText={formik.errors.password}
                    touched={formik.touched.password}
                    disabled={formik.isSubmitting}
                    shrinkLabel={true}
                    // endAdornment={<Visibility />}
                    endAdornment={<IconButton
                    // onClick={handleClickShowPassword}
                    // onMouseDown={handleMouseDownPassword}
                    // onMouseUp={handleMouseUpPassword}
                    // edge="end"
                    >
                        <Visibility color='red' />
                    </IconButton>}
                />
            </div>
            <div className="text-center">
                <Button
                    sx={{
                        mt: 3,
                        float: 'right',
                        borderRadius: 8,
                        backgroundColor: '#5A9BFF',
                        color: 'black',
                        padding: '12px 24px',
                    }}
                    startIcon={
                        formik.isSubmitting ? <CircularProgress size="1.8rem" /> : null
                    }
                    disabled={formik.isSubmitting}
                    type="submit"
                    size="large"
                    variant="contained"
                    style={{ backgroundColor: "#343A40", color: "#FFFFFF" }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = "#343A40")}
                >
                    Login
                </Button>
            </div>
        </form>
    )
}

export default LoginForm