import { useEffect, useRef, useState } from 'react';
import { ChevronDown, ImagePlus, X } from 'lucide-react';
import { useMenuManagement } from './context/MenuManagementContext';

export default function AddItemDrawer() {
  const {
    categories,
    drawerOpen,
    drawerMode,
    drawerForm,
    drawerEditingItemId,
    closeDrawer,
    updateDrawerField,
    saveDrawerItem,
  } = useMenuManagement();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (!drawerOpen) {
      setLocalError('');
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    }
  }, [drawerOpen]);

  useEffect(() => {
    setLocalError('');
  }, [drawerMode, drawerEditingItemId]);

  if (!drawerOpen) {
    return null;
  }

  const parsedPrice = Number.parseFloat(drawerForm.price);
  const isFormValid = Boolean(
    drawerForm.name.trim() &&
    drawerForm.categoryId &&
    !Number.isNaN(parsedPrice) &&
    parsedPrice >= 0
  );

  const handleClose = () => {
    setLocalError('');
    closeDrawer();
  };

  const handleSave = () => {
    const success = saveDrawerItem();
    if (!success) {
      setLocalError('Please complete item name, category, and price.');
    }
  };

  const handleFileSelect = (file: File | null) => {
    if (!file) {
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setLocalError('Image size must be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setLocalError('Please select a valid image file');
      return;
    }

    setLocalError('');

    // Read file as base64 data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      
      // Revoke old object URL if exists
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
      
      // Store the data URL for display
      updateDrawerField('image', dataUrl);
    };
    reader.onerror = () => {
      setLocalError('Failed to read image file');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="absolute inset-0 bg-[#0c1424]/30 backdrop-blur-sm animate-in fade-in duration-300" onClick={handleClose} />

      <div className="relative w-full max-w-[560px] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden">
        <div className="p-8 pb-4 flex items-start justify-between border-b border-slate-50">
          <div>
            <h2 className="text-[28px] font-black text-[#0c1424] leading-tight">
              {drawerMode === 'edit' ? 'Edit Item' : 'Add New Item'}
            </h2>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="text-[13px] text-slate-500 font-medium tracking-tight">Category:</span>
              <span className="text-[13px] text-blue-500 font-black tracking-tight">
                {categories.find((category) => category.id === drawerForm.categoryId)?.name || 'Select category'}
              </span>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="h-10 w-10 flex items-center justify-center text-slate-400 hover:text-[#0c1424] transition-all hover:bg-slate-50 rounded-xl"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 pt-6 space-y-8">
          {localError ? (
            <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
              {localError}
            </div>
          ) : null}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Item Name</label>
            <input
              type="text"
              value={drawerForm.name}
              onChange={(event) => updateDrawerField('name', event.target.value)}
              placeholder="e.g., Crispy Skin Duck"
              className="w-full h-12 bg-blue-50/50 border border-transparent rounded-xl px-4 text-[14px] font-bold text-[#0c1424] focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/20 transition-all placeholder:font-medium"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Item Image</label>
            <div className="flex items-center gap-3 rounded-xl bg-blue-50/50 border border-transparent px-4 py-3">
              <input
                type="text"
                value={drawerForm.image}
                onChange={(event) => updateDrawerField('image', event.target.value)}
                placeholder="Paste image URL or upload a file"
                className="flex-1 bg-transparent text-[14px] font-bold text-[#0c1424] focus:outline-none placeholder:font-medium"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => handleFileSelect(event.target.files?.[0] || null)}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-[11px] font-black uppercase tracking-widest text-[#0c1424] shadow-sm"
              >
                <ImagePlus size={14} />
                Upload
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Price (AUD)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0c1424] font-black text-[14px]">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={drawerForm.price}
                  onChange={(event) => updateDrawerField('price', event.target.value)}
                  className="w-full h-12 bg-blue-50/50 border border-transparent rounded-xl pl-8 pr-4 text-[14px] font-black text-[#0c1424] focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Category</label>
              <div className="relative">
                <select
                  value={drawerForm.categoryId}
                  onChange={(event) => updateDrawerField('categoryId', event.target.value)}
                  className="w-full h-12 appearance-none bg-blue-50/50 border border-transparent rounded-xl px-4 text-[14px] font-black text-[#0c1424] focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Description</label>
            <textarea
              value={drawerForm.description}
              onChange={(event) => updateDrawerField('description', event.target.value)}
              placeholder="Brief description of the dish..."
              className="w-full h-32 bg-blue-50/50 border border-transparent rounded-xl p-4 text-[14px] font-bold text-[#0c1424] focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:font-medium resize-none"
            />
            <div className="flex justify-end pt-1">
              <span className="text-[10px] font-bold text-slate-300">{drawerForm.description.length} / 200 characters</span>
            </div>
          </div>

          <div className="space-y-6">
            <label className="flex items-center justify-between gap-4 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
              <div>
                <div className="text-[13px] font-black text-[#0c1424] leading-tight">Track Inventory</div>
                <div className="text-[11px] text-slate-400 font-bold tracking-tight">Alert when stock is low</div>
              </div>
              <input
                type="checkbox"
                checked={drawerForm.trackInventory}
                onChange={(event) => updateDrawerField('trackInventory', event.target.checked)}
                className="h-5 w-5 rounded border-slate-300 text-[#0c1424] focus:ring-[#0c1424]"
              />
            </label>

            <label className="flex items-center justify-between gap-4 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
              <div>
                <div className="text-[13px] font-black text-[#0c1424] leading-tight">Active</div>
                <div className="text-[11px] text-slate-400 font-bold tracking-tight">Visible in POS menu</div>
              </div>
              <input
                type="checkbox"
                checked={drawerForm.isActive}
                onChange={(event) => updateDrawerField('isActive', event.target.checked)}
                className="h-5 w-5 rounded border-slate-300 text-[#0c1424] focus:ring-[#0c1424]"
              />
            </label>
          </div>
        </div>

        <div className="p-8 border-t border-slate-100 flex gap-4">
          <button
            onClick={handleClose}
            className="flex-1 h-12 rounded-xl border border-slate-100 text-[13px] font-black uppercase tracking-widest text-[#0c1424] hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!isFormValid}
            className="flex-1 h-12 rounded-xl bg-[#0c1424] text-white text-[13px] font-black uppercase tracking-widest shadow-xl shadow-black/20 hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Item
          </button>
        </div>
      </div>
    </div>
  );
}