/**
 * Detalle Planta Page Script
 */

import { base44Client } from '@base44plantas/api-client';
import { entities } from '@base44plantas/api-client/entities';
import { $, toggleVisibility } from '@base44plantas/utils/dom';
import { formatDate, formatNumber } from '@base44plantas/utils/format';

let currentPlant = null;
let currentUser = null;

// Initialize page
async function init() {
    try {
        // Get plant ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const plantId = urlParams.get('id');

        if (!plantId) {
            showError();
            return;
        }

        // Check auth
        currentUser = await checkAuth();

        // Load plant
        await loadPlant(plantId);

        // Setup event listeners
        setupEventListeners();

    } catch (error) {
        console.error('Initialization error:', error);
        showError();
    }
}

// Check authentication
async function checkAuth() {
    try {
        if (!base44Client.isAuthenticated()) {
            return null;
        }

        // Mock user - replace with actual API call
        return {
            name: 'Usuario Demo',
            email: 'demo@base44.com',
            role: 'admin'
        };
    } catch (error) {
        console.error('Auth error:', error);
        return null;
    }
}

// Load plant data
async function loadPlant(plantId) {
    const loadingState = $('#loading-state');
    const errorState = $('#error-state');
    const plantDetail = $('#plant-detail');

    try {
        toggleVisibility(loadingState, true);
        toggleVisibility(errorState, false);
        toggleVisibility(plantDetail, false);

        // Fetch plant - in production:
        // currentPlant = await entities.getById('PlantaFormulario', plantId);

        // Mock data for demo
        currentPlant = await loadMockPlant(plantId);

        if (!currentPlant) {
            throw new Error('Plant not found');
        }

        // Render plant details
        renderPlantDetails();

        toggleVisibility(loadingState, false);
        toggleVisibility(plantDetail, true);

    } catch (error) {
        console.error('Error loading plant:', error);
        showError();
    }
}

// Load mock plant (for demo)
async function loadMockPlant(plantId) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check localStorage first
    const plantas = JSON.parse(localStorage.getItem('plantas') || '[]');
    const stored = plantas.find(p => p.id === plantId);

    if (stored) {
        return stored;
    }

    // Return mock data
    const mockPlants = {
        '1': {
            id: '1',
            nombre_cientifico: 'Rosa chinensis',
            nombre_comun: 'Rosa de China',
            familia: 'Rosaceae',
            proveedor: 'Vivero Central',
            ubicacion: 'Invernadero A',
            formato: 'Maceta 20cm',
            color_contenedor: 'Terracota',
            estado: 'disponible',
            precio: 15.99,
            stock_inicial: 50,
            stock_actual: 42,
            fecha_recepcion: '2024-01-15',
            notas: 'Requiere riego moderado y luz solar directa.',
            codigo_qr: 'https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=https://example.com/plant/1'
        },
        '2': {
            id: '2',
            nombre_cientifico: 'Lavandula angustifolia',
            nombre_comun: 'Lavanda',
            familia: 'Lamiaceae',
            proveedor: 'Jardines del Sur',
            ubicacion: 'Sector B',
            formato: 'Maceta 15cm',
            color_contenedor: 'Gris',
            estado: 'disponible',
            precio: 8.50,
            stock_inicial: 100,
            stock_actual: 87,
            fecha_recepcion: '2024-02-01',
            notas: 'Planta aromática ideal para jardines mediterráneos.',
            codigo_qr: 'https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=https://example.com/plant/2'
        }
    };

    return mockPlants[plantId] || null;
}

