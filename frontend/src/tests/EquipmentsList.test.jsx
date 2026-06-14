import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EquipmentsList from "../pages/equipment/EquipmentsList";
import equipmentService from "../services/equipmentService";
import { useAuth } from "../hooks/useAuth";

// Mock services & hooks
vi.mock("../services/equipmentService.js", () => ({
  default: {
    getAllEquipments: vi.fn(),
    deleteEquipment: vi.fn(),
  },
}));

vi.mock("../hooks/useAuth.js", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../hooks/useDebounce.js", () => ({
  useDebounce: (value) => value,
}));

vi.mock("../services/socketService.js", () => ({
  listenToSocket: vi.fn(() => () => {}),
}));

vi.mock("react-router-dom", () => ({
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockEquipments = [
  {
    id: 1,
    code: "EQ001",
    name: "Laptop Dell",
    unit: "Cái",
    quantity: 10,
    price: 1200,
  },
  {
    id: 2,
    code: "EQ002",
    name: "Monitor LG 24",
    unit: "Cái",
    quantity: 5,
    price: 200,
  },
  {
    id: 3,
    code: "EQ003",
    name: "Keyboard Logitech",
    unit: "Cái",
    quantity: 15,
    price: 50,
  },
];

describe("EquipmentsList Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      user: { role: "admin" },
    });
  });

  it("fetches equipment list and renders items on mount", async () => {
    vi.mocked(equipmentService.getAllEquipments).mockResolvedValue({
      data: mockEquipments,
    });

    render(<EquipmentsList />);

    // Renders spinner or loading indicator first
    expect(screen.getByRole("status")).toBeInTheDocument();

    await waitFor(() => {
      expect(equipmentService.getAllEquipments).toHaveBeenCalled();
      expect(screen.getByText("Laptop Dell")).toBeInTheDocument();
      expect(screen.getByText("Monitor LG 24")).toBeInTheDocument();
      expect(screen.getByText("Keyboard Logitech")).toBeInTheDocument();
    });
  });

  it("filters equipment list correctly based on search term", async () => {
    vi.mocked(equipmentService.getAllEquipments).mockResolvedValue({
      data: mockEquipments,
    });

    render(<EquipmentsList />);

    await waitFor(() => {
      expect(screen.getByText("Laptop Dell")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(
      /search by code, name or unit/i,
    );

    // Type 'Laptop' to filter the list
    await userEvent.type(searchInput, "Laptop");

    expect(screen.getByText("Laptop Dell")).toBeInTheDocument();
    expect(screen.queryByText("Monitor LG 24")).not.toBeInTheDocument();
    expect(screen.queryByText("Keyboard Logitech")).not.toBeInTheDocument();

    // Clear search and search for code
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, "EQ002");

    expect(screen.queryByText("Laptop Dell")).not.toBeInTheDocument();
    expect(screen.getByText("Monitor LG 24")).toBeInTheDocument();
  });

  it("displays empty state if search query returns no matches", async () => {
    vi.mocked(equipmentService.getAllEquipments).mockResolvedValue({
      data: mockEquipments,
    });

    render(<EquipmentsList />);

    await waitFor(() => {
      expect(screen.getByText("Laptop Dell")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(
      /search by code, name or unit/i,
    );
    await userEvent.type(searchInput, "NonExistentEquipment");

    expect(screen.getByText("No equipments found")).toBeInTheDocument();
    expect(screen.queryByText("Laptop Dell")).not.toBeInTheDocument();
  });
});
