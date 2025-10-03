"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { User as UserIcon, Mail, Calendar, Edit2 } from "lucide-react";
import useFetchProfile from "../hooks/useFetchProfile";
import { SidebarProvider } from "@/app/context/SidebarContext";
import Sidebar from "../shared-components/Sidebar";
import { LogoutModalProvider } from "@/app/context/LogoutModalContext";
import LogoutModal from "../shared-components/Modals/LogoutModal";

function formatDate(dateString: string | undefined) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ProfilePage() {
  const router = useRouter();
  const { user: profile, error } = useFetchProfile();
  return (
    <LogoutModalProvider>
      <SidebarProvider>
        <Sidebar />
        <LogoutModal />
        <main className="flex flex-col items-center min-h-screen w-full bg-[#ffffff] py-16 overflow-hidden">
          <div className="w-full flex flex-col items-center mb-8 mt-10 ml-30">
            <h1 className="text-4xl font-bold text-[#8645E8] text-center">
              Profile
            </h1>
          </div>
          {error ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <div className="text-xl text-red-500 font-semibold">{error}</div>
            </div>
          ) : (
            <div className="bg-[#1e1a3a] rounded-3xl shadow-2xl px-8 py-12 flex flex-col md:flex-row items-center justify-center gap-35 max-w-5xl w-full ml-50 mt-20">
              <div className="relative flex flex-col items-center justify-center mb-8 md:mb-0 mr-10">
                <div className="relative w-[250px] h-[260px] rounded-full bg-[#141244] border-4 border-[#8645E8] overflow-hidden shadow-xl flex items-center justify-center">
                {profile && profile.image ? (
                    <Image
                      src={profile.image}
                      alt="User Avatar"
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="240px"
                    />
                  ) : (
                    <UserIcon className="w-32 h-32 text-[#8645E8] opacity-50" />
                  )}
                </div>
                <button
                  onClick={() => router.push("/update-profile")}
                  className="absolute bottom-6 right-1.5 w-11 h-11 bg-[#8645E8] border-4 border-[#141244] rounded-full flex items-center justify-center shadow-lg hover:bg-[#a886f9] transition mb-1 ml-100 cursor-pointer"
                  aria-label="Edit Profile"
                  type="button"
                >
                  <Edit2 className="w-6 h-6 text-white" />
                </button>
              </div>
              <div className="flex flex-col gap-10 items-center w-full max-w-md mt-0">
                <h2 className="text-4xl font-bold text-white mb-0 tracking-wide mr-80">
                  Details
                </h2>
                <div className="border-t-4 border-[#8645E8] w-full mb-2" />
                <div className="flex items-center gap-8 w-full">
                  <UserIcon className="w-7 h-7 text-[#8645E8]" />
                  <div>
                    <p className="text-lg text-[#8BB2B5] font-medium">Full Name</p>
                    <p className="text-lg text-white font-semibold">
                      {profile ? `${profile.first_name} ${profile.last_name}` : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-8 w-full">
                  <Mail className="w-7 h-7 text-[#8645E8]" />
                  <div>
                    <p className="text-lg text-[#8BB2B5] font-medium">Email</p>
                    <p className="text-lg text-white font-semibold break-all">
                      {profile ? profile.email : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-8 w-full">
                  <Calendar className="w-7 h-7 text-[#8645E8]" />
                  <div>
                    <p className="text-lg text-[#8BB2B5] font-medium">Registration Date</p>
                    <p className="text-lg text-white font-semibold">
                      {profile ? formatDate(profile.created_at) : ""}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => router.push("/update-profile")}
                  className="self-end mt-4 px-6 py-2 bg-[#8645E8] text-white rounded-lg font-semibold hover:bg-[#a886f9] transition shadow cursor-pointer"
                >
                  Update
                </button>
              </div>
            </div>
          )}
        </main>
      </SidebarProvider>
    </LogoutModalProvider>
  );
}