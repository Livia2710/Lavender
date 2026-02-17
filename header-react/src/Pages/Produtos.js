import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Search, Heart } from "lucide-react";
import styled from "styled-components";
import { supabase } from "../services/supabaseClient";
import Footer from "../Components/Footer";

const categories = ["celular", "headphone", "notebook", "acessorios"];

const Produtos = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoriaQuery = queryParams.get("categoria");

  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState("");
  const [categoria, setCategoria] = useState(categoriaQuery || "");
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     Buscar produtos
  ========================== */
  useEffect(() => {
    const buscarProdutos = async () => {
      let query = supabase.from("produtos").select("*");

      if (categoria) {
        query = query.eq("categoria", categoria);
      }

      const { data, error } = await query;

      if (!error) {
        setProdutos(data);
      } else {
        console.error(error);
      }

      setLoading(false);
    };

    buscarProdutos();
  }, [categoria]);

  /* =========================
     Buscar favoritos do usuário
  ========================== */
  useEffect(() => {
    const fetchFavorites = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("favoritos")
        .select("produto_id")
        .eq("user_id", user.id);

      if (data) {
        setFavorites(data.map(item => item.produto_id));
      }
    };

    fetchFavorites();
  }, []);

  /* =========================
     Alternar favorito
  ========================== */
  const toggleFavorite = async (produtoId) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (favorites.includes(produtoId)) {
      await supabase
        .from("favoritos")
        .delete()
        .eq("user_id", user.id)
        .eq("produto_id", produtoId);

      setFavorites(prev => prev.filter(id => id !== produtoId));
    } else {
      await supabase.from("favoritos").insert({
        user_id: user.id,
        produto_id: produtoId
      });

      setFavorites(prev => [...prev, produtoId]);
    }
  };

  const filteredProducts = produtos.filter((p) =>
    p.nome.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <p style={{ color: "white" }}>Carregando produtos...</p>;
  }

  return (
    <>
      <Container>
        <Sidebar>
          <FilterTitle>Categorias</FilterTitle>

          {categories.map((cat) => (
            <FilterButton
              key={cat}
              active={categoria === cat}
              onClick={() => setCategoria(cat)}
            >
              {cat}
            </FilterButton>
          ))}

          <ClearButton onClick={() => setCategoria("")}>
            Limpar filtro
          </ClearButton>
        </Sidebar>

        <Content>
          <SearchWrapper>
            <Search size={18} />
            <SearchInput
              type="text"
              placeholder="Buscar produto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </SearchWrapper>

          <Grid>
            {filteredProducts.map((product) => (
              <Card key={product.id}>
                
                {/* ❤️ Coração */}
                <HeartIcon onClick={() => toggleFavorite(product.id)}>
                  <Heart
                    size={20}
                    fill={favorites.includes(product.id) ? "#7C3AED" : "transparent"}
                    stroke={favorites.includes(product.id) ? "#7C3AED" : "#888"}
                  />
                </HeartIcon>

                <Image src={product.imagem_url} alt={product.nome} />

                <ProductName>{product.nome}</ProductName>

                <PriceContainer>
                  {product.preco_antigo && (
                    <OldPrice>R$ {product.preco_antigo}</OldPrice>
                  )}
                  <NewPrice>R$ {product.preco}</NewPrice>
                </PriceContainer>

                <BuyButton as={Link} to={`/produtos/${product.id}`}>
                  Detalhes
                </BuyButton>
              </Card>
            ))}
          </Grid>
        </Content>
      </Container>

      <Footer />
    </>
  );
};

export default Produtos;

const Container = styled.div`
  display: flex;
  padding: 120px 80px;
  background: #0D0D0D;
  min-height: 100vh;
  gap: 60px;
`;

const Sidebar = styled.div`
  width: 220px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const FilterTitle = styled.h2`
  color: white;
  font-family: 'Space Grotesk';
  margin-bottom: 10px;
`;

const FilterButton = styled.button`
  padding: 10px;
  background: ${({ active }) => active ? "#7C3AED" : "#1A1A1A"};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background: #7C3AED;
  }
`;

const ClearButton = styled.button`
  margin-top: 10px;
  padding: 8px;
  background: transparent;
  border: 1px solid #7C3AED;
  color: #7C3AED;
  border-radius: 8px;
  cursor: pointer;
   transition: 0.3s;

   &:hover {
    background: #7C3AED;
    color: white;
  }
`;

const Content = styled.div`
  flex: 1;
`;

const SearchWrapper = styled.div`
  position: relative;
  margin-bottom: 40px;
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 14px 14px 14px 45px;
  border-radius: 10px;
  border: none;
  background: #1A1A1A;
  color: white;
  font-size: 16px;

  &:focus {
    outline: none;
    border: 1px solid #7C3AED;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 30px;
`;

const Card = styled.div`
 position: relative;
  background: #1A1A1A;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
  transition: 0.3s;

  &:hover {
    transform: translateY(-5px);
    background: #222;
  }
`;

const HeartIcon = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  cursor: pointer;
  z-index: 10;
  transition: 0.3s;

  &:hover {
    transform: scale(1.2);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 180px;
  object-fit: contain;
  margin-bottom: 15px;
`;

const ProductName = styled.h3`
  color: white;
  margin-bottom: 10px;
`;

const PriceContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 15px;
`;

const OldPrice = styled.span`
  text-decoration: line-through;
  color: #888;
`;

const NewPrice = styled.span`
  color: #7C3AED;
  font-weight: bold;
`;

const BuyButton = styled.button`
  padding: 10px 20px;
  background: linear-gradient(90deg, #7C3AED, #9333EA);
  border: none;
  font-family: Inter;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  text-decoration: none;
`;
