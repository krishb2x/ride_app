
import React, { useState } from 'react';
import { Ride } from '../types';
import Button from './Button';

interface CreateRideFormProps {
  onSave: (details: Partial<Ride>) => void;
  onCancel: () => void;
}

const CreateRideForm: React.FC<CreateRideFormProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Ride>>({
    ride_name: 'SUNDAY RIDE.. Maa Chandrika Devi Temple 🛕',
    description: '',
    date: '2026-02-22',
    meeting_point: 'Royal Enfield Company Store Lucknow',
    breakfast_point: 'Fauji Dhaba .🍱',
    total_distance: '56 km',
    assembling_time: '06:45 AM',
    briefing_time: '06:55 AM',
    departure_time: '07:00 AM',
    reg_fee: 100,
    gears_mandatory: true,
    admin_contact: 'Chaitanya Pratap Singh',
  });

  const handleChange = (field: keyof Ride, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 overflow-y-auto pb-10">
      <div className="p-6 border-b border-zinc-900 sticky top-0 bg-zinc-950 z-10 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black">Plan Your Ride</h2>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">WhatsApp Format Support</p>
        </div>
        <button onClick={onCancel} className="p-2 bg-zinc-900 rounded-full text-zinc-500">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="p-6 space-y-6">
        <section className="space-y-4">
          <label className="block">
            <span className="text-zinc-500 text-[10px] font-black uppercase mb-1 block">Ride Title</span>
            <input 
              className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-white font-bold"
              value={formData.ride_name}
              onChange={e => handleChange('ride_name', e.target.value)}
              placeholder="e.g. Sunday Morning Rip"
            />
          </label>

          <label className="block">
            <span className="text-zinc-500 text-[10px] font-black uppercase mb-1 block">Ride Description</span>
            <textarea 
              className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-white font-bold min-h-[120px] resize-none focus:border-orange-500 outline-none transition-colors"
              value={formData.description}
              onChange={e => handleChange('description', e.target.value)}
              placeholder="Add more detailed information, rules, or the full itinerary here (multi-line supported)..."
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-zinc-500 text-[10px] font-black uppercase mb-1 block">Date</span>
              <input 
                type="date"
                className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-white font-bold"
                value={formData.date}
                onChange={e => handleChange('date', e.target.value)}
              />
            </label>
            <label className="block">
              <span className="text-zinc-500 text-[10px] font-black uppercase mb-1 block">Fee (₹)</span>
              <input 
                type="number"
                className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-white font-bold"
                value={formData.reg_fee}
                onChange={e => handleChange('reg_fee', parseInt(e.target.value))}
              />
            </label>
          </div>
        </section>

        <section className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800 space-y-4">
          <h3 className="text-xs font-black text-orange-500 uppercase tracking-widest">Logistics</h3>
          
          <label className="block">
            <span className="text-zinc-500 text-[10px] font-black uppercase mb-1 block">Assembling Point</span>
            <input 
              className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-white font-bold text-sm"
              value={formData.meeting_point}
              onChange={e => handleChange('meeting_point', e.target.value)}
            />
          </label>

          <label className="block">
            <span className="text-zinc-500 text-[10px] font-black uppercase mb-1 block">Breakfast Point</span>
            <input 
              className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-white font-bold text-sm"
              value={formData.breakfast_point}
              onChange={e => handleChange('breakfast_point', e.target.value)}
            />
          </label>

          <div className="grid grid-cols-3 gap-2">
            <label className="block">
              <span className="text-zinc-500 text-[8px] font-black uppercase mb-1 block">Assemble</span>
              <input 
                className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded-lg text-white font-bold text-xs"
                value={formData.assembling_time}
                onChange={e => handleChange('assembling_time', e.target.value)}
              />
            </label>
            <label className="block">
              <span className="text-zinc-500 text-[8px] font-black uppercase mb-1 block">Briefing</span>
              <input 
                className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded-lg text-white font-bold text-xs"
                value={formData.briefing_time}
                onChange={e => handleChange('briefing_time', e.target.value)}
              />
            </label>
            <label className="block">
              <span className="text-zinc-500 text-[8px] font-black uppercase mb-1 block">Departure</span>
              <input 
                className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded-lg text-white font-bold text-xs"
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
              <p className="text-[10px] text-zinc-500 uppercase">HELMET, BOOTS, JACKET</p>
            </div>
            <input 
              type="checkbox" 
              className="w-6 h-6 accent-orange-500"
              checked={formData.gears_mandatory}
              onChange={e => handleChange('gears_mandatory', e.target.checked)}
            />
          </div>

          <label className="block">
            <span className="text-zinc-500 text-[10px] font-black uppercase mb-1 block">Admin Name / Contact</span>
            <input 
              className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-white font-bold"
              value={formData.admin_contact}
              onChange={e => handleChange('admin_contact', e.target.value)}
            />
          </label>
        </section>

        <Button size="full" className="shadow-orange-500/30 py-5" onClick={() => onSave(formData)}>
          START RIDE & GENERATE INVITE
        </Button>
      </div>
    </div>
  );
};

export default CreateRideForm;
