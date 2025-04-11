import React, { useState } from 'react';
import { IoMdApps } from "react-icons/io";
import { MdArticle, MdBookmarks, MdHealthAndSafety, MdOutlineCalendarMonth, MdOutlineMenu, MdPerson, MdSupervisedUserCircle } from "react-icons/md";
import { TbReportSearch } from "react-icons/tb";
import { MdOutlineLogout } from "react-icons/md";
import { Logo } from '../../assets/icons';
import { useFirebase } from '../../utils/FirebaseContext'; // Update the path as needed
import { Link } from 'react-router-dom';
import { FaClipboardUser, FaMedal } from 'react-icons/fa6';

const AdminNavigation: React.FC = () => {
    const { signOut, authData } = useFirebase();
    const [showNav, setShowNav] = useState(false)

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
            <div className='md:flex hidden justify-center'>
                <Link to={'/'}><img className="w-32" src={Logo} alt="Logo" /></Link>
            </div>

            {/* Small Navigation */}
            <div className='flex md:hidden w-full fixed bg-slate-200 top-0 justify-between items-center'>
                <MdOutlineMenu className='text-5xl p-2 m-1 cursor-pointer' onClick={() => setShowNav(!showNav)} />
                <Link to={'/'}><img className="w-20" src={Logo} alt="Logo" /></Link>
            </div>

            {/* Navigation Mini */}
            <div className={`fixed h-screen bg-black bg-opacity-40 top-14 ${showNav ? "w-screen flex flex-col md:hidden" : "w-0 hidden"} z-50`}>
                <div className={`gap-3 bg-slate-100  text-gray-800 ${showNav ? "w-8/12" : "w-0"}  h-screen`}>
                    <div className='md:mt-0 py-8'>
                        <div className="rounded-xl bg-slate-100 px-6 py-2">
                            <div className="flex-row gap-4 flex justify-center items-center">
                                <div className="flex-shrink-0">
                                    <FaClipboardUser className='text-4xl bg-red-700 text-white p-1.5 rounded-full' />
                                </div>
                                <div className=" flex flex-col">
                                    <span className="text-lg font-medium text-gray-600">
                                        {authData?.name}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {authData?.type}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Link onClick={() => setShowNav(!showNav)} to='/admin' className='cursor-pointer hover:font-semibold hover:text-primary-dark text-sm px-6 py-2 flex items-center'>
                        <IoMdApps className='text-2xl mr-1' />
                        <span>Dashboard</span>
                    </Link>
                    <Link onClick={() => setShowNav(!showNav)} to='/admin/report' className='cursor-pointer hover:font-semibold hover:text-primary-dark text-sm px-6 py-2 flex items-center'>
                        <TbReportSearch className='text-2xl mr-1' />
                        <span>Report Investigation</span>
                    </Link>
                    <Link onClick={() => setShowNav(!showNav)} to='/admin/visit' className='cursor-pointer hover:font-semibold hover:text-primary-dark text-sm px-6 py-2 flex items-center'>
                        <TbReportSearch className='text-2xl mr-1' />
                        <span>Report Reguler</span>
                    </Link>
                    <Link onClick={() => setShowNav(!showNav)} to='/admin/schedule' className='cursor-pointer hover:font-semibold hover:text-primary-dark text-sm px-6 py-2 flex items-center'>
                        <MdOutlineCalendarMonth className='text-2xl mr-1' />
                        <span>Schedule Visit</span>
                    </Link>
                    <Link onClick={() => setShowNav(!showNav)} to='/admin/article' className='cursor-pointer hover:font-semibold hover:text-primary-dark text-sm px-6 py-2 flex items-center'>
                        <MdArticle className='text-2xl mr-1' />
                        <span>Blog</span>
                    </Link>
                    <Link onClick={() => setShowNav(!showNav)} to='/admin/customer' className='cursor-pointer hover:font-semibold hover:text-primary-dark text-sm px-6 py-2 flex items-center'>
                        <MdSupervisedUserCircle className='text-2xl mr-1' />
                        <span>Customer</span>
                    </Link>
                    <Link onClick={() => setShowNav(!showNav)} to='/admin/training' className='cursor-pointer hover:font-semibold hover:text-primary-dark text-sm px-6 py-2 flex items-center'>
                        <MdBookmarks className='text-2xl mr-1' />
                        <span>Training Report</span>
                    </Link>
                    <Link onClick={() => setShowNav(!showNav)} to='/admin/health' className='cursor-pointer hover:font-semibold hover:text-primary-dark text-sm px-6 py-2 flex items-center'>
                        <MdHealthAndSafety className='text-2xl mr-1' />
                        <span>Health Report</span>
                    </Link>
                    <Link onClick={() => setShowNav(!showNav)} to='/admin/podium' className='cursor-pointer hover:font-semibold hover:text-primary-dark text-sm px-6 py-2 flex items-center'>
                        <FaMedal className='text-2xl mr-1' />
                        <span>Podium</span>
                    </Link>
                    <Link onClick={() => setShowNav(!showNav)} to='/admin/user' className='cursor-pointer hover:font-semibold hover:text-primary-dark text-sm px-6 py-2 flex items-center'>
                        <MdPerson className='text-2xl mr-1' />
                        <span>User</span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className='text-gray-800 flex cursor-pointer hover:font-semibold hover:text-primary-dark text-sm px-6 py-2 items-center'
                    >
                        <MdOutlineLogout className='text-2xl mr-1' />
                        <span>Keluar</span>
                    </button>
                </div>
            </div>


            {/* List Menu */}
            <div className='pt-16 md:flex hidden text-left flex-col text-gray-800 flex-1'>
                <Link to='/admin' className='cursor-pointer hover:font-semibold hover:text-primary-dark text-sm px-6 py-2 flex items-center'>
                    <IoMdApps className='text-2xl mr-1' />
                    <span>Dashboard</span>
                </Link>
                <Link to='/admin/report' className='cursor-pointer hover:font-semibold hover:text-primary-dark text-sm px-6 py-2 flex items-center'>
                    <TbReportSearch className='text-2xl mr-1' />
                    <span>Report Investigation</span>
                </Link>
                <Link to='/admin/visit' className='cursor-pointer hover:font-semibold hover:text-primary-dark text-sm px-6 py-2 flex items-center'>
                    <TbReportSearch className='text-2xl mr-1' />
                    <span>Report Reguler</span>
                </Link>
                <Link to='/admin/schedule' className='cursor-pointer hover:font-semibold hover:text-primary-dark text-sm px-6 py-2 flex items-center'>
                    <MdOutlineCalendarMonth className='text-2xl mr-1' />
                    <span>Schedule Visit</span>
                </Link>
                <Link to='/admin/article' className='cursor-pointer hover:font-semibold hover:text-primary-dark text-sm px-6 py-2 flex items-center'>
                    <MdArticle className='text-2xl mr-1' />
                    <span>Blog</span>
                </Link>
                <Link to='/admin/customer' className='cursor-pointer hover:font-semibold hover:text-primary-dark text-sm px-6 py-2 flex items-center'>
                    <MdSupervisedUserCircle className='text-2xl mr-1' />
                    <span>Customer</span>
                </Link>
                <Link to='/admin/training' className='cursor-pointer hover:font-semibold hover:text-primary-dark text-sm px-6 py-2 flex items-center'>
                    <MdBookmarks className='text-2xl mr-1' />
                    <span>Training Report</span>
                </Link>
                <Link to='/admin/health' className='cursor-pointer hover:font-semibold hover:text-primary-dark text-sm px-6 py-2 flex items-center'>
                    <MdHealthAndSafety className='text-2xl mr-1' />
                    <span>Health Report</span>
                </Link>
                <Link to='/admin/podium' className='cursor-pointer hover:font-semibold hover:text-primary-dark text-sm px-6 py-2 flex items-center'>
                    <FaMedal className='text-2xl mr-1' />
                    <span>Podium</span>
                </Link>
                <Link to='/admin/user' className='cursor-pointer hover:font-semibold hover:text-primary-dark text-sm px-6 py-2 flex items-center'>
                    <MdPerson className='text-2xl mr-1' />
                    <span>User</span>
                </Link>
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
