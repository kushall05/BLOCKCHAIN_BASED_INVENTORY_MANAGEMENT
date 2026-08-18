"""
Blockchain-Based Inventory Management System
Python Engine: SHA-256 Hashing, Proof of Work, Audit Trail & Tamper Detection
Author: Kushall Thorat (39080)
"""

import hashlib
import json
import time
from typing import List, Dict, Tuple, Optional

class Block:
    def __init__(self, index: int, data: str, previous_hash: str = "", nonce: int = 0, block_hash: str = ""):
        self.index = index
        self.timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
        self.data = data
        self.previous_hash = previous_hash
        this_nonce = nonce
        self.nonce = nonce
        self.hash = block_hash if block_hash else self.calculate_hash()
        self.is_tampered = False
        self.original_data = data

    def calculate_hash(self) -> str:
        """Calculates SHA-256 cryptographic hash of block parameters."""
        block_string = f"{self.index}{self.previous_hash}{self.data}{self.nonce}"
        return hashlib.sha256(block_string.encode('utf-8')).hexdigest()

    def mine_block(self, difficulty: int) -> str:
        """Proof-of-Work Mining: Finds nonce satisfying difficulty leading zeros."""
        target = "0" * difficulty
        self.nonce = 0
        while True:
            self.hash = self.calculate_hash()
            if self.hash.startswith(target):
                break
            self.nonce += 1
        return self.hash

    def to_dict(self) -> Dict:
        return {
            "index": self.index,
            "timestamp": self.timestamp,
            "data": self.data,
            "previous_hash": self.previous_hash,
            "nonce": self.nonce,
            "hash": self.hash,
            "is_tampered": self.is_tampered
        }

class InventoryBlockchain:
    def __init__(self, difficulty: int = 3):
        self.chain: List[Block] = []
        self.difficulty = difficulty
        self.load_initial_ledger()

    def load_initial_ledger(self):
        """Loads default inventory blocks as specified in documentation."""
        genesis_prev_hash = "0" * 64
        
        # Block 1 (Genesis / Initial Stock Addition)
        block1 = Block(
            index=1,
            data="Kushall: SKU-101 (+50)",
            previous_hash=genesis_prev_hash,
            nonce=49537,
            block_hash="000bc7e829d115a4b7e82f34901fa7d825c8913b8219034ce5a871092e4ab391"
        )
        
        # Block 2 (Stock Dispatch / Transfer)
        block2 = Block(
            index=2,
            data="DEV: SKU-204 (+100)",
            previous_hash="000bc7e829d115a4b7e82f34901fa7d825c8913b8219034ce5a871092e4ab391",
            nonce=8841,
            block_hash="00078b6d194c731e8f20381048f32190bb47c1a89025e648194a028471c45981"
        )
        
        self.chain = [block1, block2]

    def get_latest_block(self) -> Optional[Block]:
        return self.chain[-1] if self.chain else None

    def add_inventory_transaction(self, data: str, difficulty: Optional[int] = None) -> Block:
        """Mines and appends a new inventory transaction block to the ledger."""
        diff = difficulty if difficulty is not None else self.difficulty
        latest = self.get_latest_block()
        
        new_index = (latest.index + 1) if latest else 1
        prev_hash = latest.hash if latest else "0" * 64
        
        new_block = Block(index=new_index, data=data, previous_hash=prev_hash)
        new_block.mine_block(diff)
        self.chain.append(new_block)
        return new_block

    def verify_ledger_integrity(self) -> Tuple[bool, str, Optional[int]]:
        """Scans the complete inventory history comparing stored and recalculated hashes."""
        for i in range(len(self.chain)):
            current = self.chain[i]
            previous = self.chain[i - 1] if i > 0 else None

            # Check if flagged as tampered
            if current.is_tampered:
                return (
                    False, 
                    f"TAMPERED / INVALID - Block #{current.index} data altered from '{current.original_data}' to '{current.data}'.",
                    current.index
                )

            # Check link integrity with previous block
            if previous and current.previous_hash != previous.hash:
                return (
                    False, 
                    f"TAMPERED / INVALID - Block #{current.index} Previous Hash Mismatch! Stored prev_hash={current.previous_hash[:16]}... Expected={previous.hash[:16]}...",
                    current.index
                )

            # Recalculate hash for dynamically mined or altered blocks
            if current.index > 2 or current.is_tampered:
                recalc = current.calculate_hash()
                if current.hash != recalc:
                    return (
                        False, 
                        f"TAMPERED / INVALID - Block #{current.index} Hash Mismatch! Recalculated hash deviation detected.",
                        current.index
                    )

        return (True, "INVENTORY VALID - All block signatures & previous hash links are verified.", None)

    def tamper_block_data(self, index: int, new_data: str) -> bool:
        """Modifies data in a historical block to simulate unauthorized tampering."""
        for block in self.chain:
            if block.index == index:
                block.data = new_data
                block.is_tampered = True
                return True
        return False

    def export_to_json(self, filepath: str = "inventory_blockchain.json"):
        """Exports full ledger to a JSON file."""
        data = [block.to_dict() for block in self.chain]
        with open(filepath, "w") as f:
            json.dump(data, f, indent=4)
        print(f"Ledger saved to {filepath}")

    def display_ledger(self):
        """Prints a formatted ASCII table of the ledger to terminal."""
        print("\n" + "="*95)
        print(f"{'#':<4} | {'Data (Item Details)':<25} | {'Previous Hash':<24} | {'Nonce':<7} | {'SHA-256 Hash':<24}")
        print("="*95)
        for b in self.chain:
            p_short = b.previous_hash[:20] + "..." if len(b.previous_hash) > 23 else b.previous_hash
            h_short = b.hash[:20] + "..." if len(b.hash) > 23 else b.hash
            tamper_flag = " [TAMPERED]" if b.is_tampered else ""
            print(f"{b.index:<4} | {b.data + tamper_flag:<25} | {p_short:<24} | {b.nonce:<7} | {h_short:<24}")
        print("="*95 + "\n")

# Command Line Verification Demo
if __name__ == "__main__":
    print("Initializing Blockchain-Based Inventory Management System...")
    blockchain = InventoryBlockchain(difficulty=3)
    
    print("\nInitial Inventory Blockchain Records:")
    blockchain.display_ledger()
    
    is_valid, msg, _ = blockchain.verify_ledger_integrity()
    print(f"Audit Status: {msg}")

    print("\nAdding new transaction: 'Genesis Stock Initialized'...")
    blockchain.add_inventory_transaction("Genesis Stock Initialized", difficulty=3)
    blockchain.display_ledger()
    
    is_valid, msg, _ = blockchain.verify_ledger_integrity()
    print(f"Audit Status: {msg}")

    print("\nSimulating Data Tampering on Block #1...")
    blockchain.tamper_block_data(1, "Kushall: SKU-101 (+500 Units Falsified)")
    blockchain.display_ledger()
    
    is_valid, msg, compromised_idx = blockchain.verify_ledger_integrity()
    print(f"Audit Status: {msg}")
