import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";


function App() {
  return (
    <Router>
      <Header />
      <main className="py-3">
        <Container>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/product/:id" element={<ProductScreen />} />

            {/* <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/shipping" element={<ShippingScreen />} />
            <Route path="/payment" element={<PaymentScreen />} />
            <Route path="/placeorder" element={<PlaceOrderScreen />} />
            <Route path="/order/:id" element={<OrderScreen />} />
            <Route path="/admin/userlist" element={<UserListScreen />} />
            <Route path="/admin/user/:id/edit" element={<UserEditScreen />} />
            <Route path="/admin/productlist" element={<ProductListScreen />} />
            <Route
              path="/admin/productlist/:pageNumber"
              element={<ProductListScreen />}
            />
            <Route path="/admin/product/:id/edit" element={<ProductEditScreen />} />
            <Route path="/admin/orderlist" element={<OrderListScreen />} />
            <Route path="/search/:keyword" element={<HomeScreen />} />
            <Route path="/page/:pageNumber" element={<HomeScreen />} />
            <Route
              path="/search/:keyword/page/:pageNumber"
              element={<HomeScreen />}
            /> */}

            {/* <Route path="/product/:id" element={<ProductScreen />} /> */}

            {/* <Route path="/cart/:id?" element={<CartScreen />} /> */}

            {/* <Route path="/admin/userlist" element={<UserListScreen />} />
            <Route path="/admin/user/:id/edit" element={<UserEditScreen />} /> */}

            {/* <Route path="/admin/productlist" element={<ProductListScreen />} />
            <Route
              path="/admin/productlist/:pageNumber"
              element={<ProductListScreen />}
            />
            <Route path="/admin/product/:id/edit" element={<ProductEditScreen />} /> */}

            {/* <Route path="/admin/orderlist" element={<OrderListScreen />} /> */}

            {/* <Route path="/search/:keyword" element={<HomeScreen />} />
            <Route path="/page/:pageNumber" element={<HomeScreen />} />
            <Route
              path="/search/:keyword/page/:pageNumber"
              element={<HomeScreen />}
            /> */}

          </Routes>
        </Container>
      </main>
      <Footer />
    </Router>
  );
}

export default App;