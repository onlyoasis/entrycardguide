/**
 * Decision-tree tool.
 *
 * v1.0 design constraints (matches validator.ts):
 * - ZERO network requests. Ever.
 * - ZERO npm dependencies. Hugo's js.Build pipe handles TS.
 * - State machine sourced from <script type="application/json"
 *   id="decide-tree"> populated at build time from data/decision/tree.json
 * - One instance per page (the /decide/ page).
 *
 * To add a new country:
 * 1. Add states to data/decision/tree.json
 * 2. Add an option pointing into the new flow under the "country" state
 * 3. No code changes needed here — data drives everything
 */

interface QuestionOption {
  value: string;
  label: string;
  next: string;
}

interface Form {
  name: string;
  fee: string;
  url: string;
  guide: string;
  agency: string;
  deadline?: string;
}

interface QuestionState {
  type: 'question';
  label: string;
  options: QuestionOption[];
}

interface ResultState {
  type: 'result';
  country: string;
  summary: string;
  forms: Form[];
  note?: string;
  fallback_guide?: string;
  fallback_label?: string;
  fallback_warning?: string;
}

type State = QuestionState | ResultState;

interface DecisionTree {
  version: string;
  lastVerified: string;
  start: string;
  states: Record<string, State>;
}

interface HistoryEntry {
  stateId: string;
  questionLabel: string;
  answerLabel: string;
}

class DecisionTool {
  private container: HTMLElement;
  private tree: DecisionTree;
  private currentStateId: string;
  private history: HistoryEntry[] = [];
  private i18n: Record<string, string>;

  constructor(container: HTMLElement, tree: DecisionTree, i18n: Record<string, string>) {
    this.container = container;
    this.tree = tree;
    this.currentStateId = tree.start;
    this.i18n = i18n;
  }

  start(): void {
    this.render();
  }

  private answer(option: QuestionOption, questionLabel: string): void {
    this.history.push({
      stateId: this.currentStateId,
      questionLabel,
      answerLabel: option.label,
    });
    this.currentStateId = option.next;
    this.render();
  }

  private back(): void {
    const prev = this.history.pop();
    if (prev) {
      this.currentStateId = prev.stateId;
      this.render();
    }
  }

  private restart(): void {
    this.history = [];
    this.currentStateId = this.tree.start;
    this.render();
  }

  private t(key: string, fallback: string): string {
    return this.i18n[key] || fallback;
  }

  private render(): void {
    const state = this.tree.states[this.currentStateId];
    if (!state) {
      this.container.innerHTML = `<p class="text-scam">Decision tree error: state "${this.currentStateId}" not found.</p>`;
      return;
    }

    if (state.type === 'question') {
      this.renderQuestion(state);
    } else {
      this.renderResult(state);
    }
  }

