// ImageUploadModal.tsx - Fixed version with proper file handling
import React, { useState, useCallback } from 'react';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (imageData: { src: string; altText: string }) => void;
}

export const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
  isOpen,
  onClose,
  onInsert,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('file');
  const [previewUrl, setPreviewUrl] = useState('');
  const [fileDataUrl, setFileDataUrl] = useState(''); // Add this for base64 data

  // Convert file to base64 data URL (permanent)
  const convertFileToDataUrl = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }, []);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      try {
        setSelectedFile(file);
        
        // Create both blob URL (for immediate preview) and data URL (for permanent storage)
        const blobUrl = URL.createObjectURL(file);
        const dataUrl = await convertFileToDataUrl(file);
        
        setPreviewUrl(blobUrl);
        setFileDataUrl(dataUrl); // Store the permanent data URL
        setAltText(file.name.split('.')[0]);
        
        console.log('File selected:', {
          name: file.name,
          size: file.size,
          type: file.type,
          dataUrlLength: dataUrl.length
        });
      } catch (error) {
        console.error('Error processing file:', error);
        alert('Error processing file. Please try again.');
      }
    } else {
      alert('Please select a valid image file.');
    }
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value;
    setImageUrl(url);
    setPreviewUrl(url);
    setFileDataUrl(''); // Clear file data when using URL
  };

  const handleInsert = () => {
    let src = '';
    
    if (uploadMethod === 'file' && selectedFile && fileDataUrl) {
      // Use the permanent data URL instead of blob URL
      src = fileDataUrl;
      console.log('Inserting file as data URL, length:', src.length);
    } else if (uploadMethod === 'url' && imageUrl) {
      src = imageUrl;
      console.log('Inserting URL:', src);
    }

    if (src && altText) {
      onInsert({ src, altText });
      handleClose();
    } else {
      alert('Please ensure you have selected an image and provided alt text.');
    }
  };

  const handleClose = () => {
    // Clean up blob URL if it exists
    if (previewUrl && selectedFile && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    
    // Reset all state
    setSelectedFile(null);
    setImageUrl('');
    setAltText('');
    setPreviewUrl('');
    setFileDataUrl('');
    setUploadMethod('file');
    onClose();
  };

  // Handle method switch
  const handleMethodSwitch = (method: 'file' | 'url') => {
    // Clean up previous preview if switching from file
    if (uploadMethod === 'file' && previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    
    setUploadMethod(method);
    setPreviewUrl('');
    setFileDataUrl('');
    setSelectedFile(null);
    setImageUrl('');
    setAltText('');
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={handleClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '24px',
          maxWidth: '500px',
          width: '90%',
          maxHeight: '80vh',
          overflow: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>
          Insert Image
        </h2>

        {/* Upload Method Tabs */}
        <div style={{ display: 'flex', marginBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
          <button
            onClick={() => handleMethodSwitch('file')}
            style={{
              padding: '8px 16px',
              border: 'none',
              backgroundColor: 'transparent',
              borderBottom: uploadMethod === 'file' ? '2px solid #3b82f6' : '2px solid transparent',
              color: uploadMethod === 'file' ? '#3b82f6' : '#6b7280',
              cursor: 'pointer',
              fontWeight: uploadMethod === 'file' ? '600' : '400',
            }}
          >
            Upload File
          </button>
          <button
            onClick={() => handleMethodSwitch('url')}
            style={{
              padding: '8px 16px',
              border: 'none',
              backgroundColor: 'transparent',
              borderBottom: uploadMethod === 'url' ? '2px solid #3b82f6' : '2px solid transparent',
              color: uploadMethod === 'url' ? '#3b82f6' : '#6b7280',
              cursor: 'pointer',
              fontWeight: uploadMethod === 'url' ? '600' : '400',
            }}
          >
            Image URL
          </button>
        </div>

        {/* File Upload */}
        {uploadMethod === 'file' && (
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '600' }}>
              Select Image File
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
              }}
            />
            {selectedFile && (
              <div style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>
                Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
              </div>
            )}
          </div>
        )}

        {/* URL Input */}
        {uploadMethod === 'url' && (
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '600' }}>
              Image URL
            </label>
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={handleUrlChange}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
              }}
            />
          </div>
        )}

        {/* Alt Text */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '600' }}>
            Alt Text (for accessibility) *
          </label>
          <input
            type="text"
            placeholder="Describe the image..."
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
            }}
            required
          />
        </div>

        {/* Preview */}
        {previewUrl && (
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '600' }}>
              Preview
            </label>
            <div style={{ 
              border: '1px solid #d1d5db', 
              borderRadius: '4px', 
              padding: '8px',
              textAlign: 'center',
              backgroundColor: '#f9fafb'
            }}>
              <img
                src={previewUrl}
                alt="Preview"
                style={{
                  maxWidth: '100%',
                  maxHeight: '200px',
                  borderRadius: '4px',
                }}
                onError={(e) => {
                  console.error('Preview image failed to load:', previewUrl);
                  e.currentTarget.style.display = 'none';
                }}
                onLoad={() => {
                  console.log('Preview image loaded successfully');
                }}
              />
            </div>
          </div>
        )}

        {/* Debug Info (remove in production) */}
        {process.env.NODE_ENV === 'development' && (
          <div style={{ marginBottom: '16px', fontSize: '12px', color: '#6b7280' }}>
            <strong>Debug:</strong><br />
            Method: {uploadMethod}<br />
            Preview URL: {previewUrl ? `${previewUrl.substring(0, 50)}...` : 'None'}<br />
            Data URL: {fileDataUrl ? `${fileDataUrl.substring(0, 50)}...` : 'None'}<br />
            Alt Text: {altText || 'Empty'}
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button
            onClick={handleClose}
            style={{
              padding: '8px 16px',
              border: '1px solid #d1d5db',
              backgroundColor: 'white',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleInsert}
            disabled={!previewUrl || !altText}
            style={{
              padding: '8px 16px',
              border: 'none',
              backgroundColor: previewUrl && altText ? '#3b82f6' : '#9ca3af',
              color: 'white',
              borderRadius: '4px',
              cursor: previewUrl && altText ? 'pointer' : 'not-allowed',
            }}
          >
            Insert Image
          </button>
        </div>
      </div>
    </div>
  );
};