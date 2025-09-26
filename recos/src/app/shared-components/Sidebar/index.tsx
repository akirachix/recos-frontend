"use client";

import {
  HomeIcon,
  BriefcaseIcon,
  UserGroupIcon,
  ChartBarIcon,
  CalendarIcon,
  CogIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSidebar } from "@/app/context/SidebarContext";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Button from "../Button";
import { useCompany } from "@/app/context/CompanyContext";

const topMenuItems = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Jobs", href: "/jobs", icon: BriefcaseIcon },
  { name: "Candidates", href: "/candidates", icon: UserGroupIcon },
  { name: "Analytics", href: "/analytics", icon: ChartBarIcon },
];

const bottomMenuItems = [
  { name: "Calendar", href: "/calendar", icon: CalendarIcon },
  { name: "Settings", href: "/settings", icon: CogIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isCollapsed, toggleSidebar, sidebarWidth } = useSidebar();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { selectedCompany, companies, setSelectedCompany } = useCompany();
  const iconSizeClass = isCollapsed ? "h-10 w-10" : "h-7 w-7";

  const handleCompanySelect = useCallback((company: { company_id: string; company_name: string }) => {
    setSelectedCompany(company);
    setIsDropdownOpen(false);
    router.push(`/dashboard/${company.company_id}`);
  }, [setSelectedCompany, router]);

  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen(prev => !prev);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    const handleClickOutside = (event: { target: unknown }) => {
      if (
        window.innerWidth < 1024 &&
        !isCollapsed &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        toggleSidebar();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCollapsed, toggleSidebar]);

  const isActive = useCallback((href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  }, [pathname]);

  const getHref = useCallback((href: string) => {
    if (href === "/jobs") {
      return "/jobs";
    }
    
    return selectedCompany ? `${href}/${selectedCompany.company_id}` : href;
  }, [selectedCompany]);

  const companiesList = useMemo(() => {
    return companies.map((company) => (
      <li
        key={company.company_id}
        className={`px-4 py-2 cursor-pointer ${
          selectedCompany?.company_id === company.company_id
            ? "bg-purple-700"
            : "hover:bg-purple-700"
        }`}
        onClick={() => handleCompanySelect(company)}
      >
        {company.company_name}
      </li>
    ));
  }, [companies, selectedCompany, handleCompanySelect]);

  return (
    <>
      {isCollapsed && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 lg:hidden p-2 hover:bg-purple-600/20 rounded bg-[#141244] text-white"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
      )}

      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full bg-[#141244] text-white flex flex-col transition-transform duration-300 z-50 
          ${
            isCollapsed
              ? "-translate-x-full lg:translate-x-0 lg:w-16 w-0 overflow-hidden"
              : "translate-x-0 lg:w-64 w-full"
          }`}
        style={{ width: `${sidebarWidth}px` }}
      >
        <div className="mb-8 flex items-center pt-2 px-4">
          {!isCollapsed && (
            <Image
              src="/logo-white.png"
              alt="Recos Logo"
              width={100}
              height={50}
              className="object-fill"
            />
          )}

          <div className={`flex-1 lg:hidden ${isCollapsed ? "hidden" : ""}`} />

          <div
            className={`flex-1 hidden lg:flex ${isCollapsed ? "" : "hidden"}`}
          />

          <button
            onClick={toggleSidebar}
            className={`p-2 rounded hover:bg-purple-600/20 lg:hidden ${
              isCollapsed ? "hidden" : ""
            }`}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>

          <button
            onClick={toggleSidebar}
            className="p-2 pt-4 rounded hover:bg-purple-600/20 hidden lg:block"
          >
            {isCollapsed ? (
              <ChevronRightIcon className={iconSizeClass} />
            ) : (
              <ChevronLeftIcon className={iconSizeClass} />
            )}
          </button>
        </div>

        {!isCollapsed && (
          <div
            className="relative bg-[#803CEB] flex justify-between p-2"
            ref={dropdownRef}
          >
            <Button
              onClick={toggleDropdown}
              variant="purple"
              size="sm"
              className="flex items-center w-full text-xl text-white p-2 rounded transition-colors duration-200 cursor-pointer"
            >
              {selectedCompany ? selectedCompany.company_name : "Select Company"}
              <ChevronDownIcon
                className={`ml-10 h-4 w-4 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                stroke="currentColor"
              />
            </Button>
            {isDropdownOpen && (
              <div className="absolute top-10 left-0 mt-2 w-full bg-[#803CEB] rounded shadow-lg z-10 animate-fade-in">
                <ul className="py-1 text-xl text-white">
                  {companiesList}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col justify-between flex-1 mt-6 px-4">
          <nav className="flex flex-col space-y-4">
            {topMenuItems.map((item) => (
              <Link
                key={item.name}
                href={getHref(item.href)}
                className={`flex items-center p-2 rounded ${
                  isActive(item.href)
                    ? "text-purple-600 border-b-3 border-purple-600"
                    : "hover:bg-purple-600/20"
                } ${isCollapsed ? "justify-center" : "space-x-2"}`}
              >
                <item.icon className={iconSizeClass} />
                {!isCollapsed && <span className="text-xl">{item.name}</span>}
              </Link>
            ))}
          </nav>
          <nav className="flex flex-col space-y-4">
            {bottomMenuItems.map((item) => (
              <Link
                key={item.name}
                href={getHref(item.href)}
                className={`flex items-center p-2 rounded ${
                  isActive(item.href)
                    ? "text-purple-600 border-b-3 border-purple-600"
                    : "hover:bg-purple-600/20"
                } ${isCollapsed ? "justify-center" : "space-x-2"}`}
              >
                <item.icon className={iconSizeClass} />
                {!isCollapsed && <span className="text-xl">{item.name}</span>}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}