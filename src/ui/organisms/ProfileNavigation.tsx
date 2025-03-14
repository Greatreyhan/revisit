import React from 'react';
import { IoMdApps } from "react-icons/io";
import { MdInsertPageBreak, MdLocationPin, MdOutlineSecurity } from "react-icons/md";
import { MdOutlineLogout } from "react-icons/md";
import { Logo } from '../../assets/icons';
import { useFirebase } from '../../utils/FirebaseContext'; // Update the path as needed
import { RiCustomerServiceFill } from 'react-icons/ri';
import { IoCalendarSharp } from 'react-icons/io5';

const ProfileNavigation: React.FC = () => {
    const { signOut } = useFirebase();

    const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try {
            await signOut();
            console.log("Successfully logged out");
            // Redirect to the login page or any desired route
            window.location.href = '/login';
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <div className='md:w-2/12 md:h-screen bg-slate-100 flex flex-col justify-between py-8 fixed left-0 top-0'>
            {/* Logo */}
            <div className='flex justify-center'>
                <img className='w-32' src={Logo} alt="Logo" />
            </div>

            {/* List Menu */}
            <div className='pt-16 md:flex hidden text-left flex-col text-gray-800 flex-1'>
                <a href='/profile' className='cursor-pointer hover:font-semibold hover:text-primary-dark text-sm px-6 py-2 flex items-center'>
                    <IoMdApps className='text-2xl mr-1' />
                    <span>Dashboard</span>
                </a>
                <a href='/report' className='cursor-pointer hover:font-semibold hover:text-primary-dark text-sm px-6 py-2 flex items-center'>
                    <MdInsertPageBreak className='text-2xl mr-1' />
                    <span>Report</span>
                </a>
                <a href='/visit' className='cursor-pointer hover:font-semibold hover:text-primary-dark text-sm px-6 py-2 flex items-center'>
                    <MdLocationPin className='text-2xl mr-1' />
                    <span>Visit</span>
                </a>
                <a href='/assistant' className='cursor-pointer hover:font-semibold hover:text-primary-dark text-sm px-6 py-2 flex items-center'>
                    <RiCustomerServiceFill className='text-2xl mr-1' />
                    <span>Assistant</span>
                </a>
                <a href='/schedule' className='cursor-pointer hover:font-semibold hover:text-primary-dark text-sm px-6 py-2 flex items-center'>
                    <IoCalendarSharp className='text-2xl mr-1' />
                    <span>Schedule</span>
                </a>
                <a href='/warranty' className='cursor-pointer hover:font-semibold hover:text-primary-dark text-sm px-6 py-2 flex items-center'>
                    <MdOutlineSecurity className='text-2xl mr-1' />
                    <span>Warranty</span>
                </a>
            </div>

            {/* Logout */}
            <button
                onClick={handleLogout}
                className='text-gray-800 md:flex hidden cursor-pointer hover:font-semibold hover:text-primary-dark text-sm px-6 py-2 items-center'
            >
                <MdOutlineLogout className='text-2xl mr-1' />
                <span>Keluar</span>
            </button>
        </div>
    );
};

export default ProfileNavigation;
