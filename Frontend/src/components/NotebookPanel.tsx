import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { StickyNote, Map, Download } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { THEME } from "../constants/theme";
import { NoteCard } from "./NoteCard";

interface Note {
  id: string;
  content: string;
}

const NOTES_STORAGE_KEY = "@echodocs_notes";

export const NotebookPanel = () => {
  const [activeTab, setActiveTab] = useState<"notes" | "mindmap">("notes");
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const savedNotes = await AsyncStorage.getItem(NOTES_STORAGE_KEY);
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      } else {
        setNotes([]);
      }
    } catch (err) {
      console.error("Failed to load notes", err);
    }
  };

  const saveNotes = async (newNotes: Note[]) => {
    setNotes(newNotes);
    try {
      await AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(newNotes));
    } catch (err) {
      console.error("Failed to save notes", err);
    }
  };

  const handleUpdateNote = (id: string, content: string) => {
    const updated = notes.map(n => n.id === id ? { ...n, content } : n);
    saveNotes(updated);
  };

  const handleDeleteNote = (id: string) => {
    const updated = notes.filter(n => n.id !== id);
    saveNotes(updated);
  };

  const handleAddNote = () => {
    const newNote = { id: Date.now().toString(), content: "" };
    saveNotes([...notes, newNote]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabHeader}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === "notes" && styles.activeTab]}
          onPress={() => setActiveTab("notes")}
        >
          <StickyNote size={16} color={activeTab === "notes" ? THEME.colors.accent : THEME.colors.textMuted} />
          <Text style={[styles.tabText, activeTab === "notes" && styles.activeTabText]}>Notes</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tab, activeTab === "mindmap" && styles.activeTab]}
          onPress={() => setActiveTab("mindmap")}
        >
          <Map size={16} color={activeTab === "mindmap" ? THEME.colors.accent : THEME.colors.textMuted} />
          <Text style={[styles.tabText, activeTab === "mindmap" && styles.activeTabText]}>Map</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === "notes" && (
          <View style={styles.notesList}>
            <View style={styles.notesHeader}>
              <Text style={styles.sectionTitle}>Saved Snippets</Text>
              <TouchableOpacity>
                <Download size={16} color={THEME.colors.textSecondary} />
              </TouchableOpacity>
            </View>
            {notes.map(note => (
              <NoteCard
                key={note.id}
                id={note.id}
                content={note.content}
                onUpdate={(c) => handleUpdateNote(note.id, c)}
                onDelete={() => handleDeleteNote(note.id)}
              />
            ))}
            <TouchableOpacity style={styles.addNoteBtn} onPress={handleAddNote}>
              <Text style={styles.addNoteText}>+ Add custom note</Text>
            </TouchableOpacity>
          </View>
        )}

        {activeTab === "mindmap" && (
          <View style={styles.placeholder}>
            <Map size={48} color={THEME.colors.border} />
            <Text style={styles.placeholderTitle}>Coming Soon</Text>
            <Text style={styles.placeholderText}>
              Visualizing your source relationships with interactive mind maps.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  tabHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: THEME.colors.accent,
  },
  tabText: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    fontFamily: THEME.fonts.bodyMedium,
  },
  activeTabText: {
    color: THEME.colors.accent,
  },
  content: {
    flex: 1,
  },
  notesList: {
    padding: THEME.spacing.lg,
  },
  notesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: THEME.spacing.lg,
  },
  sectionTitle: {
    color: THEME.colors.textPrimary,
    fontSize: 14,
    fontFamily: THEME.fonts.heading,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  addNoteBtn: {
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: THEME.colors.border,
    borderStyle: "dashed",
    borderRadius: THEME.radius.md,
  },
  addNoteText: {
    color: THEME.colors.textSecondary,
    fontSize: 13,
    fontFamily: THEME.fonts.body,
  },
  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: THEME.spacing.xl,
    marginTop: 60,
  },
  placeholderTitle: {
    color: THEME.colors.textPrimary,
    fontSize: 18,
    fontFamily: THEME.fonts.heading,
    marginTop: 20,
    marginBottom: 8,
  },
  placeholderText: {
    color: THEME.colors.textMuted,
    fontSize: 14,
    fontFamily: THEME.fonts.body,
    textAlign: "center",
    lineHeight: 20,
  },
});
