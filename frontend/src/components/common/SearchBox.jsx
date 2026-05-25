import { Form, InputGroup } from "react-bootstrap";

const SearchBox = ({
  placeholder = "Search...",
  value,
  onChange,
  onSearch,
}) => {
  return (
    <InputGroup className="mb-3">
      <InputGroup.Text>
        <i className="bi bi-search"></i>
      </InputGroup.Text>
      <Form.Control
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            onSearch?.();
          }
        }}
      />
    </InputGroup>
  );
};

export default SearchBox;
