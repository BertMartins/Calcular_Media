// =====================
// THEME MANAGEMENT
// =====================
function initTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
    }
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        document.documentElement.classList.toggle('dark', event.matches);
        document.documentElement.classList.toggle('light', !event.matches);
        updateThemeIcons();
    });
}

function toggleTheme() {
    const isDark = document.documentElement.classList.contains('dark');
    document.documentElement.classList.toggle('dark', !isDark);
    document.documentElement.classList.toggle('light', isDark);
    updateThemeIcons();
}

function updateThemeIcons() {
    const isDark = document.documentElement.classList.contains('dark');
    document.querySelectorAll('.dark-icon').forEach(el => el.classList.toggle('hidden', isDark));
    document.querySelectorAll('.light-icon').forEach(el => el.classList.toggle('hidden', !isDark));
}

// =====================
// NAVIGATION
// =====================
let currentPage = 'home';

function navigateTo(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-' + page).classList.add('active');

    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
        link.classList.toggle('text-white', link.dataset.page === page);
        link.classList.toggle('bg-white/10', link.dataset.page === page);
        link.classList.toggle('text-white/70', link.dataset.page !== page);
    });

    currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Re-trigger animations
    const pageEl = document.getElementById('page-' + page);
    pageEl.querySelectorAll('.animate-fadeInUp').forEach(el => {
        el.style.animation = 'none';
        el.offsetHeight;
        el.style.animation = null;
    });
}

// =====================
// MOBILE MENU
// =====================
function openMobileMenu() {
    document.getElementById('mobileMenu').classList.add('open');
    document.getElementById('mobileMenuOverlay').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
    document.getElementById('mobileMenu').classList.remove('open');
    document.getElementById('mobileMenuOverlay').classList.add('hidden');
    document.body.style.overflow = '';
}

// =====================
// CAROUSEL
// =====================
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.carousel-dot');

function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active', 'bg-white');
    dots[currentSlide].classList.add('bg-white/50');

    currentSlide = index;

    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active', 'bg-white');
    dots[currentSlide].classList.remove('bg-white/50');

    // Re-trigger animations
    slides[currentSlide].querySelectorAll('.animate-fadeInUp').forEach(el => {
        el.style.animation = 'none';
        el.offsetHeight;
        el.style.animation = null;
    });
}

function nextSlide() {
    goToSlide((currentSlide + 1) % slides.length);
}

function prevSlide() {
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
}

// Auto-advance carousel
setInterval(nextSlide, 6000);

// =====================
// APP DATA
// =====================
let appData = { semesters: [] };
let confirmCallback = null;
const STORAGE_KEY = 'uninassau_calculadora_v2';

function saveData() {
    try {
        const storage = window['localStorage'];
        if (storage) {
            storage.setItem(STORAGE_KEY, JSON.stringify(appData));
        }
    } catch (e) {
        console.error('Erro ao salvar no localStorage', e);
    }
}

function loadData() {
    try {
        const storage = window['localStorage'];
        if (storage) {
            const dataStr = storage.getItem(STORAGE_KEY);
            if (dataStr) {
                appData = JSON.parse(dataStr);
            }
        }
    } catch (e) {
        console.error('Erro ao carregar do localStorage', e);
        appData = { semesters: [] };
    }
}

// =====================
// MODAL FUNCTIONS
// =====================
function openModal(modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    setTimeout(() => {
        const input = modal.querySelector('input[type="text"]');
        if (input) input.focus();
    }, 100);
}

