import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { getOrderDetails, payOrder } from "../actions/orderActions";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { ORDER_PAY_RESET } from "../constants/orderConstants";

function OrderScreen() {
  const orderId = useParams().id;
  const dispatch = useDispatch();

  const [sdkReady, setSdkReady] = useState(false);
  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, error, loading } = orderDetails;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  if (!loading && !error) {
    order.itemsPrice = order.orderItems
      .reduce((acc, item) => acc + item.price * item.qty, 0)
      .toFixed(2);
  }

  const addPayPalScript = () => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "https://www.paypal.com/sdk/js?client-id=AeeSLzOM4NbC9AjbzV_b1VbnTN6J2VwfZ9iLv7iUx3AneFBGgn413Yq3qjkAQinQk8xeM78ZgGmbOoQ_";
    script.async = true;
    script.onload = () => {
      setSdkReady(true);
    };
    document.body.appendChild(script);
  };

  useEffect(() => {
    const getOrder = () => {
      dispatch(getOrderDetails(orderId));
    };

    if (!order || successPay || order._id !== Number(orderId)) {
      getOrder();
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript();
      } else {
        setSdkReady(true);
      }
    }

    return () => {
      // Cleanup function
      dispatch({ type: ORDER_PAY_RESET });
    };
  }, [dispatch, order, orderId, successPay]);

  const successPaymentHandler = async (details, data) => {
    dispatch(payOrder(orderId, details));
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <div>
      <h1>Order: {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>{" "}
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Shipping: </strong>
                {order.shippingAddress.address},{order.shippingAddress.city}{" "}
                {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
              </p>

              {order.isDelivered ? (
                <Message variant="success">
                  {" "}
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="warning">Not Delivered </Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success"> Paid on {order.paidAt}</Message>
              ) : (
                <Message variant="warning">Not Paid </Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message variant="info">Order is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={3}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}{" "}
                          </Link>
                        </Col>

                        <Col md={4}>
                          {item.qty} x ${item.price} = $
                          {(item.qty * item.price).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Items: </Col>
                  <Col>${order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>

              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  {sdkReady ? (
                    <PayPalButtons
                      style={{
                        shape: "rect",
                        color: "gold",
                        layout: "vertical",
                        label: "paypal",
                      }}
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [
                            {
                              amount: {
                                value: order.totalPrice,
                              },
                            },
                          ],
                        });
                      }}
                      onApprove={successPaymentHandler}
                      onError={(err) => console.log(err)}
                    />
                  ) : (
                    <Loader />
                  )}
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

function OrderScreenWrapper() {
  const [initialOptions] = useState({
    "client-id":
      "AeeSLzOM4NbC9AjbzV_b1VbnTN6J2VwfZ9iLv7iUx3AneFBGgn413Yq3qjkAQinQk8xeM78ZgGmbOoQ_",
    currency: "USD",
    intent: "capture",
  });

  return (
    <PayPalScriptProvider options={initialOptions}>
      <OrderScreen />
    </PayPalScriptProvider>
  );
}

export default OrderScreenWrapper;
