// Get the form element
const form = document.querySelector('#array-form');

// Add an event listener to the form submission
form.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the default form submission

    // Get the form values
    const temp = parseInt(form.elements.temp.value);
    const level = form.elements.level.value;
    const arrayText = form.elements.array.value;
    const nodename = form.elements.node.value;
    console.log(form.elements);
    // Parse the array text

    const array = arrayText.split(',').map((item) => {
        const parsedItem = parseFloat(item.trim());
        return isNaN(parsedItem) ? null : parsedItem;
    }).filter(item => !isNaN(item));

    // Log the form values and the parsed array
    console.log('Node:', nodename);
    console.log('temp:', temp);
    console.log('Level:', level);
    console.log('Array:', array);
});
