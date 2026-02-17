import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";

// Importando Componentes
import Slider from "../Components/Silder";
import Footer from "../Components/Footer";

// Importando imagens
import Celular from "../Assets/Imagens/Celular_preto.png";
import Headfone from "../Assets/Imagens/Headfone_preto.png";
import Notebook from "../Assets/Imagens/Notebook.png";
import Smart from "../Assets/Imagens/Smartwatch_preto.png";
import Headphonek_Azul from "../Assets/Imagens/Notebook_azul.png"
import SmartWatch from "../Assets/Imagens/Smartwatch_branco.png";
import Alexa from "../Assets/Imagens/Alexa.png";
import IconeCaminhao from "../Assets/Icone/caminhao.png";
import IconeCadeado from "../Assets/Icone/cadeado.png";
import IconeCartao from "../Assets/Icone/cartao.png";

const categories = [
  { id: 1, title: "Celular", image: Celular, slug: "celular" },
  { id: 2, title: "Headphone", image: Headfone, slug: "headphone" },
  { id: 3, title: "Notebook", image: Notebook, slug: "notebook" },
  { id: 4, title: "Acessórios", image: Smart, slug: "acessorios" }
];

const produtos = [
  { id: 1, nome: "Headphone Azul", image: Headphonek_Azul, precoAntigo: 5999, precoNovo: 4599, slug: "headphone" },
  { id: 2, nome: "Alexa", image: Alexa, precoAntigo: 699, precoNovo: 499, slug: "alexa" },
  { id: 3, nome: "Smartwatch", image: SmartWatch, precoAntigo:899, precoNovo:649, slug: "smartwatch" }
];

const vantagens = [
  { id: 1, title: "Frete Rápido", text:"Entrega para todo o Brasil com envio imediato", icon: IconeCaminhao},
  { id: 2, title: "Pagamento Seguro", text: "Ambiente 100% protegido e criptografado", icon: IconeCartao},
  { id: 3, title: "Garantia Oficial", text: "Produtos com garantia e suporte especializado", icon: IconeCadeado}
]


// Componente funcional Home
const Home = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (slug) => {
    navigate(`/produtos?categoria=${slug}`);
  };

  return(
    <>

    <Container>
    
      <Slider/>
      <CategoriesSection>
        {categories.map((item) => (
          <CategoryCard key={item.id} onClick={() => handleCategoryClick(item.slug)}>
            <CategoryImage src={item.image} alt={item.title}></CategoryImage>
            <CategoryTitle>{item.title}</CategoryTitle>
          </CategoryCard>
        ))}
      </CategoriesSection>

     <SemanaSection>
      <SemanaTitle> Produtos da Semana </SemanaTitle>
      <SemanaGrid>
        {produtos.map((produto) => (
          <SemanaCard key={produto.id}>
            <SemanaImagem src={produto.image}></SemanaImagem>
                <SemanaNomeProduto>{produto.nome}</SemanaNomeProduto>
                <SemanaPrecoContainer>
                  <PrecoAntigo>
                    R$ {produto.precoAntigo.toLocaleString("pt-BR")}
                  </PrecoAntigo>

                   <PrecoNovo>
                    R$ {produto.precoNovo.toLocaleString("pt-BR")}
                  </PrecoNovo>
                </SemanaPrecoContainer>
                <SemanaButton onClick={() =>
                  navigate(`/produtos?categoria=${produto.slug}`)
                }>
                  Comprar
                </SemanaButton>
          </SemanaCard>
        ))}

      </SemanaGrid>
     </SemanaSection>

   <VantagensSection>
  <VantagensTitle>As Vantagens da Loja</VantagensTitle>

  <VantagensGrid>
    {vantagens.map((item) => (
      <VanCard key={item.id}>
      <VanInfo>
        <AdvIcon src={item.icon} alt={item.title}></AdvIcon>
        <VanTitle>{item.title}</VanTitle>
      </VanInfo>
      <VanText>{item.text}</VanText>
    </VanCard>
    ))}
  </VantagensGrid>
    </VantagensSection>

       <Footer/>
    </Container>
    </>

  );
};


