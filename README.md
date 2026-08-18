# Blockchain-Based Inventory Management System

**Author:** Kushall Thorat (39080)  
**Topic:** Supply Chain Security, SHA-256 Hashing, Proof of Work & Cryptographic Ledger Audit Verification

---

## 1. TOPIC OVERVIEW
A **Blockchain-Based Inventory Management System** is an application that demonstrates how supply chain product movement, stock audits, and inventory tracking can be secured using cryptographic hashing and decentralized ledger architecture. 

Instead of relying on vulnerable centralized databases where stock levels can be silently manipulated, the application records every inventory update (stock additions, transfers, and dispatches) as a cryptographically linked block. If any past transaction is altered, the cryptographic chain breaks and tampering is instantly identified.

### Key Features
- **Blockchain-Based Inventory Tracking**: Sequential block ledger recording every stock movement.
- **Cryptographic Ledger Security**: SHA-256 block hash signatures ensuring tamper-resistance.
- **Proof-of-Work Mining**: Iterative nonce computation satisfying adjustable difficulty targets.
- **Previous Block Hash Linking**: Sequential linkage where block `N` includes the hash of block `N-1`.
- **Real-Time Audit Engine**: Instant verification certifying ledger status as `INVENTORY VALID` or `TAMPERED / INVALID`.
- **Tamper Simulation Engine**: Interactive injection of altered stock data to demonstrate chain breakage.
- **JSON-Based Block Storage**: Exportable/Importable digital ledger format.
- **Graphical User Interface**: Responsive web interface matching exact page 7 output layout.

---

## 2. SYSTEM ARCHITECTURE & BLOCK STRUCTURE

Each inventory block contains essential parameters:
1. **Block Index (#)**: Chronological position in the blockchain (1, 2, 3...).
2. **Timestamp**: ISO date/time of inventory event logging.
3. **Data (Item Details & Transaction)**: e.g. `Kushall: SKU-101 (+50)` or `DEV: SKU-204 (+100)`.
4. **Previous Hash**: 64-character SHA-256 hash of the preceding block (Block #1 starts with 64 zeros).
5. **Nonce**: Integer discovered during proof-of-work mining.
6. **SHA-256 Hash**: Unique 64-character hexadecimal cryptographic block signature.

---

## 3. BASIC WORKING LOGIC

```
Enter Inventory Transaction (Item, Qty, Action)
                   ↓
     Fetch Previous Inventory Block Hash
                   ↓
       Set Mining Difficulty Target
                   ↓
   Calculate Nonce via Proof of Work
                   ↓
      Generate SHA-256 Block Hash
                   ↓
       Append Stock Block to Ledger
                   ↓
      Verify Supply Chain Continuity
                   ↓
    Display Inventory Blockchain Table
```

---

## 4. TAMPER DETECTION MECHANISM

1. **Original Ledger State (`VALID`)**:
   - Block #1: `Data: Kushall: SKU-101 (+50)` | `Hash: 000bc7e829d115a4b7e8...`
   - Block #2: `Data: DEV: SKU-204 (+100)` | `PrevHash: 000bc7e829d115a4b7e8...` | `Hash: 00078b6d194c731e8f20...`

2. **Falsified State (`TAMPERED / INVALID`)**:
   - Unauthorized user alters Block #1 to: `Kushall: SKU-101 (+500 Units Falsified)`
   - Recalculated hash of Block #1 changes completely to e.g. `e71a4f02...`
   - Block #2's stored `Previous Hash` (`000bc7e8...`) no longer matches recalculated Block #1 hash (`e71a4f02...`).
   - Audit Engine detects link mismatch and flags status as **`TAMPERED / INVALID`**!

---

## 5. HOW TO RUN THE APPLICATION

### Option A: Web Graphical User Interface (GUI)
1. Double-click `index.html` to open directly in any browser, or run:
   ```bash
   python server.py
   ```
2. The server will launch at `http://localhost:8000` and automatically open your default browser.
3. Use the interface to:
   - Type new stock records (e.g. `Laptop SKU-101 (+50 Units Received)`).
   - Select **Mining Difficulty** (`1` to `5`).
   - Click **⚡ Generate Hash** to mine and append the block.
   - Click **✓ Verify Chain** to perform audit verification.
   - Click **⚠ Tamper Record** to test retroactive data falsification and observe red warning alerts.
   - Click **🔄 Reset Data** to restore original ledger records.

### Option B: Python Command-Line Interface (CLI)
To run the pure Python blockchain engine with automated audit tests:
```bash
python blockchain.py
```

---

## 6. FILE STRUCTURE

- `index.html`: Main HTML interface matching Page 7 layout.
- `style.css`: Stylesheet providing purple gradient header, rounded card container, custom button toolbar, and dark purple table.
- `app.js`: Client-side SHA-256 WebCrypto algorithm, proof-of-work miner, chain auditor, and tamper engine.
- `blockchain.py`: Standalone Python object-oriented implementation using `hashlib.sha256`.
- `server.py`: Python local web server launcher script.
- `README.md`: System documentation and user guide.
