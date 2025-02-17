let data;
let cleanedData = [];
// let chartHeight = 800;
// let chartWidth = 800;
// let barWidth = 10;
// let margin = 15;
// let gap;
// let scaler;
// let axisthickness = 3;
// let chartPosX = 200;
// let chartPosY = 800;
// let axisColor;
// let barColour;
// let femaleAges;
// let ageGroups;
// let axisTextColour;
let charts = [];



function preload(){
    data = loadTable('data/Combined.csv','csv','header');
    customfont = loadFont('assets/Poppins-Regular.ttf');
}

function setup(){
    createCanvas(1000,1000);
    angleMode(DEGREES);
    noLoop();
    // i ="john";
    cleanData();

    charts.push(new BarChart(cleanedData,"Age_Group","Female",500,600,40,15,-1,200,650,customfont,"Extremely Sexy Bar Chart Showing Daddy Ages","Age of Keezy fem (years)", "No. of Daddies"));
    // rectMode(CENTER);
    // femaleAges = cleanedData.map(row => row.Female);
    // ageGroups = cleanedData.map(row => row.Age_Group);

    // console.log(femaleAges);
    // console.log(ageGroups);
    // // gap = (chartWidth - (femaleAges.length * barWidth) - (margin*2))/(femaleAges.length-1);
    // //scaler = chartHeight/(max(femaleAges));
    // axisColor = color(210,255,255);
    // barColour = color(255,255,255);
    // axisTextColour = color(125,0,0);
}

function draw(){
    // let i = sin(45);
    // console.log(i);    
    background(0, 38, 77);
    charts.forEach(chart => chart.renderGridLines());
    charts.forEach(chart => chart.renderBars());
    charts.forEach(chart => chart.renderAxis());
    charts.forEach(chart => chart.renderLabels());
    charts.forEach(chart => chart.renderTicks());
    charts.forEach(chart => chart.renderYAxisLabels());
    charts.forEach(chart => chart.renderTitle());
    charts.forEach(chart => chart.renderXAxisTitle()());
    charts.forEach(chart => chart.renderYAxisTitle()());
    // // console.log(i);
    // fill(0,255,0);
    // stroke(0,0,0);

    // push();
    // translate(300,300);
    // rotate(45);
    // rect(0,0,100,100);
    // pop();  

    // push();
    // translate(150,150);
    // fill(0,255,255);
    // stroke(0,0,0);
    // rect(0,0,100,100);
    // pop();

    // let femaleAges = [];
    //method 1
    // cleanedData.forEach(function(age){
    //     femaleAges.push(age.Female);
    //     console.log(femaleAges);
    // });
    //method 2
    // let females = cleanedData.map((
    //     function (age){
    //         return age.female;
    //         console.log(femaleAges);
    //     }
    // ))
    //method 3
    // background(215,225,30);
    // push();
    // translate(chartPosX,chartPosY);
    // noFill();
    // stroke(axisColor);
    // strokeWeight(axisthickness);
    // line (0,0,0,-chartHeight);
    // line (0,0,chartWidth,0);
    // push();
    // translate(margin,0);
    // for(let i = 0 ; i< femaleAges.length ; i++){
    //     let xPos = (barWidth + gap) * i;
    //     fill(barColour);
    //     rect(xPos,0,barWidth,-femaleAges[i]*scaler);
    //     fill(axisTextColour);
    //     noStroke();
    //     textAlign(LEFT,CENTER);
    //     textSize(10);
    //     push();
    //     rotate(90);
    //     text(ageGroups[i], 10, -(xPos + (barWidth/2)));
    //     pop();
    // }
    // pop();
    // pop();


    

}

// class friend{
    
//     constructor(_name, _number){
//         this.name = _name;
//         this.number = _number;
//     };

//     report() {
//         console.log(this.name, this.number);
//     }
// }

// let myfriend = new friend("Optimus",20000000000000);

// let friends = [];
// friends.push(new friend("Dave", 289));
// friends.push(new friend("Buster", 119));
// console.log(friends);

function cleanData(){
    for(let i = 0; i < data.rows.length; i++){
        cleanedData.push(data.rows[i].obj);
    }

    for(let i = 0; i < cleanData.length; i++){
        cleanedData[i].Female = parseInt(cleanedData[i].Female);
        cleanedData[i].Male = parseInt(cleanedData[i].Male);
        cleanedData[i].Total = parseInt(cleanedData[i].Total);
    }
}




