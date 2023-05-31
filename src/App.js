// install react router dom with the following command: npm install react-router-dom --save

import About from "./About";
import Home from "./Home";
import NewPost from "./NewPost";
import PostPage from "./PostPage";
import Missing from "./Missing";
import { useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Layout from "./Layout";

function App() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "React Router",
      body: "React Router is a collection of navigational components that compose declaratively with your application.",
      datetime: "July 26, 2021 11:17:00 AM",
    },
    {
      id: 2,
      title: "React.js",
      body: "React is a JavaScript library for building user interfaces. It is maintained by Facebook and a community of individual developers and companies.",
      datetime: "July 26, 2021 12:17:00 AM",
    },
    {
      id: 3,
      title: "React Hooks",
      body: "Hooks are a new addition in React 16.8. They let you use state and other React features without writing a class.",
      datetime: "July 26, 2021 10:17:00 AM",
    },
    {
      id: 4,
      title: "React Context",
      body: "Context provides a way to pass data through the component tree without having to pass props down manually at every level.",
      datetime: "July 26, 2021 09:17:00 AM",
    },
  ]);
  const [search, setSearch] = useState([]);

  const [searchResults, setSearchResults] = useState([]);

  const [postTitle, setPostTitle] = useState("");
  const [postBody, setPostBody] = useState("");

  const navigate = useNavigate();

  const handleDelete = (id) => {
    const postsList = posts.filter((post) => post.id !== id);
    setPosts(postsList);
    navigate("/");
  };

  const handleSubmit = () => {};

  return (
    <Routes>
      <Route element={<Layout />} path="/">
        <Route index element={<Home posts={posts} />} />

        <Route path="post">
          <Route
            index
            element={
              <NewPost
                handleSubmit={handleSubmit}
                postTitle={postTitle}
                postBody={postBody}
                setPostTitle={setPostTitle}
                setPostBody={setPostBody}
              />
            }
          />

          <Route
            path=":id"
            element={<PostPage posts={posts} handleDelete={handleDelete} />}
          />
        </Route>

        <Route path="about" element={<About />} />

        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;
