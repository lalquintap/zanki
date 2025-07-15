
    const form = document.getElementById('wordForm');
    const entriesDiv = document.getElementById('entries');
    const wordInput = document.getElementById('word');
    const meaningInput = document.getElementById('meaning');
    const sourceInput = document.getElementById('source');
    const exampleInput = document.getElementById('example');
    const formMessage = document.getElementById('formMessage');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalContent = document.getElementById('modalContent');
    
    let editIndex = null;
    let deleteIndex = null;

    const formatDate = (dateStr) => {
      const d = new Date(dateStr);
      return d.toLocaleDateString('es-CL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    const loadEntries = () => {
      const entries = getEntries();
      entriesDiv.innerHTML = '';
      entries.forEach((entry, index) => {
        entriesDiv.appendChild(createCard(entry, index));
      });
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      formMessage.textContent = '';
      const word = wordInput.value.trim();
      const meaning = meaningInput.value.trim();
      const source = sourceInput.value.trim();
      const example = exampleInput.value.trim();
      if (!word || !meaning) return;

      const entries = getEntries();
      const existsIndex = entries.findIndex(e => e.word.toLowerCase() === word.toLowerCase());

      if (editIndex === null && existsIndex !== -1) {
        formMessage.textContent = 'Esta palabra ya está guardada. Puedes editarla si deseas actualizarla.';
        return;
      }

      const newEntry = {
        word,
        meaning,
        source,
        example,
        date: new Date().toISOString()
      };

      if (editIndex !== null) {
        entries[editIndex] = newEntry;
        editIndex = null;
        cancelEditBtn.style.display = 'none';
      } else {
        entries.unshift(newEntry);
      }

      localStorage.setItem('dictionaryEntries', JSON.stringify(entries));
      form.reset();
      loadEntries();
    });

    function getEntries(){
      return JSON.parse(localStorage.getItem('dictionaryEntries')) || [];
    }
    
    function createCard(entry, index){
      const div = document.createElement('div');
        div.className = 'card';
        div.style.animationDelay = `${index * 40}ms`;
        div.innerHTML = `
          <h3>${entry.word}</h3>
          <small>${entry.source ? '📘 ' + entry.source : ''} · ${formatDate(entry.date)}</small>
          <div class="card-buttons">
            <button onclick="editEntry(${index})">Editar</button>
            <button onclick="confirmDelete(${index})">Eliminar</button>
            <button onclick="viewDetails(${index})">Ver</button>
          </div>
        `;

        div.addEventListener('click', (e) => {
          if(!e.target.closest('button')){
            viewDetails(index);
          }
        });
        return div;
    }

    function editEntry(index) {
      const entries = getEntries();
      const entry = entries[index];
      wordInput.value = entry.word;
      meaningInput.value = entry.meaning;
      sourceInput.value = entry.source || '';
      exampleInput.value = entry.example || '';
      editIndex = index;
      cancelEditBtn.style.display = 'inline-block';
    }

    cancelEditBtn.addEventListener('click', () => {
      editIndex = null;
      form.reset();
      cancelEditBtn.style.display = 'none';
      formMessage.textContent = '';
    });

    function confirmDelete(index) {
      deleteIndex = index;
      modalContent.innerHTML = `
        <h2>¿Eliminar palabra?</h2>
        <p>Esta acción no se puede deshacer.</p>
        <div class="modal-buttons">
          <button class="btn-cancel" onclick="closeModal()">Cancelar</button>
          <button class="btn-confirm" onclick="deleteEntry()">Eliminar</button>
        </div>
      `;
      modalOverlay.classList.add('show');
    }

    function deleteEntry() {
      if (deleteIndex !== null) {
        const entries = getEntries();
        entries.splice(deleteIndex, 1);
        localStorage.setItem('dictionaryEntries', JSON.stringify(entries));
        loadEntries();
        closeModal();
      }
    }

    function viewDetails(index) {
      const entries = getEntries();
      const entry = entries[index];
      modalContent.innerHTML = `
        <h2>${entry.word}</h2>
        <p><strong>Significado:</strong> ${entry.meaning}</p>
        ${entry.source ? `<p><strong>Fuente:</strong> ${entry.source}</p>` : ''}
        ${entry.example ? `<p><strong>Ejemplo:</strong> ${entry.example}</p>` : ''}
        <p><strong>Agregada:</strong> ${formatDate(entry.date)}</p>
        <div class="modal-buttons">
          <button class="btn-cancel" onclick="closeModal()">Cerrar</button>
        </div>
      `;
      modalOverlay.classList.add('show');
    }

    function closeModal() {
      deleteIndex = null;
      modalOverlay.classList.remove('show');
    }

    window.onload = loadEntries;

