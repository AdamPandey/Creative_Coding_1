let data;
let cleanedData = [];
let charts = [];
let customfont;
let state = "menu";
let currentChartIndex = 0;
let batmanImg;
let song;
let isMuted = false; 

function preload() {
    try {
        
        console.log("Attempting to load Combined.csv from:", 'data/Combined.csv');
        data = loadTable('data/Combined.csv', 'csv', 'header');
        
        console.log("Attempting to load Poppins-Regular.ttf from:", 'assets/Poppins-Regular.ttf');
        customfont = loadFont('assets/Poppins-Regular.ttf');
        
        console.log("Attempting to load batman.png from:", 'assets/batman.png');
        batmanImg = loadImage('assets/batman.png');
        
        console.log("Attempting to load batman_theme.mp3 from:", 'assets/batman_theme.mp3');
        song = loadSound('assets/batman_theme.mp3');
        
        console.log("Preload complete. Font:", customfont, "Batman image:", batmanImg, "Song:", song, "Data:", data);
    } catch (error) {
        console.error("Preload error:", error);
    }
}

function setup() {
    createCanvas(2000, 1500); 
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

function drawVisualization() {
    
    charts[currentChartIndex].render();

    
    if (charts[currentChartIndex].animationProgress < 1) {
        let animationSpeed = 0.03; 
        charts[currentChartIndex].animationProgress = min(charts[currentChartIndex].animationProgress + animationSpeed, 1);
    }

    
    let batmanWidth = 400; 
    let batmanHeight = 600;
    let batmanX = 50;
    let batmanY = height - batmanHeight - 100; 
    if (batmanImg && batmanImg.width > 1 && batmanImg.height > 1) { 
        image(batmanImg, batmanX, batmanY, batmanWidth, batmanHeight);
    } else {
        console.warn("Batman image failed to load, using placeholder rectangle");
        fill(0, 0, 255); 
        rect(batmanX, batmanY, batmanWidth, batmanHeight);
    }

    
    drawSpeechBubble(batmanX + batmanWidth + 20, batmanY + 50, getBatmanCommentary());

    
    let nextButtonWidth = 150;
    let nextButtonHeight = 60;
    let nextButtonX = width - nextButtonWidth - 50;
    let nextButtonY = 150; 

    let prevButtonWidth = 150;
    let prevButtonHeight = 60;
    let prevButtonX = nextButtonX - prevButtonWidth - 50;
    let prevButtonY = nextButtonY;

    let muteButtonWidth = 200;
    let muteButtonHeight = 60;
    let muteButtonX = width / 2 - muteButtonWidth / 2; 
    let muteButtonY = height - muteButtonHeight - 50; 

    console.log("Canvas size:", width, height);
    console.log("Next Button Position:", nextButtonX, nextButtonY);
    console.log("Prev Button Position:", prevButtonX, prevButtonY);

    fill(255, 215, 0); 
    rect(nextButtonX, nextButtonY, nextButtonWidth, nextButtonHeight, 20); 
    fill(0);
    textSize(24);
    textAlign(CENTER, CENTER);
    textFont(customfont || 'Arial'); 
    text("Next", nextButtonX + nextButtonWidth / 2, nextButtonY + nextButtonHeight / 2);

    
    fill(255, 215, 0);
    rect(prevButtonX, prevButtonY, prevButtonWidth, prevButtonHeight, 20);
    fill(0);
    textFont(customfont || 'Arial'); 
    text("Previous", prevButtonX + prevButtonWidth / 2, prevButtonY + prevButtonHeight / 2);

    // Mute Audio button
    fill(255, 215, 0); 
    rect(muteButtonX, muteButtonY, muteButtonWidth, muteButtonHeight, 20);
    fill(0);
    textFont(customfont || 'Arial'); 
    text("Mute Audio", muteButtonX + muteButtonWidth / 2, muteButtonY + muteButtonHeight / 2);
    
    fill(255);
    textSize(20);
    textAlign(LEFT, TOP);
    textFont(customfont || 'Arial');
    text(`Chart ${currentChartIndex + 1} of ${charts.length}`, 50, 50);

    if (state === "visualization" && song) {
        try {
            if (!song.isPlaying()) {
                song.loop();
                if (!isMuted) song.setVolume(0.5);
                else song.setVolume(0);
            }
        } catch (error) {
            console.error("Error playing music:", error);
        }
    }
}

function drawSpeechBubble(x, y, bubbletext) {
    
    let bubbleWidth = 1000; 
    let bubbleHeight = 200; 
    let tailLength = 20;
    let tailWidth = 20;

    
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(25);
    textFont(customfont || 'Arial'); 
    text(bubbletext, x + bubbleWidth / 2 + 200, y + bubbleHeight / 2 + 200);

}

function getBatmanCommentary() {
    
    const commentaries = [
        "I’ve analyzed the domestic box office—1966’s 'Batman: The Movie' earned $137.8M, but 'The Dark Knight' dominates with $534.8M!", // Horizontal - Domestic
        "Internationally, 'The Dark Knight Rises' led with $634.1M, far surpassing 'Batman: The Movie’s' zero international earnings.", // Horizontal - International
        "Vertically, 'The Dark Knight' stands tall at $534.8M domestically—Gotham’s finest box office moment!", // Vertical - Domestic
        "'The Dark Knight Rises' tops international earnings at $634.1M vertically—impressive global impact.", // Vertical - International
        "Stacked, 'The Dark Knight' combines $534.8M domestic and $471.1M international for a massive $1,005.9M total—true justice for Gotham!", // Stacked
        "In percentages, 'The Dark Knight' shows 53% domestic and 47% international—balanced global appeal.", // Percent Stacked
        "My regression analysis shows domestic earnings rising steadily since 1966—Gotham’s box office power grows!", // Linear Regression
        "The spider plot reveals 'The Dark Knight’s' dominance across domestic and international earnings—unmatched in my bat-cave!", // Spider
        "This streamgraph flows like the Bat-signal—'The Dark Knight' peaks at over $1B worldwide, a dark triumph over time!" // Streamgraph
    ];
    return commentaries[currentChartIndex];
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
        let nextButtonWidth = 150;
        let nextButtonHeight = 60;
        let nextButtonX = width - nextButtonWidth - 50;
        let nextButtonY = 150;
        if (mouseX >= nextButtonX && mouseX <= nextButtonX + nextButtonWidth &&
            mouseY >= nextButtonY && mouseY <= nextButtonY + nextButtonHeight) {
            currentChartIndex = (currentChartIndex + 1) % charts.length;
            charts[currentChartIndex].animationProgress = 0; 
        }

        let prevButtonWidth = 150;
        let prevButtonHeight = 60;
        let prevButtonX = nextButtonX - prevButtonWidth - 50;
        let prevButtonY = nextButtonY;
        if (mouseX >= prevButtonX && mouseX <= prevButtonX + prevButtonWidth &&
            mouseY >= prevButtonY && mouseY <= prevButtonY + prevButtonHeight) {
            currentChartIndex = (currentChartIndex - 1 + charts.length) % charts.length;
            charts[currentChartIndex].animationProgress = 0; 
        }

        
        let muteButtonWidth = 200;
        let muteButtonHeight = 60;
        let muteButtonX = width / 2 - muteButtonWidth / 2;
        let muteButtonY = height - muteButtonHeight - 50;
        if (mouseX >= muteButtonX && mouseX <= muteButtonX + muteButtonWidth &&
            mouseY >= muteButtonY && mouseY <= muteButtonY + muteButtonHeight) {
            isMuted = !isMuted;
            if (song) {
                song.setVolume(isMuted ? 0 : 0.5); 
            }
        }
    }
    getAudioContext().resume();
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
        chartPosX: 800,
        chartPosY: 500,
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
        chartPosX: 800,
        chartPosY: 700,
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
        chartPosX: 800,
        chartPosY: 700,
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
        chartPosX: 800,
        chartPosY: 700,
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
        chartPosX: 800,
        chartPosY: 700,
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
        chartHeight: 600,
        chartWidth: 600,
        margin: 15,
        axisThickness: 3,
        chartPosX: 800,
        chartPosY: 900,
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
        chartPosX: 800,
        chartPosY: 300,
        customFont: customfont,
        title: "Spider Plot - Box Office",
        xAxisTitle: "Movies",
        yAxisTitle: "Box Office (In Millions USD)",
        barColours: [color(255, 215, 0), color(0, 191, 255)],
        showAverageLine: false
    }));
}
