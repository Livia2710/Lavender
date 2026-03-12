import { useEffect, useState } from "react";
import styled from "styled-components";
import { supabase } from "../services/supabaseClient";
import { QRCodeCanvas } from "qrcode.react";

const Carrinho = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
const [paymentMethod, setPaymentMethod] = useState(null);

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
    await supabase
      .from("carrinho")
      .delete()
      .eq("id", id);

    fetchCart();
  }

  async function updateQuantity(id, quantidade) {

    if (quantidade < 1) return;

    await supabase
      .from("carrinho")
      .update({ quantidade })
      .eq("id", id);

    fetchCart();
  }

  async function finalizarCompra() {

    const { data: { user } } = await supabase.auth.getUser();

    await supabase
      .from("carrinho")
      .delete()
      .eq("user_id", user.id);

    alert("Compra realizada com sucesso!");

    fetchCart();
  }

  const total = items.reduce((acc, item) => {
    return acc + item.produtos.preco * item.quantidade;
  }, 0);

  if (loading) return <Container>Carregando...</Container>;

  return (
    <Container>

      <h1>Seu Carrinho</h1>

      {items.length === 0 && <p>Seu carrinho está vazio.</p>}

      {items.map((item) => {

        const subtotal = item.produtos.preco * item.quantidade;

        return (
          <Card key={item.id}>

            <img src={item.produtos.imagem_url} alt="" />

            <Info>

              <h3>{item.produtos.nome}</h3>

              <p>Preço: R$ {item.produtos.preco}</p>

              <Quantidade>

                <button
                  onClick={() =>
                    updateQuantity(item.id, item.quantidade - 1)
                  }
                >
                  -
                </button>

                <span>{item.quantidade}</span>

                <button
                  onClick={() =>
                    updateQuantity(item.id, item.quantidade + 1)
                  }
                >
                  +
                </button>

              </Quantidade>

              <Subtotal>
                Subtotal: R$ {subtotal}
              </Subtotal>

            </Info>

            <RemoveButton
              onClick={() => removeItem(item.id)}
            >
              Remover
            </RemoveButton>

          </Card>
        );
      })}

      {items.length > 0 && (

        <Resumo>

          <h2>Total: R$ {total}</h2>

          <button onClick={() => setShowPayment(true)}>
            Finalizar compra
          </button>

        </Resumo>

      )}

        {showPayment && (
  <Modal>

    <PaymentBox>

      <h2>Escolha o método de pagamento</h2>

      {!paymentMethod && (
        <Options>

          <button onClick={() => setPaymentMethod("credito")}>
            Crédito
          </button>

          <button onClick={() => setPaymentMethod("debito")}>
            Débito
          </button>

          <button onClick={() => setPaymentMethod("pix")}>
            Pix
          </button>

        </Options>
      )}

      {paymentMethod === "credito" && (
        <div>
          <h3>Pagamento com Cartão de Crédito</h3>

          <input placeholder="Número do cartão" />
          <input placeholder="Nome no cartão" />
          <input placeholder="Validade" />
          <input placeholder="CVV" />

          <button onClick={finalizarCompra}>
            Confirmar pagamento
          </button>
        </div>
      )}

      {paymentMethod === "debito" && (
        <div>
          <h3>Pagamento com Cartão de Débito</h3>

          <input placeholder="Número do cartão" />
          <input placeholder="Nome no cartão" />
          <input placeholder="Validade" />
          <input placeholder="CVV" />

          <button onClick={finalizarCompra}>
            Confirmar pagamento
          </button>
        </div>
      )}

      {paymentMethod === "pix" && (
        <PixArea>

          <h3>Pagamento via Pix</h3>

          <QRCodeCanvas
            value="pagamento-lavender-store"
            size={200}
          />

          <p>Escaneie o QR Code para pagar</p>

          <button onClick={finalizarCompra}>
            Já paguei
          </button>

        </PixArea>
      )}

      <Close onClick={() => {
        setShowPayment(false);
        setPaymentMethod(null);
      }}>
        Fechar
      </Close>

    </PaymentBox>

  </Modal>
)}
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
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Quantidade = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  button {
    background: #7C3AED;
    border: none;
    color: white;
    width: 28px;
    height: 28px;
    cursor: pointer;
    border-radius: 4px;
  }
`;

const Subtotal = styled.p`
  font-weight: bold;
`;

const RemoveButton = styled.button`
  margin-left: auto;
  background: #7C3AED;
  border: none;
  padding: 8px 16px;
  color: white;
  cursor: pointer;
  border-radius: 6px;
`;

const Resumo = styled.div`
  margin-top: 40px;
  padding: 20px;
  background: #1A1A1A;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  button {
    background: #7C3AED;
    border: none;
    padding: 10px 20px;
    color: white;
    border-radius: 6px;
    cursor: pointer;
  }
`;
const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.7);

  display: flex;
  justify-content: center;
  align-items: center;
`;

const PaymentBox = styled.div`
  background: #1A1A1A;
  padding: 40px;
  border-radius: 10px;
  width: 400px;
  color: white;

  input{
    width:100%;
    margin-bottom:10px;
    padding:8px;
    border-radius:6px;
    border:none;
  }

  button{
    background:#7C3AED;
    border:none;
    color:white;
    padding:10px;
    border-radius:6px;
    cursor:pointer;
  }
`;

const Options = styled.div`
  display:flex;
  gap:10px;
  margin-top:20px;

  button{
    flex:1;
  }
`;

const PixArea = styled.div`
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:15px;
`;

const Close = styled.button`
  margin-top:20px;
  width:100%;
`;