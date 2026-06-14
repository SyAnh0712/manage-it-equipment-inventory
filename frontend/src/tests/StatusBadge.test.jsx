import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import StatusBadge from "../components/common/StatusBadge";

describe("StatusBadge component", () => {
  it("renders status text correctly", () => {
    render(<StatusBadge status="Pending" />);
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it('maps "admin" status to primary variant (bg-primary class)', () => {
    render(<StatusBadge status="admin" />);
    const badge = screen.getByText("admin");
    expect(badge).toHaveClass("bg-primary");
  });

  it('maps "active" and "approved" statuses to success variant (bg-success class)', () => {
    const { rerender } = render(<StatusBadge status="active" />);
    expect(screen.getByText("active")).toHaveClass("bg-success");

    rerender(<StatusBadge status="approved" />);
    expect(screen.getByText("approved")).toHaveClass("bg-success");
  });

  it('maps "rejected" status to danger variant (bg-danger class)', () => {
    render(<StatusBadge status="rejected" />);
    expect(screen.getByText("rejected")).toHaveClass("bg-danger");
  });

  it("defaults to secondary variant (bg-secondary class) for unknown statuses", () => {
    render(<StatusBadge status="unknown-status" />);
    expect(screen.getByText("unknown-status")).toHaveClass("bg-secondary");
  });

  it("handles empty or null status gracefully", () => {
    const { container } = render(<StatusBadge status={null} />);
    // When status is null, it displays empty text, but maps to secondary variant
    const badge = container.querySelector(".badge");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-secondary");
  });
});
