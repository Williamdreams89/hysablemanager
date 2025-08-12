// src/pages/products/Product.tsx
import React, { useEffect, useState, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toolbar } from "primereact/toolbar";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from 'primereact/toast';
import { Menu } from 'primereact/menu';
import { Card } from 'primereact/card';
import { Rating } from 'primereact/rating';
import { Tag } from 'primereact/tag';
import { useMediaQuery } from "@mui/material";
import ProductDialog from './ProductDialog';
import type { Product, Category } from '../../types';
import axiosInstance from '../../utils/axiosInstance';

interface ProductDialogData extends Partial<Product> {
  newImageFile?: File | null;
}

// Separate memoized component for row actions
const RowActions: React.FC<{
  product: Product;
  onEdit: (p: Product) => void;
  onDelete: (id: string) => void;
}> = ({ product, onEdit, onDelete }) => {
  const menu = useRef<Menu>(null);

  const items = [
    { label: "Edit", icon: "pi pi-pencil", command: () => onEdit(product) },
    { label: "Delete", icon: "pi pi-trash", command: () => onDelete(product.id) },
  ];

  return (
    <>
      <Button
        icon="pi pi-ellipsis-v"
        className="p-button-text p-button-secondary p-button-rounded"
        onClick={(e) => menu.current?.toggle(e)}
        aria-controls={`overlay_menu_${product.id}`}
        aria-haspopup
      />
      <Menu model={items} popup ref={menu} id={`overlay_menu_${product.id}`} />
    </>
  );
};

