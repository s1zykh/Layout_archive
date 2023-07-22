document.addEventListener('DOMContentLoaded', () => {
    const inputName = document.querySelector('#name');
    const inputValue = document.querySelector('#value');
    const operationForm = document.querySelector('.operation');
    const changeItems = document.querySelectorAll('.operation__change-item')
    const historyList = document.querySelector('.history__list');
    const totalMoneyIncome = document.querySelector('.counter__lower-income');
    const totalMoneyExpenses = document.querySelector('.counter__lower-expenses');
    const totalBalance = document.querySelector('.counter__upper-balance');
    let dbOperation = JSON.parse(localStorage.getItem("calc")) || [];
    let type = 'income';

    const init = () => {
        historyList.textContent = "";
        dbOperation.forEach(item => {
            dataColletcion(item);
        })
        updateBalance();
        localStorage.setItem("calc", JSON.stringify(dbOperation));
    };

    changeItems.forEach(item => {
        item.addEventListener('click', () => {
            type = item.dataset.type;
            if (type === 'income') {
                item.classList.add('active-green');
                item.classList.remove('active-red');
              } else if (type === 'expenses') {
                item.classList.add('active-red');
                item.classList.remove('active-green');
              }
          
              // Удаление классов active-green и active-red у остальных кнопок
              changeItems.forEach(otherItem => {
                if (otherItem !== item) {
                  otherItem.classList.remove('active-green', 'active-red');
                }
              });
        });
    });      

    const dataColletcion = (operation) => {
        let className = "";
        const listItem = document.createElement("li");
        if (operation.type === 'income') {
          className = "history__item";
          listItem.classList.add(className, "item-green");
        } else {
          className = "history__item";
          listItem.classList.add(className, "item-red");
        }

        listItem.innerHTML = ` 
        <div class="history__item-inner">
            <div class="history__wrapper">
                <div class="history__item-name">${operation.name}</div>
                <div class="history__item-value">${operation.value} $</div>
            </div>
            <span data-id="${operation.id}" class="history__delete material-symbols-outlined">close</span>
          

           
        </div>
        `;
        historyList.append(listItem);
    }

    const updateBalance = () => {
        let resultIncome = 0;
        let resultExpenses = 0;

        dbOperation.forEach(item => {
            if(item.type === 'income') {
                resultIncome += item.value
            } else if(item.type === 'expenses') {
                resultExpenses -= item.value
            }
        })

        totalMoneyIncome.textContent = resultIncome + "$";
        totalMoneyExpenses.textContent = resultExpenses + "$";
        totalBalance.textContent = resultIncome + resultExpenses + "$";
    };

     
    operationForm.addEventListener("submit", (event) => {
            const id = uuidv4();
            event.preventDefault();
            const name = inputName.value.trim();
            const value = inputValue.value;
            const regName = /\S/g;
            const regValue = /\d/g;

            if(!regName.test(name) || !regValue.test(value)) {
                inputName.value = '';
                inputName.classList.add('red')
                inputValue.value = '';
                inputValue.classList.add('red')
            } else {
                inputName.classList.remove('red')
                inputValue.classList.remove('red')
                const operation = {
                    id,
                    name,
                    value: parseInt(value),
                    type 
                };
                dbOperation.push(operation);
                init();
            }
    
            inputName.value = "";
            inputValue.value = "";
        });
        historyList.addEventListener('click', (e) => {
            console.log(e.target)
            if (e.target && e.target.classList.contains("history__delete")) {
                dbOperation = dbOperation.filter(
                    (operation) => operation.id !== e.target.dataset.id
                );
                init();
            }
        })
        init();
});


