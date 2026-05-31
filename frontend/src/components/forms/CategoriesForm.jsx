import { Form, Button } from "react-bootstrap";
import { useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import useImagePreview from "../../hooks/useImagePreview";
import ImagePreviewBox from "../common/ImagePreviewBox";

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
  const fileInputRef = useRef(null);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
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
  const {
    previewUrl,
    previewSource,
    imageError,
    setImageError,
    isLoading: previewLoading,
  } = useImagePreview(imageFile, imageUrlValue, initialData?.image_url);

  const handleClearUpload = () => {
    setValue("image", null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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
            <>
              <Form.Control
                ref={fileInputRef}
                type="file"
                accept="image/*"
                disabled={isLoading}
                onChange={(event) =>
                  field.onChange(event.target.files?.[0] || null)
                }
              />
              {imageFile instanceof File && (
                <div className="d-flex align-items-center gap-2 mt-2">
                  <small className="text-muted">{imageFile.name}</small>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    type="button"
                    disabled={isLoading}
                    onClick={handleClearUpload}
                  >
                    Remove file
                  </Button>
                </div>
              )}
            </>
          )}
        />
        <Form.Text className="text-muted">
          Uploaded file takes priority over Image URL when both are provided.
        </Form.Text>
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

        <ImagePreviewBox
          previewUrl={previewUrl}
          previewSource={previewSource}
          imageError={imageError}
          setImageError={setImageError}
          isLoading={previewLoading}
          alt="Category preview"
        />
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
