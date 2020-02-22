import { multiplex } from './higherorder.js'

export const getFieldValue = (field) => g_form.getValue(field)

export const setFieldValue = (field, value) => g_form.setValue(field, value)

export const clearField = (field) => g_form.clearValue(field)

export const killField = (field) => g_form.setVisible(field, false)

export const murderField = multiplex(clearField, killField)

export const restoreField = (field) => g_form.setVisible(field, true)

// available parameters: fieldname, newValue, oldValue
export const onUserFieldChange = (fn) => g_form.onUserChangeValue(fn)

export const getFieldId = (field) => g_form.getUniqueValue(field)
