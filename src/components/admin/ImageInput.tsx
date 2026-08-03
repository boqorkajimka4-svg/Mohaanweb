import { useState } from 'react';
import { Upload } from 'lucide-react';
import { api } from '../../lib/api';
import { Input } from './ui';

export default function ImageInput({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);

  const handle = (file: File) => {
    setUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = (reader.result as string).split(',')[1];
        const { url } = await api.upload(file.name, base64, file.type);
        onChange(url);
      } catch { alert('Upload failed'); }
      finally { setUploading(false); }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input value={value} onChange={e => onChange(e.target.value)} placeholder="Image URL or upload" />
        <label className="flex cursor-pointer items-center gap-2 rounded-lg bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/10">
          <Upload size={16} /> {uploading ? '...' : 'Upload'}
          <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files && handle(e.target.files[0])} />
        </label>
      </div>
      {value && <img src={value} alt="preview" className="h-24 rounded-lg border border-white/10 object-cover" />}
    </div>
  );
}
