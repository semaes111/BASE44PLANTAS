/**
 * Main Application Entry Point
 */

import { base44Client } from '@base44plantas/api-client';
import { entities } from '@base44plantas/api-client/entities';
import { $, $$, toggleVisibility, render } from '@base44plantas/utils/dom';
import { formatDate, formatNumber, getQRCodeUrl } from '@base44plantas/utils/format';

// Application State
let currentUser = null;
let plantas = [];
let filteredPlantas = [];

// Initialize App
async function init() {
    try {
        // Check authentication
        if (!base44Client.isAuthenticated()) {
            // In production, redirect to login
            showToast('Por favor, inicia sesión', 'error');
            return;
        }

        // Fetch current user
        currentUser = await fetchUser();
        updateUserUI();

        // Load plants
        await loadPlantas();

        // Setup event listeners
        setupEventListeners();

        showToast('Bienvenido a Base44 Plantas', 'success');
    } catch (error) {
        console.error('Initialization error:', error);
        showToast('Error al cargar la aplicación', 'error');
    }
}

// Fetch User
async function fetchUser() {
    try {
        // Mock user for now - replace with actual API call
        // const user = await base44Client.get('/auth/me');
        return {
            name: 'Usuario Demo',
            email: 'demo@base44.com',
            role: 'admin'
        };
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
}

// Update User UI
function updateUserUI() {
    const userNameEl = $('#user-name');
    const logoutBtn = $('#logout-btn');
    const newPlantBtn = $('#new-plant-btn');
    const emptyCTA = $('#empty-cta');

    if (currentUser) {
        userNameEl.textContent = currentUser.name;
        logoutBtn.classList.remove('hidden');

        if (currentUser.role === 'admin') {
            newPlantBtn?.classList.remove('hidden');
            emptyCTA?.classList.remove('hidden');
        }
    }
}

// Load Plants
async function loadPlantas() {
    const loadingState = $('#loading-state');
    const emptyState = $('#empty-state');
    const plantsGrid = $('#plants-grid');

    try {
        // Show loading
        toggleVisibility(loadingState, true);
        toggleVisibility(emptyState, false);
        toggleVisibility(plantsGrid, false);

        // Fetch plants - replace with actual API call
        // plantas = await entities.getAll('PlantaFormulario');

        // Mock data for demo
        plantas = await loadMockPlantas();
        filteredPlantas = [...plantas];

        // Hide loading
        toggleVisibility(loadingState, false);

        if (plantas.length === 0) {
            toggleVisibility(emptyState, true);
        } else {
            toggleVisibility(plantsGrid, true);
            renderPlantas();
            renderStats();
        }
    } catch (error) {
        console.error('Error loading plantas:', error);
        showToast('Error al cargar las plantas', 'error');
        toggleVisibility(loadingState, false);
        toggleVisibility(emptyState, true);
    }
}

// Mock data generator
async function loadMockPlantas() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return [
        {
            id: '1',
            nombre_cientifico: 'Rosa chinensis',
            nombre_comun: 'Rosa de China',
            proveedor: 'Vivero Central',
            ubicacion: 'Invernadero A',
            formato: 'Maceta 20cm',
            color_contenedor: 'Terracota',
            estado: 'disponible',
            precio: 15.99,
            stock_inicial: 50,
            stock_actual: 42,
            fecha_recepcion: '2024-01-15',
            notas: 'Requiere riego moderado'
        },
        {
            id: '2',
            nombre_cientifico: 'Lavandula angustifolia',
            nombre_comun: 'Lavanda',
            proveedor: 'Jardines del Sur',
            ubicacion: 'Sector B',
            formato: 'Maceta 15cm',
            color_contenedor: 'Gris',
            estado: 'disponible',
            precio: 8.50,
            stock_inicial: 100,
            stock_actual: 87,
            fecha_recepcion: '2024-02-01',
            notas: 'Planta aromática'
        },
        {
            id: '3',
            nombre_cientifico: 'Monstera deliciosa',
            nombre_comun: 'Costilla de Adán',
            proveedor: 'Plantas Tropicales',
            ubicacion: 'Invernadero C',
            formato: 'Maceta 25cm',
            color_contenedor: 'Negro',
            estado: 'nuevo',
            precio: 25.00,
            stock_inicial: 30,
            stock_actual: 28,
            fecha_recepcion: '2024-03-10',
            notas: 'Requiere humedad alta'
        }
    ];
}

// Render Stats
function renderStats() {
    const statsContainer = $('#stats-container');
    if (!statsContainer) return;

    const totalPlantas = plantas.length;
    const totalStock = plantas.reduce((sum, p) => sum + (p.stock_actual || 0), 0);
    const valorTotal = plantas.reduce((sum, p) => sum + ((p.precio || 0) * (p.stock_actual || 0)), 0);
    const proveedores = new Set(plantas.map(p => p.proveedor)).size;

    const stats = [
        {
            label: 'Total Plantas',
            value: totalPlantas,
            icon: '🌱'
        },
        {
            label: 'Stock Total',
            value: totalStock,
            icon: '📦'
        },
        {
            label: 'Valor Inventario',
            value: `€${formatNumber(valorTotal, 2)}`,
            icon: '💰'
        },
        {
            label: 'Proveedores',
            value: proveedores,
            icon: '🏪'
        }
    ];

    statsContainer.innerHTML = stats.map(stat => `
        <div class="stats-card bg-white rounded-xl shadow-md p-6 border border-green-100">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm text-gray-600 mb-1">${stat.label}</p>
                    <p class="text-2xl font-bold text-gray-900">${stat.value}</p>
                </div>
                <div class="text-4xl">${stat.icon}</div>
            </div>
        </div>
    `).join('');
}

