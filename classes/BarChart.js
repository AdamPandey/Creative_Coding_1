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

        // Colors
        this.barColours = options.barColours || [color(255, 215, 0)];
        this.axisColor = options.axisColor || color(125);
        this.axisTextColour = options.axisTextColour || color(255, 255, 255);

        // Average line options
        this.showAverageLine = options.showAverageLine || false;
        this.averageLineColor = options.averageLineColor || color(255, 0, 0);

        
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

        let numberOfTicks = 5;
        if (this.type === 'horizontal') {
            let tickIncrement = this.chartWidth / numberOfTicks;
            for (let i = 0; i <= numberOfTicks; i++) {
                line(tickIncrement * i, 0, tickIncrement * i, this.tickLength);
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
                textSize(10);
                text(this.data[i][this.xValue], -this.tickLength - 5, yPos + this.barWidth / 2);
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

        const numberOfTicks = 5;
        if (this.type === 'horizontal') {
            const maxValue = max(this.data.map(row => row[this.yValues[0]]));
            const tickIncrement = maxValue / numberOfTicks;
            for (let i = 0; i <= numberOfTicks; i++) {
                const labelValue = Math.round(tickIncrement * i);
                const xPos = (this.chartWidth / numberOfTicks) * i;
                text(labelValue, xPos, this.tickLength + 15);
            }
        }
        pop();
    }

    renderTitle() {
        push();
        fill(this.axisTextColour);
        textAlign(CENTER, CENTER);
        textSize(30);
        textFont(this.customFont);
        text(this.title, this.chartPosX + this.chartWidth / 2, this.chartPosY - this.chartHeight - 50);
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