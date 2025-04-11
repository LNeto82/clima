from flask import Flask, jsonify

app = Flask(__name__)

# Base de dados fictícia
weather_data = {
    "SãoPaulo": { "city": "São Paulo", "temp": 25, "unit": "Celsius" },
    "RioDeJaneiro": { "city": "Rio de Janeiro", "temp": 34, "unit": "Celsius" },
    "Curitiba": { "city": "Curitiba", "temp": 12, "unit": "Celsius" }
}

# Endpoint GET /weather/<city>
@app.route('/weather/<city>', methods=['GET'])
def get_weather(city):
    if city in weather_data:
        return jsonify(weather_data[city])
    else:
        return jsonify({"error": "Cidade não encontrada"}), 404

# Rodar servidor Flask
if __name__ == '__main__':
    app.run(port=5000)
