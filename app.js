const form = document.getElementById('wordForm');
const entriesDiv = document.getElementById('entries');
const wordInput = document.getElementById('word');
const meaningInput = document.getElementById('meaning');
const sourceInput = document.getElementById('source');
const exampleInput = document.getElementById('example');

let editIndex = null;

const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-CL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const loadEntries = () => {
    const entries = JSON.parse(localStorage.getItem('dictionaryEntries')) || [];
    entriesDiv.innerHTML = '';
    entries.forEach((entry, index) => {
        const div = document.createElement('div');
        div.className = 'entry';
        div.innerHTML = `
            <div class="entry-buttons">
                <button onclick="editEntry(${index})">Editar</button>
                <button onclick="deleteEntry(${index})">Eliminar</button>
            </div>      
            <h3>${entry.word}</h3>
            <small>Agregada el ${formatDate(entry.date)}</small>
            <p><strong>Significado:</strong> ${entry.meaning}</p>
            ${entry.source ? `<p><strong>Fuente:</strong> ${entry.source}</p>` : ''}
            ${entry.example ? `<p><strong>Ejemplo:</strong> ${entry.example}</p>` : ''}
        `;
        entriesDiv.appendChild(div);
    });
};

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const word = wordInput.value.trim();
    const meaning = meaningInput.value.trim();
    const source = sourceInput.value.trim();
    const example = exampleInput.value.trim();
    if (word && meaning) { 
        const entries = JSON.parse(localStorage.getItem('dictionaryEntries')) || [];
        const newEntry = {
            word,
            meaning,
            source,
            example,
            date: new Date().toISOString()
        };
        if (editIndex !== null){
            entries[editIndex] = {...newEntry };
            editIndex = null;
        } else {
            entries.unshift(newEntry);
        }
        localStorage.setItem('dictionaryEntries', JSON.stringify(entries));
        form.reset();
        loadEntries();
    }
});

function editEntry(index) {
    const entries = JSON.parse(localStorage.getItem('dictionaryEntries')) || [];
    const entry = entries[index];
    wordInput.value = entry.word;
    meaningInput.value = entry.meaning;
    sourceInput.value = entry.source || '';
    exampleInput.value = entry.example || '';
    editIndex = index;
}

function deleteEntry(index){
    const entries = JSON.parse(localStorage.getItem('dictionaryEntries')) || [];
    entries.splice(index, 1);
    localStorage.setItem('dictionaryEntries', JSON.stringify(entries));
    loadEntries();
}

window.onload = loadEntries;



    
