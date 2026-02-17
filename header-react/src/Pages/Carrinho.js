import { useEffect, useState } from "react";
import styled from "styled-components";
import { supabase } from "../services/supabaseClient";

const Carrinho = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  async function fetchCart() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("carrinho")
      .select(`
        id,
        quantidade,
        produtos (
          id,
          nome,
          preco,
          imagem_url
        )
      `)
      .eq("user_id", user.id);

    if (!error) {
      setItems(data);
    }

    setLoading(false);
  }

  async function removeItem(id) {
    await supabase.from("carrinho").delete().eq("id", id);
    fetchCart();
  }

  if (loading) return <Container>Carregando...</Container>;

  return (
    <Container>
      <h1>Seu Carrinho</h1>

      {items.length === 0 && <p>Seu carrinho está vazio.</p>}

      {items.map((item) => (
        <Card key={item.id}>
          <img src={item.produtos.imagem_url} alt="" />
          <div>
            <h3>{item.produtos.nome}</h3>
            <p>R$ {item.produtos.preco}</p>
          </div>
          <button onClick={() => removeItem(item.id)}>
            Remover
          </button>
        </Card>
      ))}
    </Container>
  );
};

export default Carrinho;
const Container = styled.div`
  min-height: 100vh;
  background: #0D0D0D;
  color: white;
  padding: 120px 100px;
`;

const Card = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  background: #1A1A1A;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;

  img {
    width: 100px;
    object-fit: contain;
  }

  button {
    margin-left: auto;
    background: #7C3AED;
    border: none;
    padding: 8px 16px;
    color: white;
    cursor: pointer;
    border-radius: 6px;
  }
`;
