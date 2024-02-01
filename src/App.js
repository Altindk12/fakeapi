import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  // State to store data about users, their posts, and comments
  const [usersWithPostsAndComments, setUsersWithPostsAndComments] = useState(
    []
  );
  // useEffect to fetch data when the component mounts
  useEffect(() => {
    // Async function to fetch data
    const fetchData = async () => {
      try {
        // Fetch the first  5 users
        const usersResponse = await fetch(
          "https://jsonplaceholder.typicode.com/users"
        );
        const usersData = await usersResponse.json();
        const limitedUsers = usersData.slice(0, 5);

        // Fetch 5 posts  for each user  and 1  comments on each post for each user
        const usersWithPostsAndComments = await Promise.all(
          limitedUsers.map(async (user) => {
            // Fetch the first 5 posts for each user
            const postsResponse = await fetch(
              `https://jsonplaceholder.typicode.com/users/${user.id}/posts`
            );
            const postsData = await postsResponse.json();
            const limitedPosts = postsData.slice(0, 5);
            // fetch 1 comment for each post
            const postsWithCommentsPromises = limitedPosts.map(async (post) => {
              const commentsResponse = await fetch(
                `https://jsonplaceholder.typicode.com/posts/${post.id}/comments`
              );
              const commentsData = await commentsResponse.json();
              const limitedComments = commentsData.slice(0, 1);
              return { post, comments: limitedComments };
            });
            //   wait for all comments to be fetched
            const postsWithComments = await Promise.all(
              postsWithCommentsPromises
            );

            return { user, postsWithComments };
          })
        );
        // Update state with the fetched data

        setUsersWithPostsAndComments(usersWithPostsAndComments);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    // Call the fetchData function when the component mounts

    fetchData();
  }, []);

  return (
    <div className="app-container">
      <h1>Users, Posts dhe nga nje Comment per secilin post</h1>
      {usersWithPostsAndComments.map(({ user, postsWithComments }) => (
        <div key={user.id} className="user-container">
          <h2>User: {user.name}</h2>
          <p>Email: {user.email}</p>
          <p>Phone: {user.phone}</p>
          <p>Website: {user.website}</p>
          <p>
            Address: {user.address.street}, {user.address.suite},{" "}
            {user.address.city}, {user.address.zipcode}
          </p>
          <div className="posts-container">
            {postsWithComments.map(({ post, comments }) => (
              <div key={post.id} className="post-container">
                <h3>Post: {post.title}</h3>
                <p>{post.body}</p>
                <ul>
                  {comments.map((comment) => (
                    <li key={comment.id}>Comment: {comment.body}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
