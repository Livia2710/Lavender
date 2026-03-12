import { useEffect, useState } from "react";
import styled from "styled-components";
import { supabase } from "../services/supabaseClient";
import { Link } from "react-router-dom";

const Favoritos = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchFavorites();
  }, []);

  async function fetchFavorites() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("favoritos")
      .select(`
        id,
        produtos (
          id,
          nome,
          preco,
          imagem_url
        )
      `)
      .eq("user_id", user.id);

    setItems(data || []);
  }

  return (
    <Container>
      <h1>Seus Favoritos</h1>

      {items.length === 0 && <p>Você ainda não favoritou nada.</p>}

      <Grid>
        {items.map((item) => (
          <Card key={item.id}>
            <Link to={`/produtos/${item.produtos.id}`}>
              <img src={item.produtos.imagem_url} alt="" />
              <h3>{item.produtos.nome}</h3>
              <span>R$ {item.produtos.preco}</span>
            </Link>
          </Card>
        ))}
      </Grid>
    </Container>
  );
};

export default Favoritos;

const Container = styled.div`
  min-height: 100vh;
  background: #0D0D0D;
  padding: 120px 100px;
  color: white;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 30px;
`;

const Card = styled.div`
  background: #1A1A1A;
  padding: 20px;
  border-radius: 8px;
  text-align: center;

  img {
    width: 100%;
    height: 160px;
    object-fit: contain;
    margin-bottom: 15px;
  }

  span {
    color: #7C3AED;
    font-weight: bold;
  }

  a {
    text-decoration: none;
    color: white;
  }
`;
