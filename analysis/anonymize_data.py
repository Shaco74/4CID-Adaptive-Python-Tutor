#!/usr/bin/env python3
"""
Script zur Anonymisierung der Studiendaten für Repository-Upload.

Ersetzt participant_id mit pseudonymisierten IDs (P001, P002, etc.)
während die Konsistenz über alle CSV-Dateien hinweg erhalten bleibt.

Verarbeitet sowohl exports/ als auch output/ Ordner.
PNG-Grafiken müssen durch Notebook-Neuausführung regeneriert werden.

Verwendet nur Python Standard-Library (kein pandas erforderlich).
"""

import csv
import os
import json
from pathlib import Path
from collections import OrderedDict

# Pfade
SCRIPT_DIR = Path(__file__).parent
EXPORTS_DIR = SCRIPT_DIR / "exports"
ANONYMIZED_DIR = SCRIPT_DIR / "exports_anonymized"
OUTPUT_DIR = SCRIPT_DIR / "output"
OUTPUT_ANONYMIZED_DIR = SCRIPT_DIR / "output_anonymized"
MAPPING_FILE = SCRIPT_DIR / "participant_mapping_DO_NOT_COMMIT.json"

# CSV-Dateien die anonymisiert werden müssen (exports/)
CSV_FILES = [
    "study_chat_messages-unfiltered-2026-03-03.csv",
    "study_drill_events-unfiltered-2026-03-03.csv",
    "study_evaluations-unfiltered-2026-03-03.csv",
    "study_event_timeline-unfiltered-2026-03-03.csv",
    "study_participants-filtered-2026-03-03.csv",
    "study_participants-unfiltered-2026-03-03.csv",
    "study_task_level-filtered-2026-03-03.csv",
    "study_task_level-unfiltered-2026-03-03.csv",
]

# Diese Dateien haben keine participant_id und werden nur kopiert (exports/)
COPY_FILES = [
    "study_group_summary-filtered-2026-03-03.csv",
    "study_group_summary-unfiltered-2026-03-03.csv",
]

# Output-Dateien mit participant_id (output/)
OUTPUT_CSV_FILES = [
    "neu_drill_attempts_details.csv",
]

# Output-Dateien ohne participant_id - nur kopieren (output/)
OUTPUT_COPY_FILES = [
    "manifest_final.csv",
    "neu_chat_per_step_gruppe_b.csv",
    "neu_drill_attempts_distribution.csv",
    "neu_drill_diversity.csv",
    "neu_drill_top_by_group.csv",
]


