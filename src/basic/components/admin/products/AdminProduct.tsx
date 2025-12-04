import React, { useState } from 'react';
import { Product } from '../../../../types';
import { ProductWithUI } from '../../../model/productModels';
import Button from '../../ui/Button';
import AdminProductList from './AdminProductList';
import AdminProductForm from './AdminProductForm';

interface AdminProductProps {
  products: ProductWithUI[];
  addProduct: (newProduct: Omit<ProductWithUI, 'id'>) => void;
  updateProduct: (productId: string, updates: Partial<ProductWithUI>) => void;
  deleteProduct: (productId: string) => void;
  formatPrice: (price: number, productId?: string) => string;
  addNotification: (message: string, type?: 'error' | 'success' | 'warning') => void;
}

const AdminProduct: React.FC<AdminProductProps> = ({
  products,
  addProduct,
  updateProduct,
  deleteProduct,
  formatPrice,
  addNotification
}) => {
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: 0,
    stock: 0,
    description: '',
    discounts: [] as Array<{ quantity: number; rate: number }>
  });

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editingProduct !== 'new') {
      updateProduct(editingProduct, productForm);
      setEditingProduct(null);
    } else {
      addProduct({
        ...productForm,
        discounts: productForm.discounts
      });
    }
    setProductForm({ name: '', price: 0, stock: 0, description: '', discounts: [] });
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const startEditProduct = (product: ProductWithUI) => {
    setEditingProduct(product.id);
    setProductForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || '',
      discounts: product.discounts || []
    });
    setShowProductForm(true);
  };

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">상품 목록</h2>
          <Button
            onClick={() => {
              setEditingProduct('new');
              setProductForm({ name: '', price: 0, stock: 0, description: '', discounts: [] });
              setShowProductForm(true);
            }}
            className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800"
          >
            새 상품 추가
          </Button>
        </div>
      </div>

      <AdminProductList 
        products={products}
        deleteProduct={deleteProduct}
        startEditProduct={startEditProduct}
        formatPrice={formatPrice}
      />

      {showProductForm && (
        <AdminProductForm
          productForm={productForm}
          setProductForm={setProductForm}
          handleProductSubmit={handleProductSubmit}
          editingProduct={editingProduct}
          addNotification={addNotification}
          setShowProductForm={setShowProductForm}
          setEditingProduct={setEditingProduct}
        />
      )}
    </section>
  );
};

export default AdminProduct;