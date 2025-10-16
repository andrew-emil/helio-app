import { supabase } from "@/services/supabaseClient";

// helper: convert dataURL -> File
async function dataURLToFile(dataUrl: string, filename: string) {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type });
}

// Upload images (File | dataURL string | existing public URL) to Supabase
export async function uploadImagesToSupabase(images: Array<File | string>): Promise<string[]> {
    const bucket = 'properties'; // make sure you created this bucket in Supabase and set public access if you want public URLs
    const uploadedUrls: string[] = [];

    for (const img of images) {
        try {
            // If it's already an absolute URL (http/https) — assume it's uploaded
            if (typeof img === 'string' && (img.startsWith('http://') || img.startsWith('https://'))) {
                uploadedUrls.push(img);
                continue;
            }

            // If it's a data URL string, convert to File
            let fileToUpload: File;
            if (typeof img === 'string') {
                // make a name
                const ext = (img.match(/data:.*\/(.*);base64/)?.[1]) || 'png';
                fileToUpload = await dataURLToFile(img, `img-${Date.now()}.${ext}`);
            } else {
                fileToUpload = img;
            }

            const fileExt = (fileToUpload.name.split('.').pop() || 'jpg').replace(/\?.*$/, '');
            const filename = `prop-${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
            const path = `${filename}`;

            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(path, fileToUpload, { cacheControl: '3600', upsert: false });

            if (uploadError) {
                console.error('Supabase upload error:', uploadError);
                throw uploadError;
            }

            // get public url
            const { data: publicData } = supabase.storage
                .from(bucket)
                .getPublicUrl(path);


            uploadedUrls.push(publicData.publicUrl);
        } catch (err) {
            console.error('Failed to upload an image, continuing with others:', err);
            // optionally rethrow if you want to fail fast
        }
    }

    return uploadedUrls;
}