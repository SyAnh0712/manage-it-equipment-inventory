import { Badge, Spinner } from "react-bootstrap";

const SOURCE_LABELS = {
  upload: "Uploaded file",
  url: "Image URL",
  saved: "Current image",
};

const ImagePreviewBox = ({
  previewUrl,
  previewSource = "none",
  imageError = false,
  setImageError,
  isLoading = false,
  alt = "Image preview",
}) => {
  if (isLoading) {
    return (
      <div className="border rounded p-4 text-center text-muted">
        <Spinner animation="border" size="sm" className="me-2" />
        Loading preview...
      </div>
    );
  }

  if (!previewUrl) {
    return (
      <div className="border rounded p-3 text-center text-muted">
        No image yet. Upload a file or enter an image URL above.
      </div>
    );
  }

  if (imageError) {
    return (
      <div className="alert alert-warning mb-0">
        Cannot load image. Check the uploaded file or URL and try again.
      </div>
    );
  }

  const sourceLabel = SOURCE_LABELS[previewSource];

  return (
    <div className="border rounded p-2 text-center">
      {sourceLabel && (
        <div className="mb-2">
          <Badge bg={previewSource === "upload" ? "primary" : "secondary"}>
            Preview: {sourceLabel}
          </Badge>
        </div>
      )}
      <img
        key={previewUrl}
        src={previewUrl}
        alt={alt}
        className="img-fluid"
        style={{ maxHeight: "250px", objectFit: "contain" }}
        onLoad={() => setImageError?.(false)}
        onError={() => setImageError?.(true)}
      />
    </div>
  );
};

export default ImagePreviewBox;