function closeModal(modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

function showConfirm(message, callback) {
    document.getElementById('confirmMessage').textContent = message;
    confirmCallback = callback;
    openModal(document.getElementById('confirmModal'));
}

// =====================
// SEMESTER FUNCTIONS
// =====================
function addSemester(name) {
    const semester = {
        id: Date.now().toString(),
        name: name,
        subjects: [],
        expanded: true
    };
    appData.semesters.push(semester);
    saveData();
    renderSemesters();
    updateStats();
}

function deleteSemester(id) {
    showConfirm('Deseja realmente excluir este semestre e todas as matérias?', () => {
        appData.semesters = appData.semesters.filter(s => s.id !== id);
        saveData();
        renderSemesters();
        updateStats();
    });
}

function toggleSemester(id) {
    const semester = appData.semesters.find(s => s.id === id);
    if (semester) {
        semester.expanded = !semester.expanded;
        saveData();
        renderSemesters();
    }
}

// =====================
// SUBJECT FUNCTIONS
// =====================
function openAddSubjectModal(semesterId) {
    document.getElementById('targetSemesterId').value = semesterId;
    openModal(document.getElementById('subjectModal'));
}

function addSubject(semesterId, name) {
    const semester = appData.semesters.find(s => s.id === semesterId);
    if (semester) {
        const subject = {
            id: Date.now().toString(),
            name: name,
            av1: null,
            av2: null,
            avFinal: null,
            media: null,
            status: 'pending',
            needsForRecovery: null,
            expanded: true
        };
        semester.subjects.push(subject);
        saveData();
        renderSemesters();
        updateStats();
    }
}

function deleteSubject(semesterId, subjectId) {
    showConfirm('Deseja realmente excluir esta matéria?', () => {
        const semester = appData.semesters.find(s => s.id === semesterId);
        if (semester) {
            semester.subjects = semester.subjects.filter(sub => sub.id !== subjectId);
            saveData();
            renderSemesters();
            updateStats();
        }
    });
}

function toggleSubject(semesterId, subjectId) {
    const semester = appData.semesters.find(s => s.id === semesterId);
    if (semester) {
        const subject = semester.subjects.find(sub => sub.id === subjectId);
        if (subject) {
            subject.expanded = !subject.expanded;
            saveData();
            renderSemesters();
        }
    }
}

function updateGrade(semesterId, subjectId, field, value) {
    const semester = appData.semesters.find(s => s.id === semesterId);
    if (semester) {
        const subject = semester.subjects.find(sub => sub.id === subjectId);
        if (subject) {
            const numValue = value === '' ? null : Math.min(10, Math.max(0, parseFloat(value)));
            subject[field] = numValue;
            calculateGrades(subject);
            saveData();
            renderSemesters();
            updateStats();
        }
    }
}

function calculateGrades(subject) {
    subject.media = null;
    subject.status = 'pending';
    subject.needsForRecovery = null;

    const av1 = subject.av1;
    const av2 = subject.av2;

    if (av1 !== null && av2 !== null) {
        const media = (av1 + av2) / 2;
        subject.media = Math.round(media * 10) / 10;

        if (media >= 7) {
            subject.status = 'approved';
        } else if (media >= 4) {
            subject.status = 'recovery';
            const needed = Math.ceil((10 - media) * 10) / 10;
            subject.needsForRecovery = Math.min(10, Math.max(0, needed));

            if (subject.avFinal !== null) {
                const finalMedia = (media + subject.avFinal) / 2;
                subject.media = Math.round(finalMedia * 10) / 10;
                subject.status = finalMedia >= 5 ? 'approved' : 'failed';
            }
        } else {
            subject.status = 'failed';
        }
    } else if (av1 !== null) {
        const needed = 14 - av1;
        if (needed <= 10 && needed >= 0) {
            subject.needsForRecovery = Math.ceil(needed * 10) / 10;
        }
    }
}

function getStatusClass(status) {
    const classes = {
        approved: 'status-approved',
        recovery: 'status-recovery',
        failed: 'status-failed',
        pending: 'status-pending'
    };
    return classes[status] || 'status-pending';
}

function getStatusText(status) {
    const texts = { approved: 'Aprovado', recovery: 'Recuperação', failed: 'Reprovado', pending: 'Pendente' };
    return texts[status] || 'Pendente';
}

function getStatusIcon(status) {
    const icons = { approved: 'fa-check', recovery: 'fa-clock', failed: 'fa-times', pending: 'fa-hourglass-half' };
    return icons[status] || 'fa-hourglass-half';
}

function updateStats() {
    let total = 0, approved = 0, recovery = 0, failed = 0;
    appData.semesters.forEach(semester => {
        semester.subjects.forEach(subject => {
            total++;
            if (subject.status === 'approved') approved++;
            else if (subject.status === 'recovery') recovery++;
            else if (subject.status === 'failed') failed++;
        });
    });
    document.getElementById('totalSubjects').textContent = total;
    document.getElementById('approvedCount').textContent = approved;
    document.getElementById('recoveryCount').textContent = recovery;
    document.getElementById('failedCount').textContent = failed;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function renderSemesters() {
    const container = document.getElementById('semestersContainer');
    const emptyState = document.getElementById('emptyState');

    if (appData.semesters.length === 0) {
        container.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');

    container.innerHTML = appData.semesters.map((semester, index) => `
                <div class="glass-card rounded-2xl sm:rounded-3xl overflow-hidden">
                    <div class="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors ${semester.expanded ? 'expanded' : ''}"
                         onclick="toggleSemester('${semester.id}')">
                        <div class="flex items-center gap-3 sm:gap-4">
                            <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0">
                                <i class="fas fa-graduation-cap text-base sm:text-lg"></i>
                            </div>
                            <div class="min-w-0">
                                <h2 class="text-base sm:text-xl font-bold truncate">${escapeHtml(semester.name)}</h2>
                                <p class="text-xs sm:text-sm text-white/50">${semester.subjects.length} matéria${semester.subjects.length !== 1 ? 's' : ''}</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                            <button onclick="event.stopPropagation(); deleteSemester('${semester.id}')"
                                    class="delete-btn p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-all">
                                <i class="fas fa-trash-alt text-sm"></i>
                            </button>
                            <div class="p-2">
                                <i class="fas fa-chevron-down expand-icon text-white/50 text-sm"></i>
                            </div>
                        </div>
                    </div>

                    <div class="subject-content ${semester.expanded ? 'open' : ''}">
                        <div class="p-4 sm:p-6">
                            <button onclick="openAddSubjectModal('${semester.id}')"
                                    class="w-full mb-4 py-3 border-2 border-dashed border-white/20 rounded-xl text-white/50 hover:border-primary-500 hover:text-primary-400 transition-all flex items-center justify-center gap-2 text-sm sm:text-base">
                                <i class="fas fa-plus"></i>
                                Adicionar Matéria
                            </button>

                            <div class="semester-grid">
                                ${semester.subjects.map(subject => renderSubject(semester.id, subject)).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');
}

function renderSubject(semesterId, subject) {
    const showFinal = subject.status === 'recovery' || (subject.av1 !== null && subject.av2 !== null && subject.media !== null && subject.media < 7 && subject.media >= 4);

    return `
                <div class="card-hover bg-white/5 rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all">
                    <div class="p-3 sm:p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors ${subject.expanded ? 'expanded' : ''}"
                         onclick="toggleSubject('${semesterId}', '${subject.id}')">
                        <div class="flex items-center gap-2 sm:gap-3 min-w-0">
                            <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg ${getStatusClass(subject.status)} flex items-center justify-center flex-shrink-0">
                                <i class="fas ${getStatusIcon(subject.status)} text-xs sm:text-sm"></i>
                            </div>
                            <div class="min-w-0">
                                <h3 class="font-semibold text-sm sm:text-base truncate">${escapeHtml(subject.name)}</h3>
                                <p class="text-xs text-white/50">${getStatusText(subject.status)}</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                            ${subject.media !== null ? `
                                <span class="font-mono font-bold text-base sm:text-lg ${subject.status === 'approved' ? 'text-emerald-400' : subject.status === 'failed' ? 'text-red-400' : 'text-amber-400'}">${subject.media.toFixed(1)}</span>
                            ` : ''}
                            <button onclick="event.stopPropagation(); deleteSubject('${semesterId}', '${subject.id}')"
                                    class="delete-btn p-1.5 sm:p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-all">
                                <i class="fas fa-trash-alt text-xs sm:text-sm"></i>
                            </button>
                            <div class="p-1">
                                <i class="fas fa-chevron-down expand-icon text-white/40 text-xs sm:text-sm"></i>
                            </div>
                        </div>
                    </div>

                    <div class="subject-content ${subject.expanded ? 'open' : ''}">
                        <div class="p-3 sm:p-4 pt-0 space-y-3 sm:space-y-4">
                            <div class="grid grid-cols-2 gap-2 sm:gap-3">
                                <div>
                                    <label class="block text-xs text-white/50 mb-1">AV1</label>
                                    <input type="number" min="0" max="10" step="0.1"
                                           value="${subject.av1 !== null ? subject.av1 : ''}"
                                           onchange="updateGrade('${semesterId}', '${subject.id}', 'av1', this.value)"
                                           onclick="event.stopPropagation()"
                                           class="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-center font-mono focus:outline-none input-focus transition-all text-base">
                                </div>
                                <div>
                                    <label class="block text-xs text-white/50 mb-1">AV2</label>
                                    <input type="number" min="0" max="10" step="0.1"
                                           value="${subject.av2 !== null ? subject.av2 : ''}"
                                           onchange="updateGrade('${semesterId}', '${subject.id}', 'av2', this.value)"
                                           onclick="event.stopPropagation()"
                                           class="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-center font-mono focus:outline-none input-focus transition-all text-base">
                                </div>
                            </div>

                            ${subject.av1 !== null && subject.av2 === null && subject.needsForRecovery !== null ? `
                                <div class="p-2.5 sm:p-3 rounded-lg bg-blue-500/20 border border-blue-500/30">
                                    <p class="text-xs sm:text-sm text-blue-300">
                                        <i class="fas fa-info-circle mr-2"></i>
                                        Precisa de <strong class="font-mono">${subject.needsForRecovery.toFixed(1)}</strong> na AV2 para aprovação direta
                                    </p>
                                </div>
                            ` : ''}

                            ${showFinal ? `
                                <div class="pt-2 sm:pt-3 border-t border-white/10">
                                    ${subject.needsForRecovery !== null && subject.avFinal === null ? `
                                        <div class="p-2.5 sm:p-3 rounded-lg bg-amber-500/20 border border-amber-500/30 mb-3">
                                            <p class="text-xs sm:text-sm text-amber-300">
                                                <i class="fas fa-exclamation-triangle mr-2"></i>
                                                Precisa de <strong class="font-mono">${subject.needsForRecovery.toFixed(1)}</strong> na AV Final
                                            </p>
                                        </div>
                                    ` : ''}
                                    <div>
                                        <label class="block text-xs text-white/50 mb-1">AV Final (Recuperação)</label>
                                        <input type="number" min="0" max="10" step="0.1"
                                               value="${subject.avFinal !== null ? subject.avFinal : ''}"
                                               onchange="updateGrade('${semesterId}', '${subject.id}', 'avFinal', this.value)"
                                               onclick="event.stopPropagation()"
                                               class="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-center font-mono focus:outline-none input-focus transition-all text-base">
                                    </div>
                                </div>
                            ` : ''}

                            ${subject.media !== null ? `
                                <div class="flex items-center justify-between p-2.5 sm:p-3 rounded-lg ${getStatusClass(subject.status)}">
                                    <span class="font-semibold text-sm sm:text-base">Média Final</span>
                                    <span class="font-mono font-bold text-lg sm:text-xl">${subject.media.toFixed(1)}</span>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
}

// =====================
// INITIALIZATION
// =====================
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    loadData();
    renderSemesters();
    updateStats();

    // Theme toggles
    document.getElementById('themeToggleDesktop').addEventListener('click', toggleTheme);
    document.getElementById('themeToggleMobile').addEventListener('click', toggleTheme);

    // Mobile menu
    document.getElementById('mobileMenuBtn').addEventListener('click', openMobileMenu);
    document.getElementById('closeMobileMenu').addEventListener('click', closeMobileMenu);
    document.getElementById('mobileMenuOverlay').addEventListener('click', closeMobileMenu);

    // Add semester
    document.getElementById('addSemesterBtn').addEventListener('click', () => {
        openModal(document.getElementById('semesterModal'));
    });

    // Close modals
    document.getElementById('closeSemesterModal').addEventListener('click', () => closeModal(document.getElementById('semesterModal')));
    document.getElementById('closeSubjectModal').addEventListener('click', () => closeModal(document.getElementById('subjectModal')));
    document.getElementById('cancelConfirm').addEventListener('click', () => closeModal(document.getElementById('confirmModal')));

    // Close modal on backdrop
    ['semesterModal', 'subjectModal', 'confirmModal'].forEach(id => {
        document.getElementById(id).addEventListener('click', (e) => {
            if (e.target.id === id) closeModal(document.getElementById(id));
        });
    });

    // Semester form
    document.getElementById('semesterForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('semesterName').value.trim();
        if (name) {
            addSemester(name);
            document.getElementById('semesterName').value = '';
            closeModal(document.getElementById('semesterModal'));
        }
    });

    // Subject form
    document.getElementById('subjectForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('subjectName').value.trim();
        const semesterId = document.getElementById('targetSemesterId').value;
        if (name && semesterId) {
            addSubject(semesterId, name);
            document.getElementById('subjectName').value = '';
            closeModal(document.getElementById('subjectModal'));
        }
    });

    // Confirm action
    document.getElementById('confirmAction').addEventListener('click', () => {
        if (confirmCallback) {
            confirmCallback();
            confirmCallback = null;
        }
        closeModal(document.getElementById('confirmModal'));
    });

    // Set initial nav state
    navigateTo('home');

    // =====================
    // EXPORT / IMPORT DATA
    // =====================

    // Export data as JSON file
    document.getElementById('exportDataBtn').addEventListener('click', function () {
        if (appData.semesters.length === 0) {
            showToast('Nenhum dado para exportar!', 'warning');
            return;
        }

        const dataStr = JSON.stringify(appData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const date = new Date();
        const dateStr = date.toISOString().split('T')[0];
        const filename = 'uninassau_notas_' + dateStr + '.json';

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showToast('Dados exportados com sucesso!', 'success');
    });

    // Import button click
    document.getElementById('importDataBtn').addEventListener('click', function () {
        document.getElementById('importFileInput').click();
    });

    // Import file selected
    document.getElementById('importFileInput').addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (event) {
            try {
                const importedData = JSON.parse(event.target.result);

                // Validate structure
                if (!importedData.semesters || !Array.isArray(importedData.semesters)) {
                    showToast('Arquivo inválido!', 'error');
                    return;
                }

                // Confirm import
                showConfirm('Isso substituirá todos os dados atuais. Deseja continuar?', () => {
                    appData = importedData;
                    saveData();
                    renderSemesters();
                    updateStats();
                    showToast('Dados importados com sucesso!', 'success');
                });
            } catch (error) {
                showToast('Erro ao ler o arquivo!', 'error');
            }
        };
        reader.readAsText(file);

        // Reset input
        e.target.value = '';
    });

    // Close data notice
    document.getElementById('closeDataNotice').addEventListener('click', function () {
        document.getElementById('dataNotice').style.display = 'none';
    });

    // Toast notification function
    function showToast(message, type) {
        const colors = {
            success: 'bg-emerald-500',
            error: 'bg-red-500',
            warning: 'bg-amber-500',
            info: 'bg-blue-500'
        };

        const icons = {
            success: 'fa-check-circle',
            error: 'fa-times-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };

        const toast = document.createElement('div');
        toast.className = 'fixed bottom-4 right-4 z-50 ' + colors[type] + ' text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-slideDown';
        toast.innerHTML = '<i class="fas ' + icons[type] + '"></i><span>' + message + '</span>';

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // =====================
    // QUICK CALCULATOR
    // =====================
    let quickCalcMedia = null;

    // AV1 input change - show what's needed for AV2
    document.getElementById('quickAv1').addEventListener('input', function () {
        const av1 = parseFloat(this.value);
        const needAv2Div = document.getElementById('quickNeedAv2');

        if (!isNaN(av1) && av1 >= 0 && av1 <= 10) {
            const needed = 14 - av1;
            if (needed >= 0 && needed <= 10) {
                document.getElementById('quickNeedAv2Value').textContent = needed.toFixed(1);
                needAv2Div.classList.remove('hidden');
            } else if (needed < 0) {
                document.getElementById('quickNeedAv2Value').textContent = '0.0';
                needAv2Div.classList.remove('hidden');
            } else {
                needAv2Div.classList.add('hidden');
            }
        } else {
            needAv2Div.classList.add('hidden');
        }
    });

    // Quick calc form submit
    document.getElementById('quickCalcForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const av1 = parseFloat(document.getElementById('quickAv1').value);
        const av2 = parseFloat(document.getElementById('quickAv2').value);

        if (isNaN(av1) || isNaN(av2)) return;

        const media = (av1 + av2) / 2;
        quickCalcMedia = media;
        const mediaRounded = Math.round(media * 10) / 10;

        document.getElementById('quickMedia').value = mediaRounded.toFixed(1);

        const situacaoDiv = document.getElementById('quickSituacao');
        const situacaoText = document.getElementById('quickSituacaoText');
        situacaoDiv.classList.remove('hidden', 'status-approved', 'status-recovery', 'status-failed');

        const recoveryCard = document.getElementById('quickRecoveryCard');
        const avFinalInput = document.getElementById('quickAvFinal');
        const recoveryBtn = document.getElementById('quickRecoveryBtn');
        const recoveryClearBtn = document.getElementById('quickRecoveryClearBtn');
        const needFinalDiv = document.getElementById('quickNeedFinal');

        if (media >= 7) {
            situacaoDiv.classList.add('status-approved');
            situacaoText.innerHTML = '<i class="fas fa-check-circle mr-2"></i>Aprovado!';
            // Disable recovery section
            recoveryCard.classList.add('opacity-50');
            avFinalInput.disabled = true;
            recoveryBtn.disabled = true;
            recoveryClearBtn.disabled = true;
            needFinalDiv.classList.add('hidden');
        } else if (media >= 4) {
            situacaoDiv.classList.add('status-recovery');
            situacaoText.innerHTML = '<i class="fas fa-clock mr-2"></i>Recuperação';
            // Enable recovery section
            recoveryCard.classList.remove('opacity-50');
            avFinalInput.disabled = false;
            recoveryBtn.disabled = false;
            recoveryClearBtn.disabled = false;
            // Show what's needed in final
            const needed = Math.ceil((10 - media) * 10) / 10;
            document.getElementById('quickNeedFinalValue').textContent = Math.min(10, needed).toFixed(1);
            needFinalDiv.classList.remove('hidden');
        } else {
            situacaoDiv.classList.add('status-failed');
            situacaoText.innerHTML = '<i class="fas fa-times-circle mr-2"></i>Reprovado (sem direito à final)';
            // Disable recovery section
            recoveryCard.classList.add('opacity-50');
            avFinalInput.disabled = true;
            recoveryBtn.disabled = true;
            recoveryClearBtn.disabled = true;
            needFinalDiv.classList.add('hidden');
        }
    });

    // Quick calc clear button
    document.getElementById('quickClearBtn').addEventListener('click', function () {
        document.getElementById('quickAv1').value = '';
        document.getElementById('quickAv2').value = '';
        document.getElementById('quickMedia').value = '';
        document.getElementById('quickSituacao').classList.add('hidden');
        document.getElementById('quickNeedAv2').classList.add('hidden');
        quickCalcMedia = null;

        // Reset recovery section
        const recoveryCard = document.getElementById('quickRecoveryCard');
        recoveryCard.classList.add('opacity-50');
        document.getElementById('quickAvFinal').disabled = true;
        document.getElementById('quickAvFinal').value = '';
        document.getElementById('quickRecoveryBtn').disabled = true;
        document.getElementById('quickRecoveryClearBtn').disabled = true;
        document.getElementById('quickNeedFinal').classList.add('hidden');
        document.getElementById('quickMediaFinal').value = '';
        document.getElementById('quickSituacaoFinal').classList.add('hidden');
    });

    // Recovery form submit
    document.getElementById('quickRecoveryForm').addEventListener('submit', function (e) {
        e.preventDefault();

        if (quickCalcMedia === null) return;

        const avFinal = parseFloat(document.getElementById('quickAvFinal').value);
        if (isNaN(avFinal)) return;

        const mediaFinal = (quickCalcMedia + avFinal) / 2;
        const mediaFinalRounded = Math.round(mediaFinal * 10) / 10;

        document.getElementById('quickMediaFinal').value = mediaFinalRounded.toFixed(1);

        const situacaoDiv = document.getElementById('quickSituacaoFinal');
        const situacaoText = document.getElementById('quickSituacaoFinalText');
        situacaoDiv.classList.remove('hidden', 'status-approved', 'status-failed');

        if (mediaFinal >= 5) {
            situacaoDiv.classList.add('status-approved');
            situacaoText.innerHTML = '<i class="fas fa-check-circle mr-2"></i>Aprovado!';
        } else {
            situacaoDiv.classList.add('status-failed');
            situacaoText.innerHTML = '<i class="fas fa-times-circle mr-2"></i>Reprovado';
        }
    });

    // Recovery clear button
    document.getElementById('quickRecoveryClearBtn').addEventListener('click', function () {
        document.getElementById('quickAvFinal').value = '';
        document.getElementById('quickMediaFinal').value = '';
        document.getElementById('quickSituacaoFinal').classList.add('hidden');
    });
});