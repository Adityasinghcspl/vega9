import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { Blog, BlogFormData } from '../../types/Blog';
import BlogList from '../../components/BlogList';
import BlogForm from '../../components/BlogForm';
import BlogViewModal from '../../components/BlogViewModal';
import { clearEditingBlog, createBlog, deleteBlog, getAllBlogs, setEditingBlog, setViewingBlog, updateBlog } from '../../redux/features/blog/blogSlice';

function BlogPage() {
  const dispatch = useDispatch<AppDispatch>();

  const blogs = useSelector((state: RootState) => state.blog.blogsList?.data);
  const editingBlog = useSelector((state: RootState) => state.blog.editingBlog);
  const viewingBlog = useSelector((state: RootState) => state.blog.viewingBlog);

  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(getAllBlogs());
  }, [dispatch]);

  const handleCreateBlog = async (formData: BlogFormData) => {
    await dispatch(createBlog(formData));
    setShowForm(false);
    await dispatch(getAllBlogs());
  };

  const handleEditBlog = (formData: BlogFormData) => {
    if (!editingBlog) return;
    dispatch(updateBlog({ id: editingBlog._id, blogData: formData }));
    dispatch(clearEditingBlog());
  };

  const handleDeleteBlog = (id: string) => {
    dispatch(deleteBlog(id));
  };

  const handleEditClick = (blog: Blog) => {
    dispatch(setEditingBlog(blog));
  };

  const handleCancelForm = () => {
    setShowForm(false);
    dispatch(clearEditingBlog());
  };


  return (
    <div>
      <main className="mx-auto px-3 sm:px-6 md:px-8 lg:px-10 py-1">
        <BlogList
          blogs={blogs}
          onEdit={handleEditClick}
          onDelete={handleDeleteBlog}
          onCreateNew={() => setShowForm(true)}
        />
      </main>

      {showForm && (
        <BlogForm
          onSubmit={handleCreateBlog}
          onCancel={handleCancelForm}
        />
      )}

      {editingBlog && (
        <BlogForm
          blog={editingBlog}
          onSubmit={handleEditBlog}
          onCancel={handleCancelForm}
          isEditing={true}
        />
      )}

      {viewingBlog && (
        <BlogViewModal
          blog={viewingBlog}
          onClose={() => dispatch(setViewingBlog(null))}
        />
      )}
    </div>
  );
}

export default BlogPage;

