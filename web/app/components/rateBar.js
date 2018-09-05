/**
*@Author Cedrick Ngeja
*@param {ctx} : canvas context
*@this :create graphis bar for like
*/
function RateBar(ctx) {
    'use strict';

    // Private properties and methods	
    var that = this,
		
        // Draw method updates the canvas with the current display
        draw = function () {
            var  barWidth,    barHeight, border = 0, maxBarWidth, gradient;
	  // Update the dimensions of the canvas only if they have changed
            if (ctx.canvas.width !== that.width || ctx.canvas.height !== that.height) {
                ctx.canvas.width = that.width;
                ctx.canvas.height = that.height;
            }
            // Draw the background color
            //set color value when the rate is latest than half totalrate
            if(that.rate < Math.floor(that.totalRate/2)){
                that.backgroundColor = "#dc8b8b";
            }else{
                that.backgroundColor = "#8fd4bb";
            }
            ctx.fillStyle = that.backgroundColor;
            ctx.fillRect(0, 0, that.width * that.rate / that.totalRate, that.height);
        
            // Turn on shadow
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            ctx.shadowBlur = 2;
            ctx.shadowColor = "#999";
        };

    // Public properties and methods	
    this.width = 68;
    this.height = 6;
    this.rate = 0;
    this.totalRate = 0;
    this.color = "#e3e8e8";             //string color
    this.backgroundColor = "#e3e8e1";
    this.update = function(){
        draw();
    };
}