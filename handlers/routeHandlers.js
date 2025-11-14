
export async function handleGoldPrice(req, res) {
    console.log('request gold')
    // keep live stream of gold mock prices
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    // set price initially then use setInterval
    res.write(`data: ${JSON.stringify({
        event: "price-update",
        price: 6123
    })}\n\n`);
    // return a price between 6,000 - 6,500
    setInterval(() => {
        let randomPrice = Math.floor(Math.random() * 500) + 6000

        res.write(`data: ${JSON.stringify({
            event: "price-update",
            price: randomPrice,
        })}\n\n`)

    }, 3000)

}