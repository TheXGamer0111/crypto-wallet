import axios from 'axios';

class PriceService {
  constructor() {
    this.prices = new Map();
    this.lastUpdate = null;
  }

  async getTokenPrice(symbol) {
    try {
      if (this.shouldUpdatePrices()) {
        await this.updatePrices();
      }
      return this.prices.get(symbol.toUpperCase()) || 0;
    } catch (error) {
      console.error('Error fetching token price:', error);
      return 0;
    }
  }

  async updatePrices() {
    try {
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price',
        {
          params: {
            ids: 'ethereum,bitcoin',
            vs_currencies: 'usd'
          }
        }
      );
      
      this.prices.set('ETH', response.data.ethereum.usd);
      this.prices.set('BTC', response.data.bitcoin.usd);
      this.lastUpdate = Date.now();
    } catch (error) {
      console.error('Error updating prices:', error);
    }
  }

  shouldUpdatePrices() {
    return !this.lastUpdate || Date.now() - this.lastUpdate > 5 * 60 * 1000; // 5 minutes
  }
}

export default new PriceService();