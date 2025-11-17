/**
 * Crear Planta Page Script
 */

import { base44Client } from '@base44plantas/api-client';
import { entities } from '@base44plantas/api-client/entities';
import { $, toggleVisibility } from '@base44plantas/utils/dom';

// Initialize page
async function init() {
    // Check authentication and permissions
    const user = await checkAuth();

    if (!user || user.role !== 'admin') {
        window.location.href = '../index.html';
        return;
    }

    // Set default date
    const fechaInput = $('input[name="fecha_recepcion"]');
    if (fechaInput) {
        fechaInput.value = new Date().toISOString().split('T')[0];
    }

    // Setup form handler
    const form = $('#plant-form');
    if (form) {
        form.addEventListener('submit', handleSubmit);
    }

    // Sync stock fields
    const stockInicialInput = $('input[name="stock_inicial"]');
    const stockActualInput = $('input[name="stock_actual"]');

    if (stockInicialInput && stockActualInput) {
        stockInicialInput.addEventListener('input', (e) => {
            if (stockActualInput.value === '0' || !stockActualInput.value) {
                stockActualInput.value = e.target.value;
            }
        });
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

// Handle form submission
async function handleSubmit(e) {
    e.preventDefault();

    const submitBtn = $('#submit-btn');
    const errorAlert = $('#error-alert');
    const errorMessage = $('#error-message');

    try {
        // Disable submit button
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <svg class="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Guardando...
        `;

        // Hide error
        toggleVisibility(errorAlert, false);

        // Get form data
        const formData = new FormData(e.target);
        const plantData = {};

        for (let [key, value] of formData.entries()) {
            if (key === 'precio' || key === 'stock_inicial' || key === 'stock_actual') {
                plantData[key] = parseFloat(value) || 0;
            } else {
                plantData[key] = value;
            }
        }

        // Create plant - Mock implementation
        const createdPlant = await createPlant(plantData);

        // Redirect to detail page
        window.location.href = `./detalle-planta.html?id=${createdPlant.id}`;

    } catch (error) {
        console.error('Error creating plant:', error);

        // Show error
        errorMessage.textContent = error.message || 'Error al crear la planta. Por favor, intenta de nuevo.';
        toggleVisibility(errorAlert, true);

        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
            </svg>
            Guardar Planta
        `;

        // Scroll to error
        errorAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Create plant (mock implementation)
async function createPlant(plantData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In production, this would be:
    // const plant = await entities.create('PlantaFormulario', plantData);

    // Generate mock plant ID
    const plantId = `plant_${Date.now()}`;

    // Generate QR code URL
    const baseUrl = window.location.origin;
    const plantUrl = `${baseUrl}/apps/plant-manager/pages/detalle-planta.html?id=${plantId}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(plantUrl)}`;

    // Mock created plant
    const createdPlant = {
        ...plantData,
        id: plantId,
        codigo_qr: qrCodeUrl,
        created_date: new Date().toISOString()
    };

    // Store in localStorage for demo purposes
    const plantas = JSON.parse(localStorage.getItem('plantas') || '[]');
    plantas.push(createdPlant);
    localStorage.setItem('plantas', JSON.stringify(plantas));

    return createdPlant;
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
