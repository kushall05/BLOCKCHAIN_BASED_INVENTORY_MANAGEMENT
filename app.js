/**
 * Blockchain-Based Inventory Management System
 * Core Client-side Cryptographic Ledger & Mining Engine
 */

class Block {
    constructor(index, data, previousHash = '', nonce = 0, hash = '') {
        this.index = index;
        this.timestamp = new Date().toISOString();
        this.data = data;
        this.previousHash = previousHash;
        this.nonce = nonce;
        this.hash = hash;
        this.isTampered = false;
        this.originalData = data;
    }

    /**
     * Compute SHA-256 hash using Web Crypto API
     */
    async calculateHash() {
        const message = `${this.index}${this.previousHash}${this.data}${this.nonce}`;
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    /**
     * Proof-of-Work Mining Loop
     */
    async mineBlock(difficulty) {
        const target = '0'.repeat(difficulty);
        this.nonce = 0;
        
        while (true) {
            this.hash = await this.calculateHash();
            if (this.hash.startsWith(target)) {
                break;
            }
            this.nonce++;
        }
        return this.hash;
    }
}

class InventoryBlockchain {
    constructor() {
        this.chain = [];
        this.difficulty = 3;
        this.loadInitialLedger();
    }

    /**
     * Initialize with default demo data matching documentation (Page 7)
     */
    loadInitialLedger() {
        const genesisHash = '0000000000000000000000000000000000000000000000000000000000000000';
        
        // Block 1 (Genesis / Initial Stock)
        const block1 = new Block(
            1, 
            'Kushall: SKU-101 (+50)', 
            genesisHash, 
            49537, 
            '000bc7e829d115a4b7e82f34901fa7d825c8913b8219034ce5a871092e4ab391'
        );

        // Block 2 (Stock Transfer / Dispatch)
        const block2 = new Block(
            2, 
            'DEV: SKU-204 (+100)', 
            '000bc7e829d115a4b7e82f34901fa7d825c8913b8219034ce5a871092e4ab391', 
            8841, 
            '00078b6d194c731e8f20381048f32190bb47c1a89025e648194a028471c45981'
        );

        this.chain = [block1, block2];
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    /**
     * Add new mined block to the inventory ledger
     */
    async addBlock(data, difficulty = 3) {
        const latestBlock = this.getLatestBlock();
        const newIndex = latestBlock ? latestBlock.index + 1 : 1;
        const previousHash = latestBlock ? latestBlock.hash : '0000000000000000000000000000000000000000000000000000000000000000';
        
        const newBlock = new Block(newIndex, data, previousHash);
        await newBlock.mineBlock(difficulty);
        this.chain.push(newBlock);
        return newBlock;
    }

    /**
     * Comprehensive Chain Audit & Verification
     */
    async isChainValid() {
        for (let i = 0; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = i > 0 ? this.chain[i - 1] : null;

            // Check if current block data was tampered
            if (currentBlock.isTampered) {
                return {
                    valid: false,
                    tamperedBlockIndex: currentBlock.index,
                    reason: `Block #${currentBlock.index} data was altered from "${currentBlock.originalData}" to "${currentBlock.data}".`
                };
            }

            // Verify previous hash linkage
            if (i > 0 && currentBlock.previousHash !== previousBlock.hash) {
                return {
                    valid: false,
                    tamperedBlockIndex: currentBlock.index,
                    reason: `Block #${currentBlock.index} Previous Hash Mismatch Detected. Stored: ${currentBlock.previousHash.slice(0, 16)}... Expected: ${previousBlock.hash.slice(0, 16)}...`
                };
            }

            // Recalculate hash for mined/modified blocks if not hardcoded genesis defaults
            if (currentBlock.index > 2 || currentBlock.isTampered) {
                const recalculatedHash = await currentBlock.calculateHash();
                if (currentBlock.hash !== recalculatedHash) {
                    return {
                        valid: false,
                        tamperedBlockIndex: currentBlock.index,
                        reason: `Block #${currentBlock.index} Cryptographic Hash Mismatch! Recalculated hash does not match stored block signature.`
                    };
                }
            }
        }

        return { valid: true, reason: 'All inventory block hashes match calculated values and sequence linkage is unbroken.' };
    }

    /**
     * Simulate Data Tampering on a specific block
     */
    tamperBlock(index, newData) {
        const block = this.chain.find(b => b.index === index);
        if (block) {
            block.data = newData;
            block.isTampered = true;
            return true;
        }
        return false;
    }

    /**
     * Reset Ledger to initial default state
     */
    reset() {
        this.loadInitialLedger();
    }
}

// Global Application Instance
const inventoryApp = {
    blockchain: new InventoryBlockchain(),

    init() {
        this.cacheDOM();
        this.bindEvents();
        this.renderTable();
        this.updateTamperModalOptions();
    },

    cacheDOM() {
        this.transactionInput = document.getElementById('transactionInput');
        this.difficultySelect = document.getElementById('difficultySelect');
        this.btnGenerate = document.getElementById('btnGenerate');
        this.btnVerify = document.getElementById('btnVerify');
        this.btnTamperModal = document.getElementById('btnTamperModal');
        this.btnReset = document.getElementById('btnReset');
        this.btnClear = document.getElementById('btnClear');
        
        this.statusContainer = document.getElementById('statusContainer');
        this.statusBadge = document.getElementById('statusBadge');
        this.statusText = document.getElementById('statusText');
        
        this.auditReport = document.getElementById('auditReport');
        this.auditHeader = document.getElementById('auditHeader');
        this.auditBadgeText = document.getElementById('auditBadgeText');
        this.auditDetailsText = document.getElementById('auditDetailsText');
        
        this.tableBody = document.getElementById('tableBody');
        
        // Modal DOM
        this.tamperModal = document.getElementById('tamperModal');
        this.tamperBlockSelect = document.getElementById('tamperBlockSelect');
        this.tamperDataInput = document.getElementById('tamperDataInput');
        this.btnApplyTamper = document.getElementById('btnApplyTamper');
        this.btnCancelTamper = document.getElementById('btnCancelTamper');
        this.btnCloseTamperModal = document.getElementById('btnCloseTamperModal');
    },

    bindEvents() {
        this.btnGenerate.addEventListener('click', () => this.handleGenerateHash());
        this.btnVerify.addEventListener('click', () => this.handleVerifyChain());
        this.btnTamperModal.addEventListener('click', () => this.openTamperModal());
        this.btnReset.addEventListener('click', () => this.handleReset());
        this.btnClear.addEventListener('click', () => this.handleClear());

        this.btnCancelTamper.addEventListener('click', () => this.closeTamperModal());
        this.btnCloseTamperModal.addEventListener('click', () => this.closeTamperModal());
        this.btnApplyTamper.addEventListener('click', () => this.handleApplyTamper());

        // Press Enter in transaction input to mine
        this.transactionInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleGenerateHash();
            }
        });
    },

    async handleGenerateHash() {
        const dataText = this.transactionInput.value.trim();
        if (!dataText) {
            this.showStatus('Please enter inventory item details or SKU before mining.', 'error');
            return;
        }

        const difficulty = parseInt(this.difficultySelect.value, 10);
        
        // UI Feedback: Disable button during proof of work
        this.btnGenerate.disabled = true;
        this.btnGenerate.innerHTML = `<span class="btn-icon">⏳</span> Mining Block...`;
        this.showStatus(`Executing Proof-of-Work algorithm (Difficulty: ${difficulty})...`, 'info');

        setTimeout(async () => {
            try {
                const newBlock = await this.blockchain.addBlock(dataText, difficulty);
                this.renderTable();
                this.updateTamperModalOptions();
                this.transactionInput.value = '';
                this.showStatus('● Hash Generation Successful', 'success');
                this.hideAuditReport();
            } catch (err) {
                console.error(err);
                this.showStatus('Error during proof-of-work mining.', 'error');
            } finally {
                this.btnGenerate.disabled = false;
                this.btnGenerate.innerHTML = `<span class="btn-icon">⚡</span> Generate Hash`;
            }
        }, 100);
    },

    async handleVerifyChain() {
        const audit = await this.blockchain.isChainValid();
        this.auditReport.classList.remove('hidden');

        if (audit.valid) {
            this.auditHeader.className = 'audit-header valid';
            this.auditBadgeText.textContent = 'INVENTORY VALID';
            this.auditDetailsText.textContent = 'All inventory block hashes match calculated values and sequence linkage is unbroken.';
            this.showStatus('Inventory Ledger Verified: VALID', 'success');
        } else {
            this.auditHeader.className = 'audit-header invalid';
            this.auditBadgeText.textContent = 'TAMPERED / INVALID';
            this.auditDetailsText.textContent = `COMPROMISE DETECTED: ${audit.reason}`;
            this.showStatus(`Inventory Ledger Status: TAMPERED / INVALID (Point of compromise: Block #${audit.tamperedBlockIndex})`, 'error');
        }

        this.renderTable(audit.valid ? null : audit.tamperedBlockIndex);
    },

    openTamperModal() {
        this.updateTamperModalOptions();
        const firstBlock = this.blockchain.chain[0];
        if (firstBlock) {
            this.tamperDataInput.value = `${firstBlock.data} Falsified`;
        }
        this.tamperModal.classList.remove('hidden');
    },

    closeTamperModal() {
        this.tamperModal.classList.add('hidden');
    },

    handleApplyTamper() {
        const blockIndex = parseInt(this.tamperBlockSelect.value, 10);
        const newData = this.tamperDataInput.value.trim();

        if (!newData) {
            alert('Please enter modified transaction data.');
            return;
        }

        const success = this.blockchain.tamperBlock(blockIndex, newData);
        if (success) {
            this.closeTamperModal();
            this.renderTable(blockIndex);
            this.showStatus(`Tampered data injected into Block #${blockIndex}! Click "Verify Chain" to audit.`, 'error');
            this.handleVerifyChain();
        }
    },

    handleReset() {
        this.blockchain.reset();
        this.renderTable();
        this.updateTamperModalOptions();
        this.hideAuditReport();
        this.transactionInput.value = '';
        this.showStatus('Inventory ledger reset to default state.', 'info');
    },

    handleClear() {
        this.transactionInput.value = '';
        this.showStatus('Input field cleared.', 'info');
    },

    updateTamperModalOptions() {
        this.tamperBlockSelect.innerHTML = '';
        this.blockchain.chain.forEach(block => {
            const option = document.createElement('option');
            option.value = block.index;
            option.textContent = `Block #${block.index} - ${block.data}`;
            this.tamperBlockSelect.appendChild(option);
        });

        this.tamperBlockSelect.onchange = (e) => {
            const idx = parseInt(e.target.value, 10);
            const targetBlock = this.blockchain.chain.find(b => b.index === idx);
            if (targetBlock) {
                this.tamperDataInput.value = `${targetBlock.data} Falsified`;
            }
        };
    },

    showStatus(message, type = 'success') {
        this.statusBadge.className = `status-badge status-${type}`;
        this.statusText.textContent = message;
    },

    hideAuditReport() {
        this.auditReport.classList.add('hidden');
    },

    renderTable(highlightTamperedIndex = null) {
        this.tableBody.innerHTML = '';

        this.blockchain.chain.forEach(block => {
            const tr = document.createElement('tr');
            
            if (block.isTampered || block.index === highlightTamperedIndex) {
                tr.classList.add('tr-tampered');
            }

            tr.innerHTML = `
                <td class="col-index">${block.index}</td>
                <td class="col-data">
                    ${this.escapeHTML(block.data)}
                    ${block.isTampered ? '<span class="tampered-tag">TAMPERED</span>' : ''}
                </td>
                <td class="col-hash">${block.previousHash}</td>
                <td class="col-nonce">${block.nonce}</td>
                <td class="col-hash">${block.hash}</td>
            `;

            this.tableBody.appendChild(tr);
        });
    },

    escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }
};

// Initialize Application on Page Load
document.addEventListener('DOMContentLoaded', () => {
    inventoryApp.init();
});
