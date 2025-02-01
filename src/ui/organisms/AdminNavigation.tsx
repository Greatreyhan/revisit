import React from 'react';
import { IoMdApps } from "react-icons/io";
import { MdInsertPageBreak, MdOutlineDesignServices, MdPerson, MdWork } from "react-icons/md";
import { TbReportSearch } from "react-icons/tb";
import { MdOutlineLogout } from "react-icons/md";
import { Logo } from '../../assets/icons';
import { useFirebase } from '../../utils/FirebaseContext'; // Update the path as needed

const AdminNavigation: React.FC = () => {
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
                <a href='/admin' className='cursor-pointer hover:font-semibold hover:text-primary-dark text-sm px-6 py-2 flex items-center'>
                    <IoMdApps className='text-2xl mr-1' />
                    <span>Dashboard</span>
                </a>
                <a href='/admin/portofolio' className='cursor-pointer hover:font-semibold hover:text-primary-dark text-sm px-6 py-2 flex items-center'>
                    <MdInsertPageBreak className='text-2xl mr-1' />
                    <span>Portofolio</span>
                </a>
                <a href='/admin/article' className='cursor-pointer hover:font-semibold hover:text-primary-dark text-sm px-6 py-2 flex items-center'>
                    <TbReportSearch className='text-2xl mr-1' />
                    <span>Blog</span>
                </a>
                <a href='/admin/career' className='cursor-pointer hover:font-semibold hover:text-primary-dark text-sm px-6 py-2 flex items-center'>
                    <MdWork className='text-2xl mr-1' />
                    <span>Career</span>
                </a>
                <a href='/admin/service' className='cursor-pointer hover:font-semibold hover:text-primary-dark text-sm px-6 py-2 flex items-center'>
                    <MdOutlineDesignServices className='text-2xl mr-1' />
                    <span>Service</span>
                </a>
                <a href='/admin/client' className='cursor-pointer hover:font-semibold hover:text-primary-dark text-sm px-6 py-2 flex items-center'>
                    <MdPerson className='text-2xl mr-1' />
                    <span>Client</span>
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

export default AdminNavigation;
