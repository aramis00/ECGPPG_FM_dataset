// Data storage
let modelsData = [];
let datasets12leadData = [];
let datasetsReducedData = [];
let modelsTable, datasets12leadTable, datasetsReducedTable;

// Dataset name normalization for matching
function normalizeDatasetName(name) {
    if (!name) return '';
    return name.toLowerCase()
        .replace(/[-_\s]+/g, '')
        .replace(/[^a-z0-9]/g, '');
}

// Find which models use a specific dataset
function findModelsUsingDataset(datasetName) {
    const normalized = normalizeDatasetName(datasetName);
    const matches = [];

    modelsData.forEach(model => {
        const pretrainData = (model['Pretrain Dataset'] || '').toLowerCase();
        // Check for various name patterns
        if (pretrainData.includes(normalized) ||
            pretrainData.includes(datasetName.toLowerCase()) ||
            normalizeDatasetName(pretrainData).includes(normalized)) {
            matches.push(model.model);
        }
    });

    return matches;
}

// Get model type badge
function getModelTypeBadge(model) {
    const lead = String(model.ECGlead || '').trim();
    const modality = String(model['Pretrain modality'] || '').toLowerCase().trim();

    if (modality.includes('ppg')) {
        return '<span class="badge badge-ppg">PPG</span>';
    } else if (lead === '1') {
        return '<span class="badge badge-1lead">Single-Lead</span>';
    } else {
        return '<span class="badge badge-12lead">12-Lead</span>';
    }
}

// Get model type for filtering
function getModelType(model) {
    const lead = String(model.ECGlead || '').trim();
    const modality = String(model['Pretrain modality'] || '').toLowerCase().trim();

    if (modality.includes('ppg')) {
        return 'ppg';
    } else if (lead === '1') {
        return '1lead';
    } else {
        return '12lead';
    }
}

// Create clickable dataset links
function createDatasetLinks(pretrainData) {
    if (!pretrainData) return '-';

    // Split by common separators
    const datasets = pretrainData.split(/[,;]+/).map(d => d.trim()).filter(d => d);

    return datasets.map(dataset => {
        const cleanName = dataset.replace(/\*$/, '').trim();
        return `<span class="dataset-link" onclick="showDatasetModal('${cleanName}')">${cleanName}</span>`;
    }).join(' ');
}

// Get access badge
function getAccessBadge(access) {
    if (!access) return '-';
    const accessStr = String(access).trim();

    if (accessStr.startsWith('O')) {
        return `<span class="badge badge-open">${accessStr}</span>`;
    } else if (accessStr.startsWith('R')) {
        return `<span class="badge badge-restricted">${accessStr}</span>`;
    } else if (accessStr.startsWith('C')) {
        return `<span class="badge badge-credentialed">${accessStr}</span>`;
    }
    return accessStr;
}

// Create model links
function createModelLinks(model) {
    let links = '';

    if (model.doi) {
        links += `<a href="${model.doi}" target="_blank" class="link-btn">Paper</a>`;
    }
    if (model.Codelink) {
        links += `<a href="${model.Codelink}" target="_blank" class="link-btn secondary">Code</a>`;
    }
    if (model.Weightlink && !model.Weightlink.includes('PKUDigitalHealth/ECGFounder')) {
        links += `<a href="${model.Weightlink}" target="_blank" class="link-btn secondary">Weights</a>`;
    }

    return links || '-';
}

// Populate models table
function populateModelsTable() {
    const tbody = document.getElementById('models-tbody');
    tbody.innerHTML = '';

    modelsData.forEach(model => {
        const row = document.createElement('tr');
        row.setAttribute('data-type', getModelType(model));

        row.innerHTML = `
            <td><span class="clickable" onclick="showModelModal('${model.model}')">${model.model}</span></td>
            <td>${model.Year || '-'}</td>
            <td>${getModelTypeBadge(model)}</td>
            <td>${model.Backbone || '-'}</td>
            <td>${model['Pretrain Method'] || '-'}</td>
            <td>${createDatasetLinks(model['Pretrain Dataset'])}</td>
            <td>${model['ECGs (n)'] || '-'}</td>
            <td>${createModelLinks(model)}</td>
        `;
        tbody.appendChild(row);
    });

    // Initialize DataTable
    if (modelsTable) {
        modelsTable.destroy();
    }
    modelsTable = $('#models-table').DataTable({
        pageLength: 25,
        order: [[1, 'desc']],
        language: {
            search: "Search models:"
        }
    });
}

