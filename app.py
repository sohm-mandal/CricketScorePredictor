from flask import render_template, Flask, send_from_directory, request, jsonify
import pickle
import pandas as pd

app = Flask(__name__)

model = pickle.load(open('model.pkl', 'rb'))

@app.route('/')
def helloworld():
    return render_template('index.html')

@app.route('/cities.json')
def cities(filename = 'cities.json'):
    return send_from_directory('static', filename)

@app.route('/playing_teams.json')
def playing(filename = 'playing_teams.json'):
    return send_from_directory('static', filename)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    
    features = [
        data.get('country1'),
        data.get('country2'),
        data.get('select_city'),
        int(data.get('score')),
        float(data.get('overs')),
        int(data.get('wickets')),
        int(data.get('runs'))
    ]
    batting_team, bowling_team, city, current_score, overs, wickets_left, last_five = features
    
    over, ball_no = divmod(features[4] * 10, 10)
    balls_bowled = int(over) * 6 + int(ball_no)
    balls_left = 120 - balls_bowled
    current_rr = (features[3] * 6) / balls_bowled
    
    input_df = pd.DataFrame({
        'batting_team': [batting_team],
        'bowling_team': [bowling_team],
        'city': [city],
        'current_score': [current_score],
        'balls_left': [balls_left],
        'wickets_left': [wickets_left],
        'current_rr': [current_rr],
        'last_five': [last_five]
    })
    
    predicted_runs = model.predict(input_df)
    final_result = round(predicted_runs[0])
    fnl = []
    fnl.append(final_result)
    return jsonify({'prediction': fnl[0]})


