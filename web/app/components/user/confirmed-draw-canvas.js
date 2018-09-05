/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//On selectionne la class .uploadFiles ((Button de selection de fichier pour un commentaire))
// $(function () {
// $(".uploadProfile").on('change', function () {
//     //Get count of selected files
//     var countFiles = $(this)[0].files.length;
//
//     //On selectionne le parent; puis lon trouve le child dont le Id selctor est #commentFormImageHolder
//     //var parent = $(this).parents('.formComment').find('#commentFormImageHolder');
//     // le path de l'image
//     var imgPath = $(this)[0].value;
//     console.log(imgPath);
//     var extn = imgPath.substring(imgPath.lastIndexOf('.') + 1).toLowerCase();
//     //Affectation de la variable parent à l'image_holder
//     var imageCanvas = $('.imageProfileCanvas');
//     console.log(imageCanvas);
//     imageCanvas.empty();
//
//     if (extn == "gif" || extn == "png" || extn == "jpg" || extn == "jpeg") {
//         if (typeof (FileReader) != "undefined") {
//
//             //loop for each file selected for uploaded.
//             for (var i = 0; i < countFiles; i++) {
//
//                 var reader = new FileReader();
//                 reader.onload = function (e) {
//                     $("<img />", {
//                         "src": e.target.result,
//                             "class": "thumb-imageCanvas"
//                     }).appendTo(imageCanvas);
//                 }
//
//                 imageCanvas.show();
//                 reader.readAsDataURL($(this)[0].files[i]);
//             }
//
//         } else {
//             console.log("This browser does not support FileReader.");
//         }
//     } else {
//         console.log("Pls select only images");
//     }
// });
// });
