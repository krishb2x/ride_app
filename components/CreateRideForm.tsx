
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
    ride_name: 'Sunday Morning Run',
    description: 'Join us for a leisure ride to the hills.',
    itinerary: '07:00 AM: Start\n08:30 AM: Breakfast',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    meeting_point: 'Main Store',
    breakfast_point: 'Food Point',
    total_distance: '50 km',
    assembling_time: '06:45 AM',
    briefing_time: '06:55 AM',
    departure_time: '07:00 AM',
    reg_fee: 0,
    gears_mandatory: true,
    admin_contact: '',
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
    <div className="flex flex-col h-full bg-black overflow-y-auto pb-10 relative">
      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 z-[5000] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in zoom-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] w-full max-w-sm shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-[#ff6600]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#ff6600]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black italic tracking-tighter uppercase">Confirm Ride</h3>
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Ready to share this ride?</p>
            </div>

            <div className="bg-black rounded-2xl p-5 border border-zinc-800 space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-zinc-600 text-[9px] font-black uppercase">Title</span>
                <span className="text-white text-xs font-black text-right max-w-[150px] truncate">{formData.ride_name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-600 text-[9px] font-black uppercase">Date</span>
                <span className="text-white text-xs font-black">{formData.date}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <Button size="full" variant="accent" onClick={handleConfirmPublish} className="italic py-5">
                POST RIDE
              </Button>
              <Button variant="secondary" size="full" onClick={() => setShowConfirmation(false)} className="text-xs uppercase tracking-widest py-4">
                Edit Again
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="p-6 border-b border-zinc-900 sticky top-0 bg-black z-10 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black italic tracking-tighter uppercase">CREATE RIDE</h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Set your route and info</p>
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
              className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 font-black text-xs transition-all ${formData.visibility === 'public' ? 'bg-[#ff6600] text-white shadow-lg shadow-[#ff6600]/20' : 'text-zinc-500 hover:bg-zinc-800'}`}
            >
              PUBLIC
            </button>
            <button 
              onClick={() => handleChange('visibility', 'private')}
              className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 font-black text-xs transition-all ${formData.visibility === 'private' ? 'bg-zinc-100 text-zinc-950 shadow-lg' : 'text-zinc-500 hover:bg-zinc-800'}`}
            >
              PRIVATE
            </button>
          </div>

          <label className="block">
            <span className="text-zinc-500 text-[9px] font-black uppercase mb-1 block ml-1">Ride Title</span>
            <input 
              className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-white font-bold focus:border-[#ff6600] outline-none transition-all"
              value={formData.ride_name}
              onChange={e => handleChange('ride_name', e.target.value)}
              placeholder="e.g. Sunday Morning Ride"
            />
          </label>

          <label className="block">
            <span className="text-zinc-500 text-[9px] font-black uppercase mb-1 block ml-1">Ride Description</span>
            <textarea 
              className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-white font-bold min-h-[120px] resize-none focus:border-[#ff6600] outline-none transition-colors"
              value={formData.description}
              onChange={e => handleChange('description', e.target.value)}
              placeholder="Add some details..."
            />
          </label>

          <label className="block">
            <span className="text-zinc-500 text-[9px] font-black uppercase mb-1 block ml-1">Meeting Point</span>
            <input 
              className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-white font-bold focus:border-[#ff6600] outline-none transition-all"
              value={formData.meeting_point}
              onChange={e => handleChange('meeting_point', e.target.value)}
              placeholder="Where to meet?"
            />
          </label>

          <label className="block">
            <span className="text-zinc-500 text-[9px] font-black uppercase mb-1 block ml-1">Breakfast Point</span>
            <input 
              className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-white font-bold focus:border-[#ff6600] outline-none transition-all"
              value={formData.breakfast_point}
              onChange={e => handleChange('breakfast_point', e.target.value)}
              placeholder="Food stop?"
            />
          </label>

          <label className="block">
            <span className="text-zinc-500 text-[9px] font-black uppercase mb-1 block ml-1">Itinerary / Rules</span>
            <textarea 
              className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-white font-bold min-h-[100px] resize-none focus:border-[#ff6600] outline-none transition-colors"
              value={formData.itinerary}
              onChange={e => handleChange('itinerary', e.target.value)}
              placeholder="Full briefing here..."
            />
          </label>

          <label className="block">
            <span className="text-zinc-500 text-[9px] font-black uppercase mb-1 block ml-1">Registration Fee (₹)</span>
            <input 
              type="number"
              className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-white font-bold focus:border-[#ff6600] outline-none transition-all"
              value={formData.reg_fee}
              onChange={e => handleChange('reg_fee', parseInt(e.target.value) || 0)}
              placeholder="0 for Free"
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-zinc-500 text-[9px] font-black uppercase mb-1 block ml-1">Date</span>
              <input 
                type="date"
                className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-white font-bold focus:border-[#ff6600] outline-none"
                value={formData.date}
                onChange={e => handleChange('date', e.target.value)}
              />
            </label>
            <label className="block">
              <span className="text-zinc-500 text-[9px] font-black uppercase mb-1 block ml-1">Visibility Range (KM)</span>
              <select 
                className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-white font-bold focus:border-[#ff6600] outline-none appearance-none"
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
          <h3 className="text-[10px] font-black text-[#ff6600] uppercase tracking-[0.3em] mb-4">Timings</h3>
          <div className="grid grid-cols-3 gap-2">
            <label className="block">
              <span className="text-zinc-500 text-[8px] font-black uppercase mb-1 block">Assemble</span>
              <input 
                className="w-full bg-black border border-zinc-800 p-3 rounded-lg text-white font-bold text-xs"
                value={formData.assembling_time}
                onChange={e => handleChange('assembling_time', e.target.value)}
              />
            </label>
            <label className="block">
              <span className="text-zinc-500 text-[8px] font-black uppercase mb-1 block">Briefing</span>
              <input 
                className="w-full bg-black border border-zinc-800 p-3 rounded-lg text-white font-bold text-xs"
                value={formData.briefing_time}
                onChange={e => handleChange('briefing_time', e.target.value)}
              />
            </label>
            <label className="block">
              <span className="text-zinc-500 text-[8px] font-black uppercase mb-1 block">Start</span>
              <input 
                className="w-full bg-black border border-zinc-800 p-3 rounded-lg text-white font-bold text-xs"
                value={formData.departure_time}
                onChange={e => handleChange('departure_time', e.target.value)}
              />
            </label>
          </div>
        </section>

        <Button size="full" variant="accent" className="shadow-[#ff6600]/30 py-5 italic tracking-tighter text-xl !rounded-[2rem]" onClick={handlePublishClick}>
          POST RIDE
        </Button>
      </div>
    </div>
  );
};

export default CreateRideForm;
