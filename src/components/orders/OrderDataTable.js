import React, { Component } from "react";
import Axios from "axios";
import { withStyles } from "@material-ui/core/styles";

import Paper from "@material-ui/core/Paper";

import CircularProgress from "@material-ui/core/CircularProgress";

// Table Imports
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

const useStyles = (theme) => ({
  root: {
    flexGrow: 1,
    marginBottom: 20,
  },
  table: {
    minWidth: 650,
  },

  spinnerRoot: {
    display: "flex",
    justifyContent: "center",
    paddingTop: "20px",
  },
});

class Order extends Component {
  constructor(props) {
    super(props);

    // this.deleteProduct = this.deleteProduct.bind(this);
    this.state = { orders: [], tabValue: 0, setValue: 0, loading: false };
  }

  componentDidMount() {
    let results = [];
    this.setState({ loading: true });
    Axios.get("https://bff-backend.herokuapp.com/wooCommerce/orders")
      .then((response) => {
        console.log(response.data);
        response.data.forEach((order) => {
          results.push({
            id: order.id,
            salePrice: order.total,
            status: order.status,
            date: order.date_created,
          });
        });
        this.setState({ orders: results, loading: false });
        module.exports(results);
        // console.log(results);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const { classes } = this.props;
    console.log("Woo Orders", this.state.orders);
    // this.state.products.map((product) => (console.log("SKU", product.invSKU)))
    // console.log("SKU", this.state.products.invSKU);
    return (
      <>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                {/* <TableCell align="right">ID</TableCell> */}
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Status</TableCell>
                <TableCell align="right">Date</TableCell>
                {/* <TableCell align="right">Status</TableCell>
                <TableCell align="right">Product Size</TableCell>
                <TableCell align="right">Date</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell component="th" scope="row">
                    {order.id}
                  </TableCell>
                  <TableCell align="right">{order.salePrice}</TableCell>
                  <TableCell align="right">{order.status}</TableCell>
                  <TableCell align="right">{order.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {this.state.orders.length === 0 && this.state.loading === true ? (
          <div className={classes.spinnerRoot}>
            <CircularProgress />
          </div>
        ) : (
          <div />
        )}
      </>
    );
  }
}

export default withStyles(useStyles)(Order);
