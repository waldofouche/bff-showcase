import React, { Component } from "react";
import Axios from "axios";
import {  withStyles } from "@material-ui/core/styles";

import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

// Table Imports
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

//modal Imports
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = (theme) => ({
  root: {
    flexGrow: 1,
    marginBottom: 20,
  },
  spinnerRoot: {
    display: "flex",
    justifyContent: "center",
    paddingTop: "20px",
  },
  table: {
    minWidth: 650,
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
});

class Inventory extends Component {
  constructor(props) {
    super(props);

    this.handleModalClose = this.handleModalClose.bind(this);
    //this.deleteProduct = this.deleteProduct.bind(this);
    this.state = {
      products: [],
      tabValue: 0,
      setValue: 0,
      modalOpen: false,
      currentProduct: [],
      loading: false,
      editing: false,
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    Axios.get("https://bff-backend.herokuapp.com/products")
      .then((response) => {
        return response.data;
      })
      .then((products) => {
        Axios.get("https://bff-backend.herokuapp.com/wooCommerce/products")
          .then((response) => {
            let mergedProducts = products.map((product) => {
              return {
                ...product,
                ...response.data.find((wooProduct) => {
                  return wooProduct.id === product.invWooID;
                }),
              };
            });
            this.setState({ products: mergedProducts });
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleModalOpen = (product) => {
    this.setState({ modalOpen: true, currentProduct: product });
  };

  handleModalClose = () => {
    this.setState({ modalOpen: false });
  };

  handleTabChange = (event, newValue) => {
    this.setState({ tabValue: newValue });
  };

  handleClick = (e) => {
    this.setState({ editing: true });
  };

  handleConfirm = (e) => {
    let updatedProduct = {};
    let currentProduct = this.state.currentProduct;

    updatedProduct.productName = e.target[0].value;
    updatedProduct.SKU = e.target[1].value;
    updatedProduct.currentStock = Number(e.target[2].value);
    updatedProduct.supplier = currentProduct.invSupplier;
    updatedProduct.onOrder = Number(e.target[3].value);
    updatedProduct.price = Number(e.target[4].value);
    updatedProduct.salePrice = Number(e.target[5].value);
    updatedProduct.royalty = Number(e.target[6].value);
    updatedProduct.wooID = Number(currentProduct.invWooID);

    Axios.post(
      "https://bff-backend.herokuapp.com/products/update/" + currentProduct._id.toString(),
      updatedProduct,
      { headers: { "Content-Type": "application/json" } }
    )
      .then((response) => {
        console.log("response", response);
      })
      .catch((err) => {
        console.log(err.response);
      });

    let product = {};
    product.invProductName = updatedProduct.productName;
    product.invSKU = updatedProduct.SKU;
    product.invCurrentStock = updatedProduct.currentStock;
    product.invSupplier = updatedProduct.supplier;
    product.invOnOrder = updatedProduct.onOrder;
    product.invPrice = updatedProduct.price;
    product.invSalePrice = updatedProduct.salePrice;
    product.invRoyalty = updatedProduct.royalty;
    product.invWooID = updatedProduct.wooID;

    let productList = this.state.products;

    let updatedIndex = productList.findIndex((product) => {
      return product._id === currentProduct._id;
    });

    productList[updatedIndex] = { ...productList[updatedIndex], ...product };

    this.setState({
      editing: false,
      currentProduct: { ...currentProduct, ...product },
      products: productList,
    });

    e.preventDefault();
  };

  render() {
    const { classes } = this.props;
    let productsFiltered = this.state.products;
    if (this.state.tabValue === 1) {
      productsFiltered = this.state.products.filter(
        (product) => product.invCurrentStock > 0
      );
    } else if (this.state.tabValue === 2) {
      productsFiltered = this.state.products.filter(
        (product) => product.invCurrentStock < 5 && product.invCurrentStock > 0
      );
    } else if (this.state.tabValue === 3) {
      productsFiltered = this.state.products.filter(
        (product) => product.invCurrentStock <= 0
      );
    }
    return (
      <>
        <Paper className={classes.root}>
          <Tabs
            value={this.state.tabValue}
            onChange={this.handleTabChange.bind(this)}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="All Items" />
            <Tab label="In Stock" />
            <Tab label="Low Stock" />
            <Tab label="Out of Stock" />
          </Tabs>
        </Paper>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Product Name</TableCell>
                <TableCell align="right">SKU</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Sale Price</TableCell>
                <TableCell align="right">Stock on Hand</TableCell>
                <TableCell align="right">Stock on Order</TableCell>
                <TableCell align="right">Artist Royalty</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productsFiltered.map((product) => (
                <TableRow
                  key={product.invWooID}
                  onClick={this.handleModalOpen.bind(this, product)}
                  hover
                >
                  <TableCell component="th" scope="row">
                    {product.invProductName}
                  </TableCell>
                  <TableCell align="right">{product.invSKU}</TableCell>
                  <TableCell align="right">{product.invPrice}</TableCell>
                  <TableCell align="right">{product.invSalePrice}</TableCell>
                  <TableCell align="right">{product.invCurrentStock}</TableCell>
                  <TableCell align="right">{product.invOnOrder}</TableCell>
                  <TableCell align="right">{product.invRoyalty}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {this.state.products.length === 0 && this.state.loading === true ? (
          <div className={classes.spinnerRoot}>
            <CircularProgress />
          </div>
        ) : (
          <div />
        )}
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={this.state.modalOpen}
          onClose={this.handleModalClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={this.state.modalOpen}>
            {this.state.editing ? (
              <div className={classes.paper}>
                <form onSubmit={this.handleConfirm.bind(this)}>
                  <div>
                    <TextField
                      required
                      id="standard-required"
                      label="Product Name"
                      defaultValue={this.state.currentProduct.invProductName}
                    />
                  </div>
                  <div>
                    <TextField
                      required
                      id="standard-required"
                      label="SKU *"
                      defaultValue={this.state.currentProduct.invSKU}
                    />
                  </div>
                  <br />
                  <div>
                    <TextField
                      required
                      id="standard-required"
                      label="Stock on Hand"
                      defaultValue={this.state.currentProduct.invCurrentStock}
                    />
                  </div>
                  <div>
                    <TextField
                      required
                      id="standard-required"
                      label="Stock on Order"
                      defaultValue={this.state.currentProduct.invOnOrder}
                    />
                  </div>
                  <br />
                  <div>
                    <TextField
                      required
                      id="standard-required"
                      label="Price"
                      defaultValue={this.state.currentProduct.invPrice}
                    />
                  </div>
                  <div>
                    <TextField
                      id="standard-basic"
                      label="Sale Price"
                      defaultValue={this.state.currentProduct.invSalePrice}
                    />
                  </div>
                  <div>
                    <TextField
                      required
                      id="standard-required"
                      label="Product Royalty"
                      defaultValue={this.state.currentProduct.invRoyalty}
                    />
                  </div>
                  <br />
                  <div>
                    <Button variant="contained" color="primary" type="submit">
                      Confirm
                    </Button>
                  </div>
                </form>
              </div>
            ) : (
              <div className={classes.paper}>
                <h2>{this.state.currentProduct.invProductName}</h2>
                <p>SKU: {this.state.currentProduct.invSKU}</p>
                <br />
                <p>
                  Stock on Hand: {this.state.currentProduct.invCurrentStock}
                </p>
                <p>Stock on Order: {this.state.currentProduct.invOnOrder}</p>
                <br />
                <p>Price: ${this.state.currentProduct.invPrice}</p>
                <p>
                  Sale Price: ${this.state.currentProduct.invSalePrice || "-"}
                </p>
                <p>Artist Royalty: ${this.state.currentProduct.invRoyalty}</p>
                <div>
                  <Button
                    variant="contained"
                    onClick={this.handleClick.bind(this)}
                  >
                    Modify
                  </Button>
                </div>
              </div>
            )}
          </Fade>
        </Modal>
      </>
    );
  }
}

export default withStyles(useStyles)(Inventory);