// Populate 12-lead datasets table
function populate12LeadDatasetsTable() {
    const tbody = document.getElementById('datasets-12lead-tbody');
    tbody.innerHTML = '';

    datasets12leadData.forEach(dataset => {
        const usedBy = findModelsUsingDataset(dataset.Dataset);
        const usedByHtml = usedBy.length > 0
            ? usedBy.map(m => `<span class="model-tag">${m}</span>`).join(' ')
            : '<span style="color:#999">-</span>';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><span class="clickable" onclick="showDatasetModal('${dataset.Dataset}')">${dataset.Dataset}</span></td>
            <td>${dataset.Record || '-'}</td>
            <td>${dataset['Patient (n)'] || '-'}</td>
            <td>${dataset.Country || '-'}</td>
            <td>${(dataset['Setting '] || '').substring(0, 30)}${(dataset['Setting '] || '').length > 30 ? '...' : ''}</td>
            <td>${getAccessBadge(dataset.Access)}</td>
            <td>${usedByHtml}</td>
            <td>${dataset.dataset_link ? `<a href="${dataset.dataset_link}" target="_blank" class="link-btn">Access</a>` : '-'}</td>
        `;
        tbody.appendChild(row);
    });

    if (datasets12leadTable) {
        datasets12leadTable.destroy();
    }
    datasets12leadTable = $('#datasets-12lead-table').DataTable({
        pageLength: 25,
        order: [[0, 'asc']],
        language: {
            search: "Search datasets:"
        }
    });
}

// Populate reduced-lead datasets table
function populateReducedDatasetsTable() {
    const tbody = document.getElementById('datasets-reduced-tbody');
    tbody.innerHTML = '';

    datasetsReducedData.forEach(dataset => {
        const usedBy = findModelsUsingDataset(dataset.Dataset);
        const usedByHtml = usedBy.length > 0
            ? usedBy.map(m => `<span class="model-tag">${m}</span>`).join(' ')
            : '<span style="color:#999">-</span>';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><span class="clickable" onclick="showDatasetModal('${dataset.Dataset}')">${dataset.Dataset}</span></td>
            <td>${(dataset['Record (n)'] || '-').toString().substring(0, 25)}</td>
            <td>${dataset.PPG === 1 ? '<span class="check-yes">✓</span>' : '<span class="check-no">-</span>'}</td>
            <td>${dataset.ECG === 1 ? '<span class="check-yes">✓</span>' : '<span class="check-no">-</span>'}</td>
            <td>${dataset.Country || '-'}</td>
            <td>${getAccessBadge(dataset.Access)}</td>
            <td>${usedByHtml}</td>
            <td>${dataset.data_link ? `<a href="${dataset.data_link}" target="_blank" class="link-btn">Access</a>` : '-'}</td>
        `;
        tbody.appendChild(row);
    });

    if (datasetsReducedTable) {
        datasetsReducedTable.destroy();
    }
    datasetsReducedTable = $('#datasets-reduced-table').DataTable({
        pageLength: 25,
        order: [[0, 'asc']],
        language: {
            search: "Search datasets:"
        }
    });
}

// Populate comparison checkboxes
function populateCompareCheckboxes() {
    const container = document.getElementById('model-checkboxes');
    container.innerHTML = '';

    modelsData.forEach(model => {
        const div = document.createElement('label');
        div.className = 'checkbox-item';
        div.innerHTML = `
            <input type="checkbox" value="${model.model}" onchange="updateCompareButton()">
            <span>${model.model}</span>
            ${getModelTypeBadge(model)}
        `;
        container.appendChild(div);
    });
}

// Update compare button state
function updateCompareButton() {
    const checked = document.querySelectorAll('#model-checkboxes input:checked');
    const btn = document.getElementById('compare-btn');
    btn.disabled = checked.length < 2 || checked.length > 4;
    btn.textContent = `Compare Selected (${checked.length})`;
}

