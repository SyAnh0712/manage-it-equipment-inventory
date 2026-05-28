import { Form } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "../common/Button";

const suppliersValidationSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, "Supplier name must be at least 2 characters")
    .required("Supplier name is required"),
  contact_person: yup
    .string()
    .min(2, "Contact person must be at least 2 characters")
    .required("Contact person is required"),
  phone: yup
    .string()
    .required("Phone is required")
    .matches(/^[0-9+\-\s()]+$/, "Invalid phone number"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  address: yup
    .string()
    .min(5, "Address must be at least 5 characters")
    .required("Address is required"),
});

const SuppliersForm = ({
  onSubmit,
  isLoading = false,
  initialValues = null,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(suppliersValidationSchema),
    defaultValues: initialValues || {
      name: "",
      contact_person: "",
      phone: "",
      email: "",
      address: "",
    },
  });

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group className="mb-3">
        <Form.Label>Supplier Name</Form.Label>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Form.Control
              {...field}
              type="text"
              placeholder="Enter supplier name"
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
        <Form.Label>Contact Person</Form.Label>
        <Controller
          name="contact_person"
          control={control}
          render={({ field }) => (
            <Form.Control
              {...field}
              type="text"
              placeholder="Enter contact person name"
              isInvalid={!!errors.contact_person}
              disabled={isLoading}
            />
          )}
        />
        <Form.Control.Feedback type="invalid">
          {errors.contact_person?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Phone</Form.Label>
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <Form.Control
              {...field}
              type="tel"
              placeholder="Enter phone number"
              isInvalid={!!errors.phone}
              disabled={isLoading}
            />
          )}
        />
        <Form.Control.Feedback type="invalid">
          {errors.phone?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Form.Control
              {...field}
              type="email"
              placeholder="Enter email address"
              isInvalid={!!errors.email}
              disabled={isLoading}
            />
          )}
        />
        <Form.Control.Feedback type="invalid">
          {errors.email?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Address</Form.Label>
        <Controller
          name="address"
          control={control}
          render={({ field }) => (
            <Form.Control
              {...field}
              as="textarea"
              rows={3}
              placeholder="Enter supplier address"
              isInvalid={!!errors.address}
              disabled={isLoading}
            />
          )}
        />
        <Form.Control.Feedback type="invalid">
          {errors.address?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <div className="d-grid gap-2">
        <Button variant="primary" type="submit" disabled={isLoading} size="lg">
          {isLoading ? "Saving..." : "Save Supplier"}
        </Button>
      </div>
    </Form>
  );
};

export default SuppliersForm;
