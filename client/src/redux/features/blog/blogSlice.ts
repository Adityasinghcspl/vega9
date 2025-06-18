import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RestClientBuilder } from "../../../utils/RestClient";
import { RESTServerRoute } from "../../../types/server";
import config from "../../../config/config";
import { logout } from "../auth/authSlice";
import { BlogState } from "../../../types/slice";
import { Blog, BlogFormData } from "../../../types/Blog";

const initialState: BlogState = {
  blogsList: {
    data: null,
    loading: false,
    error: null,
  },
  blog: {
    data: null,
    loading: false,
    error: null,
  },
  editingBlog: null,
  viewingBlog: null,
};

// Get all blogs
export const getAllBlogs = createAsyncThunk<Blog[], void>(
  "blog/getAllBlogs",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No access token found");
      const data = await RestClientBuilder.instance()
        .withBaseUrl(config.API_REST_ENDPOINT)
        .withHeader("Authorization", token)
        .build()
        .get<Blog[]>(RESTServerRoute.REST_GET_ALL_BLOGS);

      return data;
    } catch (error: any) {
      if (error.status === 401) {
        dispatch(logout());
      }
      const errorMessage = error?.response?.data?.message || error.message;
      return rejectWithValue(errorMessage);
    }
  }
);

// Create a blog
export const createBlog = createAsyncThunk<Blog, BlogFormData>(
  "blog/createBlog",
  async (blogData, { rejectWithValue, dispatch }) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No access token found");

      const data = await RestClientBuilder.instance()
        .withBaseUrl(config.API_REST_ENDPOINT)
        .withHeader("Authorization", token)
        .build()
        .post<Blog>(RESTServerRoute.REST_CREATE_BLOG, blogData);

      return data;
    } catch (error: any) {
      if (error.status === 401) {
        dispatch(logout());
      }
      const errorMessage = error?.response?.data?.message || error.message;
      return rejectWithValue(errorMessage);
    }
  }
);

// Delete a blog
export const deleteBlog = createAsyncThunk<string, string>(
  "blog/deleteBlog",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No access token found");

      const data = await RestClientBuilder.instance()
        .withBaseUrl(config.API_REST_ENDPOINT)
        .withHeader("Authorization", token)
        .build()
        .delete<any>(RESTServerRoute.REST_DELETE_BLOG(id));

      return data.message;
    } catch (error: any) {
      if (error.status === 401) {
        dispatch(logout());
      }
      const errorMessage = error?.response?.data?.message || error.message;
      return rejectWithValue(errorMessage);
    }
  }
);

// Update a blog
export const updateBlog = createAsyncThunk<Blog, { id: string; blogData: BlogFormData }>(
  "blog/updateBlog",
  async ({ id, blogData }, { rejectWithValue, dispatch }) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No access token found");

      const data = await RestClientBuilder.instance()
        .withBaseUrl(config.API_REST_ENDPOINT)
        .withHeader("Authorization", token)
        .build()
        .put<Blog>(RESTServerRoute.REST_UPDATE_BLOG(id), blogData);

      return data;
    } catch (error: any) {
      if (error.status === 401) {
        dispatch(logout());
      }
      const errorMessage = error?.response?.data?.message || error.message;
      return rejectWithValue(errorMessage);
    }
  }
);

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    clearBlogError: (state) => {
      state.blogsList.error = null;
      state.blog.error = null;
    },
    setEditingBlog: (state, action: PayloadAction<Blog>) => {
      state.editingBlog = action.payload;
    },
    clearEditingBlog: (state) => {
      state.editingBlog = null;
    },
    setViewingBlog: (state, action: PayloadAction<Blog | null>) => {
      state.viewingBlog = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All
      .addCase(getAllBlogs.pending, (state) => {
        state.blogsList.loading = true;
        state.blogsList.error = null;
      })
      .addCase(getAllBlogs.fulfilled, (state, action) => {
        state.blogsList.loading = false;
        state.blogsList.data = action.payload;
      })
      .addCase(getAllBlogs.rejected, (state, action) => {
        state.blogsList.loading = false;
        state.blogsList.error = action.payload as string;
      })

      // Create
      .addCase(createBlog.fulfilled, (state, action) => {
        state.blogsList.data = state.blogsList.data
          ? [action.payload, ...state.blogsList.data]
          : [action.payload];
      })

      // Update
      .addCase(updateBlog.fulfilled, (state, action) => {
        if (state.blogsList.data) {
          state.blogsList.data = state.blogsList.data.map((blog) =>
            blog._id === action.payload._id ? action.payload : blog
          );
        }
        state.editingBlog = null;
      })

      // Delete
      .addCase(deleteBlog.fulfilled, (state, action) => {
        if (state.blogsList.data) {
          state.blogsList.data = state.blogsList.data.filter(
            (blog) => blog._id !== action.payload
          );
        }
      });
  },
});

export const {
  clearBlogError,
  setEditingBlog,
  clearEditingBlog,
  setViewingBlog,
} = blogSlice.actions;

export default blogSlice.reducer;