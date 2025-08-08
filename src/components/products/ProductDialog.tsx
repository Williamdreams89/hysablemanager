// src/pages/products/ProductDialog.tsx
import React, { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import type { FileUploadSelectEvent } from 'primereact/fileupload';
import type { Product } from '../../types/index';
import useMediaQuery from '@mui/material/useMediaQuery';

// Define the path to your custom broken image placeholder.
// IMPORTANT: Make sure you have a file named 'broken_image.png'
// in your 'public/assets/' folder (or adjust the path accordingly).
const CUSTOM_BROKEN_IMAGE_FALLBACK = '/assets/broken_image.png';

// A minimal transparent GIF, used as a final failsafe if CUSTOM_BROKEN_IMAGE_FALLBACK itself fails to load.
const GENERIC_FAILSAFE_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';

// Extends the Product type to include a File object for new image uploads
interface ProductDialogData extends Partial<Product> {
  newImageFile?: File | null;
}

// Props interface for the ProductDialog component
interface ProductDialogProps {
  visible: boolean;
  isEdit: boolean;
  productData: ProductDialogData;
  setProductData: React.Dispatch<React.SetStateAction<ProductDialogData>>;
  onHide: () => void;
  onSave: () => void;
  categoryOptions: { label: string; value: string }[];
  statusOptions: { label: string; value: 'In Stock' | 'Out of Stock' | 'Low Stock' }[];
}

const ProductDialog = React.memo(({
  visible,
  isEdit,
  productData,
  setProductData,
  onHide,
  onSave,
  categoryOptions,
  statusOptions,
}: ProductDialogProps) => {

  const dialogFooter = (
    <div>
      <Button label="Cancel" icon="pi pi-times" onClick={onHide} className="p-button-text" />
      <Button
        label={isEdit ? "Update" : "Add"}
        icon="pi pi-check"
        onClick={onSave}
      />
    </div>
  );

  const isSmallScreen = useMediaQuery('(max-width: 1045px)');

  // State to hold the object URL for the image preview
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  // useEffect hook to manage the creation and revocation of object URLs.
  // This prevents continuous re-creation of URLs which caused the shaking.
  useEffect(() => {
    // If a new file is selected for upload, create a new object URL for its preview
    if (productData.newImageFile) {
      const url = URL.createObjectURL(productData.newImageFile);
      setImagePreviewUrl(url);

      // Return a cleanup function: this will revoke the object URL when the component unmounts
      // or when `productData.newImageFile` changes (i.e., a new file is selected).
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      // If no new file is selected, and there was a previous preview URL, revoke it
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
      setImagePreviewUrl(null); // Clear the preview URL state
    }
    // Dependency array: This effect re-runs only when `productData.newImageFile` changes.
    // `imagePreviewUrl` is not included as it's being set within this effect.
  }, [productData.newImageFile]);

  // Determine the source for the image preview based on available image data.
  // Priority: newly selected file (via imagePreviewUrl) > existing product image > broken image fallback.
  const displayImageSrc = imagePreviewUrl
    ? imagePreviewUrl
    : productData.image // Use the existing image URL from the backend
      ? productData.image
      : CUSTOM_BROKEN_IMAGE_FALLBACK; // Fallback to your custom broken image icon

  // Handler for when a file is selected using PrimeReact's FileUpload component
  const onFileSelect = (event: FileUploadSelectEvent) => {
    setProductData(prev => ({
      ...prev,
      newImageFile: event.files[0] || null, // Store the selected file
    }));
  };

  return (
    <Dialog
      header={isEdit ? "Edit Product" : "Add New Product"}
      visible={visible}
      style={{ width: isSmallScreen ? "95vw" : '50vw' }}
      modal
      className="p-fluid"
      footer={dialogFooter}
      onHide={onHide}
    >
      <div className="p-field mb-3">
        <label htmlFor="name" className="font-bold">Product Name</label>
        <InputText
          id="name"
          value={productData.name || ""}
          onChange={(e) => setProductData({ ...productData, name: e.target.value })}
          required
          autoFocus
        />
      </div>
      <div className="p-field mb-3">
        <label htmlFor="description" className="font-bold">Description</label>
        <InputTextarea
          id="description"
          value={productData.description || ""}
          onChange={(e) => setProductData({ ...productData, description: e.target.value })}
          rows={3}
          cols={20}
        />
      </div>
      <div className="p-field mb-3">
        <label htmlFor="price" className="font-bold">Price</label>
        <InputNumber
          id="price"
          // Use null for value when undefined/empty to ensure InputNumber behaves correctly
          value={productData.price ?? null}
          // Use functional update for setProductData and '?? undefined' for value
          onValueChange={(e) => setProductData(prev => ({ ...prev, price: e.value ?? undefined }))}
          mode="currency"
          currency="USD"
          locale="en-US"
          minFractionDigits={2}
          required
        />
      </div>
      <div className="p-field mb-3">
        <label htmlFor="category" className="font-bold">Category</label>
        <Dropdown
          id="category"
          value={productData.category || ""}
          options={categoryOptions}
          onChange={(e) => setProductData({ ...productData, category: e.value })}
          placeholder="Select a Category"
          required
        />
      </div>
      <div className="p-field mb-3">
        <label htmlFor="stock" className="font-bold">Stock Quantity</label>
        <InputNumber
          id="stock"
          value={productData.stock ?? null}
          onValueChange={(e) => setProductData(prev => ({ ...prev, stock: e.value ?? undefined }))}
          min={0}
          required
        />
      </div>
      <div className="p-field mb-3">
        <label htmlFor="status" className="font-bold">Status</label>
        <Dropdown
          id="status"
          value={productData.status || null}
          options={statusOptions}
          onChange={(e) => setProductData({ ...productData, status: e.value })}
          placeholder="Select Status"
          required
        />
      </div>
      <div className="p-field mb-3">
        <label htmlFor="imageUpload" className="font-bold">Product Image</label>

        {/* Image Preview Area */}
        <div className="flex justify-content-center mb-3">
          <img
            alt="Product Preview"
            src={displayImageSrc} /* Uses the dynamically determined image source */
            style={{ maxWidth: '150px', maxHeight: '150px', objectFit: 'contain', border: '1px solid #ccc', padding: '5px' }}
            // Fallback for when the 'src' fails to load (e.g., actual broken image URL from backend)
            onError={(e) => {
              // Only change src if it's not already the failsafe to prevent infinite loops
              if (e.currentTarget.src !== GENERIC_FAILSAFE_IMAGE) {
                e.currentTarget.src = GENERIC_FAILSAFE_IMAGE;
              }
            }}
          />
        </div>

        <FileUpload
          name="image"
          mode="basic"
          accept="image/*"
          maxFileSize={1000000}
          chooseLabel="Select Image"
          onSelect={onFileSelect}
        />
        <small className="p-d-block p-text-secondary mt-2">
          Upload an image file for the product (Max 1MB). Selecting a new image will replace the current one.
        </small>
      </div>
    </Dialog>
  );
});

export default ProductDialog;