// Render plant details
function renderPlantDetails() {
    if (!currentPlant) return;

    // Title and subtitle
    $('#plant-title').textContent = currentPlant.nombre_cientifico || 'Sin nombre';
    $('#plant-subtitle').textContent = currentPlant.nombre_comun || 'Sin nombre común';

    // Info grid
    const infoGrid = $('#plant-info-grid');
    const infoItems = [
        { label: 'Familia', value: currentPlant.familia || 'No especificada' },
        { label: 'Proveedor', value: currentPlant.proveedor || 'No especificado' },
        { label: 'Ubicación', value: currentPlant.ubicacion || 'No especificada' },
        { label: 'Formato', value: currentPlant.formato || 'No especificado' },
        { label: 'Color Contenedor', value: currentPlant.color_contenedor || 'No especificado' },
        { label: 'Fecha Recepción', value: currentPlant.fecha_recepcion ? formatDate(currentPlant.fecha_recepcion) : 'No especificada' },
    ];

    infoGrid.innerHTML = infoItems.map(item => `
        <div>
            <p class="text-sm text-gray-600 mb-1">${item.label}</p>
            <p class="text-base font-semibold text-gray-900">${item.value}</p>
        </div>
    `).join('');

    // Price and stock
    $('#plant-price').textContent = `€${formatNumber(currentPlant.precio || 0, 2)}`;
    $('#plant-stock-inicial').textContent = currentPlant.stock_inicial || 0;
    $('#plant-stock-actual').textContent = currentPlant.stock_actual || 0;

    // Stock percentage
    const stockPercentage = currentPlant.stock_inicial > 0
        ? (currentPlant.stock_actual / currentPlant.stock_inicial * 100)
        : 0;

    $('#stock-percentage').textContent = `${stockPercentage.toFixed(0)}%`;
    $('#stock-bar').style.width = `${stockPercentage}%`;

    // Update bar color based on percentage
    const stockBar = $('#stock-bar');
    if (stockPercentage > 50) {
        stockBar.className = 'h-4 bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500';
    } else if (stockPercentage > 20) {
        stockBar.className = 'h-4 bg-gradient-to-r from-yellow-400 to-yellow-600 transition-all duration-500';
    } else {
        stockBar.className = 'h-4 bg-gradient-to-r from-red-400 to-red-600 transition-all duration-500';
    }

    // Notes
    if (currentPlant.notas && currentPlant.notas.trim()) {
        toggleVisibility($('#notes-card'), true);
        $('#plant-notes').textContent = currentPlant.notas;
    }

    // Status badge
    const statusBadge = $('#plant-status');
    const statusMap = {
        'nuevo': { text: 'Nuevo', class: 'bg-blue-100 text-blue-800' },
        'disponible': { text: 'Disponible', class: 'bg-green-100 text-green-800' },
        'vendido': { text: 'Vendido', class: 'bg-gray-100 text-gray-800' },
        'descartado': { text: 'Descartado', class: 'bg-red-100 text-red-800' }
    };

    const status = statusMap[currentPlant.estado] || statusMap['nuevo'];
    statusBadge.textContent = status.text;
    statusBadge.className = `inline-block px-4 py-2 rounded-full text-sm font-medium ${status.class}`;

    // QR Code
    if (currentPlant.codigo_qr) {
        $('#qr-image').src = currentPlant.codigo_qr;
    }

    // Show admin buttons
    if (currentUser && currentUser.role === 'admin') {
        toggleVisibility($('#edit-btn'), true);
        toggleVisibility($('#delete-btn'), true);
    }
}

// Setup event listeners
function setupEventListeners() {
    // Download QR
    $('#download-qr-btn')?.addEventListener('click', downloadQR);

    // Print QR
    $('#print-qr-btn')?.addEventListener('click', printQR);

    // Copy URL
    $('#copy-url-btn')?.addEventListener('click', copyURL);

    // Edit button
    $('#edit-btn')?.addEventListener('click', () => {
        showToast('Función de edición próximamente', 'info');
    });

    // Delete button
    $('#delete-btn')?.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que quieres eliminar esta planta?')) {
            deletePlant();
        }
    });
}

// Download QR code
function downloadQR() {
    if (!currentPlant || !currentPlant.codigo_qr) return;

    const link = document.createElement('a');
    link.href = currentPlant.codigo_qr;
    link.download = `qr_${currentPlant.nombre_cientifico || 'planta'}_${currentPlant.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('QR descargado correctamente', 'success');
}

// Print QR code
function printQR() {
    if (!currentPlant || !currentPlant.codigo_qr) return;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>QR - ${currentPlant.nombre_cientifico}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    text-align: center;
                    padding: 20px;
                }
                img {
                    max-width: 400px;
                    margin: 20px auto;
                }
                h1 {
                    font-size: 24px;
                    margin-bottom: 10px;
                }
                p {
                    font-size: 18px;
                    color: #666;
                }
            </style>
        </head>
        <body>
            <h1>${currentPlant.nombre_cientifico}</h1>
            <p>${currentPlant.nombre_comun || ''}</p>
            <img src="${currentPlant.codigo_qr}" alt="QR Code" />
            <p>ID: ${currentPlant.id}</p>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// Copy URL
function copyURL() {
    const url = window.location.href;

    navigator.clipboard.writeText(url).then(() => {
        showToast('URL copiada al portapapeles', 'success');
    }).catch(err => {
        console.error('Error copying URL:', err);
        showToast('Error al copiar URL', 'error');
    });
}

// Delete plant
async function deletePlant() {
    try {
        // In production:
        // await entities.delete('PlantaFormulario', currentPlant.id);

        // Remove from localStorage (demo)
        const plantas = JSON.parse(localStorage.getItem('plantas') || '[]');
        const filtered = plantas.filter(p => p.id !== currentPlant.id);
        localStorage.setItem('plantas', JSON.stringify(filtered));

        showToast('Planta eliminada correctamente', 'success');

        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1000);

    } catch (error) {
        console.error('Error deleting plant:', error);
        showToast('Error al eliminar la planta', 'error');
    }
}

// Show error state
function showError() {
    toggleVisibility($('#loading-state'), false);
    toggleVisibility($('#error-state'), true);
    toggleVisibility($('#plant-detail'), false);
}

// Show toast notification
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
