import { Pagination as BSPagination } from "react-bootstrap";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const items = [];

  items.push(
    <BSPagination.Prev
      key="prev"
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
    />,
  );

  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);

  if (startPage > 1) {
    items.push(
      <BSPagination.Item key={1} onClick={() => onPageChange(1)}>
        1
      </BSPagination.Item>,
    );
    if (startPage > 2) {
      items.push(<BSPagination.Ellipsis key="ellipsis-start" disabled />);
    }
  }

  for (let number = startPage; number <= endPage; number++) {
    items.push(
      <BSPagination.Item
        key={number}
        active={number === currentPage}
        onClick={() => onPageChange(number)}
      >
        {number}
      </BSPagination.Item>,
    );
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      items.push(<BSPagination.Ellipsis key="ellipsis-end" disabled />);
    }
    items.push(
      <BSPagination.Item
        key={totalPages}
        onClick={() => onPageChange(totalPages)}
      >
        {totalPages}
      </BSPagination.Item>,
    );
  }

  items.push(
    <BSPagination.Next
      key="next"
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
    />,
  );

  return <BSPagination>{items}</BSPagination>;
};

export default Pagination;
