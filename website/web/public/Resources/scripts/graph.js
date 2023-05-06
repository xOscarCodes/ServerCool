//-----Server-1 Graph------ 
var data1 = [
    {
        domain: { x: [0, 1], y: [0, 1] },
        value: 21,
        title: { text: "Temperature" },
        type: "indicator",
        mode: "gauge+number",
        delta: { reference: 400 },
        gauge: { axis: { range: [null, 50] } }
    }
];

var layout1 = { width: 600, height: 400 , paper_bgcolor: "black"};
Plotly.newPlot('graph-1', data1, layout1);


//-----Server-2 Graph------ 
var data2 = [
    {
        domain: { x: [0, 1], y: [0, 1] },
        value: 16,
        title: { text: "Temperature" },
        type: "indicator",
        mode: "gauge+number",
        delta: { reference: 400 },
        gauge: { axis: { range: [null, 50] } }
    }
];

var layout2 = { width: 600, height: 400, paper_bgcolor: "black"};
Plotly.newPlot('graph-2', data2, layout2);


//-----Server-3 Graph------ 
var data3 = [
    {
        domain: { x: [0, 1], y: [0, 1] },
        value: 26,
        title: { text: "Temperature" },
        type: "indicator",
        mode: "gauge+number",
        delta: { reference: 400 },
        gauge: { axis: { range: [null, 50] } }
    }
];

var layout3 = { width: 600, height: 400 , paper_bgcolor: "black"};
Plotly.newPlot('graph-3', data3, layout3);