const Product: React.FC = () => {
  const isSmallScreen = useMediaQuery('(max-width:1045px)');
  const [products, setProducts] = useState<Product[]>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [displayDialog, setDisplayDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [productDialogData, setProductDialogData] = useState<ProductDialogData>({ newImageFile: null });

  const [categoryOptions, setCategoryOptions] = useState<{ label: string; value: string }[]>([]);
  const statusOptions: { label: string; value: 'In Stock' | 'Out of Stock' | 'Low Stock' }[] = [
    { label: 'In Stock', value: 'In Stock' },
    { label: 'Out of Stock', value: 'Out of Stock' },
    { label: 'Low Stock', value: 'Low Stock' },
  ];

  const dt = useRef<DataTable<Product[]>>(null);
  const toast = useRef<Toast>(null);

  const defaultPlaceholderImage = `https://via.placeholder.com/64x64.png?text=No+Image`;

  useEffect(() => {
    fetchProducts();
    fetchCategoryOptions();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get<Product[]>('store/products/');
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to load products. Please check console.', life: 5000 });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryOptions = async () => {
    try {
      const response = await axiosInstance.get<Category[]>('store/category/');
      const transformedCategories = response.data.map(cat => ({
        label: cat.name,
        value: cat.id
      }));
      setCategoryOptions(transformedCategories);
    } catch (error) {
      console.error("Failed to fetch categories for options:", error);
    }
  };

  const buildFormData = (data: ProductDialogData) => {
    const formData = new FormData();
    if (data.name) formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    if (data.category) formData.append('category', data.category);
    if (data.price !== undefined) formData.append('price', data.price.toString());
    if (data.stock !== undefined) formData.append('stock', data.stock.toString());
    if (data.status) formData.append('status', data.status);
    if (data.rating !== undefined) formData.append('rating', data.rating.toString());

    if (data.newImageFile) {
      formData.append('image', data.newImageFile);
    } else if (isEdit && data.image === '') {
      formData.append('image', '');
    }
    return formData;
  };

  const handleAddProduct = async () => {
    setLoading(true);
    if (!productDialogData.name || productDialogData.price === undefined || productDialogData.stock === undefined) {
      toast.current?.show({ severity: 'warn', summary: 'Validation Error', detail: 'Name, Price, and Stock are required.', life: 4000 });
      setLoading(false);
      return;
    }

    try {
      const formData = buildFormData(productDialogData);
      const response = await axiosInstance.post<Product>('/products/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setProducts(prev => [...prev, response.data]);
      setDisplayDialog(false);
      toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Product Added Successfully!', life: 3000 });
    } catch (error: any) {
      console.error("Error adding product:", error.response?.data || error);
      const errorMessage = error.response?.data?.message
        || JSON.stringify(error.response?.data)
        || error.message
        || "Failed to add product. Please try again.";
      toast.current?.show({ severity: 'error', summary: 'Error', detail: errorMessage, life: 5000 });
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = async () => {
    setLoading(true);
    if (!productDialogData.id) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Product ID is missing for update.', life: 3000 });
      setLoading(false);
      return;
    }
    if (!productDialogData.name || productDialogData.price === undefined || productDialogData.stock === undefined) {
      toast.current?.show({ severity: 'warn', summary: 'Validation Error', detail: 'Name, Price, and Stock are required.', life: 4000 });
      setLoading(false);
      return;
    }

    try {
      const formData = buildFormData(productDialogData);
      const response = await axiosInstance.patch<Product>(`/products/${productDialogData.id}/`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setProducts(prev => prev.map(p => p.id === response.data.id ? response.data : p));
      setDisplayDialog(false);
      toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Product Updated Successfully!', life: 3000 });
    } catch (error: any) {
      console.error("Error updating product:", error.response?.data || error);
      const errorMessage = error.response?.data?.message
        || JSON.stringify(error.response?.data)
        || error.message
        || "Failed to update product. Please try again.";
      toast.current?.show({ severity: 'error', summary: 'Error', detail: errorMessage, life: 5000 });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = (id: string) => {
    confirmDialog({
      message: 'Are you sure you want to delete this product? This cannot be undone.',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      accept: async () => {
        setLoading(true);
        try {
          await axiosInstance.delete(`/products/${id}/`);
          setProducts(prev => prev.filter(p => p.id !== id));
          toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Product Deleted Successfully!', life: 3000 });
        } catch (error) {
          console.error("Error deleting product:", error);
          toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete product. Please try again.', life: 5000 });
        } finally {
          setLoading(false);
        }
      },
      reject: () => {
        toast.current?.show({ severity: 'info', summary: 'Cancelled', detail: 'Product deletion cancelled.', life: 2000 });
      }
    });
  };

  const openNewDialog = () => {
    setProductDialogData({
      name: "", description: "", category: "", price: 0, stock: 0,
      status: 'In Stock', image: "", rating: 0, newImageFile: null,
    });
    setIsEdit(false);
    setDisplayDialog(true);
  };

  const openEditDialog = (product: Product) => {
    setProductDialogData({ ...product, newImageFile: null });
    setIsEdit(true);
    setDisplayDialog(true);
  };

  const imageBodyTemplate = (rowData: Product) => {
    const imageUrl = rowData.imgb || "/images/publish.png";
    return (
      <img
        src={imageUrl}
        alt={rowData.name || 'Product Image'}
        className="shadow-2 border-round"
        style={{ width: "64px", height: "64px", objectFit: 'cover' }}
        onError={(e) => (e.currentTarget.src = defaultPlaceholderImage)}
      />
    );
  };

  const priceBodyTemplate = (rowData: Product) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(rowData.price);
  };

  const ratingBodyTemplate = (rowData: Product) => {
    return <Rating value={rowData.rating || 0} readOnly cancel={false} stars={5} />;
  };

  const statusBodyTemplate = (rowData: Product) => {
    const severity = rowData.status === 'In Stock' ? 'success' : rowData.status === 'Low Stock' ? 'warning' : 'danger';
    return <Tag value={rowData.status} severity={severity}></Tag>;
  };

  const header = (
    <div className="flex flex-wrap justify-content-between align-items-center gap-2">
      <h5 className="m-0">Manage Products</h5>
      <span className="w-full sm:w-auto" style={{}}>
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter((e.target as HTMLInputElement).value)}
          placeholder="Search products..."
          className="w-full"
        />
      </span>
    </div>
  );

  const leftToolbarTemplate = (
    <Button
      label="New Product"
      icon="pi pi-plus"
      className="p-button-success mr-2"
      onClick={openNewDialog}
    />
  );

  const exportCSV = () => { dt.current?.exportCSV(); };

  const rightToolbarTemplate = (
    <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
  );

  if (loading) {
    return (
      <div className="flex justify-content-center align-items-center" style={{ height: "70vh" }}>
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <Card style={{ width: '100%', padding: '1rem' }}>
      <Toast ref={toast} />
      <ConfirmDialog />

      <Toolbar className="mb-4" start={leftToolbarTemplate} end={rightToolbarTemplate}></Toolbar>
      <DataTable
        ref={dt}
        value={products}
        paginator
        rows={10}
        rowsPerPageOptions={[10, 20, 50]}
                globalFilter={globalFilter}
        header={header}
        dataKey="id"
        responsiveLayout="scroll"
        breakpoint="991px"
        className="datatable-scrollable"
        emptyMessage="No products found."
      >
        <Column header="Image" body={imageBodyTemplate} style={{ width: '8rem', textAlign: 'center' }} />
        <Column field="name" header="Name" sortable style={{ minWidth: '10rem' }} />
        <Column field="category" header="Category" sortable style={{ minWidth: '10rem' }} />
        <Column field="price" header="Price" body={priceBodyTemplate} sortable style={{ minWidth: '8rem' }} />
        <Column field="stock" header="Stock" sortable style={{ minWidth: '8rem' }} />
        <Column field="status" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: '10rem' }} />
        <Column field="rating" header="Rating" body={ratingBodyTemplate} sortable style={{ minWidth: '10rem' }} />
        <Column body={(rowData) => (
          <RowActions product={rowData} onEdit={openEditDialog} onDelete={handleDeleteProduct} />
        )} header="Actions" exportable={false} style={{ minWidth: '8rem' }} />
      </DataTable>

      <ProductDialog
        visible={displayDialog}
        isEdit={isEdit}
        productData={productDialogData}
        setProductData={setProductDialogData}
        onHide={() => setDisplayDialog(false)}
        onSave={isEdit ? handleEditProduct : handleAddProduct}
        categoryOptions={categoryOptions}
        statusOptions={statusOptions}
      />
    </Card>
  );
};

export default Product;

