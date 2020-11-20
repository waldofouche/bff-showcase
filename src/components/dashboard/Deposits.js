import React, { Component } from "react";
import Axios from "axios";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Title from "./Title";

const useStyles = (theme) => ({
  depositContext: {
    flex: 1,
  },
});

const d = new Date();
let month = [];
month[0] = "January";
month[1] = "February";
month[2] = "March";
month[3] = "April";
month[4] = "May";
month[5] = "June";
month[6] = "July";
month[7] = "August";
month[8] = "September";
month[9] = "October";
month[10] = "November";
month[11] = "December";

const n = month[d.getMonth()];

class Deposits extends Component {
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
        response.data.forEach((order) => {
          results.push({
            id: order.id,
            salePrice: order.total,
            status: order.status,
            date: order.date_created,
          });
        });
        this.setState({ orders: results, loading: false });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  render() {
    const { classes } = this.props;
    let forDepositsResults = [];

    //Only take sales for completed orders for that particular month
    this.state.orders.forEach((order) => {
      if (order.status === "completed") {
        //Match the month
        if (Number(order.date.split("-", 2)[1]) === d.getMonth() + 1) {
          forDepositsResults.push(Number(order.salePrice));
        }
      }
    });

    let sumOfDeposit = forDepositsResults.reduce(function (a, b) {
      return a + b;
    }, 0);

    return (
      <React.Fragment>
        <Title>Current Month Sales</Title>
        <Typography component="p" variant="h4">
          ${sumOfDeposit}
        </Typography>
        <Typography color="textSecondary" className={classes.depositContext}>
          {n} {new Date().getFullYear()}
        </Typography>
      </React.Fragment>
    );
  }
}

export default withStyles(useStyles)(Deposits);
