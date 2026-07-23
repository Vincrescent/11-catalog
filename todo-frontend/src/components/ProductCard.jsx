import { Star, Edit2, Trash2, PackageCheck, PackageX, Plus, Minus } from 'lucide-react';

function ProductCard({ product, onEdit, onDelete, onUpdateStock }) {
  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div className={`product-card ${isOutOfStock ? 'out-of-stock' : ''}`}>
      {/* Product Image & Badges */}
      <div className="product-image-container">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="product-image"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80';
          }}
        />
        <div className="product-category-badge">{product.category}</div>
        <div className={`stock-badge ${isOutOfStock ? 'badge-danger' : 'badge-success'}`}>
          {isOutOfStock ? (
            <>
              <PackageX size={13} /> Stok Habis
            </>
          ) : (
            <>
              <PackageCheck size={13} /> Stok: {product.stock}
            </>
          )}
        </div>
      </div>

      {/* Product Content */}
      <div className="product-card-body">
        <div className="product-header-info">
          <h3 className="product-title" title={product.name}>
            {product.name}
          </h3>
          <div className="product-rating">
            <Star size={14} className="star-icon" fill="#F59E0B" />
            <span>{Number(product.rating || 5).toFixed(1)}</span>
          </div>
        </div>

        <p className="product-description">{product.description}</p>

        <div className="product-price-section">
          <div className="product-price-label">Harga</div>
          <div className="product-price">{formatRupiah(product.price)}</div>
        </div>

        {/* Quick Stock Actions */}
        <div className="product-stock-control">
          <span className="stock-control-label">Kelola Stok:</span>
          <div className="stock-buttons">
            <button
              className="btn-stock-adjust"
              disabled={isOutOfStock}
              onClick={() => onUpdateStock(product, Math.max(0, product.stock - 1))}
              title="Kurangi Stok"
            >
              <Minus size={14} />
            </button>
            <span className="stock-number">{product.stock}</span>
            <button
              className="btn-stock-adjust"
              onClick={() => onUpdateStock(product, product.stock + 1)}
              title="Tambah Stok"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="product-card-actions">
          <button
            onClick={() => onEdit(product)}
            className="btn-card-action btn-edit-product"
            title="Edit Produk"
          >
            <Edit2 size={15} /> Edit
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="btn-card-action btn-delete-product"
            title="Hapus Produk"
          >
            <Trash2 size={15} /> Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
