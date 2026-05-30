import { useEffect, useState } from "react";

import { resolveImageUrl } from "../utils/imageUtils";

const useImagePreview = (file, remoteUrl, fallbackUrl = "") => {
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewSource, setPreviewSource] = useState("none");
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (file instanceof File) {
      setIsLoading(true);
      setImageError(false);

      const reader = new FileReader();

      reader.onload = (event) => {
        if (cancelled) {
          return;
        }

        setPreviewUrl(event.target?.result || "");
        setPreviewSource("upload");
        setImageError(false);
        setIsLoading(false);
      };

      reader.onerror = () => {
        if (cancelled) {
          return;
        }

        setPreviewUrl("");
        setPreviewSource("none");
        setImageError(true);
        setIsLoading(false);
      };

      reader.readAsDataURL(file);

      return () => {
        cancelled = true;
      };
    }

    const typedUrl = (remoteUrl || "").trim();
    const savedUrl = (fallbackUrl || "").trim();
    const urlCandidate = typedUrl || savedUrl;

    if (urlCandidate) {
      setPreviewUrl(resolveImageUrl(urlCandidate));
      setPreviewSource(typedUrl ? "url" : "saved");
      setImageError(false);
      setIsLoading(false);
      return;
    }

    setPreviewUrl("");
    setPreviewSource("none");
    setImageError(false);
    setIsLoading(false);
  }, [file, remoteUrl, fallbackUrl]);

  return {
    previewUrl,
    previewSource,
    imageError,
    setImageError,
    isLoading,
  };
};

export default useImagePreview;
