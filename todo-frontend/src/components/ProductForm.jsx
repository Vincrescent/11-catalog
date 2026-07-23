import { useState, useEffect } from 'react';
import { Package, DollarSign, Layers, Star, Image, FileText, AlertCircle } from 'lucide-react';
import api from '../api/axiosInstance';

const CATEGORIES = ['Electronics', 'Gadgets', 'Fashion', 'Home', 'Aksesoris'];

function ProductForm({ initialData, onSuccess, onClose, showToast }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Electronics',
    price: '',
    stock: '',
    rating: '4.8',
    imageUrl: '',
    description: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        category: initialData.category || 'Electronics',
        price: initialData.price || '',
        stock: initialData.stock !== undefined ? initialData.stock : '',
        rating: initialData.rating || '4.8',
        imageUrl: initialData.imageUrl || '',
        description: initialData.description || '',
      });
    }
  }, [initialData]);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Nama produk wajib diisi';
    if (!formData.price || Number(formData.price) < 0) errs.price = 'Harga harus > 0';
    if (formData.stock === '' || Number(formData.stock) < 0) errs.stock = 'Stok tidak boleh kosong atau negatif';
    if (formData.rating && (Number(formData.rating) < 0 || Number(formData.rating) > 5)) {
      errs.rating = 'Rating harus antara 0.0 - 5.0';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        price: Number(formData.price),
        stock: Number(formData.stock),
        rating: Number(formData.rating || 5.0),
        description: formData.description.trim(),
        imageUrl: formData.imageUrl.trim() || undefined,
      };

      if (initialData?.id) {
        await api.put(`/api/v1/products/${initialData.id}`, payload);
        showToast('✅ Produk berhasil diperbarui!');
      } else {
        await api.post('/api/v1/products', payload);
        showToast('🎉 Produk baru berhasil ditambahkan!');
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error saving product:', err);
      showToast(err.message || 'Gagal menyimpan data produk', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      {/* Product Name */}
      <div className="form-group">
        <label htmlFor="product-name" className="form-label">
          <Package size={15} /> Nama Produk <span className="required">*</span>
        </label>
        <input
          id="product-name"
          type="text"
          className={`form-input ${errors.name ? 'input-error' : ''}`}
          placeholder="contoh: Sony WH-1000XM5 Headphones"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        {errors.name && (
          <span className="field-error">
            <AlertCircle size={13} /> {errors.name}
          </span>
        )}
      </div>

      {/* Category & Rating Row */}
      <div className="form-row">
        <div className="form-group flex-1">
          <label htmlFor="product-category" className="form-label">
            <Layers size={15} /> Kategori <span className="required">*</span>
          </label>
          <select
            id="product-category"
            className="form-select"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group flex-1">
          <label htmlFor="product-rating" className="form-label">
            <Star size={15} /> Rating (0.0 - 5.0)
          </label>
          <input
            id="product-rating"
            type="number"
            step="0.1"
            min="0"
            max="5"
            className={`form-input ${errors.rating ? 'input-error' : ''}`}
            placeholder="4.8"
            value={formData.rating}
            onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
          />
          {errors.rating && (
            <span className="field-error">
              <AlertCircle size={13} /> {errors.rating}
            </span>
          )}
        </div>
      </div>

      {/* Price & Stock Row */}
      <div className="form-row">
        <div className="form-group flex-1">
          <label htmlFor="product-price" className="form-label">
            <DollarSign size={15} /> Harga (Rp) <span className="required">*</span>
          </label>
          <input
            id="product-price"
            type="number"
            min="0"
            className={`form-input ${errors.price ? 'input-error' : ''}`}
            placeholder="1500000"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          />
          {errors.price && (
            <span className="field-error">
              <AlertCircle size={13} /> {errors.price}
            </span>
          )}
        </div>

        <div className="form-group flex-1">
          <label htmlFor="product-stock" className="form-label">
            <Package size={15} /> Jumlah Stok <span className="required">*</span>
          </label>
          <input
            id="product-stock"
            type="number"
            min="0"
            className={`form-input ${errors.stock ? 'input-error' : ''}`}
            placeholder="10"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
          />
          {errors.stock && (
            <span className="field-error">
              <AlertCircle size={13} /> {errors.stock}
            </span>
          )}
        </div>
      </div>

      {/* Image URL */}
      <div className="form-group">
        <label htmlFor="product-image" className="form-label">
          <Image size={15} /> URL Gambar Produk (opsional)
        </label>
        <input
          id="product-image"
          type="url"
          className="form-input"
          placeholder="https://images.unsplash.com/..."
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
        />
      </div>

      {/* Description */}
      <div className="form-group">
        <label htmlFor="product-desc" className="form-label">
          <FileText size={15} /> Deskripsi Produk
        </label>
        <textarea
          id="product-desc"
          rows="3"
          className="form-textarea"
          placeholder="Tuliskan spesifikasi atau keunggulan singkat produk..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      {/* Submit Buttons */}
      <div className="form-actions">
        <button type="button" onClick={onClose} className="btn-cancel">
          Batal
        </button>
        <button type="submit" disabled={submitting} className="btn-submit">
          {submitting ? 'Menyimpan...' : initialData ? 'Simpan Perubahan' : 'Tambah Produk'}
        </button>
      </div>
    </form>
  );
}

export default ProductForm;
