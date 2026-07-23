import { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../api/axiosInstance';
import ProductCard from '../components/ProductCard';
import ProductForm from '../components/ProductForm';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import Toast from '../components/Toast';
import {
  Package,
  Plus,
  Search,
  SlidersHorizontal,
  PackageX,
  PackageCheck,
  Star,
  RefreshCw,
  ShoppingBag,
} from 'lucide-react';

const CATEGORIES = ['Semua', 'Electronics', 'Gadgets', 'Fashion', 'Home', 'Aksesoris'];

function ProductCatalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchTerm, setSearchTerm] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Delete Confirm State
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Toast State
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Fetch Products GET /api/v1/products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let url = '/api/v1/products';
      const params = new URLSearchParams();

      if (selectedCategory !== 'Semua') {
        params.append('category', selectedCategory);
      }
      if (availableOnly) {
        params.append('available', 'true');
      }
      if (searchTerm.trim()) {
        params.append('search', searchTerm.trim());
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await api.get(url);
      setProducts(response.data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Gagal mengambil data produk dari server');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, availableOnly, searchTerm]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle Add Product Modal
  const handleAddProduct = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  // Handle Edit Product Modal
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  // Quick Stock Adjustment
  const handleUpdateStock = async (product, newStock) => {
    try {
      await api.put(`/api/v1/products/${product.id}`, { stock: newStock });
      showToast(`📦 Stok ${product.name} diperbarui menjadi ${newStock}`);
      fetchProducts();
    } catch (err) {
      console.error('Error updating stock:', err);
      showToast(err.message || 'Gagal memperbarui stok', 'error');
    }
  };

  // Handle Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      setDeleting(true);
      await api.delete(`/api/v1/products/${deleteConfirmId}`);
      showToast('🗑️ Produk berhasil dihapus dari katalog!');
      setDeleteConfirmId(null);
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      showToast(err.message || 'Gagal menghapus produk', 'error');
    } finally {
      setDeleting(false);
    }
  };

  // Calculated Dashboard Stats
  const stats = useMemo(() => {
    const totalCount = products.length;
    const totalStock = products.reduce((acc, p) => acc + (p.stock || 0), 0);
    const outOfStockCount = products.filter((p) => p.stock <= 0).length;
    const avgRating =
      totalCount > 0
        ? (
            products.reduce((acc, p) => acc + Number(p.rating || 5), 0) /
            totalCount
          ).toFixed(1)
        : '0.0';

    return { totalCount, totalStock, outOfStockCount, avgRating };
  }, [products]);

  return (
    <div className="catalog-container">
      {/* Toast Notification */}
      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: '', type: 'success' })}
        />
      )}

      {/* Hero Header */}
      <header className="catalog-header">
        <div className="header-brand">
          <div className="brand-logo">
            <ShoppingBag size={24} />
          </div>
          <div>
            <h1 className="header-title">Product Catalog Studio</h1>
            <p className="header-subtitle">
              Sistem manajemen inventaris dan katalog produk toko digital
            </p>
          </div>
        </div>

        <button onClick={handleAddProduct} className="btn-add-product">
          <Plus size={18} /> Tambah Produk Baru
        </button>
      </header>

      {/* Stats Bar */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon icon-blue">
            <Package size={20} />
          </div>
          <div>
            <div className="stat-value">{stats.totalCount}</div>
            <div className="stat-label">Total Produk</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon icon-emerald">
            <PackageCheck size={20} />
          </div>
          <div>
            <div className="stat-value">{stats.totalStock}</div>
            <div className="stat-label">Total Unit Stok</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon icon-amber">
            <Star size={20} />
          </div>
          <div>
            <div className="stat-value">⭐ {stats.avgRating}</div>
            <div className="stat-label">Rata-rata Rating</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon icon-rose">
            <PackageX size={20} />
          </div>
          <div>
            <div className="stat-value">{stats.outOfStockCount}</div>
            <div className="stat-label">Stok Habis</div>
          </div>
        </div>
      </div>

      {/* Controls & Filter Bar */}
      <div className="filter-panel">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Cari produk berdasarkan nama, deskripsi, atau kategori..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-options">
          {/* Category Pills */}
          <div className="category-tabs">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`category-tab ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Toggle Available Only */}
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
            />
            <span>Hanya Stok Tersedia</span>
          </label>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="catalog-loading">
          <RefreshCw size={28} className="spinner" />
          <p>Memuat data katalog produk...</p>
        </div>
      ) : error ? (
        <div className="catalog-error">
          <p>⚠️ {error}</p>
          <button onClick={fetchProducts} className="btn-retry">
            Coba Lagi
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="catalog-empty">
          <PackageX size={48} className="empty-icon" />
          <h3>Tidak Ada Produk Ditemukan</h3>
          <p>
            Coba ubah kata kunci pencarian atau pilih kategori lain untuk melihat daftar produk.
          </p>
          <button onClick={handleAddProduct} className="btn-add-product mt-4">
            <Plus size={16} /> Tambah Produk Pertama
          </button>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleEditProduct}
              onDelete={(id) => setDeleteConfirmId(id)}
              onUpdateStock={handleUpdateStock}
            />
          ))}
        </div>
      )}

      {/* Modal Form Product (Create/Edit) */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProduct ? 'Edit Informasi Produk' : 'Tambah Produk Baru'}
      >
        <ProductForm
          initialData={editingProduct}
          onSuccess={fetchProducts}
          onClose={() => setModalOpen(false)}
          showToast={showToast}
        />
      </Modal>

      {/* Modal Confirm Delete */}
      <ConfirmModal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleConfirmDelete}
        title="Hapus Produk dari Katalog?"
        message="Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Ya, Hapus Produk"
        loading={deleting}
      />
    </div>
  );
}

export default ProductCatalog;
