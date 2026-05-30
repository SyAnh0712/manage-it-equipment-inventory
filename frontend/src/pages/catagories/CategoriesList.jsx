import { useState, useEffect } from "react";
import { Container, Row, Col, Button as BSButton, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../hooks/useAuth";
import CategoriesTable from "../../components/ui/CategoriesTable";
import Pagination from "../../components/common/Pagination";
import SearchBox from "../../components/common/SearchBox";
import Loading from "../../components/common/Loading";
import ConfirmDialog from "../../components/common/ConfirmDialog";

import { usePagination } from "../../hooks/usePagination";
import { useDebounce } from "../../hooks/useDebounce";

import categoriesService from "../../services/categoriesService";

const CategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filteredCategories = categories.filter((category) => {
    const name = category.name?.toLowerCase() || "";
    const description = category.description?.toLowerCase() || "";
    const query = debouncedSearchTerm.toLowerCase();

    return name.includes(query) || description.includes(query);
  });

  const pagination = usePagination(filteredCategories, 10);

  async function fetchCategories() {
    try {
      setLoading(true);

      const response = await categoriesService.getAllCategories();

      setCategories(response || []);
    } catch (error) {
      toast.error("Failed to fetch categories");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      await categoriesService.deleteCategory(deleteId);

      setCategories(categories.filter((c) => c.id !== deleteId));

      setDeleteId(null);

      pagination.reset();

      toast.success("Category deleted successfully");
    } catch (error) {
      toast.error("Failed to delete category");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  if (loading) {
    return <Loading />;
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4 align-items-center">
        <Col>
          <h1>Categories Management</h1>
        </Col>

        {isAdmin && (
          <Col className="text-end">
            <Link to="/categories/add">
              <BSButton variant="primary">
                <i className="bi bi-plus-circle me-2"></i> Add New Category
              </BSButton>
            </Link>
          </Col>
        )}
      </Row>

      <Card className="mb-3">
        <Card.Body>
          <Row className="g-3">
            <Col md={6}>
              <SearchBox
                placeholder="Search by category name or description..."
                value={searchTerm}
                onChange={setSearchTerm}
              />
            </Col>

            <Col md={6} className="text-end">
              <small className="text-muted">
                Total: <strong>{filteredCategories.length}</strong> category(s)
              </small>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          {filteredCategories.length === 0 ? (
            <div className="alert alert-info text-center mb-0">
              No categories found
            </div>
          ) : (
            <>
              <CategoriesTable
                categories={pagination.paginatedItems}
                onDelete={(id) => setDeleteId(id)}
                isAdmin={isAdmin}
              />

              <div className="d-flex justify-content-center mt-4">
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={pagination.goToPage}
                />
              </div>
            </>
          )}
        </Card.Body>
      </Card>

      <ConfirmDialog
        show={!!deleteId}
        title="Delete Category"
        message="Are you sure you want to delete this category?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={isDeleting}
      />
    </Container>
  );
};

export default CategoriesList;
