import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../services/supabaseClient";

// Componente funcional Header
const Header = ({user}) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return(
    <Container>
    
      {/* Menu de Navegação */}
      <NavMenu>
          
      {/* Logo */}
      <Logo to="/">
        <img src="/images/Logo.png" alt="Logo" />
      </Logo>


        <StyledLink to="/">
          <span>Home</span>
        </StyledLink>

        <StyledLink to="/produtos">
          <span>Produtos</span>
        </StyledLink>

        { user && (
          <>
          <StyledLink to="/favoritos">
          <span>Favoritos</span>
        </StyledLink>

        <StyledLink to="/carrinho">
          <span>Carrinho</span>
        </StyledLink>
          </>
        )}


        
      </NavMenu>


      {/* Botão de login */}
      
      {user ? (
        <Login onClick={async () => {
          await supabase.auth.signOut();
          navigate("/login");
        }}
        >Sair</Login>
      ): (
        <Login to="/login">Login</Login>
      )}
  

      <Hamburger onClick={() => setIsOpen(!isOpen)}>
  <span />
  <span />
  <span />
</Hamburger>

<MobileMenu open={isOpen}>
  <MobileLink to="/" onClick={() => setIsOpen(false)}>Home</MobileLink>
  <MobileLink to="/produtos" onClick={() => setIsOpen(false)}>Produtos</MobileLink>
  <MobileLink to="/login" onClick={() => setIsOpen(false)}>Login</MobileLink>
</MobileMenu>

{isOpen && <Overlay onClick={() => setIsOpen(false)} />}

  
    </Container>
  );
};



// Styled-Components

const Container = styled.div`
  position: fixed;
  background-color: #0D0D0D;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 90px;
  display: flex;
  justify-content: space-between;
  padding: 0 30px;
  align-items: center;
  z-index: 1000;
`;

// Logo agora é Link
const Logo = styled(Link)`
  width: 80px;
  display: flex;
  align-items: center;

  img {
    width: 90%;
    border-radius: 50px;
  }
`;



// Link estilizado
const StyledLink = styled(Link)`
  text-decoration: none;
  display: flex;
  align-items: center;
  padding: 0 12px;
  font-family: 'Space Grotesk', sans-serif;
  letter-spacing: 1px;


  span {
    color: rgb(249, 249, 249);
    font-size: 18px;
    letter-spacing: 1px;
    line-height: 1.08;
    padding: 1px 0;
    white-space: nowrap;
    position: relative;

    &:before {
      background-color: rgb(249, 249, 249);
      border-radius: 0 0 4px 4px;
      bottom: -6px;
      content: "";
      height: 2px;
      left: 0;
      opacity: 0;
      position: absolute;
      right: 0;
      transform-origin: left center;
      transform: scaleX(0);
      transition: all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
      visibility: hidden;
    }
  }

  &:hover span:before {
    transform: scaleX(1);
    visibility: visible;
    opacity: 1;
  }
`;

const NavMenu = styled.div`
  align-items: center;
  display: flex;
  flex-flow: row nowrap;
  height: 100%;
  margin-left: 30px;

  @media (max-width: 768px) {
    display: none;
  }
`;

// Login também como Link
const Login = styled(Link)`
    color: #ffffff;
  background-color: #0D0D0D;
  padding: 10px 16px;
  margin-right: 45px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  border: 1px solid #f9f9f9;
  border-radius: 4px;
  transition: all 0.2s ease;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    background-color: #f9f9f9;
    color: #0D0D0D;
    border-color: transparent;
  }

  @media (max-width: 768px) {
    display: none;
  }

`;

const Hamburger = styled.div`
  display: none;
  flex-direction: column;
  gap: 6px;
  cursor: pointer;
  z-index: 1100;

  span {
    width: 25px;
    height: 3px;
    background: white;
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

const MobileMenu = styled.div`
  position: fixed;
  top: 0;
  right: ${({ open }) => (open ? "0" : "-100%")};
  width: 250px;
  height: 100vh;
  background: #111;
  display: flex;
  flex-direction: column;
  padding: 120px 30px;
  gap: 30px;
  transition: 0.3s ease;
  z-index: 1050;
`;

const MobileLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 18px;
  font-family: "Space Grotesk";
  transition: 0.3s;

  &:hover {
    color: #7C3AED;
  }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  z-index: 1000;
`;



export default Header;
