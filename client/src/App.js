import "./App.css";
import { Routes, Route } from "react-router-dom";
import { UserContextProvider } from "./components/UserContext";
import Layout from "./components/Layout";
import Header from "./components/Header";
import IndexPage from "./components/pages/IndexPage";
import PostPage from "./components/pages/PostPage";
import LoginPage from "./components/pages/LoginPage";
import RegisterPage from "./components/pages/RegisterPage";
import CreatePostPage from "./components/pages/CreatePostPage";
import SinglePostPage from "./components/pages/SinglePostPage";
import EditPostPage from "./components/pages/EditPostPage";

function App() {
    return (
        <UserContextProvider>
            <Routes>
                <Route path={"/"} element={<Layout />}>
                    <Route index element={<IndexPage />} />
                    <Route path={"/login"} element={<LoginPage />} />
                    <Route path={"/register"} element={<RegisterPage />} />
                    <Route path={"/create"} element={<CreatePostPage />} />
                    <Route path={"/post/:id"} element={<SinglePostPage />} />
                    <Route path={"/edit/:id"} element={<EditPostPage />} />
                </Route>
            </Routes>
        </UserContextProvider>
    );
}

export default App;
