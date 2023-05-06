const API_URL = 'http://localhost:5000/api/node';
const API_URL_TEST = `${API_URL}s`;


$(document).ready(async function () {
    // Make AJAX request to fetch data from the API
    await $.ajax({
        url: 'http://localhost:5000/api/audits',
        method: 'GET',
        success: function (response) {
            // Loop through the data and append rows to the table body

            $('#newTable').dataTable({
                responsive: true,
                data: response,
                columns: [
                    {
                        data: 'time',
                        render: function (data, type, row, meta) {
                            
                            const date = new Date(parseInt(data));
                            console.log(date)
                            return date.toLocaleString();
                        }
                    },
                    { data: 'userName' },
                    { data: 'message' }

                ],

            });
        },
        error: function (err) {
            console.log(err);
        }
    });
});
