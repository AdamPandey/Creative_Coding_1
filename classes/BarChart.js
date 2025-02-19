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

        // Dynamic spacing and sizing
        this.titleSize = options.titleSize || Math.min(this.chartWidth, this.chartHeight) * 0.08;
        this.axisTitleSize = options.axisTitleSize || Math.min(this.chartWidth, this.chartHeight) * 0.05;
        this.labelSize = options.labelSize || Math.min(this.chartWidth, this.chartHeight) * 0.03;
        this.padding = options.padding || Math.min(this.chartWidth, this.chartHeight) * 0.1;

        // Calculate gap and scaler based on chart type
        if (this.type === 'horizontal') {
            this.gap = (this.chartHeight - (this.data.length * this.barWidth) - (this.margin * 2)) / (this.data.length - 1);
            this.scaler = this.chartWidth / (max(this.data.map(row => row[this.yValues[0]])) || 1);
        } else if (this.type === 'vertical') {
            this.gap = (this.chartWidth - (this.data.length * this.barWidth) - (this.margin * 2)) / (this.data.length - 1);
            this.scaler = this.chartHeight / (max(this.data.map(row => row[this.yValues[0]])) || 1);
        } else if (this.type === 'stacked') {
            this.gap = (this.chartWidth - (this.data.length * this.barWidth) - (this.margin * 2)) / (this.data.length - 1);
            const maxTotal = max(this.data.map(row => this.yValues.reduce((sum, y) => sum + row[y], 0)));
            this.scaler = this.chartHeight / (maxTotal || 1);
        } else if (this.type === 'percentStacked') {
            this.gap = (this.chartWidth - (this.data.length * this.barWidth) - (this.margin * 2)) / (this.data.length - 1);
            this.scaler = this.chartHeight;
        } else {
            this.gap = 0;
            this.scaler = 1;
        }

        // Movie title abbreviations
        this.titleAbbreviations = {
            "Batman: The Movie": "Batman '66",
            "Batman": "Batman '89",
            "Batman Returns": "Returns",
            "Batman Forever": "Forever",
            "Batman & Robin": "& Robin",
            "Batman Begins": "Begins",
            "The Dark Knight": "Dark Knight",
            "The Dark Knight Rises": "Rises",
            "Batman v Superman: Dawn of Justice": "BvS",
            "Justice League": "Justice",
            "The Batman": "The Batman"
        };
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

    renderVerticalBars() {
        push();
        translate(this.margin, 0);
        for (let i = 0; i < this.data.length; i++) {
            let xPos = (this.barWidth + this.gap) * i;
            let barHeight = Math.min(this.data[i][this.yValues[0]] * this.scaler, this.chartHeight); // Cap at chartHeight
            fill(this.barColours[0]);
            noStroke();
            rect(xPos, -barHeight, this.barWidth, barHeight);

            fill(255);
            ellipse(xPos + this.barWidth / 2, -barHeight - this.padding / 2, 30, 30);
            fill(0);
            textAlign(CENTER, CENTER);
            textSize(this.labelSize);
            textFont(this.customFont);
            text(this.data[i][this.yValues[0]], xPos + this.barWidth / 2, -barHeight - this.padding / 2);
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
            ellipse(barLength + this.padding / 2, yPos + this.barWidth / 2, 30, 30);
            fill(0);
            textAlign(CENTER, CENTER);
            textSize(this.labelSize);
            textFont(this.customFont);
            text(this.data[i][this.yValues[0]], barLength + this.padding / 2, yPos + this.barWidth / 2);
        }
        pop();
    }

    renderStackedBars() {
        push();
        translate(this.margin, 0);
        for (let i = 0; i < this.data.length; i++) {
            let xPos = (this.barWidth + this.gap) * i;
            let accumulatedHeight = 0;
            let total = this.yValues.reduce((sum, y) => sum + this.data[i][y], 0);

            for (let j = 0; j < this.yValues.length; j++) {
                let value = this.data[i][this.yValues[j]];
                let segmentHeight = this.type === 'percentStacked' ? 
                    (total === 0 ? 0 : (value / total) * this.scaler) : 
                    value * this.scaler;
                // Cap accumulated height at chartHeight
                let cappedSegmentHeight = Math.min(segmentHeight, this.chartHeight - accumulatedHeight);
                fill(this.barColours[j % this.barColours.length]);
                noStroke();
                rect(xPos, -accumulatedHeight - cappedSegmentHeight, this.barWidth, cappedSegmentHeight);
                accumulatedHeight += cappedSegmentHeight;

                if (this.type === 'stacked') {
                    fill(255);
                    ellipse(xPos + this.barWidth / 2, -accumulatedHeight - this.padding / 2, 30, 30);
                    fill(0);
                    textAlign(CENTER, CENTER);
                    textSize(this.labelSize);
                    textFont(this.customFont);
                    text(this.data[i][this.yValues[j]], xPos + this.barWidth / 2, -accumulatedHeight - this.padding / 2);
                } else if (this.type === 'percentStacked') {
                    let percent = total === 0 ? 0 : Math.round((value / total) * 100);
                    fill(255);
                    ellipse(xPos + this.barWidth / 2, -accumulatedHeight - this.padding / 2, 30, 30);
                    fill(0);
                    textAlign(CENTER, CENTER);
                    textSize(this.labelSize);
                    textFont(this.customFont);
                    text(`${percent}%`, xPos + this.barWidth / 2, -accumulatedHeight - this.padding / 2);
                }
            }

            if (this.type === 'stacked') {
                let total = this.yValues.reduce((sum, y) => sum + this.data[i][y], 0);
                fill(255);
                ellipse(xPos + this.barWidth / 2, -accumulatedHeight - this.padding / 2, 30, 30);
                fill(0);
                textAlign(CENTER, CENTER);
                textSize(this.labelSize);
                textFont(this.customFont);
                text(total, xPos + this.barWidth / 2, -accumulatedHeight - this.padding / 2);
            }
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
        } else if (this.type === 'vertical' || this.type === 'stacked' || this.type === 'percentStacked') {
            line(0, 0, this.chartWidth, 0); // X-axis
            line(0, 0, 0, -this.chartHeight); // Y-axis
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
            const maxTickValue = Math.ceil(maxValue / tickIncrement) * tickIncrement;
            const numTicks = Math.ceil(maxValue / tickIncrement);
            const scaler = this.chartWidth / maxTickValue;

            for (let i = 0; i <= numTicks; i++) {
                let xPos = i * tickIncrement * scaler;
                if (xPos <= this.chartWidth) {
                    line(xPos, 0, xPos, this.tickLength);
                }
            }
        } else if (this.type === 'vertical' || this.type === 'stacked') {
            const maxValue = max(this.data.map(row => this.yValues.reduce((sum, y) => sum + row[y], 0)));
            const tickIncrement = 100;
            const maxTickValue = Math.ceil(maxValue / tickIncrement) * tickIncrement;
            const numTicks = Math.ceil(maxValue / tickIncrement);
            const scaler = this.chartHeight / maxTickValue;

            for (let i = 0; i <= numTicks; i++) {
                let yPos = -i * tickIncrement * scaler;
                line(-this.tickLength, yPos, 0, yPos);
            }
        } else if (this.type === 'percentStacked') {
            const tickIncrement = 25; // 0%, 25%, 50%, 75%, 100%
            const numTicks = 4;
            const scaler = this.chartHeight / 100; // 100% = chartHeight

            for (let i = 0; i <= numTicks; i++) {
                let yPos = -i * tickIncrement * scaler;
                line(-this.tickLength, yPos, 0, yPos);
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
            let displayTitle = this.titleAbbreviations[this.data[i][this.xValue]] || this.data[i][this.xValue];
            if (this.type === 'horizontal') {
                let yPos = (this.barWidth + this.gap) * i;
                fill(this.axisTextColour);
                textFont(this.customFont);
                textAlign(RIGHT, CENTER);
                textSize(this.labelSize);
                text(displayTitle, -this.tickLength - 5, yPos + this.barWidth / 2);
            } else if (this.type === 'vertical' || this.type === 'stacked' || this.type === 'percentStacked') {
                let xPos = (this.barWidth + this.gap) * i;
                fill(this.axisTextColour);
                textFont(this.customFont);
                textAlign(CENTER, CENTER);
                textSize(this.labelSize);
                push();
                translate(xPos + this.barWidth / 2, this.padding);
                rotate(-PI/2);
                text(displayTitle, 0, 0);
                pop();
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
        textSize(this.labelSize);
        textFont(this.customFont);

        if (this.type === 'horizontal') {
            const maxValue = max(this.data.map(row => row[this.yValues[0]]));
            const tickIncrement = 100;
            const maxTickValue = Math.ceil(maxValue / tickIncrement) * tickIncrement;
            const numTicks = Math.ceil(maxValue / tickIncrement);
            const scaler = this.chartWidth / maxTickValue;

            for (let i = 0; i <= numTicks; i++) {
                const labelValue = i * tickIncrement;
                const xPos = i * tickIncrement * scaler;
                if (xPos <= this.chartWidth) {
                    text(labelValue, xPos, this.tickLength + this.padding / 2);
                }
            }
        } else if (this.type === 'vertical' || this.type === 'stacked') {
            const maxValue = max(this.data.map(row => this.yValues.reduce((sum, y) => sum + row[y], 0)));
            const tickIncrement = 100;
            const maxTickValue = Math.ceil(maxValue / tickIncrement) * tickIncrement;
            const numTicks = Math.ceil(maxValue / tickIncrement);
            const scaler = this.chartHeight / maxTickValue;

            for (let i = 0; i <= numTicks; i++) {
                const labelValue = i * tickIncrement;
                const yPos = -i * tickIncrement * scaler;
                text(labelValue, -this.tickLength - this.padding / 2, yPos);
            }
        } else if (this.type === 'percentStacked') {
            const tickIncrement = 25; // 0%, 25%, 50%, 75%, 100%
            const numTicks = 4;
            const scaler = this.chartHeight / 100;

            for (let i = 0; i <= numTicks; i++) {
                const labelValue = i * tickIncrement;
                const yPos = -i * tickIncrement * scaler;
                text(`${labelValue}%`, -this.tickLength - this.padding / 2, yPos);
            }
        }
        pop();
    }

    renderTitle() {
        push();
        fill(this.axisTextColour);
        textAlign(CENTER, CENTER);
        textSize(this.titleSize);
        textFont(this.customFont);
        if (this.type === 'horizontal') {
            text(this.title, this.chartPosX + this.chartWidth / 2, this.chartPosY - this.padding - 50);
        } else {
            text(this.title, this.chartPosX + this.chartWidth / 2, this.chartPosY - this.chartHeight - this.padding);
        }
        pop();
    }

    renderGridLines() {
        push();
        translate(this.chartPosX, this.chartPosY);
        stroke(this.axisColor);
        strokeWeight(1);

        if (this.type === 'horizontal') {
            const maxValue = max(this.data.map(row => row[this.yValues[0]]));
            const tickIncrement = 100;
            const maxTickValue = Math.ceil(maxValue / tickIncrement) * tickIncrement;
            const numTicks = Math.ceil(maxValue / tickIncrement);
            const scaler = this.chartWidth / maxTickValue;

            for (let i = 0; i <= numTicks; i++) {
                const xPos = i * tickIncrement * scaler;
                if (xPos <= this.chartWidth) {
                    line(xPos, 0, xPos, this.chartHeight);
                }
            }
        } else if (this.type === 'vertical' || this.type === 'stacked') {
            const maxValue = max(this.data.map(row => this.yValues.reduce((sum, y) => sum + row[y], 0)));
            const tickIncrement = 100;
            const maxTickValue = Math.ceil(maxValue / tickIncrement) * tickIncrement;
            const numTicks = Math.ceil(maxValue / tickIncrement);
            const scaler = this.chartHeight / maxTickValue;

            for (let i = 0; i <= numTicks; i++) {
                const yPos = -i * tickIncrement * scaler;
                line(0, yPos, this.chartWidth, yPos);
            }
        } else if (this.type === 'percentStacked') {
            const tickIncrement = 25;
            const numTicks = 4;
            const scaler = this.chartHeight / 100;

            for (let i = 0; i <= numTicks; i++) {
                const yPos = -i * tickIncrement * scaler;
                line(0, yPos, this.chartWidth, yPos);
            }
        }
        pop();
    }

    renderXAxisTitle() {
        push();
        fill(this.axisTextColour);
        textAlign(CENTER, CENTER);
        textSize(this.axisTitleSize);
        textFont(this.customFont);
        if (this.type === 'horizontal') {
            text(this.xAxisTitle, this.chartPosX + this.chartWidth / 2, this.chartPosY - 30);
        } else {
            text(this.xAxisTitle, this.chartPosX + this.chartWidth / 2, this.chartPosY + this.padding * 2);
        }
        pop();
    }

    renderYAxisTitle() {
        push();
        fill(this.axisTextColour);
        textAlign(CENTER, CENTER);
        textSize(this.axisTitleSize);
        textFont(this.customFont);
        push();
        if (this.type === 'horizontal') {
            translate(this.chartPosX - 100, this.chartPosY + 190);
        } else {
            translate(this.chartPosX - 100, this.chartPosY - this.chartHeight / 2);
        }
        rotate(-PI/2);
        text(this.yAxisTitle, 0, 0);
        pop();
        pop();
    }

    renderAverageLine() {
        if (this.showAverageLine) {
            push();
            translate(this.chartPosX, this.chartPosY);
            let totalSum = this.data.reduce((sum, row) => sum + row[this.yValues[0]], 0);
            let average = totalSum / this.data.length;
            stroke(this.averageLineColor);
            strokeWeight(2);
            if (this.type === 'horizontal') {
                let xPos = average * this.scaler;
                line(xPos, 0, xPos, this.chartHeight);
            } else if (this.type === 'vertical' || this.type === 'stacked' || this.type === 'percentStacked') {
                let totalSum = this.data.reduce((sum, row) => sum + this.yValues.reduce((s, y) => s + row[y], 0), 0);
                let average = totalSum / this.data.length;
                let yPos = this.type === 'percentStacked' ? 
                    -(average / this.data.length) * this.scaler / 100 : 
                    -average * this.scaler;
                line(0, yPos, this.chartWidth, yPos);
            }
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