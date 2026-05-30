import { Form, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const categoriesValidationSchema = yup.object().shape({
  name: yup
    .string()
    .required("Category name is required")
    .min(2, "Category name must be at least 2 characters"),

  description: yup
    .string()
    .required("Description is required")
    .min(5, "Description must be at least 5 characters"),

  image_url: yup
    .string()
    .url("Image URL must be a valid URL")
    .nullable()
    .notRequired(),
});

const CategoriesForm = ({
  onSubmit,
  initialData = null,
  isLoading = false,
}) => {
  const [imageError, setImageError] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(initialData?.image_url || "");

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(categoriesValidationSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      image: null,
      image_url: "",
    },
  });

  const isNew = !initialData;
  const imageUrlValue = watch("image_url");
  const imageFile = watch("image");

  useEffect(() => {
    setImageError(false);
  }, [imageUrlValue, imageFile]);

  useEffect(() => {
    if (imageFile instanceof File) {
      const objectUrl = URL.createObjectURL(imageFile);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }

    setPreviewUrl(imageUrlValue || initialData?.image_url || "");
  }, [imageFile, imageUrlValue, initialData?.image_url]);

  return (
    <Form onSubmit={handleSubmit((data) => onSubmit(data))}>
      <Form.Group className="mb-3">
        <Form.Label>Category Name</Form.Label>

        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Form.Control
              {...field}
              type="text"
              placeholder="Enter category name"
              isInvalid={!!errors.name}
              disabled={isLoading}
            />
          )}
        />

        <Form.Control.Feedback type="invalid">
          {errors.name?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Form.Control
              {...field}
              as="textarea"
              rows={4}
              placeholder="Enter description"
              isInvalid={!!errors.description}
              disabled={isLoading}
            />
          )}
        />

        <Form.Control.Feedback type="invalid">
          {errors.description?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Upload Image</Form.Label>

        <Controller
          name="image"
          control={control}
          defaultValue={null}
          render={({ field }) => (
            <Form.Control
              type="file"
              accept="image/*"
              disabled={isLoading}
              onChange={(event) =>
                field.onChange(event.target.files?.[0] || null)
              }
            />
          )}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Image URL</Form.Label>

        <Controller
          name="image_url"
          control={control}
          render={({ field }) => (
            <Form.Control
              {...field}
              type="text"
              placeholder="Enter image URL"
              isInvalid={!!errors.image_url}
              disabled={isLoading}
            />
          )}
        />

        <Form.Control.Feedback type="invalid">
          {errors.image_url?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Preview</Form.Label>

        {previewUrl ? (
          !imageError ? (
            <div className="border rounded p-2 text-center">
              <img
                src={previewUrl}
                alt="Category preview"
                style={{ maxWidth: "100%", height: "auto" }}
                onLoad={() => setImageError(false)}
                onError={() => setImageError(true)}
              />
            </div>
          ) : (
            <div className="alert alert-warning mb-0">
              Cannot load image from this URL
            </div>
          )
        ) : (
          <div className="border rounded p-3 text-center text-muted">
            No image selected
          </div>
        )}
      </Form.Group>

      <div className="d-grid gap-2">
        <Button variant="primary" type="submit" disabled={isLoading}>
          {isLoading
            ? "Processing..."
            : isNew
              ? "Create Category"
              : "Update Category"}
        </Button>
      </div>
    </Form>
  );
};

export default CategoriesForm;
