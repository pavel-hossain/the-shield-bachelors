import React, { useState } from 'react';
import { useMess } from '../../context/MessContext';
import { Member, MemberRole, MemberStatus } from '../../types';
import { Users, UserPlus, FileSpreadsheet, Phone, ShieldCheck, ToggleLeft, ToggleRight, ArrowRight, Edit, Upload, Image as ImageIcon } from 'lucide-react';

export const MembersModule: React.FC = () => {
  const {
    members,
    memberSummaries,
    addMember,
    updateMember,
    toggleMemberStatus,
    setSelectedMemberForStatement,
    setIsExcelModalOpen,
    isManagerMode,
  } = useMess();

  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  // Add Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [roomNo, setRoomNo] = useState('');
  const [role, setRole] = useState<MemberRole>('Member');
  const [status, setStatus] = useState<MemberStatus>('Active');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [guardianRelation, setGuardianRelation] = useState('Father');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [joiningDate, setJoiningDate] = useState(new Date().toISOString().split('T')[0]);

  // Edit Form State
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editRoomNo, setEditRoomNo] = useState('');
  const [editRole, setEditRole] = useState<MemberRole>('Member');
  const [editStatus, setEditStatus] = useState<MemberStatus>('Active');
  const [editAvatarUrl, setEditAvatarUrl] = useState('');
  const [editApplyBenchmark, setEditApplyBenchmark] = useState(true);
  const [editGuardianName, setEditGuardianName] = useState('');
  const [editGuardianRelation, setEditGuardianRelation] = useState('Father');
  const [editGuardianPhone, setEditGuardianPhone] = useState('');
  const [editJoiningDate, setEditJoiningDate] = useState('');

  const avatarColors = [
    'bg-emerald-600 text-white',
    'bg-indigo-600 text-white',
    'bg-amber-600 text-white',
    'bg-rose-600 text-white',
    'bg-cyan-600 text-white',
    'bg-violet-600 text-white',
    'bg-teal-600 text-white',
  ];

  const openEditModal = (member: Member) => {
    setEditingMember(member);
    setEditName(member.name);
    setEditPhone(member.phone);
    setEditRoomNo(member.roomNo);
    setEditRole(member.role);
    setEditStatus(member.status);
    setEditAvatarUrl(member.avatarUrl || '');
    setEditApplyBenchmark(member.applyBenchmark !== false);
    setEditGuardianName(member.guardianName || '');
    setEditGuardianRelation(member.guardianRelation || 'Father');
    setEditGuardianPhone(member.guardianPhone || '');
    setEditJoiningDate(member.joiningDate || new Date().toISOString().split('T')[0]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isEdit) {
          setEditAvatarUrl(reader.result as string);
        } else {
          setAvatarUrl(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const randomColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];

    addMember({
      name: name.trim(),
      phone: phone.trim() || '01700000000',
      roomNo: roomNo.trim() || '101',
      role,
      status,
      avatarColor: randomColor,
      avatarUrl: avatarUrl.trim() || undefined,
      guardianName: guardianName.trim() || undefined,
      guardianRelation: guardianRelation.trim() || 'Father',
      guardianPhone: guardianPhone.trim() || undefined,
      joiningDate: joiningDate || new Date().toISOString().split('T')[0],
    });

    setName('');
    setPhone('');
    setRoomNo('');
    setAvatarUrl('');
    setGuardianName('');
    setGuardianRelation('Father');
    setGuardianPhone('');
    setIsAddMemberModalOpen(false);
  };

  const handleUpdateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember || !editName.trim()) return;

    updateMember({
      ...editingMember,
      name: editName.trim(),
      phone: editPhone.trim(),
      roomNo: editRoomNo.trim(),
      role: editRole,
      status: editStatus,
      avatarUrl: editAvatarUrl.trim() || undefined,
      applyBenchmark: editApplyBenchmark,
      guardianName: editGuardianName.trim() || undefined,
      guardianRelation: editGuardianRelation.trim() || 'Father',
      guardianPhone: editGuardianPhone.trim() || undefined,
      joiningDate: editJoiningDate || editingMember.joiningDate,
    });

    setEditingMember(null);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header & Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Mess Members Directory</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage bachelor profiles, active status, roles, and financial balances
          </p>
        </div>

        {isManagerMode ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExcelModalOpen(true)}
              className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-3 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Import Excel</span>
            </button>

            <button
              onClick={() => setIsAddMemberModalOpen(true)}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded-lg text-xs font-bold transition shadow-xs whitespace-nowrap"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Member</span>
            </button>
          </div>
        ) : (
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
            🔒 Read-Only Member Directory
          </div>
        )}
      </div>

      {/* Members Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {members.map((member) => {
          const summary = memberSummaries.find((s) => s.member.id === member.id);

          return (
            <div
              key={member.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs flex flex-col justify-between space-y-3 hover:border-indigo-500 transition group"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div
                    className="flex items-center gap-3 cursor-pointer group/avatar"
                    onClick={() => setSelectedMemberForStatement(member)}
                    title="Click to view comprehensive member profile statement"
                  >
                    {member.avatarUrl ? (
                      <img
                        src={member.avatarUrl}
                        alt={member.name}
                        className="w-11 h-11 rounded-full object-cover shrink-0 shadow-sm border border-slate-200 dark:border-slate-700 group-hover/avatar:ring-2 group-hover/avatar:ring-indigo-500 transition"
                      />
                    ) : (
                      <div
                        className={`w-11 h-11 rounded-full ${member.avatarColor} font-bold text-sm flex items-center justify-center shrink-0 shadow-sm group-hover/avatar:ring-2 group-hover/avatar:ring-indigo-500 transition`}
                      >
                        {member.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                    )}
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 group-hover/avatar:text-indigo-600 dark:group-hover/avatar:text-indigo-400 transition">
                        <span className="truncate">{member.name}</span>
                        {member.role === 'Manager' && (
                          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        )}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-emerald-600" />
                          <a href={`tel:${member.phone}`} onClick={(e) => e.stopPropagation()} className="hover:underline">
                            {member.phone}
                          </a>
                        </span>
                        <span>•</span>
                        <span>Room {member.roomNo}</span>
                      </div>
                      {member.guardianName && (
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                          <span className="text-indigo-600 dark:text-indigo-400 font-bold">Guardian:</span>{' '}
                          {member.guardianName} ({member.guardianRelation || 'Guardian'})
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Active/Inactive Status Toggle Pill */}
                  <button
                    disabled={!isManagerMode}
                    onClick={() => isManagerMode && toggleMemberStatus(member.id)}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border transition whitespace-nowrap ${
                      member.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400'
                    } ${!isManagerMode ? 'cursor-default' : 'hover:opacity-80'}`}
                    title={isManagerMode ? 'Click to toggle status' : 'Status'}
                  >
                    {member.status === 'Active' ? (
                      <ToggleRight className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <ToggleLeft className="w-3.5 h-3.5 text-slate-400" />
                    )}
                    <span>{member.status}</span>
                  </button>
                </div>

                {/* Benchmark Rule Status Badge */}
                <div className="mt-2 flex items-center gap-1.5 text-[10px]">
                  <span className="text-slate-400 font-medium">Meal Rule:</span>
                  {member.applyBenchmark !== false ? (
                    <span className="bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 px-1.5 py-0.5 rounded font-bold">
                      Min 45 Meals
                    </span>
                  ) : (
                    <span className="bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 px-1.5 py-0.5 rounded font-bold">
                      Exempt (Actual Only)
                    </span>
                  )}
                </div>

                {/* Financial Summary Snippet */}
                {summary && (
                  <div className="mt-2 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg space-y-2 text-xs">
                    <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-200 dark:border-slate-700/60">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">
                          Actual Meals
                        </span>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {summary.actualMeals}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">
                          Effective Meals
                        </span>
                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                          {summary.effectiveMeals}
                          {summary.effectiveMeals > summary.actualMeals && (
                            <span className="text-[9px] bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-1 py-0.2 rounded font-semibold whitespace-nowrap">
                              45 Min
                            </span>
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 font-medium block">
                          Meal Cost (Pure)
                        </span>
                        <strong className="text-slate-900 dark:text-white font-black">
                          ৳ {summary.mealCost.toLocaleString()}
                        </strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-medium block">
                          Net Balance
                        </span>
                        <strong
                          className={`font-black ${
                            summary.netBalance > 0
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : summary.netBalance < 0
                              ? 'text-rose-600 dark:text-rose-400'
                              : 'text-slate-600'
                          }`}
                        >
                          {summary.netBalance > 0
                            ? `+৳${summary.netBalance.toLocaleString()}`
                            : summary.netBalance < 0
                            ? `-৳${Math.abs(summary.netBalance).toLocaleString()}`
                            : 'Settled'}
                        </strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons: Edit Profile & View Statement */}
              <div className={`grid gap-2 pt-1 ${isManagerMode ? 'grid-cols-2' : 'grid-cols-1'}`}>
                {isManagerMode && (
                  <button
                    onClick={() => openEditModal(member)}
                    className="flex items-center justify-center gap-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap"
                  >
                    <Edit className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Edit Profile</span>
                  </button>
                )}

                <button
                  onClick={() => setSelectedMemberForStatement(member)}
                  className="flex items-center justify-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap w-full"
                >
                  <span>Statement</span>
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-400 group-hover:translate-x-0.5 transition" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Member Modal */}
      {isAddMemberModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span>Add New Mess Member</span>
              </h3>
              <button
                onClick={() => setIsAddMemberModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mahfuzur Rahman"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="01712345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    Room No
                  </label>
                  <input
                    type="text"
                    placeholder="101"
                    value={roomNo}
                    onChange={(e) => setRoomNo(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Profile Picture (Image URL or Upload)</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="https://example.com/avatar.jpg"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <label className="cursor-pointer bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 px-3 py-2 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1 transition">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, false)}
                      className="hidden"
                    />
                  </label>
                </div>
                {avatarUrl && (
                  <div className="mt-2 flex items-center gap-2">
                    <img src={avatarUrl} alt="Preview" className="w-8 h-8 rounded-full object-cover border border-slate-300" />
                    <span className="text-[10px] text-emerald-600 font-bold">Image loaded</span>
                  </div>
                )}
              </div>

              {/* Guardian & Emergency Contact Section */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-2.5">
                <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
                  Guardian Information (অভিভাবকের তথ্য)
                </span>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    Guardian Name (অভিভাবকের নাম)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Md. Delwar Hossain"
                    value={guardianName}
                    onChange={(e) => setGuardianName(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                      Relationship (সম্পর্ক)
                    </label>
                    <select
                      value={guardianRelation}
                      onChange={(e) => setGuardianRelation(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Father">Father (পিতা)</option>
                      <option value="Mother">Mother (মাতা)</option>
                      <option value="Elder Brother">Elder Brother (বড় ভাই)</option>
                      <option value="Uncle">Uncle (চাচ্চু/মামা)</option>
                      <option value="Legal Guardian">Legal Guardian (আইনগত অভিভাবক)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                      Guardian Phone (মোবাইল)
                    </label>
                    <input
                      type="text"
                      placeholder="01711002233"
                      value={guardianPhone}
                      onChange={(e) => setGuardianPhone(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    Joining Date (যোগদানের তারিখ)
                  </label>
                  <input
                    type="date"
                    value={joiningDate}
                    onChange={(e) => setJoiningDate(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    Mess Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as MemberRole)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-2.5 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Member">Member</option>
                    <option value="Manager">Manager</option>
                    <option value="Auditor">Auditor</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    Initial Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as MemberStatus)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-2.5 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddMemberModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-sm"
                >
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Member Modal */}
      {editingMember && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Edit className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span>Edit Profile: {editingMember.name}</span>
              </h3>
              <button
                onClick={() => setEditingMember(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateMember} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                  Member Name *
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    Room No
                  </label>
                  <input
                    type="text"
                    value={editRoomNo}
                    onChange={(e) => setEditRoomNo(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Profile Picture (Image URL or Upload File)</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="https://example.com/photo.jpg"
                    value={editAvatarUrl}
                    onChange={(e) => setEditAvatarUrl(e.target.value)}
                    className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <label className="cursor-pointer bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 px-3 py-2 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1 transition">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, true)}
                      className="hidden"
                    />
                  </label>
                </div>
                {editAvatarUrl && (
                  <div className="mt-2 flex items-center gap-2">
                    <img src={editAvatarUrl} alt="Preview" className="w-10 h-10 rounded-full object-cover border border-slate-300" />
                    <button
                      type="button"
                      onClick={() => setEditAvatarUrl('')}
                      className="text-[10px] text-rose-500 hover:underline font-bold"
                    >
                      Remove Picture
                    </button>
                  </div>
                )}
              </div>

              {/* Guardian Information Section */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-2.5">
                <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
                  Guardian Details (অভিভাবকের তথ্য)
                </span>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    Guardian Name (অভিভাবকের নাম)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Md. Delwar Hossain"
                    value={editGuardianName}
                    onChange={(e) => setEditGuardianName(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                      Relationship (সম্পর্ক)
                    </label>
                    <select
                      value={editGuardianRelation}
                      onChange={(e) => setEditGuardianRelation(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Father">Father (পিতা)</option>
                      <option value="Mother">Mother (মাতা)</option>
                      <option value="Elder Brother">Elder Brother (বড় ভাই)</option>
                      <option value="Uncle">Uncle (চাচ্চু/মামা)</option>
                      <option value="Legal Guardian">Legal Guardian (আইনগত অভিভাবক)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                      Guardian Phone (মোবাইল)
                    </label>
                    <input
                      type="text"
                      placeholder="01711002233"
                      value={editGuardianPhone}
                      onChange={(e) => setEditGuardianPhone(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    Joining Date (যোগদানের তারিখ)
                  </label>
                  <input
                    type="date"
                    value={editJoiningDate}
                    onChange={(e) => setEditJoiningDate(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    Mess Role
                  </label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as MemberRole)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-2.5 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Member">Member</option>
                    <option value="Manager">Manager</option>
                    <option value="Auditor">Auditor</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    Active / Inactive Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as MemberStatus)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-2.5 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Effective Meal Benchmark Rule Toggle Switch */}
              <div className="bg-indigo-50 dark:bg-indigo-950/40 p-3 rounded-xl border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Apply Effective Meal Benchmark (Min 45 Meals)
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
                    ON = Minimum 45 meal bill apply code rule. OFF = Pure actual meals billing exemption (e.g. guest / late joiner).
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setEditApplyBenchmark(!editApplyBenchmark)}
                  className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                    editApplyBenchmark ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      editApplyBenchmark ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
