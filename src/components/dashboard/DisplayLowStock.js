import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Title from "./Title";
import Axios from "axios";

const useStyles = (theme) => ({
  depositContext: {
    flex: 1,
  },
});

class DisplayLowStockItems extends Component {
  constructor(props) {
    super(props);
    this.state = { products: [], tabValue: 0, setValue: 0 };
  }
  componentDidMount() {
    // Your code here
    Axios.get("https://bff-backend.herokuapp.com/products")
      .then((response) => {
        this.setState({ products: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // let updatedLowStock = this.state.lowStockItems.filter((product) =>
  // product.current.watever > lowerbound && order.date.whatever < upperbound)
  render() {
    let updatedLowStock = this.state.products.filter(
      (el) => el.invCurrentStock < 5
    );

    const { classes } = this.props;
    let numberOfLowStock = 0;
    if (updatedLowStock) {
      numberOfLowStock = updatedLowStock.length;
    }

    return (
      <div>
        <Title alignItem="center">Low Stock </Title>
        <Typography component="p" variant="h4">
          {" "}
          {numberOfLowStock}
        </Typography>
        <Typography color="textSecondary" className={classes.depositContext}>
          Unique Items
        </Typography>
      </div>
    );
  }
}

export default withStyles(useStyles)(DisplayLowStockItems);
