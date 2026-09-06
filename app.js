// Main Portal Application & App Pipeline Controller
import { SSSETool } from './apps/ssse/ssse-tool.js?v=1.2';
import { XCDETool } from './apps/xcde/xcde-tool.js?v=1.2';
import { KickassPreview } from './apps/kickass/kickass-preview.js?v=1.2';
import { SharpscaleCompare } from './apps/sharpscale/sharpscale-compare.js?v=1.2';
import { DeltaruneTool } from './apps/deltarune/deltarune-tool.js?v=1.2';
import { DeltaruneManagerPreview } from './apps/deltarune-manager/deltarune-manager-preview.js?v=1.2';

class HomebrewHub {
  constructor() {
    this.apps = [];
    this.filteredApps = [];
    this.activeCategory = 'All';
    this.activePlatform = 'All';
    this.searchQuery = '';
    this.activeModalComponent = null;

    this.componentMap = {
      'ssse-tool': SSSETool,
      'xcde-tool': XCDETool,
      'kickass-preview': KickassPreview,
      'sharpscale-compare': SharpscaleCompare,
      'deltarune-tool': DeltaruneTool,
      'deltarune-manager-preview': DeltaruneManagerPreview
    };
  }

  async init() {
    try {
      const res = await fetch('data/apps.json');
      if (!res.ok) throw new Error('Failed to load apps.json');
      const data = await res.json();
      this.hubData = data.hub;
      this.apps = data.apps;
      this.filteredApps = [...this.apps];

      this.renderAppGrid();
      this.bindControls();
      this.checkHashRoute();
    } catch (err) {
      console.error('Hub initialization failed:', err);
      document.getElementById('app-grid').innerHTML = `
        <div class="error-banner">Could not load app registry: ${err.message}</div>
      `;
    }
  }

  renderAppGrid() {
    const grid = document.getElementById('app-grid');
    if (!grid) return;

    if (this.filteredApps.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <span class="empty-icon">🔍</span>
          <h3>No applications found</h3>
          <p>Try adjusting your search query or active filter chips.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = this.filteredApps.map(app => `
      <article class="app-card" style="--accent: ${app.accentColor || '#38bdf8'}">
        <div class="card-top">
          <div class="app-icon-badge">${app.icon}</div>
          <div class="app-badges">
            <span class="badge category">${app.category}</span>
            <span class="badge highlight">${app.badge}</span>
          </div>
        </div>

        <h3 class="app-title">${app.name}</h3>
        <p class="app-tagline">${app.tagline}</p>

        <div class="platform-chips">
          ${app.platforms.map(p => `<span class="platform-chip">${p}</span>`).join('')}
          <span class="version-chip">${app.version}</span>
        </div>

        <ul class="feature-list">
          ${app.features.slice(0, 3).map(f => `<li><span class="check">✓</span> ${f}</li>`).join('')}
        </ul>

        <div class="card-footer">
          <button class="btn btn-action" data-app-id="${app.id}">
            <span>${this.getActionIcon(app.actionType)}</span>
            ${this.getActionLabel(app.actionType)}
          </button>
          <a href="${app.repoUrl}" target="_blank" class="btn btn-github" title="View Source on GitHub">
            <span>⭐</span> Code
          </a>
        </div>
      </article>
    `).join('');

    // Rebind action buttons
    grid.querySelectorAll('.btn-action').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.appId;
        this.openAppModal(id);
      });
    });
  }

  getActionIcon(type) {
    if (type === 'tool') return '⚡';
    if (type === 'preview') return '▶️';
    if (type === 'compare') return '🔍';
    return '🚀';
  }

  getActionLabel(type) {
    if (type === 'tool') return 'Launch Tool';
    if (type === 'preview') return 'Live Preview';
    if (type === 'compare') return 'Compare Scaling';
    return 'Open';
  }

  bindControls() {
    // Search input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.applyFilters();
      });
    }

    // Category filter buttons
    const catFilters = document.querySelectorAll('.cat-chip');
    catFilters.forEach(chip => {
      chip.addEventListener('click', () => {
        catFilters.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.activeCategory = chip.dataset.cat;
        this.applyFilters();
      });
    });

    // Modal Close
    const modalBackdrop = document.getElementById('app-modal');
    const modalClose = document.getElementById('modal-close');
    if (modalClose) modalClose.addEventListener('click', () => this.closeModal());
    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) this.closeModal();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeModal();
    });

    window.addEventListener('hashchange', () => this.checkHashRoute());
  }

  applyFilters() {
    this.filteredApps = this.apps.filter(app => {
      const matchCat = this.activeCategory === 'All' || app.category === this.activeCategory;
      const matchSearch = !this.searchQuery || 
        app.name.toLowerCase().includes(this.searchQuery) ||
        app.tagline.toLowerCase().includes(this.searchQuery) ||
        app.category.toLowerCase().includes(this.searchQuery) ||
        app.features.some(f => f.toLowerCase().includes(this.searchQuery));
      return matchCat && matchSearch;
    });

    this.renderAppGrid();
  }

  openAppModal(appId) {
    const app = this.apps.find(a => a.id === appId);
    if (!app) return;

    window.location.hash = app.id;
    const modal = document.getElementById('app-modal');
    const container = document.getElementById('modal-content-slot');
    container.innerHTML = '';

    if (this.activeModalComponent && typeof this.activeModalComponent.destroy === 'function') {
      this.activeModalComponent.destroy();
    }

    const componentKey = app.toolComponent || app.previewComponent || app.compareComponent;
    const ComponentClass = this.componentMap[componentKey];

    if (ComponentClass) {
      this.activeModalComponent = new ComponentClass(container);
      this.activeModalComponent.render();
    } else {
      container.innerHTML = `<p>Component not registered for ${app.name}</p>`;
    }

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    const modal = document.getElementById('app-modal');
    if (modal) modal.classList.remove('open');
    document.body.style.overflow = 'auto';

    if (this.activeModalComponent && typeof this.activeModalComponent.destroy === 'function') {
      this.activeModalComponent.destroy();
      this.activeModalComponent = null;
    }

    if (window.location.hash) {
      history.pushState("", document.title, window.location.pathname + window.location.search);
    }
  }

  checkHashRoute() {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      this.openAppModal(hash);
    }
  }
}

// Bootstrap
window.addEventListener('DOMContentLoaded', () => {
  const hub = new HomebrewHub();
  hub.init();
});
