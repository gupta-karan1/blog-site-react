// install react router dom with the following command: npm install react-router-dom --save

import About from "./About";
import Home from "./Home";
import NewPost from "./NewPost";
import PostPage from "./PostPage";
import Missing from "./Missing";
import { useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Layout from "./Layout";
import { format } from "date-fns";
import api from "./api/posts";
import EditPost from "./Edit.js";
import useWindowSize from "./hooks/useWindowSize";

function App() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState([]);

  const [searchResults, setSearchResults] = useState([]);

  const [postTitle, setPostTitle] = useState("");
  const [postBody, setPostBody] = useState("");

  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");

  const navigate = useNavigate();

  const { width } = useWindowSize();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get("/posts");
        setPosts(response.data);
      } catch (err) {
        if (err.response) {
          //Not in the 200 response range
          console.log(err.response.data);
          console.log(err.response.status);
          console.log(err.response.headers);
        } else {
          console.log(`Error: ${err.message}`);
        }
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const filteredResults = posts.filter(
      (post) =>
        post.body.toLowerCase().includes(search) ||
        post.title.toLowerCase().includes(search)
    );

    setSearchResults(filteredResults.reverse());
  }, [posts, search]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/posts/${id}`);
      const postsList = posts.filter((post) => post.id !== id);
      setPosts(postsList);
      navigate("/");
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = posts.length ? posts[posts.length - 1] + 1 : 1;
    //npm install date-fns --save
    const datetime = format(new Date(), "MMMM dd, yyyy pp");
    const newPost = { id, title: postTitle, datetime, body: postBody };
    try {
      const response = await api.post("/posts", newPost);
      const allPosts = [...posts, response.data];
      setPosts(allPosts);
      setPostTitle("");
      setPostBody("");
      navigate("/");
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }
  };

  const handleEdit = async (id) => {
    const datetime = format(new Date(), "MMMM dd, yyyy pp");
    const updatedPost = { id, title: editTitle, datetime, body: editBody };
    try {
      const response = await api.put(`/posts/${id}`, updatedPost);
      setPosts(
        posts.map((post) => (post.id === id ? { ...response.data } : post))
      );
      setEditTitle("");
      setEditBody("");
      navigate("/");
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }
  };

  return (
    <Routes>
      <Route
        element={<Layout search={search} setSearch={setSearch} width={width} />}
        path="/"
      >
        <Route index element={<Home posts={searchResults} />} />

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

        <Route
          path="/edit/:id"
          element={
            <EditPost
              posts={posts}
              handleEdit={handleEdit}
              editBody={editBody}
              editTitle={editTitle}
              setEditBody={setEditBody}
              setEditTitle={setEditTitle}
            />
          }
        />

        <Route path="about" element={<About />} />

        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;
