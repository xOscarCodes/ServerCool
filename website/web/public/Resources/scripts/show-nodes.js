const API_URL = 'http://localhost:5000/api/node';
const API_URL_TEST = `${API_URL}s`;

// fetch data from MongoDB
const fetchData = async () => {

    const data = await $.get(`${API_URL_TEST}`)

    return data;
}
// create a card element with the given data
const createCard = (data) => {
    const card = document.createElement('div');
    card.classList.add('col-md-4');
    card.innerHTML = `
  <div class="card mb-3" style="width: 18rem;" id = '${data.nodeId}'>
  <div class="card-header" style="height: 2.8rem;">
                        <center>
                            <h4>Node ${data.nodeId}</h4>
                        </center>
                    </div>
                    <img src="./Resources/images/server-room${0}.jpg" class="card-img"
                        alt="...">
                    <div class="card-img-overlay">
                        <br><br>
                        <center>
                            <p>Location: ${data.location.toUpperCase()}</p>
                        </center>
                        <!-- <hr> -->
                        <br><br><br><br><br>
                        <div class="row">
                            <div class="col-sm-6">
                                <p class="room-ac" style="color: white;">Room Temperature:</p>
                                <h1 style="color: crimson;" class="room-ac-val">${data.roomtemp.toFixed(0)}&deg;C</h1>
                            </div>
                            <div class="col-sm-6">
                                <p class="room-ac" style="color: white;">AC Temperature:</p>
                                <h1 style="color: chartreuse;"
                                    class="room-ac-val">${data.actemp}&deg;C</h1>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer">
                        <small class="text-muted">Last updated 5 minutes ago</small>
                    </div>
  </div>
`;
    return card;
};
// create a container element to hold the cards
const container = document.createElement('div');
container.classList.add('container');
// fetch the data and create a card for each item
fetchData().then((data) => {
    const rows = Math.ceil(data.length / 3); // calculate number of rows needed

    for (let i = 0; i < rows; i++) {
        const row = document.createElement('div');
        row.classList.add('row');

        for (let j = i * 3; j < i * 3 + 3 && j < data.length; j++) {
            const cardData = data[j];

            const card = createCard(cardData);

            // skip this iteration if the row element is undefined
            if (!row) {
                console.error('Error: row element is undefined');
                continue;
            }

            row.appendChild(card);
        }
        container.appendChild(row);
    }

    // add the container to the page
    document.body.appendChild(container);

    // get all color picker inputs and add an event listener for changes
    const cards = document.querySelectorAll(".card");

    cards.forEach(picker => {
        picker.addEventListener("click", e => {
            const card = e.target.closest(".card");
            console.log(card);
            const dashboardUrl = `dashboard.html?node=${card.id}`;
          window.location.href = dashboardUrl;
        });
    });
});