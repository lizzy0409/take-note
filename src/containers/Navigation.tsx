import React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import uuid from 'uuid/v4'
import moment from 'moment'
import { Download, X, Plus, Cloud } from 'react-feather'
import { addNote, swapNote, sendNoteToTrash, syncState } from 'actions'
import { NoteItem, CategoryItem, ApplicationState } from 'types'
import { getNoteTitle, downloadNote } from 'helpers'
import { useKey } from 'helpers/hooks'

interface NavigationProps {
  addNote: (note: NoteItem) => void
  swapNote: (noteId: string) => void
  sendNoteToTrash: (noteId: string) => void
  syncState: (notes: NoteItem[], categories: CategoryItem[]) => void
  activeNote?: NoteItem
  activeCategoryId: string
  notes: NoteItem[]
  categories: CategoryItem[]
  syncing: boolean
}

const Navigation: React.FC<NavigationProps> = ({
  activeNote,
  activeCategoryId,
  addNote,
  swapNote,
  sendNoteToTrash,
  syncState,
  notes,
  categories,
  syncing,
}) => {
  const newNoteHandler = () => {
    const note: NoteItem = {
      id: uuid(),
      text: '',
      created: moment().format(),
      lastUpdated: moment().format(),
      category: activeCategoryId ? activeCategoryId : undefined,
    }

    if ((activeNote && activeNote.text !== '') || !activeNote) {
      addNote(note)
      swapNote(note.id)
    }
  }

  const trashNoteHandler = () => {
    if (activeNote && !activeNote.trash) {
      sendNoteToTrash(activeNote.id)
    }
  }

  const syncNotesHandler = () => {
    syncState(notes, categories)
  }

  const downloadNoteHandler = () => {
    if (activeNote) {
      downloadNote(getNoteTitle(activeNote.text), activeNote)
    }
  }

  useKey('ctrl+n', () => {
    newNoteHandler()
  })

  useKey('ctrl+w', () => {
    trashNoteHandler()
  })

  useKey('ctrl+s', () => {
    syncNotesHandler()
  })

  return (
    <nav className="navigation">
      <div className="nav-button" onClick={newNoteHandler}>
        <Plus /> New Note
      </div>
      <div className="nav-button" onClick={trashNoteHandler}>
        <X />
        Delete Note
      </div>
      <div className="nav-button" onClick={downloadNoteHandler}>
        <Download />
        Download Note
      </div>
      <div className="nav-button" onClick={syncNotesHandler}>
        <Cloud />
        Sync notes
      </div>
    </nav>
  )
}

const mapStateToProps = (state: ApplicationState) => ({
  syncing: state.syncState.syncing,
  notes: state.noteState.notes,
  categories: state.categoryState.categories,
  activeNote: state.noteState.notes.find(note => note.id === state.noteState.activeNoteId),
  activeCategoryId: state.noteState.activeCategoryId,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  addNote: (note: NoteItem) => dispatch(addNote(note)),
  swapNote: (noteId: string) => dispatch(swapNote(noteId)),
  sendNoteToTrash: (noteId: string) => dispatch(sendNoteToTrash(noteId)),
  syncState: (notes: NoteItem[], categories: CategoryItem[]) =>
    dispatch(syncState(notes, categories)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navigation)
