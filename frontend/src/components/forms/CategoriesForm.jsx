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
});

const CategoriesForm = ({
  onSubmit,
  initialData = null,
  isLoading = false,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(categoriesValidationSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
    },
  });

  const isNew = !initialData;

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
