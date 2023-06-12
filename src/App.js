import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Hub from "./pages/Hub";
import Game from "./pages/Game";
import Shop from "./pages/Shop";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/components/NotFound";
import TermsAndConditions from "./pages/terms-and-conditions";
function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="hub" element={<Hub />} />
          <Route path="game" element={<Game />} />
          <Route path="shop" element={<Shop />} />
          <Route path="terms-and-conditions" element={<TermsAndConditions />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>

  );
}

export default App;
