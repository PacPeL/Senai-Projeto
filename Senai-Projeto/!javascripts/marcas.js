// Base de datos temporal de marcas
const marcasDatabase = {
    'tornos': [
        { 
            nombre: 'Haas', 
            imagen: 'Img/marcas/haas.jpg',
            modelos: ['ST-20', 'ST-30', 'DS-30SSY'],
            descripcion: 'Fabricante líder en tornos CNC de alta precisión'
        },
        {
            nombre: 'Romi',
            imagen: 'Img/marcas/romi.jpg',
            modelos: ['GL 220M', 'C 420', 'Discovery 560'],
            descripcion: 'Tornos convencionales y CNC brasileños de alta calidad'
        }
    ],
    'fresadoras': [
        {
            nombre: 'DMG Mori',
            imagen: 'Img/marcas/dmg-mori.jpg',
            modelos: ['DMC 1035 V', 'NHX 4000', 'CMX 50 U'],
            descripcion: 'Tecnología alemana-japonesa en fresado de precisión'
        },
        {
            nombre: 'Hurco',
            imagen: 'Img/marcas/hurco.jpg',
            modelos: ['VMX30', 'VMX42', 'TMX8'],
            descripcion: 'Control intuitivo y máxima productividad'
        }
    ],
    'cortadoras-laser': [
        {
            nombre: 'Trumpf',
            imagen: 'Img/marcas/trumpf.jpg',
            modelos: ['TruLaser 3030', 'TruLaser 5030', 'TruLaser 7040'],
            descripcion: 'Tecnología láser líder en el mercado'
        }
    ]
};

// Obtener parámetros de la URL
const urlParams = new URLSearchParams(window.location.search);
const tipoMaquina = urlParams.get('tipo');

document.addEventListener('DOMContentLoaded', () => {
    // Configurar título de la página
    const titulo = document.getElementById('titulo-marcas');
    titulo.textContent = `Marcas de ${capitalizeFirstLetter(tipoMaquina.replace('-', ' '))}`;
    
    // Cargar marcas correspondientes
    cargarMarcas();
    
    // Configurar menú móvil
    document.getElementById('menuToggle').addEventListener('click', () => {
        const nav = document.querySelector('.menu-desktop');
        nav.style.display = nav.style.display === 'block' ? 'none' : 'block';
    });
});

function cargarMarcas() {
    const contenedor = document.getElementById('marcasContainer');
    const marcas = marcasDatabase[tipoMaquina] || [];
    
    if(marcas.length === 0) {
        contenedor.innerHTML = `
            <div class="no-results">
                <i class="bi bi-exclamation-triangle"></i>
                <p>No se encontraron marcas para este tipo de máquina</p>
            </div>
        `;
        return;
    }

    contenedor.innerHTML = marcas.map(marca => `
        <div class="marca-card" 
             onclick="window.location.href='detalle.html?marca=${encodeURIComponent(marca.nombre)}&tipo=${tipoMaquina}'">
            <div class="marca-imagen">
                <img src="${marca.imagen}" alt="${marca.nombre}">
            </div>
            <div class="marca-info">
                <h3>${marca.nombre}</h3>
                <p>${marca.descripcion}</p>
                <div class="modelos">
                    <span>Modelos disponibles:</span>
                    <span>${marca.modelos.slice(0, 2).join(', ')} ${marca.modelos.length > 2 ? '...' : ''}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}