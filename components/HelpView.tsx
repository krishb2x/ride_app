
import React from 'react';
import Button from './Button';

interface HelpViewProps {
  isEmbedded?: boolean;
}

const HelpView: React.FC<HelpViewProps> = ({ isEmbedded = false }) => {
  return (
    <div className={`flex flex-col h-full bg-zinc-950 ${isEmbedded ? 'p-0' : 'p-6'} overflow-y-auto`}>
      {!isEmbedded && (
        <>
          <h2 className="text-3xl font-black mb-1">Help</h2>
          <p className="text-zinc-500 text-sm mb-8">Need a hand on the road?</p>
        </>
      )}
      
      {isEmbedded && (
        <h3 className="text-xl font-black mb-4">Support & Help</h3>
      )}

      <div className="space-y-4">
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] flex items-center gap-6 group hover:border-orange-500/50 transition-colors cursor-pointer">
          <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center group-hover:bg-orange-500/10 transition-colors">
            <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          </div>
          <div>
            <h4 className="font-black text-lg">Knowledge Base</h4>
            <p className="text-zinc-500 text-xs">Articles, tips, and rider guides</p>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] flex items-center gap-6 group hover:border-orange-500/50 transition-colors cursor-pointer">
          <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center group-hover:bg-orange-500/10 transition-colors">
            <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <h4 className="font-black text-lg">Tutorials</h4>
            <p className="text-zinc-500 text-xs">Learn how to track and share</p>
          </div>
        </div>

        <div className={`${isEmbedded ? 'pt-6' : 'pt-10'} text-center`}>
           <p className="text-zinc-600 text-sm font-bold mb-6">Still haven't found what you're looking for?</p>
           <Button variant="outline" size="full" className="!rounded-2xl border-zinc-800 text-zinc-300">Submit a Request</Button>
           
           <div className="mt-8">
              <Button size="full" className="shadow-orange-500/40">Direct Support</Button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default HelpView;
