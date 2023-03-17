var redirect = document.getElementById("redirectlink")
var gen = document.getElementById("GEN")
var output = document.getElementById("out")

function generate() {
    //<meta http-equiv="refresh" content="0; url='/Error404.html'" />
    window.location.replace("http://localhost:5050/m?" + redirect.value); //https://qwer.loca.lt/m?
}