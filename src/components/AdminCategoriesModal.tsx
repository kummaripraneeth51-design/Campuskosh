import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Plus, Trash2, Settings, Sparkles, AlertCircle } from 'lucide-react';
import { CategoryIcon } from './CategoryIcon';

interface AdminCategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminCategoriesModal: React.FC<AdminCategoriesModalProps> = ({ isOpen, onClose }) => {
  const { categories, addCategory, deleteCategory, currentUser } = useApp();
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('Sparkles');

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    addCategory({
      name: newCatName.trim(),
      description: newCatDesc.trim() || 'Custom campus item category',
      iconName: newCatIcon,
    });

    setNewCatName('');
    setNewCatDesc('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-700" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Manage Item Categories</h3>
              <p className="text-[11px] text-slate-500">Administrator & campus authority controls</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-5 space-y-4">
          {/* Add Category Form */}
          <form onSubmit={handleAdd} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
            <span className="text-xs font-bold text-slate-800 block">Add New Campus Category</span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <input
                type="text"
                required
                placeholder="Category Name"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="p-2 bg-white border border-slate-300 rounded-lg"
              />
              <select
                value={newCatIcon}
                onChange={(e) => setNewCatIcon(e.target.value)}
                className="p-2 bg-white border border-slate-300 rounded-lg"
              >
                <option value="BookOpen">Books</option>
                <option value="Compass">Tools</option>
                <option value="Calculator">Calculators</option>
                <option value="Laptop">Electronics</option>
                <option value="FlaskConical">Lab Gear</option>
                <option value="Trophy">Sports</option>
                <option value="Bike">Bicycles</option>
                <option value="Sparkles">Sparkles / Other</option>
              </select>
            </div>
            <input
              type="text"
              placeholder="Short Description"
              value={newCatDesc}
              onChange={(e) => setNewCatDesc(e.target.value)}
              className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
            />
            <button
              type="submit"
              className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Category</span>
            </button>
          </form>

          {/* Current Categories List */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-700 block">
              Active Categories ({categories.length})
            </span>
            <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-xl">
              {categories.map((c) => (
                <div key={c.id} className="p-2.5 flex items-center justify-between text-xs hover:bg-slate-50">
                  <div className="flex items-center gap-2.5">
                    <CategoryIcon name={c.name} className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div className="font-semibold text-slate-800">{c.name}</div>
                      <div className="text-[10px] text-slate-400">{c.description}</div>
                    </div>
                  </div>
                  {categories.length > 5 && (
                    <button
                      onClick={() => deleteCategory(c.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                      title="Delete category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