// Container principal
const Container = styled.div`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
`;

const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const CategoriesSection = styled.section`
  display: flex;
  justify-content: center;
  gap: 40px;
  width: 100%;
  background: #0D0D0D;
  padding-bottom: 5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 60px;
    padding: 3rem 0;
  }
`;


const CategoryCard = styled.div`
  position: relative;
  width: 300px;
  height: 180px;
  background: #1A1A1A;
  border-radius: 5px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 20px;
  cursor: pointer;
  overflow: visible;
  transition: 0.3s ease;
  animation: ${fadeUp} 0.8s ease forwards;

  &:hover {
    transform: translateY(-10px);
    border: 1px solid #7C3AED;
  }

  @media (max-width: 768px) {
    width: 85%;
    height: 160px;
  }
`;


const CategoryImage = styled.img`
  position: absolute;
  top: -40px;
  width: 140px;
  object-fit: contain;
  z-index: 1;
  transition: 0.3s ease;
  ${CategoryCard}:hover & {
    transform: scale(1.08);
   
  }
`;

const CategoryTitle = styled.h3`
  position: relative;
  z-index: 2;
  color: white;
  font-size: 18px;
  font-weight: 600;
  font-family: "Space Grotesk";
`;

const SemanaSection = styled.section`
  width: 100%;
  background: #1a1a1a;
  padding-top: 2%;
  text-align: center;
`;

const SemanaTitle = styled.h2`
  color: white;
  font-size: 32px;
  margin-bottom: 80px;
  font-family: "Space Grotesk";
  letter-spacing: 2px;

  @media (max-width: 768px) {
    font-size: 24px;
    margin-bottom: 40px;
  }
`;


const SemanaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 0 20px;
  }
`;


const SemanaCard = styled.div`
  padding: 40px 20px;
  transition: 0.3s ease;

  &:hover {
  transform: translateY(-8px);
  background: #222222;
  }
`;

const SemanaImagem = styled.img`
  width: 180px;
  margin-bottom: 20px;
  object-fit: contain;
`;

const SemanaNomeProduto = styled.h3`
  color: white;
  margin-bottom: 20px
`;

const SemanaPrecoContainer = styled.div`
  display:flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
`;

const PrecoAntigo = styled.span`
  color: #3C3C3C;
  text-decoration: line-through;
`;

const PrecoNovo = styled.span`
  color: #7c3aed;
  font-weight: bold;
  font-size: 18px;
`;

const SemanaButton = styled.button`
   padding: 14px 40px;
  background: linear-gradient(90deg, #7C3AED, #9333EA);
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(124, 58, 237, 0.5);
  }
`;

const VantagensSection = styled.section`
  width: 100%;
  background: #000;
  box-sizing: border-box;
  padding: 120px 10%;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 768px) {
    padding: 80px 20px;
  }
`;


const VantagensTitle = styled.h2`
  color: white;
  font-size: 36px;
  margin-bottom: 80px;
  font-family: "Space Grotesk";
  letter-spacing: 3px;

  @media (max-width: 768px) {
    font-size: 26px;
    margin-bottom: 40px;
    text-align: center;
  }
`;

const VantagensGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  max-width: 1200px;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`;

const VanText = styled.p`
  font-size: 14px;
  color: #aaa;
  line-height: 1.6;
`;


const AdvIcon = styled.img`
  width: 32px;
  height: 32px;
  object-fit: contain;
 
`;

const VanTitle = styled.h4`
  font-size: 18px;;
  color: white;
  font-family: "Space Grotesk";
`;

const VanCard = styled.div`
  background: #141414;
  padding: 40px;
  border-radius: 12px;
  transition: 0.3s ease;
  cursor: pointer;
  text-align: left;

  &:hover {
    background: linear-gradient(135deg, #7C3AED, #9333EA);
    transform: translateY(-6px);
  }

  &:hover ${VanTitle},
  &:hover ${VanText} {
    color: white;
  }
`;

const VanInfo = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
`;






export default Home;