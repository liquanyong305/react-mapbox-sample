import * as React from "react";
import "./styles.css";
import {
  BrowserRouter,
  Route,
  Routes,
  NavLink,
  Link,
  Outlet,
  useNavigate,
  useSearchParams,
  useParams
} from "react-router-dom";
import { products } from "./data";
import HelloBlueApp from './helloBlueApp'
import EstimatedMap from './mapBox/estimatedMap'
import TsMapBox from './mapBox/tsMapBox'
import {CurveExplorer} from './components/curveExplorer'
import Sensor from './sensor/sensor'
import BasicLineChart from './components/lineChart/basicLineChart'
import { Types } from './type/Types';

export default function App() {
  const dataSet:Types.Data[] = [{date: '2021-08-09T10:10', value: 1}, {date: '2021-08-09T11:10', value: 2}, {date: '2021-08-09T12:10', value: 2}, {date: '2021-08-12T12:10', value: 2}, {date: '2021-08-13T12:10', value: 2}, {date: '2021-08-14T12:10', value: 3},]
  return (
    <div>
      <BrowserRouter>
        <nav>
          <NavLink to="/" activeClassName="active" end>
            Home
          </NavLink>
          <NavLink to="customers" activeClassName="active">
            Customers
          </NavLink>
          <NavLink to="products" activeClassName="active">
            Products
          </NavLink>
          <NavLink to="pop2dMesh" activeClassName="active">
            推計人口
          </NavLink>
          <NavLink to="sensor" activeClassName="active">
            センサー
          </NavLink>
        </nav>
        <Routes>
          <Route path="" element={<HomePage />} />
          <Route path="customers" element={<BasicLineChart data={dataSet} top={10} right={50} bottom={50} left={50} width={800} height={400} fill="blue" />} />
          <Route path="pop2dMesh" element={<EstimatedMap />} />
          <Route path="sensor" element={<Sensor />} />
          <Route path="products" element={<ProductsPage />}>
            <Route path=":id*" element={<ProductPage />} />
          </Route>
          {/* <Route path="products/:id*" element={<ProductPage />} /> */}
          <Route path="success" element={<SuccessPage />} />
          <Route path="/*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

const HomePage = () => <HelloBlueApp></HelloBlueApp>;
const CustomersPage = () => <h1>Cutomers page</h1>;
const ProductsPage = () => {
  const [search, setSearch] = React.useState("");
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  React.useEffect(() => {
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);

  const filteredProducts = search
    ? products.filter(
        p => p.name.toLowerCase().indexOf(search.toLowerCase()) > -1
      )
    : products;

  return (
    <div>
      <h1>Products page</h1>
      <h2>Search</h2>
      <form
        onSubmit={e => {
          e.preventDefault();
          setSearchParams(
            `search=${new FormData(e.currentTarget).get("search")}`
          );
        }}
      >
        <input name="search" type="search" placeholder="search ..." />
      </form>

      <div className="product-list">
        {filteredProducts.map(({ id, name }) => (
          <Link key={id} to={`/products/${id}`}>
            {name}
          </Link>
        ))}
      </div>

      <Outlet />

      <h2>Add</h2>
      <form
        onSubmit={e => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          products.push({
            id: "1",
            name: formData.get("name") as string,
            price: "£100",
            quantity: 1
          });
          navigate("/success");
        }}
      >
        <input name="name" type="text" placeholder="name" />
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

const ProductPage = () => {
  const { id } = useParams();
  const product = products.find(p => p.id === id);
  if (!product) {
    return null;
  }
  return (
    <div>
      <h1>{product.name}</h1>
      <p>Price: {product.price}</p>
      <p>Quantity in stock: {product.quantity}</p>
      <Routes>
        <Route path="buy" element={<p>Thank you for buying this product!</p>} />
        <Route
          path="*"
          element={
            <Link to="buy" className="link">
              Buy
            </Link>
          }
        />
      </Routes>
    </div>
  );
};

const SuccessPage = () => <p>Thank you for adding a product</p>;

const NotFoundPage = () => <h1>404</h1>;
