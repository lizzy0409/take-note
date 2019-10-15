import { Actions } from 'constants/enums'
import { SettingsState, SettingsActionTypes } from 'types'

const initialState: SettingsState = {
  isOpen: false,
  codeMirrorOptions: {
    mode: 'gfm',
    theme: 'base16-light',
    lineNumbers: false,
    lineWrapping: true,
    styleActiveLine: { nonEmpty: true },
    viewportMargin: Infinity,
  },
}

const settingsReducer = (state = initialState, action: SettingsActionTypes): SettingsState => {
  switch (action.type) {
    case Actions.TOGGLE_SETTINGS_MODAL:
      return {
        ...state,
        isOpen: !state.isOpen,
      }

    default:
      return state
  }
}

export default settingsReducer
