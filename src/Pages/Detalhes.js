import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { supabase } from "../services/supabaseClient";
import Footer from "../Components/Footer";
import { Heart, Truck } from "lucide-react";

const ProductDetail = () => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  

  const toggleFavorite = async () => {
    const {data: {user}} = await supabase.auth.getSession();

    if(!user) {
    setShowModal(true);
    return;
    }

    if(isFavorite){
        await supabase
        .from("favoritos")
        .delete()
        .eq("user_id", user.id)
        .eq("produto_id", product.id);

        setIsFavorite(false);
    } else {
        await supabase.from("favoritos").insert({
            user_id: user.id,
            produto_id: product.id
        });

        setIsFavorite(false)
    }
  };

  const AdicionarCarrinho = async () => {
    const { data: {user}} = await supabase.auth.getUser();

    if(!user) {
        setShowModal(true);
        return;
    }

    await supabase.from("carrinho").insert({
        user_id: user.id,
        produto_id: product.id,
        quantidade: 1
    });

    alert("Produto adicionado ao carrinho!");
  };

  useEffect(() => {
  async function fetchProduct() {
    setLoading(true);

    const { data, error } = await supabase
      .from("produtos")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
      setProduct(null);
      setLoading(false);
      return;
    }

    setProduct(data);

    // BUSCAR PRODUTOS DA MESMA CATEGORIA
    const { data: related, error: relatedError } = await supabase
      .from("produtos")
      .select("*")
      .eq("categoria", data.categoria)
      .neq("id", data.id)
      .limit(4);

    if (relatedError) {
      console.error(relatedError);
      setRelatedProducts([]);
    } else {
      setRelatedProducts(related);
    }

    setLoading(false);
  }

  fetchProduct();
}, [id]);

    

  if (loading) {
    return <NotFound>Carregando...</NotFound>;
  }

  if (!product) {
    return <NotFound>Produto não encontrado</NotFound>;
  }

  return (
     <>
    <Container>
      <ImageSection>
      <ImageWrapper>
        <ProductImage src={product.imagem_url} />
        </ImageWrapper>
      </ImageSection>

      <InfoSection>
        <Category>{product.categoria}</Category>
        <HeartWrapper onClick={toggleFavorite}>
            <Heart
                size={28}
                fill={isFavorite ? "#7C3AED" : "transparent"}
                stroke={isFavorite ? "#7C3AED" : "#888"}
            />
            </HeartWrapper>

        <Title>{product.nome}</Title>

        <PriceContainer>
          <OldPrice>R$ {product.preco_antigo}</OldPrice>
          <NewPrice>R$ {product.preco}</NewPrice>
        </PriceContainer>

        <Description>
          {product.descricao}
        </Description>

        <BuyButton onClick={AdicionarCarrinho}>
          Adicionar ao Carrinho
        </BuyButton>
      </InfoSection>

      {showModal && (
        <ModalOverlay onClick={() => setShowModal(false)}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
            <h2>Login necessário</h2>
            <p>Para finalizar a compra você precisa estar logado.</p>

            <ModalButtons>
                <LoginButton>Fazer Login</LoginButton>
                <RegisterButton>Criar Conta</RegisterButton>
            </ModalButtons>
            </ModalContent>
        </ModalOverlay>
        )}

    </Container>
    <RecommendationSection>
        <h2>Você também pode gostar</h2>

        <RecommendationGrid>
            {relatedProducts.map((item) => (
            <RecommendationCard key={item.id} onClick={() => navigate(`/produtos/${item.id}`)}>
                <img src={item.imagem_url} alt={item.nome} />
                <p>{item.nome}</p>
                <span>R$ {item.preco}</span>
            </RecommendationCard>
            ))}
        </RecommendationGrid>
        </RecommendationSection>

    <Footer/>
   </>
  );
};

export default ProductDetail;

const Container = styled.div`
  display: flex;
  gap: 80px;
  padding: 100px 100px 60px 100px;
  background: #0D0D0D;
  align-items: flex-start;
`;
const ImageSection = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;
const ImageWrapper = styled.div`
  width:450px;
  height:450px;
  display:flex;
  justify-content: center;
  align-items: center;
`;
const ProductImage = styled.img`
  max-width: 400px;
  max-height: 400px;
  width: 100%;
  height: 100%;
  object-fit: contain;
`;
const InfoSection = styled.div`
  flex: 1;
  color: white;
`;
const Category = styled.span`
  color: #7C3AED;
  text-transform: uppercase;
  font-size: 14px;
`;
const Title = styled.h1`
  font-size: 42px;
  margin: 20px 0;
  margin-top: 50px;
  font-family: 'Space Grotesk';
`;
const PriceContainer = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
  margin-bottom: 20px;
`;
const OldPrice = styled.span`
  text-decoration: line-through;
  color: #888;
  font-size: 18px;
`;
const NewPrice = styled.span`
  color: #7C3AED;
  font-size: 28px;
  font-weight: bold;
`;
const Description = styled.p`
  color: #A1A1AA;
  line-height: 1.6;
  margin-bottom: 30px;
`;
const BuyButton = styled.button`
  padding: 15px 40px;
  background: linear-gradient(90deg, #7C3AED, #9333EA);
  border: none;
  border-radius: 10px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(124, 58, 237, 0.5);
  }
`;
const NotFound = styled.div`
  padding: 200px;
  text-align: center;
  color: white;
  background: #0D0D0D;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #1A1A1A;
  padding: 40px;
  border-radius: 8px;
  width: 400px;
  text-align: center;
  color: white;
  animation: fadeIn 0.3s ease;

  h2 {
    margin-bottom: 15px;
  }

  p {
    color: #A1A1AA;
    margin-bottom: 25px;
  }
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
`;

const LoginButton = styled.button`
  padding: 10px 25px;
  background: #7C3AED;
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
`;

const RegisterButton = styled.button`
  padding: 10px 25px;
  background: transparent;
  border: 1px solid #7C3AED;
  border-radius: 8px;
  color: #7C3AED;
  cursor: pointer;
`;

const RecommendationSection = styled.div`
  background: #0D0D0D;
  padding: 80px 100px;
  color: white;
`;

const RecommendationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 30px;
`;

const RecommendationCard = styled.div`
  background: #1A1A1A;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  transition: 0.3s;
  cursor: pointer;

  img {
    width: 100%;
    height: 160px;
    object-fit: contain;
    margin-bottom: 15px;
  }

  p {
    margin-bottom: 5px;
  }

  span {
    color: #7C3AED;
    font-weight: bold;
  }

  &:hover {
    transform: translateY(-5px);
    background: #222;
  }
`;

const HeartWrapper = styled.div`
  cursor: pointer;
  width: fit-content;
  margin-bottom: 15px;
  transition: 0.3s;

  &:hover {
    transform: scale(1.15);
  }
`;

