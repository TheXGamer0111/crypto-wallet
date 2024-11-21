from flask import Flask, jsonify, request
from bit import Key
from bit.network import get_fee_cached
import requests

app = Flask(__name__)

@app.route('/api/btc/create-wallet', methods=['POST'])
def create_btc_wallet():
    # Create a new Bitcoin wallet
    key = Key()
    
    return jsonify({
        'private_key': key.to_wif(),
        'public_key': key.public_key.hex(),
        'address': key.address
    })

@app.route('/api/btc/balance/<address>', methods=['GET'])
def get_btc_balance(address):
    try:
        response = requests.get(f'https://blockchain.info/balance?active={address}')
        data = response.json()
        balance = data[address]['final_balance'] / 100000000  # Convert satoshis to BTC
        return jsonify({'balance': balance})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000) 