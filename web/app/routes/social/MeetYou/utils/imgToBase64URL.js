/**
 * Convert an image 
 * to a base64 url
 * @param  {String}   url         
 * @param  {Function} callback    
 * @param  {String}   [outputFormat=image/png]           
 */
export default function convertImgToBase64URL(url, callback, outputFormat){
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function(){
        var canvas = document.createElement('CANVAS'),
        ctx = canvas.getContext('2d'), dataURL;
        canvas.height = img.height; //.naturalHeight
        canvas.width = img.width;  //.naturalWidth
        ctx.drawImage(img, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
        console.log(dataURL);
        callback(dataURL);
        canvas = null; 
    };

    img.onerror = function(err) {
        console.log('image error')
    };

    img.src = url;
}