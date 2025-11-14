
const eventSource = new EventSource("/api/gold") 

const liveContainer = document.getElementById("gold-price")

// Handle live price updates 
eventSource.onmessage = (event) => {
    //console.log(event.data)
    const data = JSON.parse(event.data)
    const price = data.price
    liveContainer.textContent = price
}

// Handle connection loss
eventSource.onerror = () => {
  console.log("Connection lost. Attempting to reconnect...")
}
