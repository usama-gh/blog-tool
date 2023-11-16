import BlogStat from "./blog-stat";

export default function BlogStats({ blogs }: any) {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              User
            </th>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Url
            </th>
            <th scope="col" className="px-6 py-3">
              Posts
            </th>
            <th scope="col" className="px-6 py-3">
              Visits
            </th>
            <th scope="col" className="px-6 py-3">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {blogs?.length > 0 ? (
            blogs?.map((blog: any) => <BlogStat key={blog.id} blog={blog} />)
          ) : (
            <tr className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600">
              <td colSpan={6} className="px-6 py-4">
                No blog
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
