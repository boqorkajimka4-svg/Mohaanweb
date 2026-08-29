import { useState } from 'react';
import { api } from '../../lib/api';

interface ImageInputProps {
  value: string;
  onChange: (url: string) => void;
}

export default function ImageInput({ value, onChange }: ImageInputProps) {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Image is too large. Maximum size is 10MB.');
      return;
    }

    setUploading(true);

    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
          const result = reader.result;

          if (typeof result !== 'string') {
            reject(new Error('Could not read the image file.'));
            return;
          }

          const comma = result.indexOf(',');
          resolve(comma >= 0 ? result.slice(comma + 1) : result);
        };

        reader.onerror = () => {
          reject(new Error('Could not read the image file.'));
        };

        reader.readAsDataURL(file);
      });

      const result = await api.upload(
        file.name,
        base64,
        file.type
      );

      if (!result?.url) {
        throw new Error('Upload succeeded but no media URL was returned.');
      }

      onChange(result.url);
    } catch (error) {
      console.error('CMS image upload failed:', error);

      const message =
        error instanceof Error
          ? error.message
          : 'Unknown upload error';

      alert(`Upload failed: ${message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      {value && (
        <div className="relative">
          <img
            src={value}
            alt="Preview"
            className="max-h-48 w-auto rounded-lg object-contain"
          />
        </div>
      )}

      <label className="inline-flex cursor-pointer items-center rounded-lg border border-slate-600 px-4 py-2 text-sm font-medium hover:bg-slate-800">
        {uploading ? 'Uploading...' : value ? 'Replace image' : 'Upload image'}

        <input
          type="file"
          accept="image/*"
          disabled={uploading}
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];

            if (file) {
              void handleFile(file);
            }

            event.currentTarget.value = '';
          }}
        />
      </label>
    </div>
  );
}
