import React, { useState } from 'react';
import Button from '../../ui/Button';
import AdminProductList from './AdminProductList';
import AdminProductForm from './AdminProductForm';
import { useSetAtom } from 'jotai';
import { addProductAtom, updateProductAtom } from '../../../store/productAtoms';
import { Product } from '../../../../types';

const AdminProduct: React.FC = () => {
  const addProduct = useSetAtom(addProductAtom);
  const updateProduct = useSetAtom(updateProductAtom);

  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    stock: 0,
    description: '',
    discounts: []
  });

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editingProduct !== 'new') {
      updateProduct({ ...productForm, id: editingProduct });
      setEditingProduct(null);
    } else {
      addProduct(productForm);
    }
    setProductForm({ name: '', price: 0, stock: 0, description: '', discounts: [] });
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const startEditProduct = (product: Product) => {
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
        startEditProduct={startEditProduct}
      />

      {showProductForm && (
        <AdminProductForm
          productForm={productForm}
          setProductForm={setProductForm}
          handleProductSubmit={handleProductSubmit}
          editingProduct={editingProduct}
          setShowProductForm={setShowProductForm}
          setEditingProduct={setEditingProduct}
        />
      )}
    </section>
  );
};

export default AdminProduct;