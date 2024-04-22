#!/usr/bin/env ts-node

type StockPrice = {
  day: number;
  price: number;
};

class StockTrader {
  private prices: StockPrice[];
  private bestBuyDay: number = 0;
  private bestSellDay: number = 0;

  constructor(prices: StockPrice[]) {
    this.prices = prices;
  }

  public simulateTrading(): void {
    let minPriceDay: StockPrice = { day: 0, price: Infinity };
    let maxProfit: number = 0;

    for (const current of this.prices) {
      if (current.price < minPriceDay.price) {
        minPriceDay = current; // New minimum price found
      }

      let potentialProfit = current.price - minPriceDay.price;
      if (potentialProfit > maxProfit) {
        maxProfit = potentialProfit;
        this.bestBuyDay = minPriceDay.day;
        this.bestSellDay = current.day;
      }
    }

    console.log(
      `Optimal Buy Day: Day ${this.bestBuyDay}, Price: ${
        this.prices[this.bestBuyDay].price
      }`
    );
    console.log(
      `Optimal Sell Day: Day ${this.bestSellDay}, Price: ${
        this.prices[this.bestSellDay].price
      }`
    );
    console.log(`Maximum Possible Profit: $${maxProfit.toFixed(2)}`);
  }
}

// Example stock prices over 10 days
const examplePrices: StockPrice[] = [
  { day: 1, price: 110 },
  { day: 2, price: 108 },
  { day: 3, price: 105 },
  { day: 4, price: 109 },
  { day: 5, price: 120 },
  { day: 6, price: 115 },
  { day: 7, price: 112 },
  { day: 8, price: 118 },
  { day: 9, price: 122 },
  { day: 10, price: 121 },
];

const trader = new StockTrader(examplePrices);
trader.simulateTrading();
