let data;
let cleanedData = [];
let charts = [];
let customfont;

function preload() {
    data = loadTable('data/Combined.csv', 'csv', 'header');
    customfont = loadFont('assets/Poppins-Regular.ttf');
}

function setup() {
    createCanvas(3000, 2000); 
    angleMode(DEGREES);
    noLoop();
    cleanData();

    charts.push(new BarChart({
        data: cleanedData,
        xValue: "Title",
        yValues: ["Domestic"],
        type: "horizontal",
        chartHeight: 900,
        chartWidth: 1000,
        barWidth: 40,
        margin: 15,
        axisThickness: 3,
        chartPosX: 600,
        chartPosY: 650,
        customFont: customfont,
        title: "Horizontal Bar Chart - Domestic Box Office",
        xAxisTitle: "Box Office (In Millions USD)",
        yAxisTitle: "Movie Title",
        barColours: [color(255, 215, 0)],
        showAverageLine: true
    }));

}

function draw() {
    background(0, 38, 77);
    charts.forEach(chart => chart.render());
}

function cleanData() {
    for (let i = 0; i < data.rows.length; i++) {
        cleanedData.push(data.rows[i].obj);
    }

    for (let i = 0; i < cleanedData.length; i++) {
        cleanedData[i].Domestic = parseInt(parseInt(cleanedData[i]["Domestic (USD)"]) / 1000000);
        cleanedData[i].International = cleanedData[i]["International (USD)"] === "Unknown" ? 
            0 : parseInt(parseInt(cleanedData[i]["International (USD)"]) / 1000000);
        cleanedData[i].Total = parseInt(parseInt(cleanedData[i]["Total Worldwide (USD)"]) / 1000000);
    }
}