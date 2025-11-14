"""Quick script to check database schema"""
import sqlite3
import os

db_path = "slambook.db"
if not os.path.exists(db_path):
    print("Database file not found. It will be created when the server starts.")
    exit(0)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

print("=" * 60)
print("DATABASE SCHEMA")
print("=" * 60)

# Get all tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = cursor.fetchall()

for table_name in tables:
    print(f"\n[Table] {table_name[0]}")
    print("-" * 60)
    
    # Get table info
    cursor.execute(f"PRAGMA table_info({table_name[0]})")
    columns = cursor.fetchall()
    
    print(f"{'Column':<20} {'Type':<15} {'Nullable':<10} {'Default'}")
    print("-" * 60)
    
    for col in columns:
        col_id, name, col_type, not_null, default, pk = col
        nullable = "Yes" if not not_null else "No"
        default_val = default if default else "None"
        print(f"{name:<20} {col_type:<15} {nullable:<10} {default_val}")

conn.close()

