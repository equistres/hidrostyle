  // Global variables
        let filteredProducts = [];
        let currentFilters = {
            search: '',
            category: '',
            size: '',
            motor: '',
            jets: ''
        };

        // Initialize the page
        document.addEventListener('DOMContentLoaded', function() {
            // Check if data is loaded
            if (typeof hidromasajesData === 'undefined') {
                console.error('hidromasajesData no está definido. Asegúrate de que hidromasajes-data.js esté cargado.');
                document.getElementById('resultsInfo').textContent = 'Error: No se pudieron cargar los productos.';
                return;
            }
            
            filteredProducts = [...hidromasajesData];
            initializeFilters();
            renderProducts();
            setupEventListeners();
        });

        // Initialize filter options
        function initializeFilters() {
            const categories = [...new Set(hidromasajesData.map(p => p.category))];
            const sizes = [...new Set(hidromasajesData.map(p => `${p.length}×${p.width}`))];
            const motors = [...new Set(hidromasajesData.map(p => p.motor))];
            const jets = [...new Set(hidromasajesData.map(p => p.jets))];

            populateSelect('categoryFilter', categories.map(c => ({
                value: c,
                text: c.charAt(0).toUpperCase() + c.slice(1)
            })));

            populateSelect('sizeFilter', sizes.sort().map(s => ({
                value: s,
                text: s + ' cm'
            })));

            populateSelect('motorFilter', motors.sort().map(m => ({
                value: m,
                text: m
            })));

            populateSelect('jetsFilter', jets.sort((a, b) => a - b).map(j => ({
                value: j,
                text: j + ' jets'
            })));
        }

        // Populate select elements
        function populateSelect(selectId, options) {
            const select = document.getElementById(selectId);
            options.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option.value;
                optionElement.textContent = option.text;
                select.appendChild(optionElement);
            });
        }

        // Setup event listeners
        function setupEventListeners() {
            document.getElementById('searchBox').addEventListener('input', handleSearch);
            document.getElementById('categoryFilter').addEventListener('change', handleFilter);
            document.getElementById('sizeFilter').addEventListener('change', handleFilter);
            document.getElementById('motorFilter').addEventListener('change', handleFilter);
            document.getElementById('jetsFilter').addEventListener('change', handleFilter);
            document.getElementById('clearFilters').addEventListener('click', clearAllFilters);
        }

        // Handle search
        function handleSearch(e) {
            currentFilters.search = e.target.value.toLowerCase();
            applyFilters();
        }

        // Handle filters
        function handleFilter(e) {
            const filterId = e.target.id;
            const filterKey = filterId.replace('Filter', '');
            
            if (filterKey === 'size') {
                currentFilters.size = e.target.value;
            } else {
                currentFilters[filterKey] = e.target.value;
            }
            
            applyFilters();
        }

        // Apply all filters
        function applyFilters() {
            filteredProducts = hidromasajesData.filter(product => {
                // Search filter
                if (currentFilters.search && !product.name.toLowerCase().includes(currentFilters.search)) {
                    return false;
                }

                // Category filter
                if (currentFilters.category && product.category !== currentFilters.category) {
                    return false;
                }

                // Size filter
                if (currentFilters.size) {
                    const productSize = `${product.length}×${product.width}`;
                    if (productSize !== currentFilters.size) {
                        return false;
                    }
                }

                // Motor filter
                if (currentFilters.motor && product.motor !== currentFilters.motor) {
                    return false;
                }

                // Jets filter
                if (currentFilters.jets && product.jets.toString() !== currentFilters.jets) {
                    return false;
                }

                return true;
            });

            renderProducts();
        }

        // Clear all filters
        function clearAllFilters() {
            currentFilters = {
                search: '',
                category: '',
                size: '',
                motor: '',
                jets: ''
            };

            document.getElementById('searchBox').value = '';
            document.getElementById('categoryFilter').value = '';
            document.getElementById('sizeFilter').value = '';
            document.getElementById('motorFilter').value = '';
            document.getElementById('jetsFilter').value = '';

            filteredProducts = [...hidromasajesData];
            renderProducts();
        }

        // Render products
        function renderProducts() {
            const grid = document.getElementById('productsGrid');
            const resultsInfo = document.getElementById('resultsInfo');
            const noResults = document.getElementById('noResults');

            // Update results info
            resultsInfo.textContent = `Mostrando ${filteredProducts.length} de ${hidromasajesData.length} productos`;

            if (filteredProducts.length === 0) {
                grid.innerHTML = '';
                noResults.style.display = 'block';
                return;
            }

            noResults.style.display = 'none';

            // Generate product cards
            grid.innerHTML = filteredProducts.map(product => `
                <div class="product-card" data-category="${product.category}">
                    <div class="product-header category-${product.category}">
                        <div class="product-category">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</div>
                        <div class="product-name">${product.name}</div>
                        <div class="product-size">${product.length} × ${product.width} cm</div>
                    </div>
                    
                    <div class="product-visual category-${product.category}">
                    </div>
                    
                    <div class="product-content">
                        <div class="specs-grid">
                            <div class="spec-item">
                                <span class="spec-value">${product.length}</span>
                                <span class="spec-label">Largo (cm)</span>
                            </div>
                            <div class="spec-item">
                                <span class="spec-value">${product.width}</span>
                                <span class="spec-label">Ancho (cm)</span>
                            </div>
                            <div class="spec-item">
                                <span class="spec-value">${product.jets}</span>
                                <span class="spec-label">Jets</span>
                            </div>
                            <div class="spec-item">
                                <span class="spec-value">${product.motor}</span>
                                <span class="spec-label">Motor</span>
                            </div>
                        </div>
                        
                        <p style="color: var(--text-gray); margin-bottom: 1.5rem; font-size: 0.95rem;">
                            ${product.description}
                        </p>
                        
                        <ul class="features-list">
                            ${product.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                        
                        <div class="product-actions">
                            <a href="#contacto" class="btn btn-primary" onclick="contactProduct('${product.name}')">
                                💬 Consultar
                            </a>
                        </div>
                    </div>
                </div>
            `).join('');

            // Add hover effects
            document.querySelectorAll('.product-card').forEach(card => {
                card.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-15px) scale(1.03)';
                });
                
                card.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0) scale(1)';
                });
            });
        }

        // Contact product function
        function contactProduct(productName) {
            const message = `Hola! Me interesa el hidromasaje ${productName}. ¿Podrían proporcionarme más información y precio?`;
            const whatsappUrl = `https://wa.me/5491156610832?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        }

        // Share product function
        function shareProduct(productName) {
            if (navigator.share) {
                navigator.share({
                    title: `Hidrostyle - ${productName}`,
                    text: `Mira este increíble hidromasaje: ${productName}`,
                    url: window.location.href
                });
            } else {
                // Fallback for browsers that don't support Web Share API
                const url = window.location.href;
                navigator.clipboard.writeText(url).then(() => {
                    alert('¡Enlace copiado al portapapeles!');
                });
            }
        }

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Header background change on scroll
        window.addEventListener('scroll', () => {
            const header = document.querySelector('header');
            if (window.scrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = 'none';
            }
        });