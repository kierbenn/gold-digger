
import http from 'node:http'
import path from 'node:path'
import fs from 'node:fs/promises'
import { getContentType } from './utils/getContentType.js'
import { handleGoldPrice } from './handlers/routeHandlers.js'
import nodemailer from 'nodemailer'

const PORT = 8000
const __dirname = import.meta.dirname

const server = http.createServer( async (req, res) => {
    
    if (req.method === "POST") {
        let body = ''

        for await (const chunk of req) {
            body += chunk
        }

        const data = JSON.parse(body)
        
        if (req.url === '/email') {
            
            //console.log("send email", data)
            // nodemailer setup with gmail App password
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'kierancliffbennett@gmail.com',
                    pass: 'pxpw tknq zcoi sznl'
                }
            })
            
            let mailOptions = {
                from: 'kierancliffbennett@gmail.com',
                to: data.email,
                subject: '*TEST* GoldDigger *TEST*',
                text: `Your purchase is complete! You've bought ${(data.amount/data.price).toFixed(4)} ozt of gold for $${data.amount} AUD.`
            };

            try {
                const info = await transporter.sendMail(mailOptions)
                data.sent = info.response
            } catch (error) {
                data.error = error
            }
            // send back res
            res.statusCode = 201
            res.setHeader('Content-Type', 'application/json')
            console.log('what is data ', data)
            return res.end(JSON.stringify(data))

        } else {
            const historyFile = path.join(__dirname, 'data', 'sale-history.csv')
            const now = new Date().toLocaleString('en-AU').replace(',', '')
            const csvFormat = `${now}, ${data.amount}, ${data.price}, ${(data.amount/data.price).toFixed(4)}`
            fs.appendFile(historyFile, `\n${csvFormat}`, 'utf8')
            res.statusCode = 201
            res.setHeader('Content-Type', 'application/json')
            return res.end(body)
        }
        
    }

    
    if (req.method === 'GET' && req.url === "/api/gold") {

        console.log('api/gold')
        return await handleGoldPrice(req, res)

    } else {
        // path to index file
        const publicDir = path.join(__dirname, 'public')
          const filePath = path.join(
            publicDir,
            req.url === '/' ? 'index.html' : req.url
          )
        // return correct content type
        const ext = path.extname(filePath)
        const contentType = getContentType(ext)
        console.log(filePath, ext)
        res.statusCode = 200
        res.setHeader('Content-Type', contentType)
        try {
            const indexPage = await fs.readFile(filePath)
            res.end(indexPage)
        } catch (err) {
            if (err.code === 'ENOENT') { 
                console.log("error no entry", req.url)
            }
        }
        
    }

})

server.listen(PORT, () => {
    console.log(`server connected on port: ${PORT}`)
})