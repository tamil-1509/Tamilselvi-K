import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import {
  HeartPulse,
  Search,
  Plus,
  AlertTriangle,
  Package,
  TrendingDown,
  Trash2,
  Edit2,
  Calendar,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Medicine } from '../../types';

export const PharmacyView: React.FC = () => {
  const {
    medicines,
    addMedicine,
    updateMedicineStock,
    deleteMedicine,
    currentRole,
  } = useHospital();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Medicine Form State
  const [name, setName] = useState('');
  const [genericName, setGenericName] = useState('');
  const [category, setCategory] = useState<Medicine['category']>('Antibiotic');
  const [quantity, setQuantity] = useState(100);
  const [minThreshold, setMinThreshold] = useState(30);
  const [pricePerUnit, setPricePerUnit] = useState(15.0);
  const [expiryDate, setExpiryDate] = useState('2027-12-31');
  const [manufacturer, setManufacturer] = useState('Pfizer Inc.');
  const [batchNumber, setBatchNumber] = useState('BATCH-2026-01');

  // Stock edit modal
  const [editingMed, setEditingMed] = useState<Medicine | null>(null);
  const [newStockQty, setNewStockQty] = useState<number>(0);

  const lowStockMedicines = medicines.filter((m) => m.stockStatus !== 'In Stock');

  const filteredMedicines = medicines.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.batchNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'All' || m.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const handleCreateMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addMedicine({
      name: name.trim(),
      genericName: genericName.trim() || name.trim(),
      category,
      quantity: Number(quantity),
      minThreshold: Number(minThreshold),
      pricePerUnit: Number(pricePerUnit),
      expiryDate,
      manufacturer: manufacturer.trim(),
      batchNumber: batchNumber.trim(),
    });

    setShowAddModal(false);
  };

  const handleUpdateStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMed) return;
    updateMedicineStock(editingMed.id, newStockQty);
    setEditingMed(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Hospital Pharmacy & Formulary</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pharmaceutical inventory management, reorder alerts, batch controls, and digital dispensations
          </p>
        </div>

        {currentRole === 'admin' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Formulary Medicine
          </button>
        )}
      </div>

      {/* Low-Stock Alert Banner */}
      {lowStockMedicines.length > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="font-bold text-sm text-amber-950">
                Low Inventory Safety Alert ({lowStockMedicines.length} Items Below Threshold)
              </p>
              <p className="text-amber-800 mt-0.5">
                The following medicines require immediate vendor re-stocking:{' '}
                <strong>{lowStockMedicines.map((m) => `${m.name} (${m.quantity} left)`).join(', ')}</strong>.
              </p>
            </div>
          </div>
          <span className="font-mono text-xs font-semibold bg-white px-2.5 py-1 rounded border border-amber-300 shrink-0">
            Reorder Level
          </span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search medicine brand, generic name, or batch..."
            className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none"
          >
            <option value="All">All Categories ({medicines.length})</option>
            <option value="Antibiotic">Antibiotic</option>
            <option value="Cardiovascular">Cardiovascular</option>
            <option value="Antidiabetic">Antidiabetic</option>
            <option value="Analgesic">Analgesic</option>
            <option value="Gastrointestinal">Gastrointestinal</option>
            <option value="Respiratory">Respiratory</option>
          </select>
        </div>
      </div>

      {/* Medicines Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                <th className="py-3 px-4">Medicine & Formulation</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Stock In-Hand</th>
                <th className="py-3 px-4">Unit Price</th>
                <th className="py-3 px-4">Batch & Expiry</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMedicines.map((med) => (
                <tr key={med.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900">{med.name}</p>
                    <p className="text-[11px] text-slate-500 italic">{med.genericName}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{med.manufacturer}</p>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium">
                      {med.category}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono">
                    <span className="font-bold text-slate-900 text-sm">{med.quantity}</span>
                    <span className="text-[10px] text-slate-400 block">Min: {med.minThreshold}</span>
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 tabular-nums">
                    ${med.pricePerUnit.toFixed(2)}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[11px]">
                    <p className="text-slate-800 font-medium">{med.batchNumber}</p>
                    <p className="text-slate-400">Exp: {med.expiryDate}</p>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                        med.stockStatus === 'In Stock'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : med.stockStatus === 'Low Stock'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {med.stockStatus}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                    <button
                      onClick={() => {
                        setEditingMed(med);
                        setNewStockQty(med.quantity);
                      }}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-[11px] font-semibold cursor-pointer"
                    >
                      Update Stock
                    </button>

                    {currentRole === 'admin' && (
                      <button
                        onClick={() => deleteMedicine(med.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                        title="Delete medicine"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Adjustment Modal */}
      <Modal
        isOpen={!!editingMed}
        onClose={() => setEditingMed(null)}
        title="Adjust Pharmacy Inventory Count"
        subtitle={`Medicine: ${editingMed?.name}`}
        maxWidth="max-w-sm"
      >
        <form onSubmit={handleUpdateStock} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Total Quantity on Shelf</label>
            <input
              type="number"
              value={newStockQty}
              onChange={(e) => setNewStockQty(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-bold text-sm"
              required
            />
            <p className="text-[11px] text-slate-400 mt-1">Safety Reorder Threshold: {editingMed?.minThreshold} units</p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t">
            <button
              type="button"
              onClick={() => setEditingMed(null)}
              className="px-3 py-1.5 text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-lg shadow-xs cursor-pointer"
            >
              Confirm Quantity
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Medicine Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Hospital Formulary Drug"
        subtitle="Catalog pharmaceutical medication into pharmacy ledger"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreateMedicine} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Brand Name & Strength</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Amoxicillin 500mg"
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
                required
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Generic Name</label>
              <input
                type="text"
                value={genericName}
                onChange={(e) => setGenericName(e.target.value)}
                placeholder="e.g. Amoxicillin Trihydrate"
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Therapeutic Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs bg-white"
              >
                <option value="Antibiotic">Antibiotic</option>
                <option value="Analgesic">Analgesic</option>
                <option value="Cardiovascular">Cardiovascular</option>
                <option value="Antidiabetic">Antidiabetic</option>
                <option value="Antiviral">Antiviral</option>
                <option value="Respiratory">Respiratory</option>
                <option value="Vitamins">Vitamins</option>
                <option value="Gastrointestinal">Gastrointestinal</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Unit Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(Number(e.target.value))}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs font-mono"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Stock Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs font-mono"
                required
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Safety Threshold</label>
              <input
                type="number"
                value={minThreshold}
                onChange={(e) => setMinThreshold(Number(e.target.value))}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs font-mono"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Expiry Date</label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs font-mono"
                required
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Batch Number</label>
              <input
                type="text"
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs font-mono"
                required
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Manufacturer</label>
              <input
                type="text"
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-3 py-1.5 text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded cursor-pointer"
            >
              Add to Pharmacy
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
