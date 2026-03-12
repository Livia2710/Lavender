import { useState, useEffect } from "react";
import styled from "styled-components";
import Headfone from "../Assets/Imagens/Headfone.png";
import Notebook from "../Assets/Imagens/Notebook_preto.png";
import Celulares from "../Assets/Imagens/celulares.png"


const products = [
  {
    id: 1,
    name: "Headphone JBL",
    description: "Experimente um som imersivo com cancelamento de ruído.",
    image: Headfone
  },
  {
    id: 2,
    name: "Notebook Gamer",
    description: "Alta performance para jogos e produtividade.",
    image: Notebook
  },
  {
    id: 3,
    name: "Smartwatch Pro",
    description: "Tecnologia e elegância no seu pulso.",
    image: Celulares
  }
];

const Slider = () => {
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);

      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % products.length);
        setFade(true);
      }, 300);

    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Container>
      <Content fade={fade}>
        <Title>{products[current].name}</Title>
        <Description>{products[current].description}</Description>
        <Button>Conheça nossos produtos</Button>
      </Content>

      <ImageWrapper fade={fade}>
        <ProductImage 
          src={products[current].image} 
          alt={products[current].name} 
        />
      </ImageWrapper>
    </Container>
  );
};

export default Slider;

const Container = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #0D0D0D;
  width: 100%;
  margin-top: 5rem;
  padding: 5rem;
  box-sizing: border-box;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    text-align: center;
    padding: 3rem 20px;
    gap: 40px;
  }
`;


const Content = styled.div`
  opacity: ${({ fade }) => (fade ? 1 : 0)};
  transform: ${({ fade }) =>
    fade ? "translateY(0)" : "translateY(20px)"};
  transition: all 0.4s ease;
  padding: 100px;

  @media (max-width: 768px) {
    padding: 0;
  }
`;


const Title = styled.h1`
  font-size: 42px;
  margin-bottom: 20px;
  font-family: 'Space Grotesk', sans-serif;
  color: #ffff;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const Description = styled.p`
  font-size: 18px;
  color: #A1A1AA;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    font-size: 15px;
  }
`;


const Button = styled.button`
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

const ImageWrapper = styled.div`
  opacity: ${({ fade }) => (fade ? 1 : 0)};
  transform: ${({ fade }) =>
    fade ? "translateX(0)" : "translateX(20px)"};
  filter: drop-shadow(0 20px 40px rgba(124, 58, 237, 0.5));
  transition: all 0.4s ease;
  margin-right: 5%;

  @media (max-width: 768px) {
    margin-right: 0;
  }
`;


const ProductImage = styled.img`
  width: 580px;
  height: 580px;
  object-fit: contain;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 300px;
    height: auto;
  }
`;
