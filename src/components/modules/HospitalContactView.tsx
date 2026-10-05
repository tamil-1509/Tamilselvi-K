import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import {
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  Send,
  AlertTriangle,
  CheckCircle2,
  Building,
} from 'lucide-react';

export const HospitalContactView: React.FC = () => {
  const { addNotification, currentUser } = useHospital();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [senderName, setSenderName] = useState(currentUser?.name || '');
  const [senderEmail, setSenderEmail] = useState(currentUser?.email || '');
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    addNotification({
      targetRole: 'receptionist',
      title: `Patient Inquiry: ${subject || 'General Request'}`,
      message: `${senderName} (${senderEmail}) wrote: "${message}"`,
      type: 'system',
    });

    setSentSuccess(true);
    setMessage('');
    setSubject('');
    setTimeout(() => setSentSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Hospital Contact & Emergency Services</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          24/7 Trauma triage, ambulance dispatch, clinical appointment lines, and patient support
        </p>
      </div>

      {/* Emergency Hotline Banner */}
      <div className="p-5 bg-gradient-to-r from-rose-900 to-rose-700 text-white rounded-xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-300" />
            <h2 className="text-base font-bold uppercase tracking-wider">24/7 Emergency & Trauma Hotline</h2>
          </div>
          <p className="text-xs text-rose-100">
            For critical cardiovascular, neurological, or trauma incidents, call immediately or arrive at Ambulance Station 4.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/10 px-4 py-2.5 rounded-lg border border-white/20">
          <PhoneCall className="w-5 h-5 text-rose-200 animate-pulse" />
          <span className="font-mono text-xl font-black tracking-tight">+1 (555) 911-CARE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Directory Cards */}
        <div className="space-y-4">
          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-3 text-xs">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Building className="w-4 h-4 text-teal-600" />
              PulseCare Main Campus
            </h3>

            <div className="space-y-2 text-slate-600">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <p>1200 Healthcare Boulevard, Suite 100<br />Metro City, MC 94016</p>
              </div>

              <div className="flex items-center gap-2.5">
                <PhoneCall className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-mono">+1 (555) 234-CARE (General Line)</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span>support@pulsecare.com</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Emergency: 24/7 · Outpatient: 08:00 - 18:00</span>
              </div>
            </div>
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs text-xs space-y-2.5">
            <h4 className="font-bold text-slate-900">Direct Department Phone Extensions</h4>
            <div className="divide-y divide-slate-100">
              <div className="py-1.5 flex justify-between">
                <span className="text-slate-600">Cardiology Clinic</span>
                <span className="font-mono text-slate-900 font-semibold">Ext. 3021</span>
              </div>
              <div className="py-1.5 flex justify-between">
                <span className="text-slate-600">Neurology & Stroke Unit</span>
                <span className="font-mono text-slate-900 font-semibold">Ext. 4015</span>
              </div>
              <div className="py-1.5 flex justify-between">
                <span className="text-slate-600">Orthopedics & Fracture</span>
                <span className="font-mono text-slate-900 font-semibold">Ext. 2104</span>
              </div>
              <div className="py-1.5 flex justify-between">
                <span className="text-slate-600">Pediatric Care NICU</span>
                <span className="font-mono text-slate-900 font-semibold">Ext. 3110</span>
              </div>
              <div className="py-1.5 flex justify-between">
                <span className="text-slate-600">Central Diagnostic Lab</span>
                <span className="font-mono text-slate-900 font-semibold">Ext. 1088</span>
              </div>
              <div className="py-1.5 flex justify-between">
                <span className="text-slate-600">Inpatient Pharmacy</span>
                <span className="font-mono text-slate-900 font-semibold">Ext. 1042</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 p-6 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <h3 className="font-bold text-slate-900 text-sm mb-1">Send a Message to Patient Services</h3>
          <p className="text-xs text-slate-500 mb-4">
            Inquiries are routed directly to the duty receptionist desk and clinical coordination team.
          </p>

          {sentSuccess && (
            <div className="p-3 mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Your message has been transmitted to hospital reception. A duty coordinator will follow up shortly.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Your Full Name</label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Your Email Address</label>
                <input
                  type="email"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Subject of Inquiry</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Appointment rescheduling / Medical records request"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Message Body</label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please provide details about your medical request, appointment inquiry, or billing question..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-lg shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              Transmit Inquiry to Reception
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
