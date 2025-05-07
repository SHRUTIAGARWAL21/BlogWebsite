import "./App.css";
import Post from "./Post.js";
import Header from "./pages/homepage/Header";
import Footer from "./pages/homepage/Footer.js";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import Layout from "./pages/homepage/Layout.js";
import IndexPage from "./pages/homepage/IndexPages.js";
import LoginPage from "./pages/LoginPage.js";
import RegisterPage from "./pages/RegisterPage.js";
import BlogPage from "./pages/BlogPage.js";
import CreatePost from "./pages/CreatePost.js";
import PostPage from "./pages/PostPage.js";
import EditPost from "./pages/EditPost.js";
import UserProfilePage from "./pages/UserProfilePage.js";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
        </Route>
        <Route path={"/blogs"} element={<BlogPage />} />
        <Route path={"/login"} element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/post/:id" element={<PostPage />} />
        <Route path="/edit/:id" element={<EditPost />} />
        <Route path="/myprofile/:id" element={<UserProfilePage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
