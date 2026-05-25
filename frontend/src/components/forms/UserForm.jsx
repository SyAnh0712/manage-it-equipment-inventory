import { Form, Button } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const userValidationSchema = yup.object().shape({
  username: yup
    .string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters"),
  full_name: yup
    .string()
    .required("Full name is required")
    .min(2, "Full name must be at least 2 characters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Email must be valid"),
  password: yup.string().when("isNew", {
    is: true,
    then: (schema) =>
      schema
        .required("Password is required")
        .min(6, "Password must be at least 6 characters"),
    otherwise: (schema) => schema,
  }),
  role: yup
    .string()
    .required("Role is required")
    .oneOf(["admin", "staff"], "Role must be either admin or staff"),
});

const UserForm = ({ onSubmit, initialData = null, isLoading = false }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(userValidationSchema),
    defaultValues: initialData || {
      username: "",
      full_name: "",
      email: "",
      password: "",
      role: "staff",
    },
  });

  const isNew = !initialData;

  return (
    <Form onSubmit={handleSubmit((data) => onSubmit(data))} autoComplete="off">
      <Form.Group className="mb-3">
        <Form.Label>Username</Form.Label>
        <Controller
          name="username"
          control={control}
          render={({ field }) => (
            <Form.Control
              {...field}
              autoComplete="new-username"
              type="text"
              placeholder="Enter username"
              isInvalid={!!errors.username}
              disabled={isLoading}
            />
          )}
        />
        <Form.Control.Feedback type="invalid">
          {errors.username?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Full Name</Form.Label>
        <Controller
          name="full_name"
          control={control}
          render={({ field }) => (
            <Form.Control
              {...field}
              autoComplete="new-email"
              type="text"
              placeholder="Enter full name"
              isInvalid={!!errors.full_name}
              disabled={isLoading}
            />
          )}
        />
        <Form.Control.Feedback type="invalid">
          {errors.full_name?.message}
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
              autoComplete="new-password"
              type="email"
              placeholder="Enter email"
              isInvalid={!!errors.email}
              disabled={isLoading}
            />
          )}
        />
        <Form.Control.Feedback type="invalid">
          {errors.email?.message}
        </Form.Control.Feedback>
      </Form.Group>

      {isNew && (
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Form.Control
                {...field}
                autoComplete="new-password"
                type="password"
                placeholder="Enter password"
                isInvalid={!!errors.password}
                disabled={isLoading}
              />
            )}
          />
          <Form.Control.Feedback type="invalid">
            {errors.password?.message}
          </Form.Control.Feedback>
        </Form.Group>
      )}

      <Form.Group className="mb-3">
        <Form.Label>Role</Form.Label>
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <Form.Select
              {...field}
              isInvalid={!!errors.role}
              disabled={isLoading}
            >
              <option value="">Select role</option>
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
            </Form.Select>
          )}
        />
        <Form.Control.Feedback type="invalid">
          {errors.role?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <div className="d-grid gap-2">
        <Button variant="primary" type="submit" disabled={isLoading}>
          {isLoading ? "Processing..." : isNew ? "Create User" : "Update User"}
        </Button>
      </div>
    </Form>
  );
};

export default UserForm;
