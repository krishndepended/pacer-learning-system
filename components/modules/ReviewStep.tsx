import React from 'react';
import { Check, Zap } from 'lucide-react';
import { PacerSession } from '../../types';

interface ReviewStepProps {
  session: PacerSession;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({ session }) => {
  const commonContainerClass = "animate-in fade-in slide-in-from-bottom-4 duration-500";

  return (
    <div className={`text-center py-8 ${commonContainerClass}`}>
      <div className="w-24 h-24 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-6">
        <Check size={48} strokeWidth={3} />
      </div>
      <h2 className="text-3xl font-normal text-gray-900 mb-2">You're all set!</h2>
      <p className="text-gray-500 mb-10">
        Session for "{session.topic}" is ready to be committed to your archive.
      </p>

      {/* Stats Grid */}
      <div className="bg-m3-surface-container-high rounded-3xl p-6 max-w-lg mx-auto text-left grid grid-cols-2 gap-y-6 gap-x-4 mb-8">
        <div>
          <span className="text-gray-400 text-xs uppercase tracking-wider block mb-1">Procedural</span>
          <div className="font-medium text-xl text-m3-p">{session.procedural.steps.length} Steps</div>
        </div>
        <div>
          <span className="text-gray-400 text-xs uppercase tracking-wider block mb-1">Analogous</span>
          <div className="font-medium text-xl text-m3-a">{session.analogous.conceptA ? 'Defined' : 'Empty'}</div>
        </div>
        <div>
          <span className="text-gray-400 text-xs uppercase tracking-wider block mb-1">Flashcards</span>
          <div className="font-medium text-xl text-gray-800">
            {session.evidence.length + session.reference.length} Cards
          </div>
        </div>
        <div>
          <span className="text-gray-400 text-xs uppercase tracking-wider block mb-1">Focus Zone</span>
          <div className="font-medium text-xl text-yellow-600">
            {session.distractions.length} Trapped
          </div>
        </div>
      </div>

      {/* Distractions Cleared Section */}
      {session.distractions.length > 0 && (
        <div className="max-w-lg mx-auto text-left border-t border-gray-200 pt-8">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={16} className="text-yellow-500" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">Distractions Cleared</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {session.distractions.map((d, i) => (
              <span 
                key={i} 
                className="inline-flex items-center px-3 py-1.5 rounded-lg bg-yellow-50 text-yellow-800 text-sm font-medium border border-yellow-100"
              >
                <span className="mr-2 text-yellow-400 line-through decoration-yellow-400/50 select-none">
                   {d}
                </span>
                <Check size={12} className="text-yellow-600 ml-1" />
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center">
            You successfully offloaded these thoughts to stay in flow.
          </p>
        </div>
      )}
    </div>
  );
};