 document.addEventListener('DOMContentLoaded', function () {
        // --- Mock Data ---
        const complaintsData = [
            { id: 'C-12345', category: 'Potholes / Road Damage', location: 'Main Street & 2nd Ave', date: '2025-09-18', status: 'Solved', description: 'Large pothole causing traffic issues.' },
            { id: 'C-67890', category: 'Waste Management / Uncollected Garbage', location: 'Oakwood Park', date: '2025-09-17', status: 'In Progress', description: 'Trash cans overflowing for three days.' },
            { id: 'C-24680', category: 'Streetlight Outage', location: 'Elm Street, near #152', date: '2025-09-16', status: 'Pending', description: 'The entire block has no streetlights.' },
            { id: 'C-13579', category: 'Water Leakage / Drainage Issue', location: 'Maple Avenue', date: '2025-09-15', status: 'Solved', description: 'Clean water leaking from a pipe.' },
            { id: 'C-98765', category: 'Public Park Maintenance', location: 'Central Park Playground', date: '2025-09-14', status: 'In Progress', description: 'Broken swing in the kids area.' }
        ];

        // --- Page Navigation Logic ---
        const navLinks = document.querySelectorAll('.nav-link');
        const pages = document.querySelectorAll('.page');

        function showPage(pageId) {
            pages.forEach(page => {
                if (page.id === pageId) {
                    page.classList.add('active');
                } else {
                    page.classList.remove('active');
                }
            });
            window.scrollTo(0, 0);
            // Close mobile menu on navigation
            document.getElementById('mobile-menu').classList.add('hidden');
        }

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const pageId = link.getAttribute('data-page');
                showPage(pageId);
            });
        });

        // --- Mobile Menu Toggle ---
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // --- Complaint Form Logic ---
        const complaintForm = document.getElementById('complaint-form');
        const formContainer = document.getElementById('complaint-form-container');
        const successMessage = document.getElementById('form-success-message');
        const complaintIdDisplay = document.getElementById('complaint-id-display');
        const fileAnotherButton = document.getElementById('file-another');

        complaintForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const newId = `C-${Math.floor(10000 + Math.random() * 90000)}`;
            
            const formData = new FormData(this);
            const newComplaint = {
                id: newId,
                category: formData.get('category'),
                location: formData.get('location'),
                date: new Date().toISOString().split('T')[0],
                status: 'Pending',
                description: formData.get('description')
            };

            // Add to our mock data
            complaintsData.unshift(newComplaint);

            // Update UI
            complaintIdDisplay.textContent = newId;
            formContainer.classList.add('hidden');
            successMessage.classList.remove('hidden');
            populateDashboard(); // Refresh dashboard with new data
        });

        fileAnotherButton.addEventListener('click', () => {
            formContainer.classList.remove('hidden');
            successMessage.classList.add('hidden');
            complaintForm.reset();
        });


        // --- Tracking Logic ---
        const trackForm = document.getElementById('track-form');
        const trackingInput = document.getElementById('complaint-id-input');
        const trackingResultsContainer = document.getElementById('tracking-results');

        trackForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const complaintId = trackingInput.value.trim().toUpperCase();
            const complaint = complaintsData.find(c => c.id.toUpperCase() === complaintId);
            
            trackingResultsContainer.classList.remove('hidden');
            if (complaint) {
                const statusClass = getStatusClass(complaint.status);
                trackingResultsContainer.innerHTML = `
                    <h3 class="text-2xl font-bold mb-4 text-white">Complaint Details</h3>
                    <div class="space-y-3 text-gray-300">
                        <p><strong>ID:</strong> <span class="text-white">${complaint.id}</span></p>
                        <p><strong>Category:</strong> <span class="text-white">${complaint.category}</span></p>
                        <p><strong>Location:</strong> <span class="text-white">${complaint.location}</span></p>
                        <p><strong>Date Filed:</strong> <span class="text-white">${complaint.date}</span></p>
                        <p><strong>Description:</strong> <span class="text-white">${complaint.description}</span></p>
                        <p class="flex items-center"><strong>Status:</strong> <span class="ml-2 status-badge ${statusClass}">${complaint.status}</span></p>
                    </div>
                `;
            } else {
                trackingResultsContainer.innerHTML = `
                    <h3 class="text-2xl font-bold mb-2 text-white">Not Found</h3>
                    <p class="text-gray-400">No complaint found with the ID "${complaintId}". Please check the ID and try again.</p>
                `;
            }
        });


        // --- Dashboard Logic ---
        const dashboardTableBody = document.getElementById('dashboard-table-body');
        
        function getStatusClass(status) {
            switch (status) {
                case 'Solved': return 'status-solved';
                case 'Pending': return 'status-pending';
                case 'In Progress': return 'status-progress';
                default: return 'bg-gray-700 text-gray-300';
            }
        }

        function populateDashboard() {
            dashboardTableBody.innerHTML = ''; // Clear existing rows
            complaintsData.forEach(complaint => {
                const statusClass = getStatusClass(complaint.status);
                const row = `
                    <tr class="hover:bg-dark-tertiary/40 transition-colors duration-200">
                        <td class="p-4 text-sm font-medium text-gray-200">${complaint.id}</td>
                        <td class="p-4 text-sm text-gray-400">${complaint.category}</td>
                        <td class="p-4 text-sm text-gray-400">${complaint.location}</td>
                        <td class="p-4 text-sm text-gray-400">${complaint.date}</td>
                        <td class="p-4 text-sm">
                            <span class="status-badge ${statusClass}">${complaint.status}</span>
                        </td>
                    </tr>
                `;
                dashboardTableBody.innerHTML += row;
            });
        }
        
        // --- Initial Load ---
        showPage('home'); // Show home page initially
        populateDashboard(); // Populate the dashboard on first load
    });