// Compare models
function compareModels() {
    const checked = document.querySelectorAll('#model-checkboxes input:checked');
    const selectedModels = Array.from(checked).map(cb => cb.value);

    const models = modelsData.filter(m => selectedModels.includes(m.model));

    const thead = document.getElementById('comparison-thead');
    const tbody = document.getElementById('comparison-tbody');

    // Create header
    thead.innerHTML = `
        <tr>
            <th>Property</th>
            ${models.map(m => `<th>${m.model}</th>`).join('')}
        </tr>
    `;

    // Properties to compare
    const properties = [
        { key: 'Year', label: 'Year' },
        { key: 'Backbone', label: 'Backbone' },
        { key: 'Pretrain modality', label: 'Modality' },
        { key: 'Pretrain Method', label: 'Method' },
        { key: 'Pretrain Dataset', label: 'Pretrain Data' },
        { key: 'ECGs (n)', label: 'Data Size' },
        { key: 'ECGlead', label: 'ECG Leads' },
        { key: 'sampling_rate', label: 'Sample Rate' },
        { key: 'task', label: 'Tasks' },
        { key: 'performance', label: 'Performance' }
    ];

    tbody.innerHTML = properties.map(prop => `
        <tr>
            <td>${prop.label}</td>
            ${models.map(m => `<td>${m[prop.key] || '-'}</td>`).join('')}
        </tr>
    `).join('');

    // Add links row
    tbody.innerHTML += `
        <tr>
            <td>Links</td>
            ${models.map(m => `<td>${createModelLinks(m)}</td>`).join('')}
        </tr>
    `;

    document.getElementById('comparison-table-container').style.display = 'block';
}

// Show dataset modal
function showDatasetModal(datasetName) {
    // Search in both dataset arrays
    let dataset = datasets12leadData.find(d =>
        normalizeDatasetName(d.Dataset).includes(normalizeDatasetName(datasetName)) ||
        normalizeDatasetName(datasetName).includes(normalizeDatasetName(d.Dataset))
    );

    if (!dataset) {
        dataset = datasetsReducedData.find(d =>
            normalizeDatasetName(d.Dataset).includes(normalizeDatasetName(datasetName)) ||
            normalizeDatasetName(datasetName).includes(normalizeDatasetName(d.Dataset))
        );
    }

    const modal = document.getElementById('dataset-modal');
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');

    title.textContent = datasetName;

    if (dataset) {
        const usedBy = findModelsUsingDataset(datasetName);

        body.innerHTML = `
            <div class="modal-info">
                <label>Records</label>
                <span>${dataset.Record || dataset['Record (n)'] || '-'}</span>
            </div>
            <div class="modal-info">
                <label>Patients</label>
                <span>${dataset['Patient (n)'] || '-'}</span>
            </div>
            <div class="modal-info">
                <label>Country</label>
                <span>${dataset.Country || '-'}</span>
            </div>
            <div class="modal-info">
                <label>Setting</label>
                <span>${dataset['Setting '] || dataset.Setting || '-'}</span>
            </div>
            <div class="modal-info">
                <label>Access</label>
                ${getAccessBadge(dataset.Access)}
            </div>
            ${dataset.PPG !== undefined ? `
            <div class="modal-info">
                <label>Signals</label>
                <span>
                    ${dataset.PPG === 1 ? '<span class="badge badge-ppg">PPG</span>' : ''}
                    ${dataset.ECG === 1 ? '<span class="badge badge-12lead">ECG</span>' : ''}
                </span>
            </div>
            ` : ''}
            <div class="modal-info">
                <label>Used by Models</label>
                <div class="used-by-list">
                    ${usedBy.length > 0 ? usedBy.map(m => `<span class="model-tag">${m}</span>`).join('') : '<span style="color:#999">Not used by any indexed model</span>'}
                </div>
            </div>
            <div class="modal-info">
                <label>Access Link</label>
                ${dataset.dataset_link || dataset.data_link
                    ? `<a href="${dataset.dataset_link || dataset.data_link}" target="_blank" class="link-btn">Access Dataset</a>`
                    : '<span>-</span>'}
            </div>
        `;
    } else {
        const usedBy = findModelsUsingDataset(datasetName);
        body.innerHTML = `
            <p>This dataset is referenced in model pretraining but may not be in our indexed dataset list.</p>
            <div class="modal-info">
                <label>Used by Models</label>
                <div class="used-by-list">
                    ${usedBy.length > 0 ? usedBy.map(m => `<span class="model-tag">${m}</span>`).join('') : '-'}
                </div>
            </div>
        `;
    }

    modal.style.display = 'block';
}

