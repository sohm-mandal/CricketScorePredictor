// Fetch and populate the city dropdown
fetch('/cities.json')
    .then(response => response.json())
    .then(data => {
        const citySelect = document.getElementById('select-city');

        // Populate the dropdown with cities
        data.cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
        });
    })
    .catch(error => console.error('Error fetching city data:', error));

// Fetch and populate the country1 (batting team) and country2 (bowling team) dropdowns
fetch('/playing_teams.json')
    .then(response => response.json())
    .then(data => {
        const country1Select = document.getElementById('country1');
        const country2Select = document.getElementById('country2');

        // Populate the dropdowns with teams
        data.playing_teams.forEach(team => {
            const option1 = document.createElement('option');
            option1.value = team;
            option1.textContent = team;
            country1Select.appendChild(option1);

            const option2 = document.createElement('option');
            option2.value = team;
            option2.textContent = team;
            country2Select.appendChild(option2);
        });
    })
    .catch(error => console.error('Error fetching team data:', error));

document.getElementById('scoreForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent form submission

    // Get form data
    const country1 = document.getElementById('country1').value;
    const country2 = document.getElementById('country2').value;
    const select_city = document.getElementById('select-city').value;
    const score = document.getElementById('score').value;
    const overs = document.getElementById('overs').value;
    const wickets = document.getElementById('wickets').value;
    const runs = document.getElementById('runs').value;
    
    // Send data to Flask backend
    fetch('/predict', {  // Updated URL here
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            country1: country1,
            country2: country2,
            select_city: select_city,
            score: score,
            overs: overs,
            wickets: wickets,
            runs: runs
        }),
    })
    
    .then(response => response.json())
    .then(data => {
        document.getElementById('output').innerText = `Prediction: ${data.prediction}`;
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
