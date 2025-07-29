document.addEventListener('DOMContentLoaded', function() {
    // FAQ Accordion functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                const answer = otherItem.querySelector('.faq-answer');
                answer.style.maxHeight = null;
            });
            
            // Toggle current item
            if (!isOpen) {
                item.classList.add('active');
                const answer = item.querySelector('.faq-answer');
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });

    // Category filtering - COMPLETELY REWRITTEN
    const categoryBtns = document.querySelectorAll('.category-btn');
    const faqCategories = document.querySelectorAll('.faq-category');
    let currentCategory = 'all';

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            currentCategory = category;
            
            // Update active button
            categoryBtns.forEach(otherBtn => otherBtn.classList.remove('active'));
            btn.classList.add('active');

            // Show/hide categories based on selection
            faqCategories.forEach(cat => {
                if (category === 'all') {
                    cat.style.display = 'block';
                    // Show all items in this category
                    const items = cat.querySelectorAll('.faq-item');
                    items.forEach(item => {
                        item.style.display = 'block';
                        item.style.opacity = '1';
                    });
                } else if (cat.dataset.category === category) {
                    cat.style.display = 'block';
                    // Show all items in this category
                    const items = cat.querySelectorAll('.faq-item');
                    items.forEach(item => {
                        item.style.display = 'block';
                        item.style.opacity = '1';
                    });
                } else {
                    cat.style.display = 'none';
                    // Hide all items in this category
                    const items = cat.querySelectorAll('.faq-item');
                    items.forEach(item => {
                        item.style.display = 'none';
                        item.style.opacity = '0';
                    });
                }
            });

            // Clear search when changing categories
            const searchInput = document.getElementById('faqSearch');
            if (searchInput) {
                searchInput.value = '';
            }
            
            // Remove any search results messages
            const searchResultsCount = document.getElementById('searchResultsCount');
            if (searchResultsCount) {
                searchResultsCount.remove();
            }
            
            const noResultsMessage = document.getElementById('noResultsMessage');
            if (noResultsMessage) {
                noResultsMessage.remove();
            }
        });
    });

    // Enhanced Search functionality - MODIFIED TO WORK WITH CATEGORIES
    const searchInput = document.getElementById('faqSearch');
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            performSearch(searchTerm);
        });

        // Add search on Enter key
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const searchTerm = e.target.value.toLowerCase().trim();
                performSearch(searchTerm);
            }
        });
    }

    function performSearch(searchTerm) {
        const faqItems = document.querySelectorAll('.faq-item');
        let hasResults = false;
        let resultCount = 0;
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question h3').textContent.toLowerCase();
            const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
            const category = item.closest('.faq-category').dataset.category;
            
            // Check if search term matches question, answer, or category
            const matchesSearch = searchTerm === '' || 
                question.includes(searchTerm) || 
                answer.includes(searchTerm) ||
                category.includes(searchTerm);
            
            // Only show items that match both the current category AND the search term
            const matchesCategory = currentCategory === 'all' || category === currentCategory;
            
            if (matchesSearch && matchesCategory) {
                item.style.display = 'block';
                item.style.opacity = '1';
                hasResults = true;
                resultCount++;
                
                // Highlight search term in question if found
                if (searchTerm && question.includes(searchTerm)) {
                    highlightText(item.querySelector('.faq-question h3'), searchTerm);
                } else {
                    removeHighlight(item.querySelector('.faq-question h3'));
                }
            } else {
                item.style.display = 'none';
                item.style.opacity = '0.5';
            }
        });

        // Show/hide categories based on search results
        faqCategories.forEach(cat => {
            const visibleItems = cat.querySelectorAll('.faq-item[style*="display: block"]');
            if (visibleItems.length > 0 || searchTerm === '') {
                cat.style.display = 'block';
            } else {
                cat.style.display = 'none';
            }
        });

        // Show search results count
        showSearchResultsCount(resultCount, searchTerm);
        
        // Show "no results" message if needed
        showNoResultsMessage(hasResults, searchTerm);
    }

    function highlightText(element, searchTerm) {
        const text = element.textContent;
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        // Minimalistic highlight: subtle light teal background, no border
        element.innerHTML = text.replace(regex, '<mark style="background-color: #e0f7fa; color: inherit; padding: 1px 3px; border-radius: 2px;">$1</mark>');
    }

    function removeHighlight(element) {
        const text = element.textContent;
        element.innerHTML = text;
    }

    function showSearchResultsCount(resultCount, searchTerm) {
        let resultsCountMsg = document.getElementById('searchResultsCount');
        
        if (searchTerm !== '' && resultCount > 0) {
            if (!resultsCountMsg) {
                resultsCountMsg = document.createElement('div');
                resultsCountMsg.id = 'searchResultsCount';
                resultsCountMsg.className = 'search-results-count';
            }
            resultsCountMsg.textContent = `Found ${resultCount} result${resultCount === 1 ? '' : 's'} for "${searchTerm}"`;
            
            if (!document.getElementById('searchResultsCount')) {
                document.querySelector('.faq-accordion').insertBefore(resultsCountMsg, document.querySelector('.faq-accordion').firstChild);
            }
        } else if (resultsCountMsg) {
            resultsCountMsg.remove();
        }
    }

    function showNoResultsMessage(hasResults, searchTerm) {
        let noResultsMsg = document.getElementById('noResultsMessage');
        
        if (!hasResults && searchTerm !== '') {
            if (!noResultsMsg) {
                noResultsMsg = document.createElement('div');
                noResultsMsg.id = 'noResultsMessage';
                noResultsMsg.className = 'no-results-message';
                noResultsMsg.innerHTML = `
                    <div style="text-align: center; padding: 2rem; color: #6B7280;">
                        <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                        <h3>No results found for "${searchTerm}"</h3>
                        <p>Try searching with different keywords or browse our categories above.</p>
                    </div>
                `;
                document.querySelector('.faq-accordion').appendChild(noResultsMsg);
            }
        } else if (noResultsMsg) {
            noResultsMsg.remove();
        }
    }

    // Clear search when clicking outside search box
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.faq-search') && !e.target.closest('.faq-accordion')) {
            if (searchInput && searchInput.value !== '') {
                searchInput.value = '';
                performSearch('');
            }
        }
    });
}); 