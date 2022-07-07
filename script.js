const transactionsUl = document.querySelector("#transactions")
const incomeDisplay = document.querySelector("#money-plus")
const expenseDisplay = document.querySelector("#money-minus")
const balanceDisplay = document.querySelector("#balance")
const form = document.querySelector("#form")
const inputTransactionName = document.querySelector("#text")
const inputTransactionAmount = document.querySelector("#amount")


const localStorageTransactions = JSON.parse(localStorage
    .getItem("transactions"))
let transactions = localStorage
    .getItem("transactions") !== null ? localStorageTransactions : [] 


const removeTransaction = ID => {
    transactions = transactions.filter(transaction => 
        transaction.id !== ID)
    updateLocalStorage()
    init()
}

const addTransictionIntoDOM = transaction => {
    const operator = transaction.amount < 0 ? "-" : "+"
    const CSSClass = transaction.amount < 0 ? "minus" : "plus"
    const amountWithoutOperator = Math.abs(transaction.amount)
    const li = document.createElement("li")

    li.classList.add(CSSClass)
    li.innerHTML = `
        ${transaction.name} 
        <span>${operator} R$ ${amountWithoutOperator}</span>
        <button class="delete-btn" onClick="removeTransaction(${transaction.id})">
            x
        </button>
    `
    transactionsUl.append(li)  
}

const getExpenses = transactionAmount => Math.abs(transactionAmount
    .filter(value => value <0)
    .reduce((accumulator, value) => accumulator + value, 0))
    .toFixed(2)

const getIncome = transactionAmount => transactionAmount
    .filter(value => value > 0)
    .reduce((accumulator, value) => accumulator + value, 0)
    .toFixed(2)

const getTotal = transactionAmount => transactionAmount
    .reduce((accumulator, transaction) => accumulator + transaction, 0)
    .toFixed(2)

const updateBalanceValues = () => {
    const transactionAmount = transactions.map(transaction => transaction.amount)
    const total = getTotal(transactionAmount)
    const income = getIncome(transactionAmount)
    const expense = getExpenses(transactionAmount)

    balanceDisplay.textContent = `R$ ${total}`
    incomeDisplay.textContent = `R$ ${income}`
    expenseDisplay.textContent = `R$ ${expense}`
}

const init = () => {//init é a função que vai executar o preenhimento das informações do estado da aplicação quando a pagina for carregada, adicionando as trasações no DOM
    transactionsUl.innerHTML = ""
    transactions.forEach(addTransictionIntoDOM)
    updateBalanceValues()
}

init()

const updateLocalStorage = () => {
    localStorage.setItem("transactions", JSON.stringify(transactions))
}

const genarateID = () => Math.round(Math.random() * 1000)

const addToTransactionsArray = (transactionName, transactionAmount) => {
    transactions.push({
        id: genarateID(), 
        name: transactionName, 
        amount: Number(transactionAmount)//converter a string pra number
    })    
}

const cleanInputs = () => {
    inputTransactionName.value = ""
    inputTransactionAmount.value = ""
}

const handleFormSubmit = event => {
    event.preventDefault()

    const transactionName = inputTransactionName.value.trim()
    const transactionAmount = inputTransactionAmount.value.trim()
    const isSomeInpotEmpty = transactionName === '' || transactionAmount === ''

    if(isSomeInpotEmpty){
        alert("Por favor preencha tanto o nome quanto o valor da transação")
        return//so o bloco do if for executado o return para a execução do codigo abaixo
    }
    

    addToTransactionsArray(transactionName, transactionAmount)
    init()
    updateLocalStorage()
    cleanInputs()
    
}

form.addEventListener("submit", handleFormSubmit)
