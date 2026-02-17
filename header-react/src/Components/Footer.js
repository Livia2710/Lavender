import styled from "styled-components";
import { Link } from "react-router-dom";

const Footer = () => {
  return(
    <Container>

      <Logo to="/">
        <img src="/images/Logo.png" alt="Logo" />
      </Logo>

      <NavMenu>
        <StyledLink to="/">Home</StyledLink>
        <StyledLink to="/produtos">Produtos</StyledLink>
        <StyledLink to="/login">Login</StyledLink>
      </NavMenu>

      <Divider />

      <Copy>
        © {new Date().getFullYear()} Todos os direitos reservados
      </Copy>

    </Container>
  );
};




// Styled-Components

const Container = styled.div`
  background-color: #222222;
  width: 100%;
  height: 30vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 30px;
  align-items: center;
`;

// Logo agora é Link
const Logo = styled(Link)`
  width: 80px;

  display: flex;
  align-items: center;

  img {
    width: 90%;
    border-radius: 50px;
      margin: 30px
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #3C3C3C;
  padding: 0 12px;
  font-family: 'Space Grotesk', sans-serif;
  letter-spacing: 1px;
  transition: 0.3s ease;

  &:hover {
    color: #7C3AED;
  }
`;

const Divider = styled.hr`
  width: 95%;
  border: 1px solid #2C2C2C;

`;


const Copy = styled.p`
 color: #3C3C3C;
 font-size: 16px;

`

const NavMenu = styled.div`
  align-items: center;
  display: flex;
  flex-flow: row nowrap;
  height: 100%;
  margin-left: 30px;

  @media (max-width: 548px) {
    display: none;
  }
`;


export default Footer;
