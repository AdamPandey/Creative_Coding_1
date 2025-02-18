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


    // Horizontal Bar Chart
    charts.push(new BarChart({
        data: cleanedData,
        xValue: "Age_Group",
        yValues: ["Male"],
        type: "horizontal",
        chartHeight: 500,
        chartWidth: 600,
        barWidth: 40,
        margin: 15,
        axisThickness: 3,
        chartPosX: 900,
        chartPosY: 650,
        customFont: customfont,
        title: "Horizontal Bar Chart - Male Ages",
        xAxisTitle: "Number of Males",
        yAxisTitle: "Age Group",
        barColours: [color(0, 191, 255)],
        axisColor: color(125),
        axisTextColour: color(255, 255, 255)
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