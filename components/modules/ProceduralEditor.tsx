import React, { useRef } from 'react';
import { Plus, Trash2, Check, GripVertical } from 'lucide-react';
import { ProceduralContent, ProceduralItem } from '../../types';
import { generateId } from '../../services/storageService';
import { Button } from '../ui/Button';

interface ProceduralEditorProps {
  content: ProceduralContent;
  onChange: (newContent: ProceduralContent) => void;
}

export const ProceduralEditor: React.FC<ProceduralEditorProps> = ({ content, onChange }) => {
  // We use a ref to focus the new input when added via Enter key
  const lastAddedId = useRef<string | null>(null);

  const updateStep = (id: string, updates: Partial<ProceduralItem>) => {
    const newSteps = content.steps.map(step => 
      step.id === id ? { ...step, ...updates } : step
    );
    onChange({ ...content, steps: newSteps });
  };

  const addStep = (afterIndex: number = -1) => {
    const newStep: ProceduralItem = { id: generateId(), text: '', completed: false };
    const newSteps = [...content.steps];
    
    if (afterIndex === -1) {
      newSteps.push(newStep);
    } else {
      newSteps.splice(afterIndex + 1, 0, newStep);
    }
    
    onChange({ ...content, steps: newSteps });
  };

  const removeStep = (id: string) => {
    onChange({ ...content, steps: content.steps.filter(s => s.id !== id) });
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addStep(index);
    } else if (e.key === 'Backspace' && content.steps[index].text === '' && content.steps.length > 1) {
      e.preventDefault();
      removeStep(content.steps[index].id);
    }
  };

  return (
    <div className="space-y-4 max-w-3xl">
      {content.steps.length === 0 ? (
         <div className="bg-m3-surface-container-high rounded-3xl p-8 border border-dashed border-gray-300 text-center mb-6">
            <div className="w-16 h-16 bg-blue-50 text-m3-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={32} />
            </div>
            <h3 className="text-gray-900 font-bold mb-2">No steps defined yet</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Create a checklist for this procedure. Break down the "How-to" into actionable steps.
            </p>
            <Button onClick={() => addStep()} variant="filled" icon={<Plus size={18} />}>
               Start Checklist
            </Button>
         </div>
      ) : (
        <div className="space-y-2">
          {content.steps.map((step, index) => (
            <div 
              key={step.id} 
              className={`group flex items-center gap-3 p-3 rounded-xl border transition-all duration-200
                ${step.completed 
                  ? 'bg-gray-50 border-transparent' 
                  : 'bg-white border-gray-200 shadow-sm hover:shadow-md hover:border-blue-200'}
              `}
            >
              {/* Checkbox / Index */}
              <button
                onClick={() => updateStep(step.id, { completed: !step.completed })}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all flex-shrink-0 border
                  ${step.completed 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-400 hover:border-blue-400'}
                `}
              >
                {step.completed ? <Check size={18} strokeWidth={3} /> : <span className="text-xs font-bold">{index + 1}</span>}
              </button>

              {/* Text Input */}
              <input
                type="text"
                value={step.text}
                onChange={(e) => updateStep(step.id, { text: e.target.value })}
                onKeyDown={(e) => handleKeyDown(e, index)}
                autoFocus={index === content.steps.length - 1 && !step.text} // Auto-focus if it's a fresh step at end
                placeholder={`Step ${index + 1}...`}
                className={`flex-1 bg-transparent outline-none text-base
                  ${step.completed 
                    ? 'text-gray-400 line-through' 
                    : 'text-gray-900 font-medium'}
                `}
              />

              {/* Delete Action */}
              <button 
                onClick={() => removeStep(step.id)}
                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                title="Delete Step"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}

          <div className="pt-2">
            <Button onClick={() => addStep()} variant="text" icon={<Plus size={18} />} className="text-gray-500 hover:text-blue-600">
              Add Step
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};