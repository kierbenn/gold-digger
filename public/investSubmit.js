
const liveContainer = document.getElementById("gold-price")
const submitForm = document.getElementById('invest-submit')
const amountInvest = document.getElementById('amount-invest')
let formData = {}

submitForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    formData = {
        id: 1,
        price: liveContainer.textContent,
        amount: amountInvest.value
    }
    
    try {
        const response = await fetch('/', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData),
        })
        const data = await response.json()
        document.querySelector('#modal p').textContent = `
        You bought ${(data.amount/data.price).toFixed(4)} 
        ounces (ozt) for $${data.amount} AUD. The sale executed 
        and we're preparing your documentation.`
        toggle()
        //amountInvest.
        console.log(data)
    } catch (err) {
        console.error(err)
    }
})

function toggle() {
    document.getElementById('modal-container').classList.toggle('hidden')
}

document.getElementById('modal-container').addEventListener('click', toggle)
document.getElementById('modal').addEventListener('click', (e) => e.stopPropagation())

// email check
const emailCheck = document.getElementById('email-check')
emailCheck.addEventListener('change', () => {
    document.getElementById('email-container').classList.toggle('hidden')
})

document.getElementById('summary-submit').addEventListener('submit', async (e) => {
    e.preventDefault()
    //console.log('summary submit')
    const email = document.getElementById('email').value
    // if no email value or email check is off, don't send an email
    if (email && emailCheck) {
        // email & price
        formData.email = email
        //console.log(formData)
        const response = await fetch('/email',{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData),
        })
        const data = await response.json()
        console.log('email sent: ', data)
    }
    toggle()
})