// Render Plants
function renderPlantas() {
    const plantsGrid = $('#plants-grid');
    if (!plantsGrid) return;

    if (filteredPlantas.length === 0) {
        toggleVisibility(plantsGrid, false);
        toggleVisibility($('#empty-state'), true);
        $('#empty-title').textContent = 'No se encontraron plantas';
        $('#empty-description').textContent = 'Intenta con otro término de búsqueda';
        return;
    }

    toggleVisibility(plantsGrid, true);
    toggleVisibility($('#empty-state'), false);

    plantsGrid.innerHTML = filteredPlantas.map(planta => createPlantCard(planta)).join('');

    // Add click listeners to cards
    $$('.plant-card').forEach(card => {
        card.addEventListener('click', () => {
            const plantId = card.dataset.id;
            window.location.href = `./pages/detalle-planta.html?id=${plantId}`;
        });
    });
}

// Create Plant Card HTML
function createPlantCard(planta) {
    const stockPercentage = planta.stock_inicial > 0
        ? (planta.stock_actual / planta.stock_inicial * 100).toFixed(0)
        : 0;

    const stockColor = stockPercentage > 50 ? 'green' : stockPercentage > 20 ? 'yellow' : 'red';

    return `
        <div class="plant-card bg-white rounded-2xl shadow-lg p-6 border border-green-100 cursor-pointer" data-id="${planta.id}">
            <div class="flex items-start justify-between mb-4">
                <div class="flex-1">
                    <h3 class="text-xl font-bold text-gray-900 mb-1">${planta.nombre_cientifico || 'Sin nombre'}</h3>
                    <p class="text-sm text-gray-600">${planta.nombre_comun || 'Sin nombre común'}</p>
                </div>
                <span class="px-3 py-1 rounded-full text-xs font-medium ${
                    planta.estado === 'disponible' ? 'bg-green-100 text-green-800' :
                    planta.estado === 'nuevo' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                }">
                    ${planta.estado || 'Sin estado'}
                </span>
            </div>

            <div class="space-y-2 mb-4">
                <div class="flex items-center text-sm text-gray-600">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    ${planta.ubicacion || 'Sin ubicación'}
                </div>
                <div class="flex items-center text-sm text-gray-600">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                    </svg>
                    ${planta.proveedor || 'Sin proveedor'}
                </div>
            </div>

            <div class="flex items-center justify-between pt-4 border-t border-gray-100">
                <div>
                    <p class="text-2xl font-bold text-green-600">€${formatNumber(planta.precio || 0, 2)}</p>
                </div>
                <div class="text-right">
                    <p class="text-sm text-gray-600">Stock</p>
                    <p class="text-lg font-semibold text-gray-900">${planta.stock_actual || 0}/${planta.stock_inicial || 0}</p>
                    <div class="w-24 h-2 bg-gray-200 rounded-full mt-1">
                        <div class="h-2 bg-${stockColor}-500 rounded-full" style="width: ${stockPercentage}%"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Search Function
function handleSearch(searchTerm) {
    const term = searchTerm.toLowerCase().trim();

    if (!term) {
        filteredPlantas = [...plantas];
    } else {
        filteredPlantas = plantas.filter(planta => {
            return (
                planta.nombre_cientifico?.toLowerCase().includes(term) ||
                planta.nombre_comun?.toLowerCase().includes(term) ||
                planta.proveedor?.toLowerCase().includes(term) ||
                planta.ubicacion?.toLowerCase().includes(term)
            );
        });
    }

    renderPlantas();
}

// Export to CSV
function exportToCSV() {
    if (plantas.length === 0) {
        showToast('No hay datos para exportar', 'info');
        return;
    }

    const headers = [
        'Nombre Científico',
        'Nombre Común',
        'Proveedor',
        'Ubicación',
        'Formato',
        'Color',
        'Estado',
        'Precio',
        'Stock Inicial',
        'Stock Actual',
        'Fecha Recepción',
        'Notas'
    ];

    const rows = plantas.map(p => [
        p.nombre_cientifico || '',
        p.nombre_comun || '',
        p.proveedor || '',
        p.ubicacion || '',
        p.formato || '',
        p.color_contenedor || '',
        p.estado || '',
        p.precio || '',
        p.stock_inicial || '',
        p.stock_actual || '',
        p.fecha_recepcion || '',
        p.notas || ''
    ]);

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `plantas_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Archivo exportado correctamente', 'success');
}

// Setup Event Listeners
function setupEventListeners() {
    // Search
    const searchInput = $('#search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            handleSearch(e.target.value);
        });
    }

    // Export
    const exportBtn = $('#export-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportToCSV);
    }

    // Logout
    const logoutBtn = $('#logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            base44Client.setAccessToken(null);
            window.location.reload();
        });
    }
}

// Show Toast Notification
function showToast(message, type = 'info') {
    const container = $('#toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';

    toast.innerHTML = `
        <span class="text-2xl">${icon}</span>
        <span class="text-sm font-medium text-gray-900">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Export for debugging
window.app = {
    plantas,
    currentUser,
    loadPlantas,
    showToast
};
