import React, { useState } from 'react';
import { useMess } from '../../context/MessContext';
import {
  Shield,
  X,
  MapPin,
  Phone,
  User,
  Wifi,
  Clock,
  FileText,
  AlertTriangle,
  Printer,
  Copy,
  Check,
  Edit3,
  Save,
  CheckCircle2,
  DollarSign,
  Plus,
  Trash2,
  Building,
  Lock,
  HeartHandshake,
  QrCode,
  Share2,
  CreditCard,
} from 'lucide-react';
import { MessProfile } from '../../types';

export const MessProfileModal: React.FC = () => {
  const {
    isProfileModalOpen,
    setIsProfileModalOpen,
    messProfile,
    updateMessProfile,
    members,
    currentPeriod,
  } = useMess();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<MessProfile>({ ...messProfile });
  const [newRuleText, setNewRuleText] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isProfileModalOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleSave = () => {
    updateMessProfile(formData);
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleAddRule = () => {
    if (!newRuleText.trim()) return;
    setFormData((prev) => ({
      ...prev,
      rules: [...prev.rules, newRuleText.trim()],
    }));
    setNewRuleText('');
  };

  const handleRemoveRule = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== idx),
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                Official Mess Profile & Policy Handbook
              </h2>
              <p className="text-xs text-emerald-200 font-medium">
                {messProfile.name} • Established {messProfile.establishedYear}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition flex items-center gap-1.5 text-white cursor-pointer"
            >
              {isEditing ? <EyeIcon className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
              <span>{isEditing ? 'View Mode' : 'Edit Profile'}</span>
            </button>
            <button
              onClick={() => setIsProfileModalOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition cursor-pointer text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 print:p-0">
          {savedSuccess && (
            <div className="p-3 bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md animate-in slide-in-from-top">
              <CheckCircle2 className="w-4 h-4" />
              <span>Mess profile updated and persisted successfully!</span>
            </div>
          )}

          {isEditing ? (
            /* EDIT FORM */
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    Mess Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    Tagline / Motto
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    Address / Holding
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    City & District
                  </label>
                  <input
                    type="text"
                    value={`${formData.city}, ${formData.district}`}
                    onChange={(e) => {
                      const parts = e.target.value.split(',');
                      setFormData({
                        ...formData,
                        city: parts[0]?.trim() || '',
                        district: parts[1]?.trim() || '',
                      });
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    Manager Name & Phone
                  </label>
                  <input
                    type="text"
                    value={formData.managerName}
                    onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white mb-2"
                    placeholder="Manager Name"
                  />
                  <input
                    type="text"
                    value={formData.managerPhone}
                    onChange={(e) => setFormData({ ...formData, managerPhone: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                    placeholder="Manager Phone"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    Auditor Name & Phone
                  </label>
                  <input
                    type="text"
                    value={formData.auditorName}
                    onChange={(e) => setFormData({ ...formData, auditorName: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white mb-2"
                    placeholder="Auditor Name"
                  />
                  <input
                    type="text"
                    value={formData.auditorPhone}
                    onChange={(e) => setFormData({ ...formData, auditorPhone: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                    placeholder="Auditor Phone"
                  />
                </div>
              </div>

              {/* Wi-Fi & Financial Gateways */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-4">
                <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span>Mess Pay Numbers & Financial Gateways</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      bKash Number
                    </label>
                    <input
                      type="text"
                      value={formData.bKashNumber}
                      onChange={(e) => setFormData({ ...formData, bKashNumber: e.target.value })}
                      placeholder="01948545255"
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      Nagad Number
                    </label>
                    <input
                      type="text"
                      value={formData.nagadNumber}
                      onChange={(e) => setFormData({ ...formData, nagadNumber: e.target.value })}
                      placeholder="01948545255"
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      Rocket Number
                    </label>
                    <input
                      type="text"
                      value={formData.rocketNumber}
                      onChange={(e) => setFormData({ ...formData, rocketNumber: e.target.value })}
                      placeholder="018776890414"
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      Dutch Bangla Bank Account (DBBL)
                    </label>
                    <input
                      type="text"
                      value={formData.bankAccountDetails || 'Dutch Bangla Bank: 2281600015015'}
                      onChange={(e) => setFormData({ ...formData, bankAccountDetails: e.target.value })}
                      placeholder="Dutch Bangla Bank: 2281600015015"
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Wi-Fi SSID</label>
                    <input
                      type="text"
                      value={formData.wifiSSID}
                      onChange={(e) => setFormData({ ...formData, wifiSSID: e.target.value })}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Wi-Fi Password</label>
                    <input
                      type="text"
                      value={formData.wifiPass}
                      onChange={(e) => setFormData({ ...formData, wifiPass: e.target.value })}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Rules Editor */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Official Mess Rules & By-Laws
                </label>
                <div className="space-y-2">
                  {formData.rules.map((rule, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={rule}
                        onChange={(e) => {
                          const updated = [...formData.rules];
                          updated[idx] = e.target.value;
                          setFormData({ ...formData, rules: updated });
                        }}
                        className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white"
                      />
                      <button
                        onClick={() => handleRemoveRule(idx)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  <div className="flex gap-2 pt-2">
                    <input
                      type="text"
                      value={newRuleText}
                      onChange={(e) => setNewRuleText(e.target.value)}
                      placeholder="Add new rule or by-law..."
                      className="flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white"
                    />
                    <button
                      onClick={handleAddRule}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Rule</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Emergency Contacts */}
              <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 space-y-3">
                <h4 className="text-xs font-black uppercase text-rose-700 dark:text-rose-400 tracking-wider">
                  Emergency Services Directory
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Police / Thana</label>
                    <input
                      type="text"
                      value={formData.emergencyPolice}
                      onChange={(e) => setFormData({ ...formData, emergencyPolice: e.target.value })}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">District Hospital</label>
                    <input
                      type="text"
                      value={formData.emergencyHospital}
                      onChange={(e) => setFormData({ ...formData, emergencyHospital: e.target.value })}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          ) : (
            /* VIEW MODE: BEAUTIFUL OFFICIAL MESS PROFILE CARD */
            <div className="space-y-6">
              {/* Top Identity Hero Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white border border-emerald-900/60 shadow-xl relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider">
                        Official Mess Charter
                      </span>
                      <span className="text-xs text-slate-400 font-medium">Est. {messProfile.establishedYear}</span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                      {messProfile.name}
                    </h1>
                    <p className="text-xs sm:text-sm text-emerald-200 font-medium mt-1">
                      {messProfile.tagline}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-slate-300 mt-3 font-medium">
                      <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{messProfile.address}, {messProfile.city}, {messProfile.district}</span>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex sm:flex-col gap-2 shrink-0 self-start sm:self-auto">
                    <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center min-w-[120px]">
                      <p className="text-[10px] uppercase font-bold text-slate-300">Active Boarders</p>
                      <p className="text-xl font-black text-emerald-400 mt-0.5">{members.length} Members</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Stakeholders & Governance */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Manager */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                      M
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded">
                        Mess Manager
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                        {messProfile.managerName}
                      </h3>
                      <p className="text-xs text-slate-500 font-mono">{messProfile.managerPhone}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(messProfile.managerPhone, 'manager_phone')}
                    className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
                    title="Copy Phone"
                  >
                    {copiedKey === 'manager_phone' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Auditor */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                      A
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded">
                        Financial Auditor
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                        {messProfile.auditorName}
                      </h3>
                      <p className="text-xs text-slate-500 font-mono">{messProfile.auditorPhone}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(messProfile.auditorPhone, 'auditor_phone')}
                    className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
                    title="Copy Phone"
                  >
                    {copiedKey === 'auditor_phone' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Schedule, Policies & Wi-Fi Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Meal Times */}
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-xs">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span>Serving Schedule</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between pb-1.5 border-b border-slate-100 dark:border-slate-700">
                      <span className="text-slate-500">Breakfast</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{messProfile.breakfastTime}</span>
                    </div>
                    <div className="flex justify-between pb-1.5 border-b border-slate-100 dark:border-slate-700">
                      <span className="text-slate-500">Lunch</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{messProfile.lunchTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Dinner</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{messProfile.dinnerTime}</span>
                    </div>
                  </div>
                </div>

                {/* Key Policies */}
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-xs">
                    <HeartHandshake className="w-4 h-4 text-indigo-600" />
                    <span>Core Policies</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between pb-1.5 border-b border-slate-100 dark:border-slate-700">
                      <span className="text-slate-500">Min. Benchmark</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">{messProfile.minimumMealPolicy} Meals</span>
                    </div>
                    <div className="flex justify-between pb-1.5 border-b border-slate-100 dark:border-slate-700">
                      <span className="text-slate-500">Guest Meal Rate</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">৳ {messProfile.guestMealCharge}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Deposit Deadline</span>
                      <span className="font-bold text-amber-600">{messProfile.depositDeadline}</span>
                    </div>
                  </div>
                </div>

                {/* Wi-Fi & Internet Credentials */}
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-xs">
                      <Wifi className="w-4 h-4 text-teal-600" />
                      <span>Mess High-Speed Wi-Fi</span>
                    </div>
                    <button
                      onClick={() => handleCopy(`SSID: ${messProfile.wifiSSID} | Pass: ${messProfile.wifiPass}`, 'wifi')}
                      className="text-[11px] font-bold text-teal-600 flex items-center gap-1 cursor-pointer hover:underline"
                    >
                      {copiedKey === 'wifi' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'wifi' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="space-y-1 text-xs">
                    <p className="text-slate-500 text-[11px]">Network SSID:</p>
                    <p className="font-mono font-bold text-slate-900 dark:text-white">{messProfile.wifiSSID}</p>
                    <p className="text-slate-500 text-[11px] pt-1">Password:</p>
                    <p className="font-mono font-bold text-slate-900 dark:text-white">{messProfile.wifiPass}</p>
                  </div>
                </div>
              </div>

              {/* Official Pay & Deposit Gateways */}
              <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider">
                      Official Mess Payment & Deposit Gateways
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Click card to copy number</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* bKash */}
                  <div
                    onClick={() => handleCopy(messProfile.bKashNumber, 'bkash_card')}
                    className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-pink-200 dark:border-pink-900/40 hover:border-pink-400 transition cursor-pointer shadow-xs relative group"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 font-bold text-[10px] uppercase">
                        bKash (Send Money)
                      </span>
                      <button className="text-slate-400 group-hover:text-pink-600">
                        {copiedKey === 'bkash_card' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <p className="font-mono font-black text-sm text-slate-900 dark:text-white">
                      {messProfile.bKashNumber}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Personal / Mess Manager</p>
                  </div>

                  {/* Nagad */}
                  <div
                    onClick={() => handleCopy(messProfile.nagadNumber, 'nagad_card')}
                    className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-900/40 hover:border-amber-400 transition cursor-pointer shadow-xs relative group"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold text-[10px] uppercase">
                        Nagad (Send Money)
                      </span>
                      <button className="text-slate-400 group-hover:text-amber-600">
                        {copiedKey === 'nagad_card' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <p className="font-mono font-black text-sm text-slate-900 dark:text-white">
                      {messProfile.nagadNumber}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Personal / Mess Manager</p>
                  </div>

                  {/* Rocket */}
                  <div
                    onClick={() => handleCopy(messProfile.rocketNumber, 'rocket_card')}
                    className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-900/40 hover:border-purple-400 transition cursor-pointer shadow-xs relative group"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold text-[10px] uppercase">
                        Rocket (DBBL)
                      </span>
                      <button className="text-slate-400 group-hover:text-purple-600">
                        {copiedKey === 'rocket_card' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <p className="font-mono font-black text-sm text-slate-900 dark:text-white">
                      {messProfile.rocketNumber}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Personal / 12 Digits</p>
                  </div>

                  {/* Dutch Bangla Bank */}
                  <div
                    onClick={() => handleCopy('2281600015015', 'dbbl_card')}
                    className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-900/40 hover:border-emerald-400 transition cursor-pointer shadow-xs relative group"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] uppercase">
                        Dutch-Bangla Bank
                      </span>
                      <button className="text-slate-400 group-hover:text-emerald-600">
                        {copiedKey === 'dbbl_card' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <p className="font-mono font-black text-xs text-slate-900 dark:text-white truncate">
                      A/C: 2281600015015
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Dutch Bangla Bank Ltd</p>
                  </div>
                </div>
              </div>

              {/* By-laws & Rules List */}
              <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider">
                    Mess By-Laws & Code of Conduct
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {messProfile.rules.map((rule, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 flex items-start gap-2 leading-relaxed"
                    >
                      <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="text-slate-700 dark:text-slate-300">{rule}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Emergency Directory */}
              <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <h4 className="text-xs font-black uppercase text-rose-700 dark:text-rose-400 tracking-wider">
                    Emergency Directory (Police, Fire, Hospital & Landlord)
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-800 font-medium">
                    <span className="text-slate-500">Police / Thana: </span>
                    <span className="font-bold text-slate-900 dark:text-white">{messProfile.emergencyPolice}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-800 font-medium">
                    <span className="text-slate-500">Hospital: </span>
                    <span className="font-bold text-slate-900 dark:text-white">{messProfile.emergencyHospital}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-800 font-medium">
                    <span className="text-slate-500">Fire Station: </span>
                    <span className="font-bold text-slate-900 dark:text-white">{messProfile.emergencyFire}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-800 font-medium">
                    <span className="text-slate-500">Landlord Contact: </span>
                    <span className="font-bold text-slate-900 dark:text-white">{messProfile.emergencyLandlord}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between shrink-0">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Official Profile</span>
          </button>
          <button
            onClick={() => setIsProfileModalOpen(false)}
            className="px-5 py-2 bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper eye icon for toggle
function EyeIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
