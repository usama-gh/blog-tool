"use client";

export const QueryBlog = () => {
  if (typeof document !== "undefined") {
    const url = document?.referrer;
    if (url) {
      const blog_name = url.split("?")[1];
      const username = blog_name ? blog_name.split("=")[1] : null;
      if (!sessionStorage.username && username) {
        sessionStorage.setItem("username", username);
      }
    }
  }

  return <></>;
};
