document.addEventListener('DOMContentLoaded', function () {
    const urlForm = document.getElementById('url-form');
    const loadingSpinner = document.getElementById('loading');
    const videoInfo = document.getElementById('video-info');
    const errorMessage = document.getElementById('error-message');
    const videoThumbnail = document.getElementById('video-thumbnail');
    const videoTitle = document.getElementById('video-title');
    const formatList = document.getElementById('format-list');

    if (urlForm) {
        urlForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const url = document.getElementById('url').value.trim();

            // Reset UI state
            videoInfo.classList.add('hidden');
            errorMessage.classList.add('hidden');
            loadingSpinner.classList.remove('hidden');
            formatList.innerHTML = '';

            try {
                // Fetch video information
                const response = await fetch(`/video_info?url=${encodeURIComponent(url)}`);
                const data = await response.json();

                if (response.ok) {
                    // Display video information
                    videoThumbnail.src = data.thumbnail;
                    videoTitle.textContent = data.title;

                    // Populate available formats
                    data.streams.forEach(stream => {
                        const formatItem = document.createElement('div');
                        formatItem.className = 'format-button bg-white dark:bg-gray-700 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-600 hover:border-red-500 dark:hover:border-red-500 transition-all duration-200';

                        let formatHTML = `
                            <div class="flex flex-col justify-between h-full">
                                <div class="format-container mb-3">
                                    <div class="flex items-center mb-2">
                                        <span class="format-quality text-gray-900 dark:text-white font-medium">${stream.resolution}</span>
                                    </div>
                                    <div class="flex flex-wrap gap-2">
                                        <span class="format-badge bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded">${stream.mime_type}</span>
                                    </div>
                                </div>
                                <button class="download-format-button w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center space-x-2" data-url="${url}" data-itag="${stream.itag}">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                                    </svg>
                                    <span>Download</span>
                                </button>
                            </div>
                        `;

                        formatItem.innerHTML = formatHTML;
                        formatList.appendChild(formatItem);
                    });

                    // Show video info section
                    videoInfo.classList.remove('hidden');
                } else {
                    showError(data.error || 'An error occurred while fetching video information.');
                }
            } catch (error) {
                console.error('Error:', error);
                showError('An unexpected error occurred. Please try again.');
            } finally {
                loadingSpinner.classList.add('hidden');
            }
        });
    }

    // Handle download button clicks
    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('download-format-button')) {
            const url = event.target.getAttribute('data-url');
            const itag = event.target.getAttribute('data-itag');
            window.location.href = `/download?url=${encodeURIComponent(url)}&itag=${itag}`;
        }
    });

    function showError(message) {
        errorMessage.querySelector('span').textContent = message;
        errorMessage.classList.remove('hidden');
    }
});
