// Función para cargar histórico
function loadHistory() {
    const historyList = document.getElementById('historyList');
    const machineFilter = document.getElementById('filterMachine').value;
    const statusFilter = document.getElementById('filterStatus').value;

    let query = historyCollection.orderBy('timestamp', 'desc').limit(50);

    if(machineFilter !== 'all') query = query.where('machineId', '==', machineFilter);
    if(statusFilter !== 'all') query = query.where('newStatus', '==', statusFilter);

    query.get().then((querySnapshot) => {
        historyList.innerHTML = '';
        
        if(querySnapshot.empty) {
            historyList.innerHTML = '<p class="no-history">Nenhum registro encontrado</p>';
            return;
        }

        querySnapshot.forEach((doc) => {
            const history = doc.data();
            const item = document.createElement('div');
            item.className = 'history-item';
            
            const date = history.timestamp.toDate();
            const formattedDate = date.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            item.innerHTML = `
                <div class="history-date">${formattedDate}</div>
                <div class="history-info">
                    <strong>${history.machineName}</strong><br>
                    Alteração realizada por ${history.changedBy}
                    ${history.notes ? `<br>Notas: ${history.notes}` : ''}
                </div>
                <div class="history-status">
                    <span class="status-change ${getStatusClass(history.oldStatus)}">${translateStatus(history.oldStatus)}</span>
                    <i class="bi bi-arrow-right"></i>
                    <span class="status-change ${getStatusClass(history.newStatus)}">${translateStatus(history.newStatus)}</span>
                </div>
            `;

            historyList.appendChild(item);
        });
    }).catch((error) => {
        console.error("Erro ao carregar histórico: ", error);
    });
}

// Función auxiliar para traducción de status
function translateStatus(status) {
    const statusMap = {
        operational: 'Operacional',
        maintenance: 'Manutenção',
        waiting: 'Espera'
    };
    return statusMap[status] || status;
}

// Función auxiliar para clases de status
function getStatusClass(status) {
    return `status-${status}`;
}

// Cargar máquinas para filtro
function loadMachineFilter() {
    machinesCollection.get().then((querySnapshot) => {
        const machineFilter = document.getElementById('filterMachine');
        
        querySnapshot.forEach((doc) => {
            const option = document.createElement('option');
            option.value = doc.id;
            option.textContent = doc.data().name;
            machineFilter.appendChild(option);
        });
    });
}

// Event listeners para filtros
document.getElementById('filterMachine').addEventListener('change', loadHistory);
document.getElementById('filterStatus').addEventListener('change', loadHistory);

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    loadMachineFilter();
    loadHistory();
});

// Agrega esto en app.js para actualización automática
historyCollection.orderBy('timestamp', 'desc')
    .limit(50)
    .onSnapshot((snapshot) => {
        loadHistory();
    });

    import { db, collection, addDoc } from './firebase.js';

    // Función para registrar cambios en el histórico
    export async function logHistoryChange(machineId, machineName, oldStatus, newStatus, notes = '') {
        try {
            await addDoc(collection(db, "history"), {
                machineId,
                machineName,
                oldStatus,
                newStatus,
                notes,
                changedBy: "Usuário Atual", // Reemplazar con sistema de autenticación
                timestamp: new Date()
            });
        } catch (error) {
            console.error("Erro ao registrar histórico:", error);
        }
    }
    
    // Ejemplo de uso al cambiar estado de máquina
    async function updateMachineStatus(machineId, newStatus) {
        const machineRef = doc(db, "machines", machineId);
        const docSnap = await getDoc(machineRef);
        
        if (docSnap.exists()) {
            const oldStatus = docSnap.data().status;
            await updateDoc(machineRef, { status: newStatus });
            await logHistoryChange(machineId, docSnap.data().name, oldStatus, newStatus);
        }
    }