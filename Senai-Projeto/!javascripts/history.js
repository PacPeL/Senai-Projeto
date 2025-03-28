
import { 
    db, 
    collection, 
    query, 
    where, 
    orderBy, 
    onSnapshot, 
    getDocs 
  } from './firebase.js';
  
  export class HistoryManager {
    constructor() {
      this.historyList = document.getElementById('historyList');
      this.filterMachine = document.getElementById('filterMachine');
      this.filterStatus = document.getElementById('filterStatus');
      
      this.setupEventListeners();
      this.loadMachinesForFilter();
      this.loadHistory();
    }
  
    setupEventListeners() {
      this.filterMachine.addEventListener('change', () => this.loadHistory());
      this.filterStatus.addEventListener('change', () => this.loadHistory());
    }
  
    async loadMachinesForFilter() {
      try {
        const machinesSnapshot = await getDocs(collection(db, "machines"));
        this.filterMachine.innerHTML = '<option value="all">Todas as Máquinas</option>';
        machinesSnapshot.forEach(doc => {
          const option = document.createElement('option');
          option.value = doc.id;
          option.textContent = doc.data().name;
          this.filterMachine.appendChild(option);
        });
      } catch (error) {
        console.error("Error cargando máquinas:", error);
      }
    }
  
    async loadHistory() {
      try {
        const q = query(
          collection(db, "history"),
          orderBy("timestamp", "desc")
        );
        
        onSnapshot(q, (snapshot) => {
          this.historyList.innerHTML = '';
          snapshot.forEach(doc => {
            const data = doc.data();
            this.renderHistoryItem({
              ...data,
              timestamp: data.timestamp?.toDate()
            });
          });
        });
      } catch (error) {
        console.error("Error cargando histórico:", error);
      }
    }
  
    renderHistoryItem(entry) {
      const item = document.createElement('div');
      item.className = 'history-entry';
      item.innerHTML = `
        <div class="entry-header">
          <span class="machine-name">${entry.machineName}</span>
          <span class="entry-date">${entry.timestamp.toLocaleString('pt-BR')}</span>
        </div>
        <div class="status-change">
          <span class="status-old">${this.translateStatus(entry.oldStatus)}</span>
          <i class="bi bi-arrow-right"></i>
          <span class="status-new">${this.translateStatus(entry.newStatus)}</span>
        </div>
      `;
      this.historyList.appendChild(item);
    }
  
    translateStatus(status) {
      const statusMap = {
        operational: '🟢 Operacional',
        maintenance: '🟡 Manutenção',
        waiting: '🔴 Espera'
      };
      return statusMap[status] || status;
    }
  }
  
  // Inicialización
  document.addEventListener('DOMContentLoaded', () => {
    new HistoryManager();
  });