def create_participant_mapping(csv_files, output_csv_files):
    """
    Erstellt einheitliches Mapping von echten IDs zu pseudonymisierten IDs.
    Scannt sowohl exports/ als auch output/ Dateien.
    """
    all_participants = set()
    
    # Sammle alle unique participant_ids aus exports/
    for csv_file in csv_files:
        file_path = EXPORTS_DIR / csv_file
        if not file_path.exists():
            print(f"⚠️  Datei nicht gefunden: exports/{csv_file}")
            continue
        
        with open(file_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            if 'participant_id' in reader.fieldnames:
                for row in reader:
                    all_participants.add(row['participant_id'])
    
    # Sammle auch participant_ids aus output/
    for csv_file in output_csv_files:
        file_path = OUTPUT_DIR / csv_file
        if not file_path.exists():
            print(f"⚠️  Datei nicht gefunden: output/{csv_file}")
            continue
        
        with open(file_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            if 'participant_id' in reader.fieldnames:
                for row in reader:
                    all_participants.add(row['participant_id'])
    
    # Sortiere für konsistentes Mapping
    sorted_participants = sorted(all_participants)
    
    # Erstelle Mapping: original -> P001, P002, etc.
    mapping = OrderedDict()
    for i, original in enumerate(sorted_participants):
        mapping[original] = f"P{i+1:03d}"
    
    print(f"✓ Erstellt Mapping für {len(mapping)} Teilnehmer")
    return mapping


def anonymize_csv(csv_file, mapping, source_dir, dest_dir):
    """
    Anonymisiert eine einzelne CSV-Datei.
    """
    input_path = source_dir / csv_file
    output_path = dest_dir / csv_file
    
    if not input_path.exists():
        print(f"⚠️  Überspringe {csv_file} (nicht gefunden)")
        return
    
    row_count = 0
    
    with open(input_path, 'r', encoding='utf-8') as infile, \
         open(output_path, 'w', encoding='utf-8', newline='') as outfile:
        
        reader = csv.DictReader(infile)
        writer = csv.DictWriter(outfile, fieldnames=reader.fieldnames)
        writer.writeheader()
        
        for row in reader:
            # Anonymisiere participant_id wenn vorhanden
            if 'participant_id' in row and row['participant_id'] in mapping:
                row['participant_id'] = mapping[row['participant_id']]
            
            writer.writerow(row)
            row_count += 1
    
    print(f"✓ Anonymisiert: {csv_file} ({row_count} Zeilen)")


def copy_file(csv_file, source_dir, dest_dir):
    """
    Kopiert eine Datei ohne Anonymisierung (z.B. group_summary).
    """
    input_path = source_dir / csv_file
    output_path = dest_dir / csv_file
    
    if not input_path.exists():
        print(f"⚠️  Überspringe {csv_file} (nicht gefunden)")
        return
    
    with open(input_path, 'r', encoding='utf-8') as infile, \
         open(output_path, 'w', encoding='utf-8') as outfile:
        outfile.write(infile.read())
    
    print(f"✓ Kopiert: {csv_file}")


def main():
    """
    Hauptfunktion: Anonymisiert alle Studiendaten.
    """
    print("=" * 60)
    print("Anonymisierung der Studiendaten")
    print("=" * 60)
    
    # Erstelle Output-Verzeichnisse
    ANONYMIZED_DIR.mkdir(exist_ok=True)
    OUTPUT_ANONYMIZED_DIR.mkdir(exist_ok=True)
    
    # Erstelle Mapping
    print("\n1. Erstelle Participant-Mapping...")
    mapping = create_participant_mapping(CSV_FILES, OUTPUT_CSV_FILES)
    
    # Speichere Mapping (NUR für interne Nutzung, NICHT committen!)
    with open(MAPPING_FILE, 'w') as f:
        json.dump(mapping, f, indent=2)
    print(f"✓ Mapping gespeichert: {MAPPING_FILE.name}")
    print(f"   ⚠️  WICHTIG: Diese Datei NICHT ins Repository committen!")
    
    # Anonymisiere alle CSV-Dateien aus exports/
    print("\n2. Anonymisiere exports/ CSV-Dateien...")
    for csv_file in CSV_FILES:
        anonymize_csv(csv_file, mapping, EXPORTS_DIR, ANONYMIZED_DIR)
    
    # Kopiere group_summary Dateien (keine participant_id)
    print("\n3. Kopiere exports/ Aggregat-Dateien...")
    for csv_file in COPY_FILES:
        copy_file(csv_file, EXPORTS_DIR, ANONYMIZED_DIR)
    
    # Anonymisiere output/ CSV-Dateien
    print("\n4. Anonymisiere output/ CSV-Dateien...")
    for csv_file in OUTPUT_CSV_FILES:
        anonymize_csv(csv_file, mapping, OUTPUT_DIR, OUTPUT_ANONYMIZED_DIR)
    
    # Kopiere output/ Aggregat-Dateien
    print("\n5. Kopiere output/ Aggregat-Dateien...")
    for csv_file in OUTPUT_COPY_FILES:
        copy_file(csv_file, OUTPUT_DIR, OUTPUT_ANONYMIZED_DIR)
    
    # Zusammenfassung
    print("\n" + "=" * 60)
    print("✅ Anonymisierung abgeschlossen!")
    print("=" * 60)
    print(f"\nAnonymisierte Dateien:")
    print(f"  - {ANONYMIZED_DIR.name}/")
    print(f"  - {OUTPUT_ANONYMIZED_DIR.name}/")
    print(f"\nMapping-Datei: {MAPPING_FILE.name} (NICHT committen!)")
    print("\n⚠️  WICHTIG - PNG-Grafiken:")
    print("Die Grafiken in output/*.png enthalten noch Original-IDs!")
    print("Lösung: Jupyter Notebook mit anonymisierten Daten neu ausführen.")
    print("\nNächste Schritte:")
    print("1. exports_anonymized/ und output_anonymized/ prüfen")
    print("2. Jupyter Notebook mit anonymisierten Daten neu ausführen")
    print("3. Originale exports/ und output/ aus Repository entfernen")
    print("4. participant_mapping_*.json in .gitignore hinzufügen")


if __name__ == "__main__":
    main()