// Show model modal
function showModelModal(modelName) {
    const model = modelsData.find(m => m.model === modelName);
    if (!model) return;

    const modal = document.getElementById('model-modal');
    const title = document.getElementById('model-modal-title');
    const body = document.getElementById('model-modal-body');

    title.textContent = model.model;

    body.innerHTML = `
        <div class="modal-info">
            <label>Paper Title</label>
            <p>${model.title || '-'}</p>
        </div>
        <div class="modal-info">
            <label>Year</label>
            <span>${model.Year || '-'}</span>
        </div>
        <div class="modal-info">
            <label>Type</label>
            ${getModelTypeBadge(model)}
        </div>
        <div class="modal-info">
            <label>Backbone</label>
            <span>${model.Backbone || '-'}</span>
        </div>
        <div class="modal-info">
            <label>Pretraining Method</label>
            <span>${model['Pretrain Method'] || '-'}</span>
        </div>
        <div class="modal-info">
            <label>Pretraining Data</label>
            <div style="margin-top:5px">${createDatasetLinks(model['Pretrain Dataset'])}</div>
        </div>
        <div class="modal-info">
            <label>Data Size</label>
            <span>${model['ECGs (n)'] || '-'}</span>
        </div>
        <div class="modal-info">
            <label>ECG Leads</label>
            <span>${model.ECGlead || '-'}</span>
        </div>
        <div class="modal-info">
            <label>Sample Rate</label>
            <span>${model.sampling_rate ? model.sampling_rate + ' Hz' : '-'}</span>
        </div>
        <div class="modal-info">
            <label>Tasks</label>
            <p>${model.task || '-'}</p>
        </div>
        <div class="modal-info">
            <label>Performance</label>
            <p>${model.performance || '-'}</p>
        </div>
        <div class="modal-info">
            <label>Links</label>
            <div style="margin-top:5px">
                ${model.doi ? `<a href="${model.doi}" target="_blank" class="link-btn">Paper</a>` : ''}
                ${model.Codelink ? `<a href="${model.Codelink}" target="_blank" class="link-btn secondary">Code</a>` : ''}
                ${model.Weightlink ? `<a href="${model.Weightlink}" target="_blank" class="link-btn secondary">Weights</a>` : ''}
            </div>
        </div>
    `;

    modal.style.display = 'block';
}

// Tab navigation
function setupTabs() {
    document.querySelectorAll('.nav-tabs li').forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab
            document.querySelectorAll('.nav-tabs li').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Show corresponding content
            const tabId = tab.getAttribute('data-tab');
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Filter buttons
function setupFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            // Filter table rows
            if (modelsTable) {
                if (filter === 'all') {
                    modelsTable.search('').columns().search('').draw();
                } else {
                    // Custom filtering
                    $.fn.dataTable.ext.search.pop(); // Remove previous filter
                    $.fn.dataTable.ext.search.push((settings, data, dataIndex) => {
                        if (settings.nTable.id !== 'models-table') return true;
                        const row = modelsTable.row(dataIndex).node();
                        return row.getAttribute('data-type') === filter;
                    });
                    modelsTable.draw();
                    $.fn.dataTable.ext.search.pop(); // Clean up
                }
            }
        });
    });
}

// Modal close handlers
function setupModals() {
    document.querySelectorAll('.modal .close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            closeBtn.closest('.modal').style.display = 'none';
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}

// Compare button handler
function setupCompare() {
    document.getElementById('compare-btn').addEventListener('click', compareModels);
}

// Load data and initialize
async function init() {
    try {
        // Load from local docs folder (JSON files are copied here)
        const basePath = '';

        // Load all data
        const [modelsRes, datasets12Res, datasetsRedRes] = await Promise.all([
            fetch(basePath + 'models.json'),
            fetch(basePath + 'ecg_datasets_12lead.json'),
            fetch(basePath + 'ecg_ppg_datasets_reduced.json')
        ]);

        modelsData = await modelsRes.json();
        datasets12leadData = await datasets12Res.json();
        datasetsReducedData = await datasetsRedRes.json();

        // Populate tables
        populateModelsTable();
        populate12LeadDatasetsTable();
        populateReducedDatasetsTable();
        populateCompareCheckboxes();

        // Setup interactions
        setupTabs();
        setupFilters();
        setupModals();
        setupCompare();

        console.log('Data loaded successfully:', {
            models: modelsData.length,
            datasets12lead: datasets12leadData.length,
            datasetsReduced: datasetsReducedData.length
        });

    } catch (error) {
        console.error('Error loading data:', error);
        document.querySelector('main').innerHTML = `
            <div style="text-align:center;padding:50px;">
                <h2>Error Loading Data</h2>
                <p>Please make sure the JSON data files are available.</p>
                <p style="color:#999">${error.message}</p>
            </div>
        `;
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', init);
