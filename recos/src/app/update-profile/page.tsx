"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import useFetchProfile from "../hooks/useFetchProfile";
import { fetchUpdateProfile } from "../utils/fetchProfile";
import { removeAuthToken } from "../utils/authToken";
import {
  User as UserIcon,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CameraIcon,
} from "lucide-react";
import { SidebarProvider } from "@/app/context/SidebarContext";
import Sidebar from "../shared-components/Sidebar";
import { LogoutModalProvider } from "@/app/context/LogoutModalContext";
import LogoutModal from "../shared-components/Modals/LogoutModal";

export default function UpdateProfilePage() {
  const router = useRouter();
  const { user: profile, error } = useFetchProfile();
  const [showPassword, setShowPassword] = useState(false);
  const [avatarImage, setAvatarImage] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    image: null as File | null,
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        email: profile.email || "",
        password: "",
        full_name: `${profile.first_name || ""} ${profile.last_name || ""}`.trim(),
        image: null,
      });
      setAvatarPreview(profile.image || null);
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target;
    if (type === "file" && files && files[0]) {
      setAvatarImage(files[0]);
      setFormData((prev) => ({ ...prev, image: files[0] }));
      setAvatarPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const cleanEmail = formData.email.replace(/[\0\n\r\t\v\f]/g, "").trim();
    const cleanFullName = (formData.full_name || "").trim();

    if (!cleanEmail) {
      setErrorMessage("Email is required.");
      return;
    }
    if (!cleanFullName) {
      setErrorMessage("Full name is required.");
      return;
    }

    let first_name = "";
    let last_name = "";
    const names = cleanFullName.split(" ");
    if (names.length === 1) {
      first_name = names[0];
      last_name = "";
    } else if (names.length > 1) {
      first_name = names[0];
      last_name = names.slice(1).join(" ");
    }

    const form = new FormData();
    form.append("email", cleanEmail);
    form.append("first_name", first_name);
    form.append("last_name", last_name);
    if (formData.password) form.append("password", formData.password);
    if (avatarImage) {
      form.append("image", avatarImage);
    }

    setSaving(true);
    try {
      await fetchUpdateProfile(form);

      const emailChanged =
        formData.email && profile && formData.email !== profile.email;
      const passwordChanged = !!formData.password;

      setSuccess(true);

      if (avatarImage) {
        setAvatarPreview(URL.createObjectURL(avatarImage));
      }

      if (emailChanged || passwordChanged) {
        setTimeout(() => {
          setSaving(false);
          removeAuthToken();
          router.push("/signin");
        }, 2000);
        return;
      }
      setTimeout(() => {
        setSuccess(false);
        setSaving(false);
        router.push("/profile");
      }, 2000);
    } catch (err) {
      setSaving(false);
      setErrorMessage("Update failed. Please try again.");
    }
  };

  return (
    <LogoutModalProvider>
      <SidebarProvider>
        <Sidebar />
        <LogoutModal />
        <main className="flex flex-col items-center min-h-screen w-full bg-[#ffffff] py-16 overflow-hidden">
          <div className="w-full flex flex-col items-center mb-8 mt-10 ml-50">
            <h1 className="text-4xl font-bold text-[#8645E8] text-center">
              Edit Profile
            </h1>
          </div>
          {error ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <div className="text-xl text-red-500 font-semibold">{error}</div>
            </div>
          ) : (
            <div className="bg-[#1e1a3a] rounded-3xl shadow-2xl px-8 py-12 flex flex-col md:flex-row items-center justify-center gap-35 max-w-5xl w-full ml-50 mt-20">
              <div className="relative flex flex-col items-center justify-center mb-8 md:mb-0 mr-10">
                <div className="relative w-[240px] h-[240px] rounded-full bg-[#141244] border-4 border-[#8645E8] overflow-hidden shadow-xl flex items-center justify-center">
                  {avatarPreview ? (
                    <Image
                      src={avatarPreview}
                      alt="Avatar Preview"
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="240px"
                      priority
                    />
                  ) : (
                    <UserIcon className="w-32 h-32 text-[#8645E8] opacity-50" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => document.getElementById("avatarInput")?.click()}
                  className="absolute bottom-6 right-1.5 w-11 h-11 bg-[#8645E8] border-4 border-[#141244] rounded-full flex items-center justify-center shadow-lg hover:bg-[#a886f9] transition mb-1 ml-100 cursor-pointer"
                  aria-label="Upload avatar"
                >
                  <CameraIcon className="w-6 h-6" />
                </button>
                <input
                  id="avatarInput"
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                />
              </div>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-7 items-center w-full max-w-md mt-0"
              >
                <h2 className="text-4xl font-bold text-white mb-0 tracking-wide mr-80">
                  Details
                </h2>
                <div className="border-t-4 border-[#8645E8] w-full mb-10" />
                <div className="flex items-center gap-8 w-full mb-5">
                  <UserIcon className="w-7 h-7 text-[#8645E8]" />
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                    className="flex-1 px-4 py-2 rounded-lg text-lg bg-[#2d2551] text-white border border-[#8645E8] placeholder-[#8BB2B5] outline-none"
                    placeholder="Full Name"
                    maxLength={80}
                  />
                </div>
                <div className="flex items-center gap-8 w-full mb-5">
                  <Mail className="w-7 h-7 text-[#8645E8]" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="flex-1 px-4 py-2 rounded-lg text-lg bg-[#2d2551] text-white border border-[#8645E8] placeholder-[#8BB2B5] outline-none"
                    placeholder="Email"
                    maxLength={254}
                  />
                </div>
                <div className="flex items-center gap-8 w-full mb-5">
                  <Lock className="w-7 h-7 text-[#8645E8]" />
                  <div className="relative w-full">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Change Password"
                      autoComplete="new-password"
                      className="flex-1 px-4 py-2 rounded-lg text-lg bg-[#2d2551] text-white border border-[#8645E8] placeholder-[#8BB2B5] outline-none w-full pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8645E8] hover:text-[#a886f9] focus:outline-none cursor-pointer"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <Eye className="w-6 h-6" />
                      ) : (
                        <EyeOff className="w-6 h-6" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-8 justify-end w-full mt-2">
                  <button
                    type="button"
                    onClick={() => router.push("/profile")}
                    className="px-5 py-2 border-2 border-[#8645E8] text-[#8645E8] rounded-lg text-lg font-medium shadow hover:bg-[#23204f] hover:text-white transition cursor-pointer"
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-7 py-2 bg-[#8645E8] text-white rounded-lg text-lg font-semibold shadow hover:bg-[#a886f9] transition cursor-pointer flex items-center justify-center min-w-[90px]"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className="animate-spin mr-2">
                          <svg
                            className="w-5 h-5 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            />
                          </svg>
                        </span>
                        Saving...
                      </>
                    ) : (
                      "Save"
                    )}
                  </button>
                </div>
                {errorMessage && (
                  <div className="w-full text-center mt-2">
                    <span className="text-red-400 font-semibold">{errorMessage}</span>
                  </div>
                )}
                {success && (
                  <div className="w-full text-center mt-2">
                    <span className="text-green-400 font-semibold">Profile updated successfully!</span>
                  </div>
                )}
              </form>
            </div>
          )}
        </main>
      </SidebarProvider>
    </LogoutModalProvider>
  );
}