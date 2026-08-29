import supabase from './db-client.js';
import { verifyAdmin } from './auth.js';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const admin = await verifyAdmin(req);

    if (!admin) {
      return res.status(401).json({
        error: 'Unauthorized - valid admin session required',
      });
    }

    const { fileName, fileBase64, contentType } = req.body || {};

    if (!fileName || !fileBase64) {
      return res.status(400).json({
        error: 'Missing file data',
      });
    }

    if (!contentType || !contentType.startsWith('image/')) {
      return res.status(400).json({
        error: 'Only image files are allowed',
      });
    }

    const buffer = Buffer.from(fileBase64, 'base64');

    if (!buffer.length) {
      return res.status(400).json({
        error: 'Uploaded file is empty',
      });
    }

    const safeName = fileName
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/^\.+/, '');

    const storagePath = `${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(storagePath, buffer, {
        contentType,
        upsert: false,
      });

    if (uploadError) {
      console.error('Storage upload failed:', uploadError);

      return res.status(500).json({
        error: `Storage upload failed: ${uploadError.message}`,
      });
    }

    const { data: urlData } = supabase.storage
      .from('media')
      .getPublicUrl(storagePath);

    const url = urlData?.publicUrl;

    if (!url) {
      console.error('Failed to generate public media URL');

      return res.status(500).json({
        error: 'Failed to generate public media URL',
      });
    }

    const { error: mediaError } = await supabase
      .from('media')
      .insert({
        url,
        name: fileName,
        path: storagePath,
        type: contentType,
        size: buffer.length,
      });

    if (mediaError) {
      console.error('Media database insert failed:', mediaError);

      // Roll back the Storage object if the database record cannot be created.
      await supabase.storage
        .from('media')
        .remove([storagePath])
        .catch((cleanupError) => {
          console.error('Storage cleanup failed:', cleanupError);
        });

      return res.status(500).json({
        error: `Media database insert failed: ${mediaError.message}`,
      });
    }

    return res.status(200).json({
      url,
      path: storagePath,
    });
  } catch (err) {
    console.error('upload API error:', err);

    return res.status(500).json({
      error: err instanceof Error ? err.message : String(err),
    });
  }
}
