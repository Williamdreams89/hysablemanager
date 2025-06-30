// src/pages/categories/Category.tsx
import React, { useEffect, useState, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toolbar } from "primereact/toolbar";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from 'primereact/toast';
import { Menu } from 'primereact/menu';
import { Card } from 'primereact/card';

import CategoryDialog from './CategoryDialog'; // Import the new dialog component
import type { Category } from '../../types/index'; // Import the Category interface
import axios from 'axios'; // Import Axios for API calls
import axiosInstance from '../../utils/axiosInstance';

const Category: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [displayDialog, setDisplayDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [categoryDialogData, setCategoryDialogData] = useState<Partial<Category>>({});

  const dt = useRef<DataTable<Category[]>>(null);
  const toast = useRef<Toast>(null);

  // --- Data Fetching ---
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      // *** IMPORTANT: REPLACE WITH YOUR ACTUAL BACKEND API ENDPOINT FOR CATEGORIES ***
      // Example: await axios.get<Category[]>('http://localhost:8000/api/categories/');
      const response = await axiosInstance.get<Category[]>('/store/category/'); // Mock API for demonstration
      setCategories(response.data);
      toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Categories loaded successfully.', life: 3000 });
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to load categories. Please check console.', life: 5000 });
    } finally {
      setLoading(false);
    }
  };

  // --- CRUD Operations ---
  const handleAddCategory = async () => {
    try {
      setLoading(true);
      if (!categoryDialogData.name) {
          toast.current?.show({ severity: 'warn', summary: 'Validation Error', detail: 'Category Name is required.', life: 4000 });
          setLoading(false);
          return;
      }
      // *** IMPORTANT: REPLACE WITH YOUR ACTUAL BACKEND API ENDPOINT (POST for creation) ***
      const response = await axiosInstance.post<Category>('/store/category/', categoryDialogData);
      
      setCategories(prev => [...prev, response.data]);
      setDisplayDialog(false);
      toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Category Added Successfully!', life: 3000 });
    } catch (error: any) {
      console.error("Error adding category:", error.response?.data || error);
      const errorMessage = error.response?.data?.message 
                           || error.message 
                           || "Failed to add category. Please try again.";
      toast.current?.show({ severity: 'error', summary: 'Error', detail: errorMessage, life: 5000 });
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategory = async () => {
    try {
      setLoading(true);
      if (!categoryDialogData.id) {
          toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Category ID is missing for update.', life: 3000 });
          setLoading(false);
          return;
      }
      if (!categoryDialogData.name) {
          toast.current?.show({ severity: 'warn', summary: 'Validation Error', detail: 'Category Name is required.', life: 4000 });
          setLoading(false);
          return;
      }
      // *** IMPORTANT: REPLACE WITH YOUR ACTUAL BACKEND API ENDPOINT (PATCH/PUT for update) ***
      const response = await axiosInstance.patch<Category>(`/store/category/${categoryDialogData.id}/`, categoryDialogData);
      
      setCategories(prev => prev.map(c => c.id === response.data.id ? response.data : c));
      setDisplayDialog(false);
      toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Category Updated Successfully!', life: 3000 });
    } catch (error: any) {
      console.error("Error updating category:", error.response?.data || error);
      const errorMessage = error.response?.data?.message 
                           || error.message 
                           || "Failed to update category. Please try again.";
      toast.current?.show({ severity: 'error', summary: 'Error', detail: errorMessage, life: 5000 });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = (id: string) => {
    confirmDialog({
      message: 'Are you sure you want to delete this category? This cannot be undone.',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      accept: async () => {
        try {
          setLoading(true);
          // *** IMPORTANT: REPLACE WITH YOUR ACTUAL BACKEND API ENDPOINT (DELETE operation) ***
          await axios.delete(`https://667b9360bd52dbeac4203716.mockapi.io/api/v1/categories/${id}`);
          
          setCategories(prev => prev.filter(c => c.id !== id));
          toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Category Deleted Successfully!', life: 3000 });
        } catch (error) {
          console.error("Error deleting category:", error);
          toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete category. Please try again.', life: 5000 });
        } finally {
          setLoading(false);
        }
      },
      reject: () => {
        toast.current?.show({ severity: 'info', summary: 'Cancelled', detail: 'Category deletion cancelled.', life: 2000 });
      }
    });
  };

  // --- Dialog Control Functions ---
  const openNewDialog = () => {
    setCategoryDialogData({
      name: "",
      description: "",
    });
    setIsEdit(false);
    setDisplayDialog(true);
  };

  const openEditDialog = (category: Category) => {
    setCategoryDialogData({ ...category }); // Populate dialog with existing category data
    setIsEdit(true);
    setDisplayDialog(true);
  };

  // --- DataTable Column Templates ---
  const actionBody = (rowData: Category) => {
    const rowMenuRef = useRef<Menu>(null);

    const items = [
      {
        label: "Edit",
        icon: "pi pi-pencil",
        command: () => openEditDialog(rowData),
      },
      {
        label: "Delete",
        icon: "pi pi-trash",
        command: () => handleDeleteCategory(rowData.id),
      },
    ];

    return (
      <>
        <Button
          icon="pi pi-ellipsis-v"
          className="p-button-text p-button-secondary p-button-rounded"
          onClick={(event) => {
            rowMenuRef.current?.toggle(event);
          }}
          aria-controls={`overlay_menu_${rowData.id}`}
          aria-haspopup
        />
        <Menu model={items} popup ref={rowMenuRef} id={`overlay_menu_${rowData.id}`} />
      </>
    );
  };

  // --- DataTable Header and Toolbar ---
  const header = (
    <div className="flex flex-wrap justify-content-between align-items-center gap-2">
      <h5 className="m-0">Manage Categories</h5>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter((e.target as HTMLInputElement).value)}
          placeholder="Search categories..."
          className="w-full sm:w-auto"
        />
      </span>
    </div>
  );

  const leftToolbarTemplate = (
    <Button
      label="New Category"
      icon="pi pi-plus"
      className="p-button-success mr-2"
      onClick={openNewDialog}
    />
  );

  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const rightToolbarTemplate = (
    <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
  );

  // --- Render ---
  if (loading) {
    return (
      <div className="flex justify-content-center align-items-center" style={{ height: "70vh" }}>
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <div style={{width: 'calc(100vw)', padding:'4px'}}>
      <Toast ref={toast} />
      <ConfirmDialog />

      <Toolbar className="mb-4" start={leftToolbarTemplate} end={rightToolbarTemplate}></Toolbar>

      <DataTable
        ref={dt}
        value={categories}
        paginator
        rows={10}
        rowsPerPageOptions={[10, 20, 50]}
        globalFilter={globalFilter}
        header={header}
        dataKey="id"
        responsiveLayout="stack"
        breakpoint="991px" // Same breakpoint as used for products page for consistency
        emptyMessage="No categories found."
        className="datatable-responsive"
      >
        <Column field="name" header="Name" sortable></Column>
        <Column field="description" header="Description"></Column>
        <Column body={actionBody} header="Actions" exportable={false} style={{ minWidth: '8rem' }} />
      </DataTable>

      <CategoryDialog
        visible={displayDialog}
        isEdit={isEdit}
        categoryData={categoryDialogData}
        setCategoryData={setCategoryDialogData}
        onHide={() => setDisplayDialog(false)}
        onSave={isEdit ? handleEditCategory : handleAddCategory}
      />
    </div>
  );
};

export default Category;