import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { supabase } from "../services/supabaseClient";

const Login = () => {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAuth = async () => {
    setLoading(true);
    setMessage("");

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
      } else {
        navigate("/");
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage("Conta criada com sucesso!");
      }
    }

    setLoading(false);
  };

  return (
    <Container>
      <Card>
        <h2>{isLogin ? "Login" : "Criar Conta"}</h2>

        <Input
          type="email"
          placeholder="Seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          type="password"
          placeholder="Sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button onClick={handleAuth} disabled={loading}>
          {loading ? "Carregando..." : isLogin ? "Entrar" : "Cadastrar"}
        </Button>

        {message && <Message>{message}</Message>}

        <Toggle>
          {isLogin ? "Não tem conta?" : "Já possui conta?"}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? " Criar conta" : " Fazer login"}
          </span>
        </Toggle>
      </Card>
    </Container>
  );
};

export default Login;

const Container = styled.div`
  min-height: 100vh;
  background: #0D0D0D;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Card = styled.div`
  background: #1A1A1A;
  padding: 50px;
  border-radius: 12px;
  width: 400px;
  color: white;
  text-align: center;

  h2 {
    margin-bottom: 30px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border-radius: 8px;
  border: none;
  background: #2A2A2A;
  color: white;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background: linear-gradient(90deg, #7C3AED, #9333EA);
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const Message = styled.p`
  margin-top: 15px;
  color: #7C3AED;
`;

const Toggle = styled.p`
  margin-top: 20px;
  font-size: 14px;
  color: #A1A1AA;

  span {
    color: #7C3AED;
    cursor: pointer;
    font-weight: bold;
  }
`;
