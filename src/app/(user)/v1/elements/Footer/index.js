import React from 'react'
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import EmailIcon from '@mui/icons-material/Email';

const Footer = () => {
    return (
        <footer className="bg-newCodes-foreground py-4">
            <div className="container mx-auto text-center text-sm text-gray-600">
                <p className="text-white">
                    Powered by:{" "}
                    <span className="font-semibold text-white">Zeus</span>
                </p>
                <p className="mt-2 text-white">
                    <p className='mb-2'> Having trouble accessing the test ?</p>
                    <p className='flex items-center justify-center'>Contact us for assistance :&nbsp;&nbsp;&nbsp;
                        <LocalPhoneIcon className='mr-1' />
                        <a
                            href="tel:+18002656038"
                            className="text-white font-medium hover:underline"
                        >
                            +91 98779 - 72841
                        </a>
                        &nbsp; | &nbsp;
                        <EmailIcon className='mr-1' />
                        <a
                            href="mailto:hr@crebos.com"
                            className="text-white font-medium hover:underline"
                        >
                            hr@crebos.online
                        </a>
                    </p>
                </p>

            </div>
        </footer>
    )
}

export default Footer