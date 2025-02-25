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
        } else if (this.type === 'linearRegression') {
            this.gap = 0;
            const maxY = max(this.data.map(row => row[this.yValues[0]]));
            this.yScaler = this.chartHeight / (maxY || 1);
            const xMin = min(this.data.map(row => parseFloat(row[this.xValue])));
            const xMax = max(this.data.map(row => parseFloat(row[this.xValue])));
            this.xScaler = (this.chartWidth - 2 * this.margin) / (xMax - xMin || 1);
            this.xMin = xMin;
            this.calculateLinearRegression();
        } else if (this.type === 'spider') {
            this.gap = 0;
            const maxY = max(this.data.map(row => this.yValues.reduce((sum, y) => sum + row[y], 0)));
            this.scaler = min(this.chartWidth, this.chartHeight) / 2 / (maxY || 1);
        } else if (this.type === 'curvedArea') {
            this.gap = (this.chartWidth - (this.data.length * this.barWidth) - (this.margin * 2)) / (this.data.length - 1);
            const maxY = max(this.data.map(row => row[this.yValues[0]]));
            this.scaler = this.chartHeight / (maxY || 1);
        } else {
            this.gap = 0;
            this.scaler = 1;
        }

        // Animation state
        this.animationProgress = 0;

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

    
    formatNumber(value) {
        if (value >= 1000000000) {
            return (value / 1000000000).toFixed(1) + " M";
        } else if (value >= 1000000) {
            return (value / 1000000).toFixed(1) + " K";
        } else if (value >= 1000) {
            return (value / 1000).toFixed(1) + " B";
        }
        return value.toString();
    }

    calculateLinearRegression() {
        const x = this.data.map(row => parseFloat(row[this.xValue]));
        const y = this.data.map(row => parseFloat(row[this.yValues[0]]));
        const n = x.length;

        const sumX = x.reduce((sum, val) => sum + val, 0);
        const sumY = y.reduce((sum, val) => sum + val, 0);
        const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
        const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);

        this.m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        this.b = (sumY - this.m * sumX) / n;
    }

    renderBars() {
        push();
        translate(this.chartPosX, this.chartPosY);

        if (this.type === 'horizontal') {
            this.renderHorizontalBars();
        } else if (this.type === 'stacked' || this.type === 'percentStacked') {
            this.renderStackedBars();
        } else if (this.type === 'linearRegression') {
            this.renderLinearRegressionPoints();
        } else if (this.type === 'spider') {
            this.renderSpiderPlot();
        } else if (this.type === 'curvedArea') {
            this.renderCurvedArea();
        } else {
            this.renderVerticalBars();
        }

        pop();
    }

    renderCurvedArea() {
        push();
        translate(this.margin + 25, 0);
    
        
        let gradient = drawingContext.createLinearGradient(0, 0, 0, -this.chartHeight);
        gradient.addColorStop(0, color(this.barColours[0].levels[0], this.barColours[0].levels[1], this.barColours[0].levels[2], 150));
        drawingContext.fillStyle = gradient;
    
        noStroke();
        beginShape();
        vertex(0, 0);
    
        for (let i = 0; i < this.data.length; i++) {
            let x = i * (this.barWidth + this.gap);
            let y = -this.data[i][this.yValues[0]] * this.scaler * this.easeInOutQuad(this.animationProgress);
    
            if (i === 0) {
                vertex(x, y); 
            } else {
                let prevX = (i - 1) * (this.barWidth + this.gap);
                let prevY = -this.data[(i - 1)][this.yValues[0]] * this.scaler * this.easeInOutQuad(this.animationProgress);
                let controlX1 = prevX + (x - prevX) * 0.33;
                let controlY1 = prevY;
                let controlX2 = prevX + (x - prevX) * 0.67;
                let controlY2 = y;
                bezierVertex(controlX1, controlY1, controlX2, controlY2, x, y);
            }
        }
    
        vertex((this.data.length - 1) * (this.barWidth + this.gap), 0);
        endShape(CLOSE);
    
        
        if (this.animationProgress > 0) {
            for (let i = 0; i < this.data.length; i++) {
                let x = i * (this.barWidth + this.gap);
                let y = -this.data[i][this.yValues[0]] * this.scaler * this.easeInOutQuad(this.animationProgress);
                fill(255);
                ellipse(x, y, 30, 30);
                fill(0);
                textAlign(CENTER, CENTER);
                textSize(this.labelSize);
                textFont(this.customFont);
                text(this.formatNumber(this.data[i][this.yValues[0]]), x, y);
            }
        }
    
        pop();
    }

    renderVerticalBars() {
        push();
        translate(this.margin, 0);
        for (let i = 0; i < this.data.length; i++) {
            let xPos = (this.barWidth + this.gap) * i;
            let fullHeight = Math.min(this.data[i][this.yValues[0]] * this.scaler, this.chartHeight);
            let animatedHeight = fullHeight * this.easeInOutQuad(this.animationProgress);

            fill(this.barColours[0]);
            noStroke();
            rect(xPos, 0, this.barWidth, -animatedHeight);

            if (this.animationProgress > 0) {
                fill(255);
                ellipse(xPos + this.barWidth / 2, -animatedHeight - this.padding / 2, 30, 30);
                fill(0);
                textAlign(CENTER, CENTER);
                textSize(this.labelSize);
                textFont(this.customFont);
                text(this.data[i][this.yValues[0]], xPos + this.barWidth / 2, -animatedHeight - this.padding / 2);
            }
        }
        pop();
    }

    renderHorizontalBars() {
        push();
        translate(0, this.margin);
        for (let i = 0; i < this.data.length; i++) {
            let yPos = (this.barWidth + this.gap) * i;
            let fullLength = this.data[i][this.yValues[0]] * this.scaler;
            let animatedLength = fullLength * this.easeInOutQuad(this.animationProgress);

            fill(this.barColours[0]);
            noStroke();
            rect(0, yPos, animatedLength, this.barWidth);

            if (this.animationProgress > 0) {
                fill(255);
                ellipse(animatedLength + this.padding / 2, yPos + this.barWidth / 2, 30, 30);
                fill(0);
                textAlign(CENTER, CENTER);
                textSize(this.labelSize);
                textFont(this.customFont);
                text(this.data[i][this.yValues[0]], animatedLength + this.padding / 2, yPos + this.barWidth / 2);
            }
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
                let animatedHeight = segmentHeight * this.easeInOutQuad(this.animationProgress);
                let cappedSegmentHeight = Math.min(animatedHeight, this.chartHeight - accumulatedHeight);

                fill(this.barColours[j % this.barColours.length]);
                noStroke();
                rect(xPos, -accumulatedHeight - cappedSegmentHeight, this.barWidth, cappedSegmentHeight);

                if (this.animationProgress > 0) {
                    if (this.type === 'stacked') {
                        fill(255);
                        ellipse(xPos + this.barWidth / 2, -accumulatedHeight - cappedSegmentHeight - this.padding / 2, 35, 35);
                        fill(0);
                        textAlign(CENTER, CENTER);
                        textSize(this.labelSize);
                        textFont(this.customFont);
                        text(this.formatNumber(this.data[i][this.yValues[j]]), xPos + this.barWidth / 2, -accumulatedHeight - cappedSegmentHeight - this.padding / 2);
                    } else if (this.type === 'percentStacked') {
                        let percent = total === 0 ? 0 : Math.round((value / total) * 100);
                        fill(255);
                        ellipse(xPos + this.barWidth / 2, -accumulatedHeight - cappedSegmentHeight - this.padding / 2, 35, 35);
                        fill(0);
                        textAlign(CENTER, CENTER);
                        textSize(this.labelSize);
                        textFont(this.customFont);
                        text(`${percent}%`, xPos + this.barWidth / 2, -accumulatedHeight - cappedSegmentHeight - this.padding / 2);
                    }
                }
                accumulatedHeight += cappedSegmentHeight;
            }

            if (this.type === 'stacked' && this.animationProgress > 0) {
                let total = this.yValues.reduce((sum, y) => sum + this.data[i][y], 0);
                fill(255);
                ellipse(xPos + this.barWidth / 2, -accumulatedHeight - this.padding / 2, 30, 30);
                fill(0);
                textAlign(CENTER, CENTER);
                textSize(this.labelSize);
                textFont(this.customFont);
                text(this.formatNumber(total), xPos + this.barWidth / 2, -accumulatedHeight - this.padding / 2);
            }
        }
        pop();
    }

    renderLinearRegressionPoints() {
        push();
        translate(this.margin, 0);

        for (let i = 0; i < this.data.length; i++) {
            let xVal = parseFloat(this.data[i][this.xValue]);
            let yVal = this.data[i][this.yValues[0]];
            let xPos = (xVal - this.xMin) * this.xScaler;
            let yPos = Math.min(yVal * this.yScaler, this.chartHeight);
            fill(this.barColours[0]);
            noStroke();
            ellipse(xPos, -yPos, 10, 10);

            fill(255);
            textAlign(CENTER, CENTER);
            textSize(this.labelSize);
            textFont(this.customFont);
            text(yVal, xPos, -yPos - this.padding / 2);
        }

        stroke(255, 0, 0);
        strokeWeight(2);
        const xActualMin = min(this.data.map(row => parseFloat(row[this.xValue])));
        const xActualMax = max(this.data.map(row => parseFloat(row[this.xValue])));
        let yStart = this.m * xActualMin + this.b;
        let yEnd = this.m * xActualMax + this.b;
        let yPosStart = constrain(yStart * this.yScaler, 0, this.chartHeight);
        let yPosEnd = constrain(yEnd * this.yScaler, 0, this.chartHeight);
        line(0, -yPosStart, this.chartWidth - 2 * this.margin, -yPosEnd);

        pop();
    }

    renderSpiderPlot() {
        push();
        translate(this.chartWidth / 2, this.chartHeight / 2);

        const radius = min(this.chartWidth, this.chartHeight) / 2 - this.padding;
        const angleStep = TWO_PI / this.data.length;

        for (let i = 0; i < this.data.length; i++) {
            let angle = i * angleStep;
            let x = cos(angle) * radius;
            let y = sin(angle) * radius;
            stroke(this.axisColor);
            strokeWeight(this.axisThickness);
            line(0, 0, x, y);

            let labelX = cos(angle) * (radius + this.padding / 2);
            let labelY = sin(angle) * (radius + this.padding / 2);
            fill(this.axisTextColour);
            noStroke();
            textAlign(CENTER, CENTER);
            textSize(this.labelSize);
            textFont(this.customFont);
            let displayTitle = this.titleAbbreviations[this.data[i][this.xValue]] || this.data[i][this.xValue];
            text(displayTitle, labelX, labelY);
        }

        for (let j = 0; j < this.yValues.length; j++) {
            stroke(this.barColours[j % this.barColours.length]);
            strokeWeight(2);
            noFill();
            beginShape();
            for (let i = 0; i < this.data.length; i++) {
                let angle = i * angleStep;
                let value = this.data[i][this.yValues[j]];
                let r = min(value * this.scaler, radius);
                let x = cos(angle) * r;
                let y = sin(angle) * r;
                vertex(x, y);
            }
            endShape(CLOSE);
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
            line(0, this.chartHeight, this.chartWidth, this.chartHeight);
            line(0, this.chartHeight, 0, 0);
        } else if (this.type === 'vertical' || this.type === 'stacked' || this.type === 'percentStacked' || this.type === 'linearRegression' || this.type === 'curvedArea') {
            line(0, 0, this.chartWidth, 0);
            line(0, 0, 0, -this.chartHeight);
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
                    line(xPos, this.chartHeight, xPos, this.chartHeight - this.tickLength);
                }
            }
        } else if (this.type === 'vertical' || this.type === 'stacked' || this.type === 'linearRegression' || this.type === 'curvedArea') {
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
            const tickIncrement = 25;
            const numTicks = 4;
            const scaler = this.chartHeight / 100;

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
                text(displayTitle, -this.tickLength - 15, yPos + this.barWidth / 2 + 10);
            } else if (this.type === 'vertical' || this.type === 'stacked' || this.type === 'percentStacked' || this.type === 'curvedArea') {
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
            } else if (this.type === 'linearRegression') {
                let xVal = parseFloat(this.data[i][this.xValue]);
                let xPos = (xVal - this.xMin) * this.xScaler;
                fill(this.axisTextColour);
                textFont(this.customFont);
                textAlign(CENTER, CENTER);
                textSize(this.labelSize);
                push();
                translate(xPos, this.padding);
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
                    text(labelValue, xPos + 5, this.chartHeight + this.tickLength / 2 +20);
                }
            }
        } else if (this.type === 'vertical' || this.type === 'stacked' || this.type === 'linearRegression' || this.type === 'curvedArea') {
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
            const tickIncrement = 25;
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
            text(this.title, this.chartPosX + this.chartWidth / 2, this.chartPosY - 2 * this.padding - 50);
        } else if (this.type === 'spider') {
            text(this.title, this.chartPosX + this.chartWidth / 2, this.chartPosY - this.chartHeight / 2 + 200);
        } else {
            text(this.title, this.chartPosX + this.chartWidth / 2, this.chartPosY - this.chartHeight - 2 * this.padding);
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
        } else if (this.type === 'vertical' || this.type === 'stacked' || this.type === 'linearRegression' || this.type === 'curvedArea') {
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
            text(this.xAxisTitle, this.chartPosX + this.chartWidth / 2, this.chartPosY + this.chartHeight + this.padding * 2);
        } else if (this.type !== 'spider') {
            text(this.xAxisTitle, this.chartPosX + this.chartWidth / 2, this.chartPosY + 120);
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
            translate(this.chartPosX - 150, this.chartPosY + this.chartHeight / 2);
        } else if (this.type === 'spider') {
            // Do nothing for spider plot
        } else {
            translate(this.chartPosX - 100, this.chartPosY - this.chartHeight / 2);
        }
        if (this.type !== 'spider') {
            rotate(-PI/2);
            text(this.yAxisTitle, 0, 0);
        }
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
            } else if (this.type === 'vertical' || this.type === 'stacked' || this.type === 'percentStacked' || this.type === 'linearRegression' || this.type === 'curvedArea' || this.type === 'spider') {
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

    easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    }
}