import * as React from 'react';
import { Link, Route, Routes } from 'react-router-dom';

import './app.module.css';

const About = React.lazy(() => import('about/Module'));
const Blog = React.lazy(() => import('blog/Module'));
const Store = React.lazy(() => import('store/Module'));
const Base = React.lazy(() => import('base/Module'));

export function App() {
  return (
    <>
      <nav className="nav">
        <h1 className="title">Nx Mehrzweck.</h1>
        <Link className="link" to="/">Home</Link>
        <Link className="link" to="/about">About</Link>
        <Link className="link" to="/blog">Blog</Link>
        <Link className="link" to="/store">Store</Link>
        <Link className="link" to="/base">Base</Link>
      </nav>
      <React.Suspense fallback={null}>
        <main className="outlet">
          <Routes>
            <Route element={<h1>Home</h1>} path="/" />
            <Route element={<About />} path="/about" />
            <Route element={<Blog />} path="/blog" />
            <Route element={<Store />} path="/store" />
            <Route element={<Base />} path="/base" />
          </Routes>
        </main>
      </React.Suspense>
    </>
  );
}

export default App;
