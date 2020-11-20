import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer,
} from "recharts";
import Title from "./Title";
import Axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";

// Generate Sales Data

const useStyles = () => ({
  spinnerRoot: {
    display: "flex",
    justifyContent: "center",
    paddingTop: "20px",
  },
});

class Chart extends Component {
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
        response.data.forEach((order, index) => {
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
    let forGraphResults = [];
    this.state.orders.forEach((order) => {
      forGraphResults.push({
        date: order.date.split("-", 2)[1] + "/" + order.date.split("-", 2)[0],
        sales: order.salePrice,
      });
    });

    let sumOfEachMonth = Object.create(null);
    forGraphResults.forEach((value) => {
      sumOfEachMonth[value.date] = sumOfEachMonth[value.date] || [];
      sumOfEachMonth[value.date].push(value);
    });

    let graphData = [];
    for (let [key, value] of Object.entries(sumOfEachMonth)) {
      let sum = 0;
      value.forEach((innerEntry) => {
        sum = sum + parseFloat(innerEntry.sales);
      });
      graphData.push({ month: key, amount: sum });
    }
    //let values =  sumOfEachMonth.reduce((a, b) => [a.sales + b.sales]);

    console.log("final", graphData);

    return (
      <>
        {this.state.orders.length === 0 && this.state.loading === true ? (
          <div className={classes.spinnerRoot}>
            <CircularProgress />
          </div>
        ) : (
          <div />
        )}
        <React.Fragment>
          <Title>{new Date().getFullYear()}</Title>
          <ResponsiveContainer>
            <LineChart
              data={graphData.reverse()}
              margin={{
                top: 16,
                right: 16,
                bottom: 0,
                left: 24,
              }}
            >
              <XAxis dataKey="month" />
              <YAxis>
                <Label
                  angle={270}
                  position="left"
                  style={{
                    textAnchor: "middle",
                  }}
                >
                  Sales ($)
                </Label>
              </YAxis>
              <Line type="monotone" dataKey="amount" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </React.Fragment>
      </>
    );
  }
}

export default withStyles(useStyles)(Chart);
