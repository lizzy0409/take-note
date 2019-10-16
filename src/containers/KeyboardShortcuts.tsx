import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useKeyboard } from 'contexts/KeyboardContext'
import { downloadNote, getNoteTitle, newNote } from 'helpers'
import { useKey, useInterval } from 'helpers/hooks'
import { addNote, swapNote, toggleTrashedNote } from 'slices/note'
import { syncState } from 'slices/sync'
import { toggleDarkTheme } from 'slices/theme'
import { RootState, CategoryItem, NoteItem } from 'types'

const KeyboardShortcuts: React.FC = () => {
  const { categories } = useSelector((state: RootState) => state.categoryState)
  const { activeCategoryId, activeFolder, activeNoteId, notes } = useSelector(
    (state: RootState) => state.noteState
  )

  const activeNote = notes.find(note => note.id === activeNoteId)

  const dispatch = useDispatch()

  const _addNote = (note: NoteItem) => dispatch(addNote(note))
  const _swapNote = (noteId: string) => dispatch(swapNote(noteId))
  const _toggleTrashedNote = (noteId: string) => dispatch(toggleTrashedNote(noteId))
  const _syncState = (notes: NoteItem[], categories: CategoryItem[]) =>
    dispatch(syncState({ notes, categories }))
  const _toggleDarkTheme = () => dispatch(toggleDarkTheme())

  const { addingTempCategory, setAddingTempCategory } = useKeyboard()
  const newNoteHandler = () => {
    const note = newNote(activeCategoryId, activeFolder)

    if ((activeNote && activeNote.text !== '' && !activeNote.trash) || !activeNote) {
      _addNote(note)
      _swapNote(note.id)
    }
  }

  const newTempCategoryHandler = () => {
    !addingTempCategory && setAddingTempCategory(true)
  }

  const trashNoteHandler = () => {
    if (activeNote) {
      _toggleTrashedNote(activeNote.id)
    }
  }

  const syncNotesHandler = () => {
    _syncState(notes, categories)
  }

  const downloadNoteHandler = () => {
    if (activeNote) {
      downloadNote(getNoteTitle(activeNote.text), activeNote)
    }
  }

  const toggleDarkThemeHandler = () => {
    _toggleDarkTheme()
  }

  useKey('capslock+n', () => {
    newNoteHandler()
  })

  useKey('capslock+c', () => {
    newTempCategoryHandler()
  })

  useKey('capslock+w', () => {
    trashNoteHandler()
  })

  useKey('capslock+s', () => {
    syncNotesHandler()
  })

  useKey('capslock+d', () => {
    downloadNoteHandler()
  })

  useKey('capslock+t', () => {
    toggleDarkThemeHandler()
  })

  useInterval(() => {
    _syncState(notes, categories)
  }, 30000)

  return null
}

export default KeyboardShortcuts
