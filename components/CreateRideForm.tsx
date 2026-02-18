
import React, { useState } from 'react';
import { Ride } from '../types';
import Button from './Button';

interface CreateRideFormProps {
  onSave: (details: Partial<Ride>) => void;
  onCancel: () => void;
}

const CreateRideForm: React.FC<CreateRideFormProps> = ({ onSave, onCancel }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState<Partial<Ride>>({
    ride_name: 'SUNDAY RIDE.. Maa Chandrika Devi Temple 🛕',
    description: '',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Default to tomorrow
    meeting_point: 'Royal Enfield Company Store Lucknow',
    breakfast_point: 'Fauji Dhaba .🍱',
    total_distance: '56 km',
    assembling_time: '06:45 AM',
    briefing_time: '06:55 AM',
    departure_time: '07:00 AM',
    reg_fee: 100,
    gears_mandatory: true,
    admin_contact: 'Chaitanya Pratap Singh',
    static_map_url: '',
    visibility: 'public',
    radius_km: 5,
  });

  const handleChange = (field: keyof Ride, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePublishClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirmPublish = () => {
    const selectedDate = new Date(formData.date || '');
    const today = new Date();
    today.setHours(0,0,0,0);
    
    const status = selectedDate > today ? 'upcoming' : 'active';
    onSave({ ...formData, status });
    setShowConfirmation(false);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 overflow-y-auto pb-10 relative">
      {/* Confirmation Dialog Overlay */}
      {showConfirmation && (
        <div className="fixed inset-0 z-[5000] bg-zinc-950/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in zoom-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] w-full max-w-sm shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black italic tracking-tighter uppercase">Confirm Mission</h3>
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Double check your flight plan</p>
            </div>

            <div className="bg-zinc-950 rounded-2xl p-5 border border-zinc-800 space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-zinc-600 text-[9px] font-black uppercase">Title</span>
                <span className="text-white text-xs font-black text-right max-w-[150px] truncate">{formData.ride_name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-600 text-[9px] font-black uppercase">Date</span>
                <span className="text-white text-xs font-black">{formData.date}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-600 text-[9px] font-black uppercase">Access</span>
                <span className={`text-xs font-black uppercase ${formData.visibility === 'public' ? 'text-green-500' : 'text-orange-500'}`}>
                  {formData.visibility}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-600 text-[9px] font-black uppercase">Broadcast Radius</span>
                <span className="text-white text-xs font-black">{formData.radius_km} KM</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <Button size="full" onClick={handleConfirmPublish} className="italic py-5 shadow-orange-500/20">
                CONFIRM & DEPLOY
              </Button>
              <Button variant="secondary" size="full" onClick={() => setShowConfirmation(false)} className="text-xs uppercase tracking-widest py-4">
                Wait, let me edit
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="p-6 border-b border-zinc-900 sticky top-0 bg-zinc-950 z-10 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black italic tracking-tighter">PLAN YOUR MISSION</h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Setup Route & Access</p>
        </div>
        <button onClick={onCancel} className="p-2 bg-zinc-900 rounded-full text-zinc-500">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="p-6 space-y-8">
        <section className="space-y-4">
          <div className="bg-zinc-900/50 p-2 rounded-2xl flex gap-2 border border-zinc-800">
            <button 
              onClick={() => handleChange('visibility', 'public')}
              className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 font-black text-xs transition-all ${formData.visibility === 'public' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-zinc-500 hover:bg-zinc-800'}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21v-82M12 21v-8m0 0l-3-3m3 3l3-3M6.75 6.75C6.75 3.016 9.766 0 13.5 0s6.75 3.016 6.75 6.75v10.5c0 3.734-3.016 6.75-6.75 6.75S6.75 21 6.75 17.25V6.75z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              OPEN RIDE
            </button>
            <button 
              onClick={() => handleChange('visibility', 'private')}
              className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 font-black text-xs transition-all ${formData.visibility === 'private' ? 'bg-zinc-100 text-zinc-950 shadow-lg' : 'text-zinc-500 hover:bg-zinc-800'}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              PRIVATE
            </button>
          </div>
          {formData.visibility === 'private' && (
            <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest text-center px-4">
              * RIDERS MUST REQUEST ACCESS. ADMIN APPROVAL REQUIRED.
            </p>
          )}

          <label className="block">
            <span className="text-zinc-500 text-[9px] font-black uppercase mb-1 block ml-1">Ride Title</span>
            <input 
              className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-white font-bold focus:border-orange-500 outline-none transition-all"
              value={formData.ride_name}
              onChange={e => handleChange('ride_name', e.target.value)}
              placeholder="e.g. Sunday Morning Rip"
            />
          </label>

          <label className="block">
            <span className="text-zinc-500 text-[9px] font-black uppercase mb-1 block ml-1">Itinerary / Rules</span>
            <textarea 
              className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-white font-bold min-h-[100px] resize-none focus:border-orange-500 outline-none transition-colors"
              value={formData.description}
              onChange={e => handleChange('description', e.target.value)}
              placeholder="Full briefing here..."
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-zinc-500 text-[9px] font-black uppercase mb-1 block ml-1">Date</span>
              <input 
                type="date"
                className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-white font-bold focus:border-orange-500 outline-none"
                value={formData.date}
                onChange={e => handleChange('date', e.target.value)}
              />
            </label>
            <label className="block">
              <span className="text-zinc-500 text-[9px] font-black uppercase mb-1 block ml-1">Discovery Radius (KM)</span>
              <select 
                className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-white font-bold focus:border-orange-500 outline-none appearance-none"
                value={formData.radius_km}
                onChange={e => handleChange('radius_km', parseInt(e.target.value))}
              >
                <option value={3}>3 KM</option>
                <option value={5}>5 KM</option>
                <option value={10}>10 KM</option>
                <option value={20}>20 KM</option>
              </select>
            </label>
          </div>
        </section>

        <section className="bg-zinc-900/50 p-6 rounded-[2rem] border border-zinc-800 space-y-4">
          <h3 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em] mb-4">Logistics</h3>
          
          <label className="block">
            <span className="text-zinc-500 text-[9px] font-black uppercase mb-1 block ml-1">Assembling Point</span>
            <input 
              className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-white font-bold text-sm"
              value={formData.meeting_point}
              onChange={e => handleChange('meeting_point', e.target.value)}
            />
          </label>

          <label className="block">
            <span className="text-zinc-500 text-[9px] font-black uppercase mb-1 block ml-1">Static Map URL</span>
            <input 
              className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-white font-bold text-sm focus:border-orange-500 outline-none transition-colors"
              value={formData.static_map_url}
              onChange={e => handleChange('static_map_url', e.target.value)}
              placeholder="Route visualizer URL..."
            />
          </label>

          <div className="grid grid-cols-3 gap-2">
            <label className="block">
              <span className="text-zinc-500 text-[8px] font-black uppercase mb-1 block">Assemble</span>
              <input 
                className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-white font-bold text-xs"
                value={formData.assembling_time}
                onChange={e => handleChange('assembling_time', e.target.value)}
              />
            </label>
            <label className="block">
              <span className="text-zinc-500 text-[8px] font-black uppercase mb-1 block">Briefing</span>
              <input 
                className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-white font-bold text-xs"
                value={formData.briefing_time}
                onChange={e => handleChange('briefing_time', e.target.value)}
              />
            </label>
            <label className="block">
              <span className="text-zinc-500 text-[8px] font-black uppercase mb-1 block">Departure</span>
              <input 
                className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-white font-bold text-xs"
                value={formData.departure_time}
                onChange={e => handleChange('departure_time', e.target.value)}
              />
            </label>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-zinc-900 rounded-2xl border border-zinc-800">
            <div>
              <p className="font-black text-sm">Gears Mandatory</p>
              <p className="text-[9px] text-zinc-500 uppercase tracking-widest">Safety Protocol required</p>
            </div>
            <input 
              type="checkbox" 
              className="w-6 h-6 accent-orange-500 rounded-md"
              checked={formData.gears_mandatory}
              onChange={e => handleChange('gears_mandatory', e.target.checked)}
            />
          </div>

          <label className="block">
            <span className="text-zinc-500 text-[9px] font-black uppercase mb-1 block ml-1">
              Admin Name
            </span>
            <input 
              className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-white font-bold focus:border-orange-500 outline-none transition-colors"
              value={formData.admin_contact}
              onChange={e => handleChange('admin_contact', e.target.value)}
              placeholder="Admin Name / Contact"
            />
          </label>
        </section>

        <Button size="full" className="shadow-orange-500/30 py-5 italic tracking-tighter text-xl !rounded-[2rem]" onClick={handlePublishClick}>
          PUBLISH MISSION
        </Button>
      </div>
    </div>
  );
};

export default CreateRideForm;
