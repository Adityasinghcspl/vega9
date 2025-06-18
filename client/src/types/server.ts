// RESTful API
export const RESTServerRoute = {
	// User Routes
	REST_SIGNIN_USER: 'api/user/login',
	REST_SIGNUP_USER: 'api/user/signup',
	REST_All_USERS: 'api/user',
	REST_GET_USER: (id: string) => `api/user/${id}`,
	REST_DELETE_USER: (id: string) => `api/user/${id}`,

	//Blogs Routes
	REST_GET_ALL_BLOGS: 'api/blog',
	REST_CREATE_BLOG: 'api/blog',
	REST_GET_BLOG: (id: string) => `api/blog/${id}`,
	REST_UPDATE_BLOG: (id: string) => `api/blog/${id}`,
	REST_DELETE_BLOG: (id: string) => `api/blog/${id}`,
}