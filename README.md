# TakeNote

## Installation

> Redux DevTools Chrome extension is required for development!

```bash
git clone git@github.com:taniarascia/takenote
cd vnote
npm i
npm start
```

## Todos

- [x] View all notes
- [x] View notes by cateogory
- [x] Add note
- [x] Update note
- [x] Delete note
- [x] Download note
- [x] Add category
- [ ] Update category
- [x] Delete category -> prune notes of deleted category
- [x] Add note to category
- [x] Sync (save) notes and categories to local storage
- [x] Keybindings for add, delete, download, sync
- [x] Add frontmatter to md files
- [x] Delete notes to trash first
- [x] Add "all" and "trash" folders
- [ ] Put all options in note dropdown options
- [ ] Add Favorites 
- [ ] Search notes
- [ ] Drag and drop notes into categories
- [ ] Add syntax highlighting for multi-language support
- [ ] Basic settings
  - [ ] Light/dark mode
  - [ ] Frequency of polling for sync (polling or inactivity?)
- [ ] Add authentication (GitHub 0Auth)
- [ ] Hook up Gist API for storage
- [ ] Style app
- [ ] Tabs for notes? 

## Bugs

- [x] Note options in "all notes" displays category its already in
- [x] Moving note to category does not swap to proper note
- [x] Do not view trash notes after deleting in categories
- [ ] Can't restore deleted note
- [ ] Can't permanently delete note
- [x] Note not focused if new note keybind event outside of editor

## Redux

### Add enum

```ts
// types/enums
export enum Actions {
   ...
  ADD_CATEGORY_TO_NOTE = 'ADD_CATEGORY_TO_NOTE',
  ...
}
```

### Add action

```ts
// actions/index.ts
export const addCategoryToNote = (categoryId: string, noteId: string) => ({
  type: Actions.ADD_CATEGORY_TO_NOTE,
  payload: { categoryId, noteId },
})
```

### Add action type

```ts
// types/index.ts
export interface AddCategoryToNoteAction {
  type: typeof Actions.ADD_CATEGORY_TO_NOTE
  payload: {
    categoryId: string
    noteId: string
  }
}

export type NotesActionTypes = AddCategoryToNoteAction | ...
```

### Add reducer

```ts
// reducers/index.ts
case Actions.ADD_CATEGORY_TO_NOTE:
  return {
    ...state,
    notes: state.notes.map(note =>
      note.id === action.payload.noteId
        ? {
            id: note.id,
            text: note.text,
            created: note.created,
            lastUpdated: note.lastUpdated,
            category: action.payload.categoryId,
          }
        : note
    ),
  }
```

### Update container

#### Import action

```tsx
// containers/Component.tsx
import { addCategoryToNote } from 'actions'
```

#### Add to container props

```tsx
// containers/Component.tsx
interface NoteListProps {
  addCategoryToNote: () => void
  ...
}

const NoteList: React.FC<NoteListProps> = ({
  ...
  addCategoryToNote,
}) => {
```

#### Map dispatch to props

```ts
// containers/Component.tsx
const mapDispatchToProps = (dispatch: Dispatch) => ({
  addCategoryToNote: (categoryId: string, noteId: string) =>
    dispatch(addCategoryToNote(categoryId, noteId)),
})
```

#### Use the damn function

```tsx
// containers/Component.tsx
<div
  key={category.id}
  onClick={() => {
    addCategoryToNote(category.id, note.id)
  }}
>
  {category.name}
</div>
```
