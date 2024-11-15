import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { Toaster } from "sonner";

function App() {
  return (
    <>
        <Toaster/>
        <div className="mx-auto max-w-7xl px-4 pt-8">
          <Routes>
            <Route path="/" index element={<Home />} />
          </Routes>
        </div>
      
      </>
  );
}

export default App;
