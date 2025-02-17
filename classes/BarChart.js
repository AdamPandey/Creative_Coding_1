class BarChart {
    constructor(_data, _xValue, _yValue, _chartHeight, _chartWidth, _barWidth, _margin, _axisthickness, _chartPosX, _chartPosY, _customfont, _title, _xAxisTitle, _yAxisTitle) {
        this.data = _data;
        this.xValue = _xValue;
        this.yValue = _yValue;
        this.chartHeight = _chartHeight;
        this.chartWidth = _chartWidth;
        this.barWidth = _barWidth;
        this.margin = _margin;
        this.axisthickness = _axisthickness;
        this.chartPosX = _chartPosX;
        this.chartPosY = _chartPosY;

        this.gap = (this.chartWidth - (this.data.length * this.barWidth) - (this.margin * 2)) / (this.data.length - 1);
        this.scaler = this.chartHeight / (max(cleanedData.map(row => row[this.yValue])) || 1);

        this.axisColor = color(125);
        this.barColour = color(255, 215, 0);
        this.axisTextColour = color(255, 255, 255);
        this.ticklength = 10;
        
        this.customFont = _customfont;
        this.title = _title;
        this.xAxisTitle = _xAxisTitle; 
        this.yAxisTitle = _yAxisTitle;
    }

    renderBars() {
        push();
        translate(this.chartPosX, this.chartPosY);
        push();
        translate(this.margin, 0);
        for (let i = 0; i < this.data.length; i++) {
            let xPos = (this.barWidth + this.gap) * i;
            let barHeight = this.data[i][this.yValue] * this.scaler; 
            fill(this.barColour);
            rect(xPos, 0, this.barWidth, -barHeight); 
    
            
            let circleY = -barHeight; 
            fill(255); 
            ellipse(xPos + this.barWidth / 2, circleY, 30, 30); 

            
            fill(0);
            textAlign(CENTER, CENTER);
            textSize(10);
            text(this.data[i][this.yValue], xPos + this.barWidth / 2, circleY); 
        }
        pop();
        pop();
    }

    renderAxis() {
        push();
        translate(this.chartPosX, this.chartPosY);
        noFill();
        stroke(this.axisColor);
        strokeWeight(this.axisthickness);
        line(0, 0, 0, -this.chartHeight);
        line(0, 0, this.chartWidth, 0);
        pop();
    }

    renderTicks() {
        push();
        translate(this.chartPosX, this.chartPosY);
        noFill();
        stroke(this.axisColor);
        strokeWeight(this.axisthickness);

        let tickIncrement = this.chartHeight / 5;
        for (let i = 0; i < 5; i++) {
            line(0, -tickIncrement * i, -this.ticklength, -tickIncrement * i);
        }
        pop();
    }

    renderLabels() {
        push();
        translate(this.chartPosX, this.chartPosY);
        push();
        translate(this.margin, 0);
        for (let i = 0; i < this.data.length; i++) {
            let xPos = (this.barWidth + this.gap) * i;
            push();
            rotate(90);
            fill(this.axisTextColour);
            textFont(this.customFont);
            text(this.data[i][this.xValue], 10, -(xPos + (this.barWidth / 2))); pop();
        }
        pop();
        pop();
    }

    renderYAxisLabels() {
        push();
        translate(this.chartPosX, this.chartPosY);
        fill(this.axisTextColour);
        noStroke();
        textAlign(RIGHT, CENTER);
        textSize(10);
        textFont(this.customFont);
        
        const maxValue = max(this.data.map(row => row[this.yValue]));
        const numberOfTicks = 5; 
        const tickIncrement = maxValue / numberOfTicks;
    
        for (let i = 0; i <= numberOfTicks; i++) {
            const labelValue = Math.round(tickIncrement * i);
            const yPos = -this.chartHeight + (this.chartHeight / numberOfTicks) * (numberOfTicks - i); 
            text(labelValue, -this.ticklength - 5, yPos); 
        }
        pop();
    }

    renderTitle() {
        push();
        fill(this.axisTextColour); 
        textAlign(CENTER, CENTER); 
        textSize(30); 
        textFont(this.customFont); 
        text(this.title, this.chartPosX + this.chartWidth / 2, this.chartPosY - this.chartHeight - 50); // Position the title above the chart
        pop();
    }

    renderGridLines() {
        push();
        translate(this.chartPosX, this.chartPosY);
        stroke(this.axisColor);
        strokeWeight(1); 
        const maxValue = max(this.data.map(row => row[this.yValue]));
        const numberOfTicks = 5; 
        const tickIncrement = maxValue / numberOfTicks;
    
        for (let i = 0; i <= numberOfTicks; i++) {
            const yPos = -this.chartHeight + (this.chartHeight / numberOfTicks) * i; 
            line(0, yPos, this.chartWidth, yPos);
        }
        pop();
    }

    renderXAxisTitle() {
        push();
        fill(this.axisTextColour); 
        textAlign(CENTER, CENTER);
        textSize(20);
        textFont(this.customFont);
        text(this.xAxisTitle, this.chartPosX + this.chartWidth / 2, this.chartPosY + 130); 
        pop();
    }
    
    renderYAxisTitle() {
        push();
        fill(this.axisTextColour);
        textAlign(CENTER, CENTER);
        textSize(20);
        textFont(this.customFont);
        
        
        push();
        translate(this.chartPosX, this.chartPosY);
        rotate(-90); 
        text(this.yAxisTitle, 0, -this.chartWidth / 2);
        pop();
        
        pop();
    }
}