let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let events = JSON.parse(localStorage.getItem('events')) || [];

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function aggiornaMeseAnno() {
    const mesi = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
    document.getElementById('meseAnno').innerText = mesi[currentMonth] + ' ' + currentYear;
}

function changeMonth(delta) {
    currentMonth += delta;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear += 1;
    } else if (currentMonth < 0) {
        currentMonth = 11;
        currentYear -= 1;
    }
    mostraCalendario();
    aggiornaMeseAnno();
}

function mostraCalendario() {
    const container = document.getElementById('calendar');
    container.innerHTML = '';

    const giorniSettimana = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
    giorniSettimana.forEach(g => {
        const headerDiv = document.createElement('div');
        headerDiv.className = 'header';
        headerDiv.innerText = g;
        container.appendChild(headerDiv);
    });

    const primoGiorno = new Date(currentYear, currentMonth, 1);
    let giornoSettimana = primoGiorno.getDay(); 
    if (giornoSettimana === 0) {
        giornoSettimana = 6;
    } else {
        giornoSettimana -= 1;
    }

    const giorniNelMese = new Date(currentYear, currentMonth + 1, 0).getDate();

    for (let i = 0; i < giornoSettimana; i++) {
        const vuoto = document.createElement('div');
        container.appendChild(vuoto);
    }

    for (let day = 1; day <= giorniNelMese; day++) {
        const giornoDiv = document.createElement('div');
        giornoDiv.className = 'day';
        giornoDiv.innerText = day;

        giornoDiv.onclick = () => {
            const dataSelezionata = new Date(currentYear, currentMonth, day);
            mostraEventi(dataSelezionata);
        };

        const dataISO = new Date(currentYear, currentMonth, day).toISOString();
        if (events.some(e => e.date === dataISO)) {
            giornoDiv.style.backgroundColor = '#5e35b1';
        }

        container.appendChild(giornoDiv);
    }
}

function mostraEventi(selectedDate) {
    const isoDate = selectedDate.toISOString();
    const attivitàDelGiorno = tasks.filter(t => t.date === isoDate);

    const lista = document.getElementById('taskList');
    lista.innerHTML = '';

    attivitàDelGiorno.forEach((task, index) => {
        const actualIndex = tasks.indexOf(task);
        const li = document.createElement('li');
        const spanClasse = task.completed ? 'completed' : '';

        li.innerHTML = `
            <span class="${spanClasse}">${task.text} (Data: ${new Date(task.date).toLocaleDateString()})</span>
            <div class="task-buttons">
                <button class="complete-btn" data-index="${actualIndex}" onclick="toggleCompleteFromButton(this)"> ${task.completed ? 'Incompleta' : 'Completa'} </button>
                <button class="delete-btn" data-index="${actualIndex}" onclick="eliminaTaskFromButton(this)">Elimina</button>
            </div>
        `;
        lista.appendChild(li);
    });
}


function toggleCompleteFromButton(btn) {
    const index = parseInt(btn.dataset.index, 10);
    toggleComplete(index);
}


function eliminaTaskFromButton(btn) {
    const index = parseInt(btn.dataset.index, 10);
    eliminaTask(index);
}


function aggiungiTask() {
    const input = document.getElementById('taskInput');
    const testo = input.value.trim();
    if (testo !== '') {
        const dataInput = prompt("Inserisci la data (gg/mm/aaaa):", "");
        let data = null;
        if (dataInput) {
            const parts = dataInput.split('/');
            if (parts.length === 3) {
                const day = parseInt(parts[0], 10);
                const month = parseInt(parts[1], 10) - 1;
                const year = parseInt(parts[2], 10);
                data = new Date(year, month, day);
            }
        }
        tasks.push({text: testo, completed: false, date: data ? data.toISOString() : null});
        document.getElementById('taskInput').value = '';
        mostraTasks();
        mostraCalendario();
        aggiornaMeseAnno();
    }
}

function eliminaTask(index) {
    tasks.splice(index, 1);
    mostraTasks();
    mostraCalendario();
}

function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    mostraTasks();
}


function mostraTasks() {
    const lista = document.getElementById('taskList');
    lista.innerHTML = '';

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        const spanClasse = task.completed ? 'completed' : '';

        li.innerHTML = `
            <span class="${spanClasse}">${task.text} (Data: ${task.date ? new Date(task.date).toLocaleDateString() : 'Nessuna data'})</span>
            <div class="task-buttons">
                <button class="complete-btn" data-index="${index}" onclick="toggleComplete(${index})">${task.completed ? 'Incompleta' : 'Completa'}</button>
                <button class="delete-btn" data-index="${index}" onclick="eliminaTask(${index})">Elimina</button>
            </div>
        `;
        lista.appendChild(li);
    });
}

mostraCalendario();
aggiornaMeseAnno();