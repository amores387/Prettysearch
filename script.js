function searchImages() {
    const query = document.getElementById("searchInput").value;

    if (!query.trim()) {
        showError("Error: No keyword entered.");
        return;
    }

    showError("");
    showLoading(true);

    // Demo images (no backend needed)
    setTimeout(() => {
        showLoading(false);
        generateDemoImages(query);
    }, 900);
}

function generateDemoImages(keyword) {
    const gallery = document.getElementById("gallery");
    gallery.innerHTML = "";

    for (let i = 1; i <= 12; i++) {
        const img = document.createElement("img");
        img.src = `https://source.unsplash.com/random/300x300/?${keyword}&v=${i}`;
        gallery.appendChild(img);
    }
}

function showError(msg) {
    document.getElementById("error").innerText = msg;
}

function showLoading(state) {
    document.getElementById("loading").style.display = state ? "block" : "none";
}

document.getElementById("searchInput").addEventListener("keypress", e => {
    if (e.key === "Enter") searchImages();
});