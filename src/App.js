// Importação dos componentes necessarios
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import { useEffect, useState } from "react";
import { supabase } from "./services/supabaseClient";

// Importação das Páginas
import Detalhes from "./Pages/Detalhes";
import Home from "./Pages/Home";
import Produtos from "./Pages/Produtos";
import Login from "./Pages/Login";
import Carrinho from "./Pages/Carrinho";
import Favoritos from "./Pages/Favoritos";
import Header from "./Components/Header";

function PrivateRoute({ user, children }) {
  if (!user) {
    return <Login />;
  }
  return children;
}

// Componente Funcional principal App
function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setUser(data.session?.user?? null);
        });

        //escutar mudanças de login/logout
        const { data: listener} = supabase.auth.onAuthStateChange(
            (event, session) => {
                setUser(session?.user ?? null);
            }
        );
         return () => {
            listener.subscription.unsubscribe();
         };
    }, []);

    return (
        <div className="App">
            <Router>
                <AppContent user={user}/>

            </Router>
        </div>
    );
}

function AppContent({ user }) {
  const location = useLocation();

  const hideHeaderRoutes = ["/login"];

  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideHeader && <Header user={user} />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/produtos/:id" element={<Detalhes />} />
        <Route path="/login" element={<Login />} />
        <Route path="/favoritos" element={<Favoritos />} />
        <Route path="/carrinho" element={<Carrinho />} />
      </Routes>
    </>
  );
}

export default App;
