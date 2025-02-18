class BarChart {
    constructor(options) {
        // Required options
        this.data = options.data;
        this.xValue = options.xValue;
        this.yValues = options.yValues || [options.yValue];
        this.type = options.type || 'vertical';

        // Chart dimensions and styling
        this.chartHeight = options.chartHeight || 500;
        this.chartWidth = options.chartWidth || 600;
        this.barWidth = options.barWidth || 40;
        this.margin = options.margin || 15;
        this.axisThickness = options.axisThickness || 3;
        this.chartPosX = options.chartPosX || 200;
        this.chartPosY = options.chartPosY || 650;
        this.tickLength = options.tickLength || 10;

        // Fonts and titles
        this.customFont = options.customFont || 'Arial';
        this.title = options.title || '';
        this.xAxisTitle = options.xAxisTitle || '';
        this.yAxisTitle = options.yAxisTitle || '';

        
        this.barColours = options.barColours || [color(255, 215, 0)];
        this.axisColor = options.axisColor || color(125);
        this.axisTextColour = options.axisTextColour || color(255, 255, 255);

       
        this.showAverageLine = options.showAverageLine || false;
        this.averageLineColor = options.averageLineColor || color(255, 0, 0);

        
        if (this.type === 'horizontal') {
            this.gap = (this.chartHeight - (this.data.length * this.barWidth) - (this.margin * 2)) / (this.data.length - 1);
            this.scaler = this.chartWidth / (max(this.data.map(row => row[this.yValues[0]])) || 1);
        } else {
            
            this.gap = 0; 
            this.scaler = 1; 
        }
    }

    renderBars() {
        push();
        translate(this.chartPosX, this.chartPosY);

        if (this.type === 'horizontal') {
            this.renderHorizontalBars();
        } else if (this.type === 'stacked' || this.type === 'percentStacked') {
            this.renderStackedBars();
        } else {
            this.renderVerticalBars();
        }

        pop();
    }

    renderHorizontalBars() {
        push();
        translate(0, this.margin); 
        for (let i = 0; i < this.data.length; i++) {
            let yPos = (this.barWidth + this.gap) * i;
            let barLength = this.data[i][this.yValues[0]] * this.scaler;
            fill(this.barColours[0]);
            noStroke();
            rect(0, yPos, barLength, this.barWidth);

            
            fill(255);
            ellipse(barLength + 15, yPos + this.barWidth / 2, 30, 30);
            fill(0);
            textAlign(CENTER, CENTER);
            textSize(15);
            textFont(this.customFont);
            text(this.data[i][this.yValues[0]], barLength + 15, yPos + this.barWidth / 2);
        }
        pop();
    }

    
    renderVerticalBars() {
        
        console.log("Vertical bars not implemented yet.");
    }

    renderStackedBars() {
        
        console.log("Stacked bars not implemented yet.");
    }

    renderAxis() {
        push();
        translate(this.chartPosX, this.chartPosY);
        noFill();
        stroke(this.axisColor);
        strokeWeight(this.axisThickness);
        if (this.type === 'horizontal') {
            line(0, 0, this.chartWidth, 0);
            line(0, 0, 0, this.chartHeight); 
        }
        pop();
    }

    renderTicks() {
        push();
        translate(this.chartPosX, this.chartPosY);
        noFill();
        stroke(this.axisColor);
        strokeWeight(this.axisThickness);
    
        if (this.type === 'horizontal') {
            const maxValue = max(this.data.map(row => row[this.yValues[0]])); 
            const tickIncrement = 100; 
            const numTicks = Math.floor(maxValue / tickIncrement) + 1; 
            const scaler = this.chartWidth / maxValue; 
    
            for (let i = 0; i < numTicks; i++) {
                let xPos = i * tickIncrement * scaler;
                line(xPos, 0, xPos, this.tickLength);
            }
        }
        pop();
    }

    renderLabels() {
        push();
        translate(this.chartPosX, this.chartPosY);
        push();
        translate(this.margin, 0);
        for (let i = 0; i < this.data.length; i++) {
            if (this.type === 'horizontal') {
                let yPos = (this.barWidth + this.gap) * i;
                fill(this.axisTextColour);
                textFont(this.customFont);
                textAlign(RIGHT, CENTER);
                textSize(20);
                text(this.data[i][this.xValue], -this.tickLength - 20, yPos + this.barWidth / 2);
            }
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
    
        if (this.type === 'horizontal') {
            const maxValue = max(this.data.map(row => row[this.yValues[0]]));
            const tickIncrement = 100;
            const numTicks = Math.floor(maxValue / tickIncrement) + 1;
            const scaler = this.chartWidth / maxValue;
    
            for (let i = 0; i < numTicks; i++) {
                const labelValue = i * tickIncrement; 
                const xPos = i * tickIncrement * scaler;
                text(labelValue, xPos, this.tickLength + 15);
            }
        }
        pop();
    }

    renderTitle() {
        push();
        fill(this.axisTextColour);
        textAlign(CENTER, CENTER);
        textSize(50);
        textFont(this.customFont);
        text(this.title, this.chartPosX + this.chartWidth / 2, this.chartPosY - 80);
        pop();
    }

    renderGridLines() {
        push();
        translate(this.chartPosX, this.chartPosY);
        stroke(this.axisColor);
        strokeWeight(1);
        const numberOfTicks = 5;

        if (this.type === 'horizontal') {
            const maxValue = max(this.data.map(row => row[this.yValues[0]]));
            const tickIncrement = maxValue / numberOfTicks;
            for (let i = 0; i <= numberOfTicks; i++) {
                const xPos = (this.chartWidth / numberOfTicks) * i;
                line(xPos, 0, xPos, this.chartHeight);
            }
        }
        pop();
    }

    renderXAxisTitle() {
        push();
        fill(this.axisTextColour);
        textAlign(CENTER, CENTER);
        textSize(20);
        textFont(this.customFont);
        text(this.xAxisTitle, this.chartPosX + this.chartWidth / 2, this.chartPosY - 30);
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
        text(this.yAxisTitle, -280, -200);
        pop();
        pop();
    }

    renderAverageLine() {
        if (this.showAverageLine && this.type === 'horizontal') {
            push();
            translate(this.chartPosX, this.chartPosY);
            let totalSum = this.data.reduce((sum, row) => sum + row[this.yValues[0]], 0);
            let average = totalSum / this.data.length;
            let xPos = average * this.scaler;
            stroke(this.averageLineColor);
            strokeWeight(2);
            line(xPos, 0, xPos, this.chartHeight);
            pop();
        }
    }

    render() {
        this.renderGridLines();
        this.renderBars();
        this.renderAxis();
        this.renderLabels();
        this.renderTicks();
        this.renderYAxisLabels();
        this.renderTitle();
        this.renderXAxisTitle();
        this.renderYAxisTitle();
        this.renderAverageLine();
    }
}