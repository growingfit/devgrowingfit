'use client';

import React, { useState, useEffect } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import {
  getEnquiriesAction,
  toggleEnquiryStatusAction,
  deleteEnquiryAction,
} from '@/lib/actions/cms';
import {
  Inbox,
  Mail,
  Phone,
  Calendar,
  Search,
  CheckCircle2,
  Clock,
  Trash2,
  RefreshCw,
  MessageSquare,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Filter,
} from 'lucide-react';

interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email?: string;
  message?: string;
  status: 'unread' | 'read';
  source?: string;
  created_at: string;
}

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unread' | 'read'>('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const data = await getEnquiriesAction();
      setEnquiries(data || []);
      if (selectedEnquiry) {
        const updated = (data || []).find((e: Enquiry) => e.id === selectedEnquiry.id);
        setSelectedEnquiry(updated || null);
      }
    } catch (err) {
      console.error('Failed to load enquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleToggleStatus = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const res = await toggleEnquiryStatusAction(id);
      if (res.success) {
        setEnquiries((prev) =>
          prev.map((item) =>
            item.id === id
              ? { ...item, status: item.status === 'read' ? 'unread' : 'read' }
              : item
          )
        );
        if (selectedEnquiry && selectedEnquiry.id === id) {
          setSelectedEnquiry((prev) =>
            prev ? { ...prev, status: prev.status === 'read' ? 'unread' : 'read' } : null
          );
        }
        setActionMessage({ type: 'success', text: res.message || 'Status updated.' });
        setTimeout(() => setActionMessage(null), 3000);
      }
    } catch {
      setActionMessage({ type: 'error', text: 'Failed to update status.' });
    }
  };

  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this enquiry? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await deleteEnquiryAction(id);
      if (res.success) {
        setEnquiries((prev) => prev.filter((item) => item.id !== id));
        if (selectedEnquiry && selectedEnquiry.id === id) {
          setSelectedEnquiry(null);
        }
        setActionMessage({ type: 'success', text: 'Enquiry deleted successfully.' });
        setTimeout(() => setActionMessage(null), 3000);
      }
    } catch {
      setActionMessage({ type: 'error', text: 'Failed to delete enquiry.' });
    }
  };

  // Filter & Search Logic
  const filteredEnquiries = enquiries.filter((item) => {
    const matchesFilter =
      filterStatus === 'all' ? true : item.status === filterStatus;

    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesFilter;

    const matchesSearch =
      (item.name || '').toLowerCase().includes(query) ||
      (item.phone || '').toLowerCase().includes(query) ||
      (item.email || '').toLowerCase().includes(query) ||
      (item.message || '').toLowerCase().includes(query);

    return matchesFilter && matchesSearch;
  });

  const totalCount = enquiries.length;
  const unreadCount = enquiries.filter((e) => e.status === 'unread').length;
  const readCount = enquiries.filter((e) => e.status === 'read').length;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recent';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <>
      <AdminHeader
        title="Enquiries & Messages"
        description="View and manage website contact submissions and academy trial requests"
      />

      <main className="p-6 sm:p-8 max-w-6xl space-y-8">
        {/* Action Message Banner */}
        {actionMessage && (
          <div
            className={`p-4 rounded-xl flex items-center gap-3 text-xs font-semibold ${
              actionMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {actionMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            )}
            <span>{actionMessage.text}</span>
          </div>
        )}

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-[#E8E8EC] rounded-2xl p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#667085]">
                Total Enquiries
              </p>
              <h3 className="text-2xl font-black text-[#172033] mt-1">{totalCount}</h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-[#172033]">
              <Inbox className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white border border-[#E8E8EC] rounded-2xl p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#667085]">
                New / Unread
              </p>
              <h3 className="text-2xl font-black text-[#67238A] mt-1">{unreadCount}</h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center text-[#67238A]">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white border border-[#E8E8EC] rounded-2xl p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#667085]">
                Reviewed / Read
              </p>
              <h3 className="text-2xl font-black text-emerald-700 mt-1">{readCount}</h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white border border-[#E8E8EC] rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, phone, email, or message..."
              className="w-full pl-10 pr-4 py-2 bg-[#FAFAFC] border border-[#E8E8EC] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#172033] transition-colors"
            />
          </div>

          {/* Filter Status Tabs + Refresh Button */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <div className="flex items-center bg-[#F4F5F7] p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  filterStatus === 'all'
                    ? 'bg-white text-[#172033] shadow-xs font-bold'
                    : 'text-[#667085] hover:text-[#172033]'
                }`}
              >
                All ({totalCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('unread')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  filterStatus === 'unread'
                    ? 'bg-white text-[#67238A] shadow-xs font-bold'
                    : 'text-[#667085] hover:text-[#172033]'
                }`}
              >
                Unread ({unreadCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('read')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  filterStatus === 'read'
                    ? 'bg-white text-emerald-700 shadow-xs font-bold'
                    : 'text-[#667085] hover:text-[#172033]'
                }`}
              >
                Read ({readCount})
              </button>
            </div>

            <button
              type="button"
              onClick={fetchEnquiries}
              title="Refresh list"
              className="p-2 bg-[#F4F5F7] hover:bg-slate-200 text-[#172033] rounded-xl transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Enquiries List & Detail Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Enquiries List */}
          <div className={`${selectedEnquiry ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-3`}>
            {filteredEnquiries.length === 0 ? (
              <div className="bg-white border border-[#E8E8EC] rounded-2xl p-12 text-center space-y-3 shadow-xs">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Inbox className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-[#172033]">No enquiries found</h4>
                <p className="text-xs text-[#667085] max-w-sm mx-auto">
                  {searchQuery
                    ? 'No results matched your search keyword. Try clearing the filter.'
                    : 'When visitors submit the contact form on your website, their enquiries will appear here instantly.'}
                </p>
              </div>
            ) : (
              filteredEnquiries.map((enq) => {
                const isSelected = selectedEnquiry?.id === enq.id;
                const isUnread = enq.status === 'unread';

                return (
                  <div
                    key={enq.id}
                    onClick={() => setSelectedEnquiry(enq)}
                    className={`bg-white border rounded-2xl p-5 shadow-xs transition-all cursor-pointer relative ${
                      isSelected
                        ? 'border-[#172033] ring-2 ring-[#172033]/10'
                        : isUnread
                        ? 'border-purple-200 bg-purple-50/20 hover:border-purple-300'
                        : 'border-[#E8E8EC] hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h4 className="text-sm font-bold text-[#172033] truncate">
                            {enq.name}
                          </h4>
                          {isUnread ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#67238A] text-white">
                              NEW
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-[#667085]">
                              READ
                            </span>
                          )}
                        </div>

                        {/* Contact details */}
                        <div className="flex items-center gap-4 text-xs text-[#667085] flex-wrap">
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-[#172033]" />
                            <a
                              href={`tel:${enq.phone.replace(/\s+/g, '')}`}
                              onClick={(e) => e.stopPropagation()}
                              className="font-medium hover:underline text-[#172033]"
                            >
                              {enq.phone}
                            </a>
                          </div>
                          {enq.email && (
                            <div className="flex items-center gap-1.5">
                              <Mail className="w-3.5 h-3.5 text-[#172033]" />
                              <a
                                href={`mailto:${enq.email}`}
                                onClick={(e) => e.stopPropagation()}
                                className="hover:underline text-[#172033]"
                              >
                                {enq.email}
                              </a>
                            </div>
                          )}
                        </div>

                        {/* Message Preview */}
                        {enq.message && (
                          <p className="text-xs text-[#475467] line-clamp-2 pt-1 font-normal">
                            {enq.message}
                          </p>
                        )}
                      </div>

                      {/* Right Meta / Actions */}
                      <div className="flex flex-col items-end gap-3 shrink-0">
                        <div className="flex items-center gap-1 text-[11px] text-[#667085]">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(enq.created_at)}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => handleToggleStatus(enq.id, e)}
                            title={isUnread ? 'Mark as Read' : 'Mark as Unread'}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#172033] transition-colors"
                          >
                            <CheckCircle2 className={`w-3.5 h-3.5 ${isUnread ? 'text-slate-400' : 'text-emerald-600'}`} />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleDelete(enq.id, e)}
                            title="Delete enquiry"
                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: Selected Enquiry Detail View (When active) */}
          {selectedEnquiry && (
            <div className="lg:col-span-5 bg-white border border-[#E8E8EC] rounded-2xl p-6 sm:p-7 shadow-sm sticky top-28 space-y-6">
              <div className="flex items-start justify-between pb-4 border-b border-[#F0F1F3]">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        selectedEnquiry.status === 'unread'
                          ? 'bg-[#67238A] text-white'
                          : 'bg-slate-100 text-[#667085]'
                      }`}
                    >
                      {selectedEnquiry.status === 'unread' ? 'UNREAD ENQUIRY' : 'READ'}
                    </span>
                    <span className="text-xs text-[#667085]">
                      {formatDate(selectedEnquiry.created_at)}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#172033]">
                    {selectedEnquiry.name}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedEnquiry(null)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-bold px-2 py-1"
                >
                  ✕
                </button>
              </div>

              {/* Direct Actions */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`tel:${selectedEnquiry.phone.replace(/\s+/g, '')}`}
                  className="inline-flex items-center justify-center gap-2 bg-[#172033] hover:bg-black text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {selectedEnquiry.phone}</span>
                </a>

                {selectedEnquiry.email ? (
                  <a
                    href={`mailto:${selectedEnquiry.email}`}
                    className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-[#172033] text-xs font-bold py-2.5 px-4 rounded-xl transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Send Email</span>
                  </a>
                ) : (
                  <div className="inline-flex items-center justify-center text-xs text-slate-400 bg-slate-50 rounded-xl py-2.5">
                    No Email Provided
                  </div>
                )}
              </div>

              {/* Message Details */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#172033] block">
                  Enquiry Message
                </label>
                <div className="bg-[#FAFAFC] border border-[#E8E8EC] rounded-xl p-4 text-xs sm:text-sm text-[#172033] leading-relaxed whitespace-pre-wrap">
                  {selectedEnquiry.message || 'No specific message entered with this submission.'}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-[#F0F1F3] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleToggleStatus(selectedEnquiry.id)}
                  className="text-xs font-semibold text-[#172033] hover:underline cursor-pointer"
                >
                  {selectedEnquiry.status === 'unread' ? 'Mark as Read' : 'Mark as Unread'}
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(selectedEnquiry.id)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Enquiry</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
