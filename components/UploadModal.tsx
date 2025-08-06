import { useRef, useState } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";

export default function UploadModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { supabaseClient, session } = useSessionContext();
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file || !session?.user) return;

    setUploading(true);
    const { error: uploadError } = await supabaseClient.storage
      .from("audio")
      .upload(file.name, file);

    if (uploadError) {
      console.error("Storage upload error:", uploadError.message);
      setUploading(false);
      return;
    }

    const { error: dbError } = await supabaseClient.from("audio_files").insert({
      filename: file.name,
      uploaded_by: session.user.id,
    });

    if (dbError) {
      console.error("DB insert error:", dbError.message);
      setUploading(false);
      return;
    }

    setUploading(false);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-black p-4 rounded">
        <input type="file" ref={fileInputRef} />
        <button onClick={handleUpload} disabled={uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
        <button onClick={onClose} disabled={uploading}>
          Cancel
        </button>
      </div>
    </div>
  );
}
