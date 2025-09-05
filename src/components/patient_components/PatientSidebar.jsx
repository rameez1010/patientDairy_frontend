import React, { useState } from 'react';

import { jwtDecode } from 'jwt-decode';
import { FaPowerOff, FaRegUserCircle } from 'react-icons/fa';
import { IoMdSettings } from 'react-icons/io';
import { MdBloodtype, MdDashboard } from 'react-icons/md';
import { PiChartBarFill } from 'react-icons/pi';
import { TbReportAnalytics } from 'react-icons/tb';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import logo from '../../assets/biokrystal_logo.png';
import patientApiService from '../../services/patientApiService';

const PatientSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await patientApiService.logout();
      navigate('/patient_login');
    } catch (error) {
      console.error('Error during logout:', error);
      // Even if logout fails, clear tokens and redirect
      navigate('/patient_login');
    }
  };

  const token = patientApiService.getAccessToken();
  const decodedToken = jwtDecode(token);
  console.log(decodedToken);

  const isActive = (path) => {
    console.log({ path });
    console.log({ location: location.pathname, path: path === location.pathname });
    return location.pathname === path ? 'bg-[#5558E4] text-white pl-1' : 'text-gray-600 hover:text-[#5558E4]';
  };

  const [isOpen, setIsOpen] = useState(false);

  // Determine if mobile (Tailwind: md is 768px)
  // We'll use Tailwind classes for show/hide, but this state controls mobile drawer

  return (
    <>
      <button
        className="absolute z-40 md:hidden hover:bg-gray-100"
        style={{ top: 42, left: 32 }}
        onClick={() => setIsOpen(true)}
        aria-label="Open sidebar"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar drawer */}
      <nav
        className={`fixed top-0 left-0 z-50 h-screen font-light flex flex-col justify-between border-r-[1px] bg-white transition-transform duration-300 w-64
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:static md:translate-x-0 md:w-1/6 flex flex-col justify-between`}
        aria-label="Sidebar"
      >
        <div>
          <div className="flex items-center h-12 px-5 py-3 overflow-hidden">
            <Link to="" className="flex-shrink-0">
              <img className="h-6 w-auto" src={logo} alt="BioKrystal" />
            </Link>
            <span className="text-lg font-bold text-black ml-1 flex-shrink-0">Bio Krystal</span>
            <span className="text-xs self-end mb-1 ml-2 text-gray-600 truncate">Patient View</span>
          </div>
          <div className="border-b-[1px]"></div>
          <div className="px-5 py-3">
            <ul className="py-2 font-medium ml-2 space-y-3 text-medium">
              <Link
                to="/patient_dashboard"
                className={`flex items-center gap-2 py-1 rounded ${isActive('/patient_dashboard')}`}
              >
                <MdDashboard className="" /> Dashboard
              </Link>
              <Link to="/patient_labs" className={`flex items-center gap-2 py-1 rounded ${isActive('/patient_labs')}`}>
                <MdBloodtype /> My Labs
              </Link>
              <Link
                to="/patient_reports"
                className={`flex items-center gap-2 py-1 rounded ${isActive('/patient_reports')}`}
              >
                <TbReportAnalytics /> My Reports
              </Link>
              <Link
                to="/patient_analytics"
                className={`flex items-center gap-2 py-1 rounded ${isActive('/patient_analytics')}`}
              >
                <PiChartBarFill /> Analytics
              </Link>
              <Link
                to="/patient_settings"
                className={`flex items-center gap-2 py-1 rounded ${isActive('/patient_settings')}`}
              >
                <IoMdSettings /> Settings
              </Link>
            </ul>
          </div>
        </div>

        <div className="px-2 pb-2 flex items-center justify-between gap-2 text-medium font-normal text-black border-t-[1px] pt-2">
          <div className="flex items-center gap-2">
            <span>
              <FaRegUserCircle size={29} className="text-[#5558E4]" />
            </span>
            <Link to="/patient_settings" className="cursor-pointer hover:text-gray-200 text-sm font-medium text-medium">
              {decodedToken.first_name} {decodedToken.last_name}
            </Link>
          </div>
          <Link onClick={handleLogout} className="cursor-pointer">
            <FaPowerOff size={17} className="text-[#5558E4] hover:text-gray-400" />
          </Link>
        </div>
      </nav>
    </>
  );
};

export default PatientSidebar;
