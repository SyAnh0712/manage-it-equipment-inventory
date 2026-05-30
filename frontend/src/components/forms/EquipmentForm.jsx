import { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import Button from "../common/Button";

const equipmentValidationSchema = yup.object().shape({
  code: yup.string().required("Code is required"),

  name: yup
    .string()
    .min(2, "Equipment name must be at least 2 characters")
    .required("Equipment name is required"),

  category_id: yup.number().required("Category is required"),

  supplier_id: yup.number().required("Supplier is required"),

  unit: yup.string().required("Unit is required"),

  quantity: yup
    .number()
    .min(1, "Quantity must be at least 1")
    .required("Quantity is required"),

  price: yup
    .number()
    .min(0, "Price must be positive")
    .required("Price is required"),

  image_url: yup.string(),

  description: yup.string(),
});

const EquipmentForm = ({
  onSubmit,
  isLoading = false,
  initialData = null,
  categories = [],
  suppliers = [],
}) => {
  const [imageError, setImageError] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(equipmentValidationSchema),

    defaultValues: initialData || {
      code: "",
      name: "",
      category_id: "",
      supplier_id: "",
      unit: "",
      quantity: 1,
      price: 0,
      image_url: "",
      description: "",
    },
  });

  const imageUrl = watch("image_url");

  useEffect(() => {
    setImageError(false);
  }, [imageUrl]);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group className="mb-3">
        <Form.Label>Code</Form.Label>

        <Controller
          name="code"
          control={control}
          render={({ field }) => (
            <Form.Control
              {...field}
              type="text"
              placeholder="Enter equipment code"
              isInvalid={!!errors.code}
            />
          )}
        />

        <Form.Control.Feedback type="invalid">
          {errors.code?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Equipment Name</Form.Label>

        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Form.Control
              {...field}
              type="text"
              placeholder="Enter equipment name"
              isInvalid={!!errors.name}
            />
          )}
        />

        <Form.Control.Feedback type="invalid">
          {errors.name?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Category</Form.Label>

        <Controller
          name="category_id"
          control={control}
          render={({ field }) => (
            <Form.Select {...field} isInvalid={!!errors.category_id}>
              <option value="">Select category</option>

              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </Form.Select>
          )}
        />

        <Form.Control.Feedback type="invalid">
          {errors.category_id?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Supplier</Form.Label>

        <Controller
          name="supplier_id"
          control={control}
          render={({ field }) => (
            <Form.Select {...field} isInvalid={!!errors.supplier_id}>
              <option value="">Select supplier</option>

              {suppliers.map((sup) => (
                <option key={sup.id} value={sup.id}>
                  {sup.name}
                </option>
              ))}
            </Form.Select>
          )}
        />

        <Form.Control.Feedback type="invalid">
          {errors.supplier_id?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Unit</Form.Label>

        <Controller
          name="unit"
          control={control}
          render={({ field }) => (
            <Form.Control
              {...field}
              type="text"
              placeholder="Example: piece, box..."
              isInvalid={!!errors.unit}
            />
          )}
        />

        <Form.Control.Feedback type="invalid">
          {errors.unit?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Quantity</Form.Label>

        <Controller
          name="quantity"
          control={control}
          render={({ field }) => (
            <Form.Control
              {...field}
              type="number"
              isInvalid={!!errors.quantity}
            />
          )}
        />

        <Form.Control.Feedback type="invalid">
          {errors.quantity?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Price</Form.Label>

        <Controller
          name="price"
          control={control}
          render={({ field }) => (
            <Form.Control
              {...field}
              type="number"
              step="0.01"
              isInvalid={!!errors.price}
            />
          )}
        />

        <Form.Control.Feedback type="invalid">
          {errors.price?.message}
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
            />
          )}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Preview</Form.Label>

        {imageUrl ? (
          !imageError ? (
            <div className="border rounded p-2 text-center">
              <img
                src={imageUrl}
                alt="Equipment Preview"
                className="img-fluid"
                style={{
                  maxHeight: "250px",
                  objectFit: "contain",
                }}
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

      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Form.Control {...field} as="textarea" rows={3} />
          )}
        />
      </Form.Group>

      <div className="d-grid">
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Equipment"}
        </Button>
      </div>
    </Form>
  );
};

export default EquipmentForm;
