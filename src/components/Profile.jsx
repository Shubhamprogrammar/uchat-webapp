import {
  FaUser,
  FaPhone,
  FaBirthdayCake,
  FaVenusMars,
  FaEdit,
  FaSave,
  FaTimes,
  FaInfoCircle,
  FaCamera,
  FaSignOutAlt,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import axios from "axios";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";

const Profile = ({ userId, onClose }) => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const HOST = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");
  const { user: currentUser, setUser: setGlobalUser, logout } = useAuth();

  const isSelf = !userId || userId === (currentUser?.id || currentUser?._id);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const endpoint = isSelf ? `${HOST}/api/auth/self-user` : `${HOST}/api/auth/user/${userId}`;
      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data || {});
      setFormData(response.data || {});
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUser({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, photo: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleUpdate = async () => {
    setSaving(true);
    try {
      await axios.put(`${HOST}/api/auth/update-profile`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(formData);
      if (isSelf) {
        setGlobalUser({ ...currentUser, ...formData });
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setSaving(false);
    }
  };

  const getAvatarGradient = () => {
    const ch = (user?.username || "U").charAt(0).toUpperCase();
    const code = ch.charCodeAt(0);
    const hue = (code * 37) % 360;
    return `linear-gradient(135deg, hsl(${hue}, 70%, 55%), hsl(${(hue + 40) % 360}, 80%, 45%))`;
  };

  const InfoRow = ({ icon: Icon, label, value, fieldName, editable }) => (
    <div className="flex items-center gap-4 px-4 py-3 rounded-2xl bg-gray-50/80 border border-transparent hover:border-blue-50 transition-all">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white shadow-sm">
        <Icon className="text-blue-600" size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">{label}</p>
        {isEditing && editable ? (
          <input
            name={fieldName}
            value={formData[fieldName] || ""}
            onChange={handleChange}
            className="w-full text-sm font-bold text-gray-900 bg-white border border-blue-100 rounded-lg px-2 py-1.5 mt-1 focus:outline-none focus:border-blue-400"
          />
        ) : (
          <p className="text-sm font-bold text-gray-900 truncate mt-0.5">{value || "—"}</p>
        )}
      </div>
    </div>
  );

  if (loading || !user) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-white border-l border-gray-100">
        <div className="w-16 h-16 rounded-full bg-gray-100 animate-pulse mb-4" />
        <div className="w-24 h-4 rounded bg-gray-50 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-100 shadow-2xl overflow-hidden">
      <div className="p-5 flex items-center justify-between border-b border-gray-100">
        <h3 className="font-black text-gray-900 text-sm uppercase tracking-tighter">
          {isSelf ? "My Account" : "User Profile"}
        </h3>
        <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition-all active:scale-95 cursor-pointer">
          <FaTimes size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/30">
        <div className="p-8 flex flex-col items-center text-center">
          <div className="relative mb-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-16 h-16 rounded-[2rem] flex items-center justify-center text-white text-4xl font-black shadow-2xl overflow-hidden relative group"
              style={{ background: getAvatarGradient() }}
            >
              {(formData.photo || user?.photo) ? (
                <img src={formData.photo || user.photo} alt="profile" className="w-full h-full object-cover" />
              ) : (
                user?.username?.[0]?.toUpperCase()
              )}
              
              {isSelf && isEditing && (
                <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <FaCamera size={24} className="text-white mb-1" />
                  <span className="text-[10px] font-bold text-white">Change</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              )}
            </motion.div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-green-500 border-4 border-white shadow-lg" />
          </div>

          <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-none">{user?.name}</h2>
          <p className="text-sm text-blue-600 font-bold mt-2 bg-blue-50 px-3 py-1 rounded-full">@{user?.username}</p>

          <div className="mt-6 w-full px-2">
            {isEditing ? (
              <textarea
                name="about"
                value={formData.about || ""}
                onChange={handleChange}
                className="w-full text-sm font-bold p-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:border-blue-400 resize-none h-24 shadow-inner"
                placeholder="Share your story..."
              />
            ) : (
              <p className="text-sm font-medium text-gray-700 italic leading-relaxed px-4">
                "{user?.about || "Hey there! I'm using UChat!"}"
              </p>
            )}
          </div>
        </div>

        <div className="px-5 pb-8 space-y-3">
          <div className="flex items-center gap-3 mb-4 px-2">
            <span className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Contact Information</span>
            <div className="h-px flex-1 bg-gray-100" />
          </div>

          <InfoRow
            icon={FaUser}
            label="Full Name"
            value={user?.name}
            fieldName="name"
            editable={true}
          />
          <InfoRow
            icon={FaVenusMars}
            label="Gender"
            value={user?.gender}
            fieldName="gender"
            editable={false}
          />
          <InfoRow
            icon={FaBirthdayCake}
            label="Date of Birth"
            value={user?.dob ? new Date(user.dob).toLocaleDateString(undefined, { dateStyle: 'long' }) : "Not provided"}
            fieldName="dob"
            editable={false}
          />

          {isSelf && (
            <InfoRow
              icon={FaPhone}
              label="Primary Mobile"
              value={user?.mobile}
              fieldName="mobile"
              editable={false}
            />
          )}
        </div>
      </div>

      {isSelf && (
        <div className="p-6 bg-white border-t border-gray-100 space-y-3">
          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div
                key="editing"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="flex gap-3"
              >
                <button
                  onClick={handleUpdate}
                  disabled={saving}
                  className="flex-[2] py-4 text-sm font-black text-white bg-blue-600 rounded-[1.25rem] hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                >
                  {saving ? "Saving Changes..." : "Update Profile"}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-4 text-sm font-black text-gray-500 bg-gray-100 rounded-[1.25rem] hover:bg-gray-200 transition-all active:scale-[0.98] cursor-pointer"
                >
                  Cancel
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="actions"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="space-y-3"
              >
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full py-2 text-sm font-black text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-[1.25rem] hover:shadow-2xl hover:shadow-orange-200 transition-all active:scale-[0.98] cursor-pointer"
                >
                  <div className="flex items-center justify-center gap-2">
                    <FaEdit size={16} />
                    <span>Modify Account</span>
                  </div>
                </button>
                <button
                  onClick={logout}
                  className="w-full py-2 text-sm font-black text-red-500 bg-red-50 rounded-[1.25rem] hover:bg-red-100 transition-all active:scale-[0.98] cursor-pointer"
                >
                  <div className="flex items-center justify-center gap-2">
                    <FaSignOutAlt size={16} />
                    <span>Sign Out</span>
                  </div>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Profile;
