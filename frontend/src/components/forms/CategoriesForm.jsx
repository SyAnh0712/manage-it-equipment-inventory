import { Form, Button } from "react-bootstrap";
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
      image_url: "",
    },
  });

  const isNew = !initialData;

  const imageUrlValue = watch("image_url");

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

      {imageUrlValue && (
        <div className="mb-3">
          <div className="text-muted mb-1">Preview</div>
          <div className="border rounded p-2 text-center">
            <img
              src={imageUrlValue}
              alt="Category preview"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </div>
        </div>
      )}

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
