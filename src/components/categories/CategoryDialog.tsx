// src/components/CategoryDialog.tsx (or src/pages/categories/CategoryDialog.tsx)
import React, { useEffect, useState, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import type { FileUploadSelectEvent } from 'primereact/fileupload';
import { Chip } from 'primereact/chip'; // Import Chip component
import useMediaQuery from '@mui/material/useMediaQuery';
import { type Category } from '../../types'; // Adjust path if types.ts is elsewhere
import type { CategoryGalleryImage} from '../../types' // Import the new type
import axiosInstance from '../../utils/axiosInstance';

// Define the path to your custom broken image placeholder.
// IMPORTANT: Make sure you have a file named 'broken_image.png'
// in your 'public/assets/' folder (or adjust the path accordingly).
const CUSTOM_BROKEN_IMAGE_FALLBACK = '/assets/broken_image.png';

// A minimal transparent GIF, used as a final failsafe if CUSTOM_BROKEN_IMAGE_FALLBACK also fails to load.
const GENERIC_FAILSAFE_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';


// Extends the Category type to include a File object for new image uploads,
// and a field for a selected gallery image URL.
interface CategoryDialogData extends Partial<Category> {
  newImageFile?: File | null;
  selectedGalleryImageUrl?: string | null; // New field for gallery image URL
}

// Props interface for the CategoryDialog component
interface CategoryDialogProps {
  visible: boolean;
  isEdit: boolean;
  categoryData: CategoryDialogData; // Changed from productData
  setCategoryData: React.Dispatch<React.SetStateAction<CategoryDialogData>>; // Changed from setProductData
  onHide: () => void;
  onSave: () => void;
}

const CategoryDialog = React.memo(({
  visible,
  isEdit,
  categoryData, // Changed
  setCategoryData, // Changed
  onHide,
  onSave,
}: CategoryDialogProps) => {

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

  // State to hold the object URL for the image preview (for newly uploaded files)
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  // NEW: State to store the list of category images/icons from the API
  const [categoryGalleryImages, setCategoryGalleryImages] = useState<CategoryGalleryImage[]>([]);

  // Effect to fetch category gallery images when the dialog becomes visible
  useEffect(() => {
    if (visible && categoryGalleryImages.length === 0) { // Fetch only if dialog visible and not already fetched
      fetchCategoryGalleryImages();
    }
  }, [visible, categoryGalleryImages.length]); // Re-run when visibility changes or if images are missing

  const fetchCategoryGalleryImages = async () => {
    try {
      // IMPORTANT: Replace with your actual API endpoint for category images/icons
      const response = await axiosInstance.get<CategoryGalleryImage[]>('/store/category/gallery/');
      setCategoryGalleryImages(response.data);
    } catch (error) {
      console.error("Failed to fetch category gallery images:", error);
      // You might want to display a toast error here
    }
  };

  // useEffect hook to manage the creation and revocation of object URLs (for File uploads).
  useEffect(() => {
    if (categoryData.newImageFile) {
      const url = URL.createObjectURL(categoryData.newImageFile);
      setImagePreviewUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      // If no new file is selected, and there was a previous preview URL, revoke it
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
      setImagePreviewUrl(null);
    }
  }, [categoryData.newImageFile]);


  // Determine the source for the image preview based on available image data.
  // Priority: newly selected file > selected gallery image > existing category image > broken image fallback.
  const displayImageSrc = imagePreviewUrl // From new FileUpload
    ? imagePreviewUrl
    : categoryData.selectedGalleryImageUrl // From gallery chip click
      ? categoryData.selectedGalleryImageUrl
      : categoryData.icon // Existing image URL from backend
        ? categoryData.icon
        : CUSTOM_BROKEN_IMAGE_FALLBACK; // Fallback to your custom broken image icon

  // Handler for when a file is selected using PrimeReact's FileUpload component
  const onFileSelect = (event: FileUploadSelectEvent) => {
    setCategoryData(prev => ({
      ...prev,
      newImageFile: event.files[0] || null,
      selectedGalleryImageUrl: null, // Clear gallery selection if a new file is uploaded
    }));
  };

  // NEW: Handler for when a gallery image chip is clicked
  const onGalleryImageClick = (imageUrl: string) => {
    setCategoryData(prev => ({
      ...prev,
      newImageFile: null, // Clear any pending file upload
      selectedGalleryImageUrl: imageUrl, // Set the selected gallery image URL
    }));
  };

  // Reset image related states when dialog is hidden
  useEffect(() => {
    if (!visible) {
      setImagePreviewUrl(null);
      setCategoryData(prev => ({ ...prev, newImageFile: null, selectedGalleryImageUrl: null }));
    }
  }, [visible, setCategoryData]);


  return (
    <Dialog
      header={isEdit ? "Edit Category" : "Add New Category"}
      visible={visible}
      style={{ width: isSmallScreen ? "95vw" : '50vw' }}
      modal
      className="p-fluid"
      footer={dialogFooter}
      onHide={onHide}
    >
      <div className="p-field mb-3">
        <label htmlFor="name" className="font-bold">Category Name</label>
        <InputText
          id="name"
          value={categoryData.name || ""}
          onChange={(e) => setCategoryData({ ...categoryData, name: e.target.value })}
          required
          autoFocus
        />
      </div>

      <div className="p-field mb-3">
        <label htmlFor="categoryImage" className="font-bold">Category Image/Icon</label>

        {/* Image Preview Area */}
        <div className="flex justify-content-center mb-3">
          <img
            alt="Category Preview"
            src={displayImageSrc}
            style={{ maxWidth: '150px', maxHeight: '150px', objectFit: 'contain', border: '1px solid #ccc', padding: '5px' }}
            onError={(e) => {
              if (e.currentTarget.src !== GENERIC_FAILSAFE_IMAGE) {
                e.currentTarget.src = GENERIC_FAILSAFE_IMAGE;
              }
            }}
          />
        </div>

        {/* File Upload Component */}
        <FileUpload
          name="image"
          mode="basic"
          accept="image/*"
          maxFileSize={1000000}
          chooseLabel="Upload New Image"
          onSelect={onFileSelect}
        />
        <small className="p-d-block p-text-secondary mt-2">
          Upload a new image file (Max 1MB). Overrides gallery selection.
        </small>

        {/* NEW: Category Image Gallery Chips */}
        {categoryGalleryImages.length > 0 && (
          <div className="mt-4">
            <h6 className="font-bold mb-2">Or Select from Gallery:</h6>
            <div className="flex flex-wrap gap-2">
              {categoryGalleryImages.map((img) => (
                <Chip
                  key={img.id} // Assuming a unique ID for each gallery image
                  label={img.name}
                  image={img.url}
                  className={`p-chip-sm cursor-pointer ${
                    categoryData.selectedGalleryImageUrl === img.url ? 'p-chip-highlight' : ''
                  }`}
                  onClick={() => onGalleryImageClick(img.url)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
});

export default CategoryDialog;