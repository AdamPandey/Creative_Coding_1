let data;
let cleanedData = [];
let charts = [];
let customfont;
let state = "menu"; 
let currentChartIndex = 0; 

function preload() {
    data = loadTable('data/Combined.csv', 'csv', 'header');
    customfont = loadFont('assets/Poppins-Regular.ttf');
}

function setup() {
    createCanvas(5000, 4000);
    angleMode(RADIANS);
    
    cleanData();
    setupCharts();
}

function draw() {
    background(0, 38, 77); 

    if (state === "menu") {
        drawMenu();
    } else if (state === "visualization") {
        drawVisualization();
    }
}

function drawMenu() {
    
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(50);
    textFont(customfont);
    text("Batman Box Office Visualizations", width / 2, height / 2 - 100);

    
    let buttonWidth = 300;
    let buttonHeight = 80;
    let buttonX = width / 2 - buttonWidth / 2;
    let buttonY = height / 2;

    fill(255, 215, 0); 
    rect(buttonX, buttonY, buttonWidth, buttonHeight, 20); 
    fill(0);
    textSize(30);
    text("Start Visualization", buttonX + buttonWidth / 2, buttonY + buttonHeight / 2);
}

function mousePressed() {
    if (state === "menu") {
        
        let buttonWidth = 300;
        let buttonHeight = 80;
        let buttonX = width / 2 - buttonWidth / 2;
        let buttonY = height / 2;

        if (mouseX >= buttonX && mouseX <= buttonX + buttonWidth &&
            mouseY >= buttonY && mouseY <= buttonY + buttonHeight) {
            state = "visualization";
            currentChartIndex = 0; 
        }
    } else if (state === "visualization") {
        
        let buttonWidth = 150;
        let buttonHeight = 60;
        let buttonX = width - buttonWidth - 50;
        let buttonY = height - buttonHeight - 50;

        if (mouseX >= buttonX && mouseX <= buttonX + buttonWidth &&
            mouseY >= buttonY && mouseY <= buttonY + buttonHeight) {
            currentChartIndex = (currentChartIndex + 1) % charts.length; 
        }
    }
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

function setupCharts() {
    charts.push(new BarChart({
        data: cleanedData,
        xValue: "Title",
        yValues: ["Domestic"],
        type: "horizontal",
        chartHeight: 500,
        chartWidth: 600,
        barWidth: 40,
        margin: 15,
        axisThickness: 3,
        chartPosX: 1050,
        chartPosY: 200,
        customFont: customfont,
        title: "Horizontal Bar Chart - Domestic Box Office",
        xAxisTitle: "Box Office (In Millions USD)",
        yAxisTitle: "Movie Title",
        barColours: [color(255, 215, 0)],
        showAverageLine: true
    }));

    charts.push(new BarChart({
        data: cleanedData,
        xValue: "Title",
        yValues: ["International"],
        type: "horizontal",
        chartHeight: 500,
        chartWidth: 600,
        barWidth: 40,
        margin: 15,
        axisThickness: 3,
        chartPosX: 1050,
        chartPosY: 200,
        customFont: customfont,
        title: "Horizontal Bar Chart - International Box Office",
        xAxisTitle: "Box Office (In Millions USD)",
        yAxisTitle: "Movie Title",
        barColours: [color(255, 215, 0)],
        showAverageLine: true
    }));

    charts.push(new BarChart({
        data: cleanedData,
        xValue: "Title",
        yValues: ["Domestic"],
        type: "vertical",
        chartHeight: 500,
        chartWidth: 600,
        barWidth: 40,
        margin: 15,
        axisThickness: 3,
        chartPosX: 1050,
        chartPosY: 200,
        customFont: customfont,
        title: "Vertical Bar Chart - Domestic Box Office",
        xAxisTitle: "Movie Title",
        yAxisTitle: "Box Office (In Millions USD)",
        barColours: [color(255, 215, 0)],
        showAverageLine: true
    }));

    charts.push(new BarChart({
        data: cleanedData,
        xValue: "Title",
        yValues: ["International"],
        type: "vertical",
        chartHeight: 500,
        chartWidth: 600,
        barWidth: 40,
        margin: 15,
        axisThickness: 3,
        chartPosX: 1050,
        chartPosY: 200,
        customFont: customfont,
        title: "Vertical Bar Chart - International Box Office",
        xAxisTitle: "Movie Title",
        yAxisTitle: "Box Office (In Millions USD)",
        barColours: [color(255, 215, 0)],
        showAverageLine: true
    }));

    charts.push(new BarChart({
        data: cleanedData,
        xValue: "Title",
        yValues: ["Domestic", "International"],
        type: "stacked",
        chartHeight: 500,
        chartWidth: 600,
        barWidth: 40,
        margin: 15,
        axisThickness: 3,
        chartPosX: 1050,
        chartPosY: 200,
        customFont: customfont,
        title: "Stacked Bar Chart - Box Office",
        xAxisTitle: "Movie Title",
        yAxisTitle: "Box Office (In Millions USD)",
        barColours: [color(255, 215, 0), color(0, 191, 255)],
        showAverageLine: true
    }));

    charts.push(new BarChart({
        data: cleanedData,
        xValue: "Title",
        yValues: ["Domestic", "International"],
        type: "percentStacked",
        chartHeight: 500,
        chartWidth: 600,
        barWidth: 40,
        margin: 15,
        axisThickness: 3,
        chartPosX: 1050,
        chartPosY: 200,
        customFont: customfont,
        title: "100% Stacked Bar Chart - Box Office",
        xAxisTitle: "Movie Title",
        yAxisTitle: "Percentage",
        barColours: [color(255, 215, 0), color(0, 191, 255)],
        showAverageLine: true
    }));

    charts.push(new BarChart({
        data: cleanedData,
        xValue: "Year",
        yValues: ["Domestic"],
        type: "linearRegression",
        chartHeight: 500,
        chartWidth: 600,
        margin: 15,
        axisThickness: 3,
        chartPosX: 1050,
        chartPosY: 200,
        customFont: customfont,
        title: "Linear Regression - Domestic Box Office",
        xAxisTitle: "Year",
        yAxisTitle: "Box Office (In Millions USD)",
        barColours: [color(255, 215, 0)],
        showAverageLine: true
    }));

    charts.push(new BarChart({
        data: cleanedData,
        xValue: "Title",
        yValues: ["Domestic", "International"],
        type: "spider",
        chartHeight: 500,
        chartWidth: 600,
        margin: 15,
        axisThickness: 3,
        chartPosX: 1050,
        chartPosY: 200,
        customFont: customfont,
        title: "Spider Plot - Box Office",
        xAxisTitle: "Movies",
        yAxisTitle: "Box Office (In Millions USD)",
        barColours: [color(255, 215, 0), color(0, 191, 255)],
        showAverageLine: false
    }));
}