  private renderQuestion(state: QuestionState): void {
    const stepNum = this.history.length + 1;
    const breadcrumbs = this.history
      .map(
        h =>
          `<li><span class="text-muted">${escape(h.questionLabel)}</span> <span class="text-ink">${escape(h.answerLabel)}</span></li>`
      )
      .join('');

    this.container.innerHTML = `
      ${breadcrumbs ? `<ol class="decide-breadcrumbs">${breadcrumbs}</ol>` : ''}
      <div class="decide-step text-meta text-muted font-mono uppercase">${this.t('decide_step', 'Step')} ${stepNum}</div>
      <h2 class="decide-question font-serif font-medium">${escape(state.label)}</h2>
      <div class="decide-options">
        ${state.options
          .map(
            (opt, i) => `
          <button type="button" class="decide-option" data-index="${i}">
            <span class="decide-option-label">${escape(opt.label)}</span>
            <span class="decide-option-arrow" aria-hidden="true">→</span>
          </button>`
          )
          .join('')}
      </div>
      ${
        this.history.length > 0
          ? `<button type="button" class="decide-back text-small text-muted">← ${this.t('decide_back', 'Back')}</button>`
          : ''
      }
    `;

    // Wire up listeners
    this.container.querySelectorAll<HTMLButtonElement>('.decide-option').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index || '0', 10);
        this.answer(state.options[idx], state.label);
      });
    });
    const backBtn = this.container.querySelector<HTMLButtonElement>('.decide-back');
    if (backBtn) backBtn.addEventListener('click', () => this.back());

    // Scroll the new question into view (subtle, only if scrolled past)
    if (this.history.length > 0) {
      this.container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  private renderResult(state: ResultState): void {
    const breadcrumbs = this.history
      .map(
        h =>
          `<li><span class="text-muted">${escape(h.questionLabel)}</span> <span class="text-ink">${escape(h.answerLabel)}</span></li>`
      )
      .join('');

    const formsHtml =
      state.forms.length > 0
        ? state.forms
            .map(
              f => `
        <div class="decide-form">
          <div class="decide-form-header">
            <span class="decide-form-name">${escape(f.name)}</span>
            <span class="decide-form-fee ${f.fee === 'FREE' ? 'is-free' : 'is-paid'}">${escape(f.fee)}</span>
          </div>
          <div class="decide-form-agency text-small text-muted">${escape(f.agency)}</div>
          ${f.deadline ? `<div class="decide-form-deadline text-xs text-muted">${escape(f.deadline)}</div>` : ''}
          <div class="decide-form-actions">
            <a href="${escape(f.url)}" rel="noopener" class="decide-form-cta-primary">
              ${this.t('decide_open_official', 'Open official site')} →
            </a>
            <a href="${escape(f.guide)}" class="decide-form-cta-secondary">
              ${this.t('decide_read_guide', 'Read our guide')}
            </a>
          </div>
        </div>`
            )
            .join('')
        : `<div class="decide-no-forms">
            <div class="text-h2 font-serif">${this.t('decide_no_forms', 'Nothing to file.')}</div>
            <p class="text-small text-muted">${this.t('decide_no_forms_explainer', 'You are exempt from the digital arrival card. Just bring your passport.')}</p>
          </div>`;

    this.container.innerHTML = `
      ${breadcrumbs ? `<ol class="decide-breadcrumbs">${breadcrumbs}</ol>` : ''}
      <div class="decide-result">
        <div class="decide-result-eyebrow text-meta text-muted font-mono uppercase">${this.t('decide_result_label', 'Your answer')}</div>
        <h2 class="decide-summary font-serif font-medium">${escape(state.summary)}</h2>
        <div class="decide-forms">${formsHtml}</div>
        ${state.note ? `<p class="decide-note text-small">${escape(state.note)}</p>` : ''}
        ${
          state.fallback_guide && state.fallback_label
            ? `<p class="decide-fallback text-small">
                <a href="${escape(state.fallback_guide)}" class="text-ink">${escape(state.fallback_label)} →</a>
              </p>`
            : ''
        }
        ${
          state.fallback_warning
            ? `<p class="decide-fallback-warning text-small text-muted">${escape(state.fallback_warning)}</p>`
            : ''
        }
        <div class="decide-actions">
          <button type="button" class="decide-restart">${this.t('decide_restart', 'Start over')}</button>
          ${this.history.length > 0 ? `<button type="button" class="decide-back text-small text-muted">← ${this.t('decide_back', 'Back')}</button>` : ''}
        </div>
      </div>
    `;

    const restartBtn = this.container.querySelector<HTMLButtonElement>('.decide-restart');
    if (restartBtn) restartBtn.addEventListener('click', () => this.restart());
    const backBtn = this.container.querySelector<HTMLButtonElement>('.decide-back');
    if (backBtn) backBtn.addEventListener('click', () => this.back());
  }
}

function escape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function loadTree(container: HTMLElement): DecisionTree | null {
  const script = container.querySelector<HTMLScriptElement>(
    'script[type="application/json"].decide-tree'
  );
  if (!script || !script.textContent) return null;
  try {
    return JSON.parse(script.textContent) as DecisionTree;
  } catch (e) {
    console.warn('decide: tree JSON parse failed', e);
    return null;
  }
}

function loadI18n(container: HTMLElement): Record<string, string> {
  const script = container.querySelector<HTMLScriptElement>(
    'script[type="application/json"].decide-i18n'
  );
  if (!script || !script.textContent) return {};
  try {
    return JSON.parse(script.textContent);
  } catch {
    return {};
  }
}

function init(): void {
  document.querySelectorAll<HTMLElement>('.decide-tool').forEach(container => {
    const tree = loadTree(container);
    if (!tree) return;
    const i18n = loadI18n(container);
    const target = container.querySelector<HTMLElement>('.decide-canvas');
    if (!target) return;
    new DecisionTool(target, tree, i18n).start();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
